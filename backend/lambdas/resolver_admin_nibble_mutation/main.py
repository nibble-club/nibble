import logging
import os

import redis
from common import es_indices, redis_keys, tables, utils, validation
from common.errors import NibbleError
from redis.lock import LockError
from sqlalchemy.sql import select

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# connect to database
engine = utils.get_engine()
nibble_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE)
restaurant_restaurant_admin_table = tables.get_table_metadata(
    tables.NibbleTable.RESTAURANT_RESTAURANT_ADMIN
)
restaurant_table = tables.get_table_metadata(tables.NibbleTable.RESTAURANT)

r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])

# connect to Elasticsearch
es = es_indices.get_es_client()


def lambda_handler(event, context):
    """Resolves adminCreateNibble GraphQL requests
    """
    logger.info(event)
    event_field = event["field"]
    if event_field not in ("adminCreateNibble", "adminEditNibble"):
        raise NibbleError(
            "Incorrect request type {0} for admin*Nibble handler".format(event_field)
        )

    nibble = event["arguments"]["input"]
    admin_id = event["identity"]["username"]
    admin_id_restaurant_id_mapping = select(
        [restaurant_restaurant_admin_table.c.restaurant_id]
    ).where(restaurant_restaurant_admin_table.c.admin_id == admin_id)

    # connect to Redis
    r.ping()
    logger.info("Connected to Redis")

    if event_field == "adminCreateNibble":
        with engine.begin() as conn:  # transactionizes SQL updates
            with r.pipeline() as pipe:  # transactionizes Redis updates
                # update db
                db_values = nibble_event_db_mapper(nibble)

                result = conn.execute(
                    nibble_table.insert()
                    .returning(nibble_table.c.restaurant_id, nibble_table.c.id)
                    .values(restaurant_id=admin_id_restaurant_id_mapping, **db_values)
                )
                row = result.fetchone()
                nibble_id = row["id"]
                restaurant_id = row["restaurant_id"]
                logger.info(
                    "Inserted with PK {0} at restaurant ID {1}".format(
                        nibble_id, restaurant_id
                    )
                )
                # update elasticsearch
                add_to_elasticsearch(db_values, nibble_id, restaurant_id, conn)

                # update redis
                nibble_available_count = db_values["available_count"]
                pipe.hset(
                    redis_keys.NIBBLES_REMAINING, nibble_id, nibble_available_count
                )
                pipe.hset(
                    redis_keys.NIBBLES_AVAILABLE, nibble_id, nibble_available_count
                )
                pipe.execute()
            # end of Redis transaction
        # end of SQL transaction

    elif event_field == "adminEditNibble":
        nibble_id = event["arguments"]["id"]

        try:  # meant to catch LockErrors
            with r.lock(
                redis_keys.nibble_lock(nibble_id), blocking_timeout=3
            ):  # acquire Redis lock on nibble
                # get current counts
                available_count = int(r.hget(redis_keys.NIBBLES_AVAILABLE, nibble_id))
                remaining_count = int(r.hget(redis_keys.NIBBLES_REMAINING, nibble_id))
                with engine.begin() as conn:  # transactionizes SQL calls
                    with r.pipeline() as pipe:  # transactionizes Redis calls
                        check_valid_nibble_update(
                            nibble,
                            nibble_id,
                            conn,
                            nibble_table,
                            available_count,
                            remaining_count,
                        )

                        # confirmed valid update, push db changes
                        db_values = nibble_event_db_mapper(nibble)
                        result = conn.execute(
                            nibble_table.update()
                            .returning(nibble_table.c.restaurant_id)
                            .where(nibble_table.c.id == nibble_id)
                            .values(**db_values)
                        )
                        nibble_available_count = db_values["available_count"]
                        restaurant_id = result.fetchone()["restaurant_id"]

                        # update elasticsearch
                        add_to_elasticsearch(db_values, nibble_id, restaurant_id, conn)

                        # update redis
                        pipe.hset(
                            redis_keys.NIBBLES_REMAINING,
                            nibble_id,
                            nibble_available_count,
                        )
                        pipe.execute()
                    # end of Redis pipeline
                # end of SQL transaction
            # end of Redis lock
            logger.info("Updated Nibble with PK: {0}".format(event["arguments"]["id"]))
        except LockError:
            raise NibbleError(
                "Someone is currently making a reservation, try again in a moment"
            )
    # end of adminEditNibble block
    return nibble_event_result_mapper(db_values, nibble_id)


def nibble_event_db_mapper(nibble):
    """Gets fields to insert into nibble database, along with common validation for
    inserts and updates
    """
    # validate input
    if nibble["type"].upper() not in validation.VALID_NIBBLE_TYPES:
        raise NibbleError(
            "Invalid nibble type {0}, not in {1}".format(
                nibble["type"], validation.VALID_NIBBLE_TYPES
            )
        )
    if nibble["count"] < 1:
        raise NibbleError(
            "Invalid nibble count; {0} is less than 1".format(nibble["count"])
        )
    if validation.in_past(nibble["availableTo"]):
        raise NibbleError("Invalid nibble availableTo time, in past")

    if nibble["availableFrom"] >= nibble["availableTo"]:
        raise NibbleError("Invalid nibble timing, expires before start")

    try:
        return {
            "name": nibble["name"],
            "type": nibble["type"],
            "available_count": nibble["count"],
            "description": nibble.get("description", None),
            "price": nibble["price"],
            "available_from": nibble["availableFrom"],
            "available_to": nibble["availableTo"],
            "image_url": nibble["imageUrl"],
        }
    except KeyError:
        raise NibbleError("Nibble input missing required element")


def nibble_event_result_mapper(db_values, nibble_id):
    """Creates GraphQL event result to return, based on database values inserted"""
    return {
        "id": nibble_id,
        "name": db_values["name"],
        "type": db_values["type"],
        "count": db_values["available_count"],
        "imageUrl": db_values["image_url"],
        "description": db_values["description"],
        "price": db_values["price"],
        "availableFrom": db_values["available_from"],
        "availableTo": db_values["available_to"],
    }


def check_valid_nibble_update(
    nibble, nibble_id, conn, nibble_table, available_count, remaining_count
):
    """Checks if the given nibble is a valid update of the existing nibble"""
    nibble_available_count = nibble["count"]
    # validate remaining count
    reserved_count = available_count - remaining_count
    if nibble_available_count < reserved_count:
        raise NibbleError(
            "Cannot set available count to {0}, there are already {1} reservations".format(
                nibble_available_count, reserved_count
            )
        )

    # check if Nibble is in past
    nibble_row = conn.execute(
        select([nibble_table.c.available_to]).where(nibble_table.c.id == nibble_id)
    ).fetchone()

    if nibble_row is None:
        raise NibbleError("No Nibble exists with id {0}".format(nibble_id))

    if validation.in_past(nibble_row["available_to"]):
        raise NibbleError("Cannot update archived Nibble; please create a new one")


def add_to_elasticsearch(db_values, nibble_id, restaurant_id, conn):
    logger.info("Fetching restaurant location")
    restaurant_row = conn.execute(
        select([restaurant_table.c.latitude, restaurant_table.c.longitude]).where(
            restaurant_table.c.id == restaurant_id
        )
    ).fetchone()
    logger.info("Adding record to Elasticsearch")
    index_result = es.index(
        index=es_indices.NIBBLE_INDEX,
        id=nibble_id,
        body={
            "name": db_values["name"],
            "type": db_values["type"],
            "count": db_values["available_count"],
            "restaurantId": restaurant_id,
            "description": db_values["description"],
            "price": db_values["price"],
            "availableFrom": db_values["available_from"],
            "availableTo": db_values["available_to"],
            "imageUrl": db_values["image_url"],
            "location": {
                "lat": restaurant_row["latitude"],
                "lon": restaurant_row["longitude"],
            },
        },
    )
    logger.info(index_result)
    logger.info("Indexed Nibble in Elasticsearch")

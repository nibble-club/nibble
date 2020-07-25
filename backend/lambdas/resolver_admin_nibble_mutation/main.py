import logging
import json
import os
from common import tables, utils, validation, redis_keys
from sqlalchemy.sql import select
import redis
from redis.lock import LockError

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    """Resolves adminCreateNibble GraphQL requests
    """
    event_field = event["field"]
    if event_field not in ("adminCreateNibble", "adminEditNibble"):
        raise RuntimeError(
            "Incorrect request type {0} for admin*Nibble handler".format(event_field)
        )

    nibble = event["arguments"]["input"]

    # connect to Redis
    r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])
    r.ping()
    logger.info("Connected to Redis")

    # connect to database
    engine = utils.get_engine()
    print(engine)
    nibble_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE)

    if event_field == "adminCreateNibble":
        with engine.begin() as conn:  # transactionizes SQL updates
            with r.pipeline() as pipe:  # transactionizes Redis updates
                # update db
                db_values = nibble_event_db_mapper(nibble)
                result = conn.execute(
                    nibble_table.insert().values(
                        restaurant_id=nibble.get("restaurantId", None), **db_values
                    )
                )
                nibble_id = result.inserted_primary_key[0]
                logger.info("Inserted with PK: {0}".format(nibble_id))

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
                        conn.execute(
                            nibble_table.update()
                            .where(nibble_table.c.id == nibble_id)
                            .values(**db_values)
                        )
                        nibble_available_count = db_values["available_count"]
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
            raise RuntimeError(
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
        raise RuntimeError(
            "Invalid nibble type {0}, not in {1}".format(
                nibble["type"], validation.VALID_NIBBLE_TYPES
            )
        )
    if nibble["count"] < 1:
        raise RuntimeError(
            "Invalid nibble count; {0} is less than 1".format(nibble["count"])
        )
    if validation.in_past(nibble["availableTo"]):
        raise RuntimeError("Invalid nibble availableTo time, in past")

    if nibble["availableFrom"] >= nibble["availableTo"]:
        raise RuntimeError("Invalid nibble timing, expires before start")

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
        raise RuntimeError("Nibble input missing required element")


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
        raise RuntimeError(
            "Cannot set available count to {0}, there are already {1} reservations".format(
                nibble_available_count, reserved_count
            )
        )

    # check if Nibble is in past
    nibble_row = conn.execute(
        select([nibble_table.c.available_to]).where(nibble_table.c.id == nibble_id)
    ).fetchone()

    if nibble_row is None:
        raise RuntimeError("No Nibble exists with id {0}".format(nibble_id))

    if validation.in_past(nibble_row["available_to"]):
        raise RuntimeError("Cannot update archived Nibble; please create a new one")


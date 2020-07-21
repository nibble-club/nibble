import logging
import json
import os
from common import tables, utils, validation, redis_keys
import redis
from redis.lock import LockError

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    """Resolves adminCreateNibble GraphQL requests
    """
    if event["field"] not in ("adminCreateNibble", "adminEditNibble"):
        raise RuntimeError(
            "Incorrect request type {0} for admin*Nibble handler".format(event["field"])
        )

    nibble = event["arguments"]["input"]

    # connect to Redis
    r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])
    r.ping()
    logger.info("Connected to Redis")

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

    # connect to database
    engine = utils.get_engine()
    nibble_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE)

    try:
        nibble_restaurant_id = nibble["restaurantId"]
        nibble_name = nibble["name"]
        nibble_type = nibble["type"]
        nibble_available_count = nibble["count"]
        nibble_description = nibble.get("description", None)
        nibble_price = nibble["price"]
        nibble_available_from = nibble["availableFrom"]
        nibble_available_to = nibble["availableTo"]
        nibble_image_url = nibble["imageUrl"]
    except KeyError:
        raise RuntimeError("Nibble input missing required element")

    if event["field"] == "adminCreateNibble":
        ins = nibble_table.insert().values(
            restaurant_id=nibble_restaurant_id,
            name=nibble_name,
            type=nibble_type,
            available_count=nibble_available_count,
            description=nibble_description,
            price=nibble_price,
            available_from=nibble_available_from,
            available_to=nibble_available_to,
            image_url=nibble_image_url,
        )

        with engine.begin() as conn:  # transactionizes SQL updates
            with r.pipeline() as pipe:  # transactionizes Redis updates
                result = conn.execute(ins)
                nibble_id = result.inserted_primary_key[0]
                logger.info("Inserted with PK: {0}".format(nibble_id))
                pipe.hset(
                    redis_keys.NIBBLES_REMAINING, nibble_id, nibble_available_count
                )
                pipe.hset(
                    redis_keys.NIBBLES_AVAILABLE, nibble_id, nibble_available_count
                )
                pipe.execute()
            # end of Redis transaction
        # end of SQL transaction

    elif event["field"] == "adminEditNibble":
        nibble_id = event["arguments"]["id"]

        try:  # meant to catch LockErrors
            with r.lock(
                redis_keys.nibble_lock(nibble_id), blocking_timeout=3
            ):  # acquire Redis lock on nibble
                # get current counts
                original_available_count = int(
                    str(r.hget(redis_keys.NIBBLES_AVAILABLE, nibble_id))
                )
                remaining_count = int(
                    str(r.hget(redis_keys.NIBBLES_REMAINING, nibble_id))
                )
                with engine.begin() as conn:  # transactionizes SQL calls
                    with r.pipeline() as pipe:  # transactionizes Redis calls
                        # validate remaining count
                        reserved_count = original_available_count - remaining_count
                        if nibble_available_count < reserved_count:
                            raise RuntimeError(
                                "Cannot set available count to {0}, there are already {1} reservations".format(
                                    nibble_available_count, reserved_count
                                )
                            )

                        # confirmed valid update
                        upd = (
                            nibble_table.update()
                            .where(nibble_table.c.id == nibble_id)
                            .values(
                                restaurant_id=nibble_restaurant_id,
                                name=nibble_name,
                                type=nibble_type,
                                available_count=nibble_available_count,
                                description=nibble_description,
                                price=nibble_price,
                                available_from=nibble_available_from,
                                available_to=nibble_available_to,
                                image_url=nibble_image_url,
                            )
                        )

                        # push db changes
                        conn.execute(upd)
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
    result = {
        "id": nibble_id,
        "name": nibble_name,
        "type": nibble_type,
        "count": nibble_available_count,
        "imageUrl": nibble_image_url,
        "description": nibble_description,
        "price": nibble_price,
        "availableFrom": nibble_available_from,
        "availableTo": nibble_available_to,
    }
    logger.info(result)
    return result

import logging
import os
from datetime import datetime

import redis
from common import redis_keys, tables, utils
from common.errors import NibbleError
from sqlalchemy.sql import and_, select

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# get tables and build query
engine = utils.get_engine()
nibble_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE)
nibble_info_cols = [
    nibble_table.c.id,
    nibble_table.c.name,
    nibble_table.c.type,
    nibble_table.c.image_url,
    nibble_table.c.description,
    nibble_table.c.price,
    nibble_table.c.available_from,
    nibble_table.c.available_to,
]


def lambda_handler(event, context):
    """Resolves requests for available nibble information
    """
    logger.info(event)
    source_info = event["field"]
    source, field = source_info.split(".")

    r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])
    r.ping()
    logger.info("Connected to Redis")

    if source == "Restaurant":
        restaurant_id = event["source"]["id"]
        return handle_restaurant_nibbles(restaurant_id, r)
    elif source == "Query":
        # resolving Query.nibbleInfo request
        nibble_id = event["arguments"]["nibbleId"]
        return handle_nibble_query(nibble_id, r)
    else:
        raise NibbleError(
            "Invalid field {0} for restaurant nibbles available resolver".format(field)
        )


def handle_restaurant_nibbles(restaurant_id, r):
    """Handles fetching the available nibbles for the given restaurant.

    Args:
        restaurant_id (str): ID of the restaurant
        r (redis.Redis): Redis client

    Returns:
        list: List of GraphQL response of available nibbles at this restaurant
    """
    # resolving nibblesAvailable request
    current_time = int(datetime.now().timestamp())
    s = (
        select(nibble_info_cols)
        .where(
            and_(
                nibble_table.c.restaurant_id == restaurant_id,
                nibble_table.c.available_from < current_time,
                current_time < nibble_table.c.available_to,
            )
        )
        .order_by(nibble_table.c.available_to)
    )

    with engine.connect() as conn:
        nibbles = []
        for row in conn.execute(s):
            # fetch available count from redis
            nibble_id = row["id"]
            available_count = int(r.hget(redis_keys.NIBBLES_REMAINING, nibble_id))
            if available_count > 0:
                nibbles.append(
                    {
                        "id": nibble_id,
                        "name": row["name"],
                        "type": row["type"],
                        "count": available_count,
                        "imageUrl": row["image_url"],
                        "description": row["description"],
                        "price": row["price"],
                        "availableFrom": row["available_from"],
                        "availableTo": row["available_to"],
                    }
                )

    logger.info(nibbles)
    return nibbles


def handle_nibble_query(nibble_id, r):
    """Handles fetching the given nibble based on its ID

    Args:
        nibble_id (str): Nibble ID
        r (redis.Redis): Redis client

    Returns:
        dict: GraphQL response of nibble info
    """
    s = select(nibble_info_cols).where(nibble_table.c.id == nibble_id)
    with engine.connect() as conn:
        result = conn.execute(s)
        row = result.fetchone()
        result.close()

    if row is None:
        raise NibbleError("No nibble with ID {0} found".format(nibble_id))

    # get available count
    available_count = int(r.hget(redis_keys.NIBBLES_REMAINING, nibble_id))

    # return result
    nibble = {
        "id": nibble_id,
        "name": row["name"],
        "type": row["type"],
        "count": available_count,
        "imageUrl": row["image_url"],
        "description": row["description"],
        "price": row["price"],
        "availableFrom": row["available_from"],
        "availableTo": row["available_to"],
    }
    logger.info(nibble)
    return nibble

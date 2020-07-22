import logging
import json
import os
from common import tables, utils, validation, redis_keys
from sqlalchemy.sql import select, and_
import redis
from datetime import datetime


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    """Resolves requests for available nibble information
    """
    logger.info(event)
    field = event["field"]
    if field != "Restaurant.nibblesAvailable":
        raise RuntimeError(
            "Invalid field {0} for restaurant nibbles available resolver".format(field)
        )

    r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])
    r.ping()
    logger.info("Connected to Redis")

    restaurant_id = event["source"]["id"]

    # get tables and build query
    engine = utils.get_engine()
    nibble_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE)
    current_time = int(datetime.now().timestamp())

    s = (
        select(
            [
                nibble_table.c.id,
                nibble_table.c.name,
                nibble_table.c.type,
                nibble_table.c.image_url,
                nibble_table.c.description,
                nibble_table.c.price,
                nibble_table.c.available_from,
                nibble_table.c.available_to,
            ]
        )
        .where(
            and_(
                nibble_table.c.restaurant_id == restaurant_id,
                nibble_table.c.available_from < current_time,
                nibble_table.c.available_to > current_time,
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

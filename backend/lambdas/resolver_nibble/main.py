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
    source_info = event["field"]
    source, field = source_info.split(".")

    r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])
    r.ping()
    logger.info("Connected to Redis")

    # get tables and build query
    engine = utils.get_engine()
    nibble_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE)
    current_time = int(datetime.now().timestamp())

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

    if source == "Restaurant":
        restaurant_id = event["source"]["id"]
        # resolving nibblesAvailable request
        s = (
            select(nibble_info_cols)
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
        # end if resolving Restaurant.availableNibbles
    elif source == "Query":
        # resolving Query.nibbleInfo request
        nibble_id = event["arguments"]["nibbleId"]
        s = select(nibble_info_cols).where(nibble_table.c.id == nibble_id)
        with engine.connect() as conn:
            result = conn.execute(s)
            row = result.fetchone()
            result.close()

        if row is None:
            raise RuntimeError(
                "Restaurant for nibble ID {0} not found".format(nibble_id)
            )

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
    else:
        raise RuntimeError(
            "Invalid field {0} for restaurant nibbles available resolver".format(field)
        )


import logging
import os

import redis
from common import es_indices, redis_keys, tables, utils
from common.errors import NibbleError
from sqlalchemy import select

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# get db connection
engine = utils.get_engine()
restaurant_table = tables.get_table_metadata(tables.NibbleTable.RESTAURANT)
restaurant_restaurant_admin_table = tables.get_table_metadata(
    tables.NibbleTable.RESTAURANT_RESTAURANT_ADMIN
)

# connect to Elasticsearch
es = es_indices.get_es_client()

# connect to Redis
r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])


def lambda_handler(event, context):
    """Resolves requests for deactivating restaurant"""
    logger.info(event)
    event_field = event["field"]
    if event_field not in ("adminDeactivateRestaurant",):
        raise NibbleError(
            "Incorrect request type {0} for adminDeactivateRestaurant handler".format(
                event_field
            )
        )

    admin_id = event["identity"]["username"]
    admin_id_restaurant_id_mapping = (
        select([restaurant_restaurant_admin_table.c.restaurant_id])
        .where(restaurant_restaurant_admin_table.c.admin_id == admin_id)
        .alias()
    )

    statement = (
        restaurant_table.update()
        .returning(restaurant_table.c.id, restaurant_table.c.market)
        .where(restaurant_table.c.id == admin_id_restaurant_id_mapping.c.restaurant_id)
        .values(active=False)
    )

    with engine.begin() as conn:
        with r.pipeline() as pipe:
            # execute update, get market and id
            row = conn.execute(statement).fetchone()

            # update on Elasticsearch
            es.update(
                index=es_indices.RESTAURANT_INDEX,
                id=row["id"],
                body={"doc": {"active": False}},
            )

            # remove from geo set
            pipe.zrem(redis_keys.restaurant_geo(row["market"]), row["id"])
            pipe.execute()

    return {"id": row["id"]}

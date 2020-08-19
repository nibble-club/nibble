import logging
import os

import redis
from common import es_indices, redis_keys, tables, utils
from common.errors import NibbleError
from sqlalchemy.sql import select

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# connect to database
engine = utils.get_engine()
restaurant_table = tables.get_table_metadata(tables.NibbleTable.RESTAURANT)
restaurant_restaurant_admin_table = tables.get_table_metadata(
    tables.NibbleTable.RESTAURANT_RESTAURANT_ADMIN
)

# connect to Redis
r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])

# connect to Elasticsearch
es = es_indices.get_es_client()


def lambda_handler(event, context):
    """Resolves adminCreateRestaurant and adminEditRestaurant GraphQL requests
    """
    logger.info(event)
    if event["field"] not in ("adminCreateRestaurant", "adminEditRestaurant"):
        raise NibbleError(
            "Incorrect request type {0} for admin*Restaurant handler".format(
                event["field"]
            )
        )

    admin_id = event["identity"]["username"]
    is_create = event["field"] == "adminCreateRestaurant"
    restaurant = event["arguments"]["input"]

    r.ping()
    logger.info("Connected to Redis")

    # insert restaurant into database
    db_values = get_restaurant_db_mapping(restaurant)

    if is_create:
        statement = restaurant_table.insert().values(**db_values)
    else:
        admin_id_restaurant_id_mapping = (
            select([restaurant_restaurant_admin_table.c.restaurant_id])
            .where(restaurant_restaurant_admin_table.c.admin_id == admin_id)
            .alias()
        )
        statement = (
            restaurant_table.update()
            .returning(restaurant_table.c.id)
            .where(
                restaurant_table.c.id == admin_id_restaurant_id_mapping.c.restaurant_id
            )
            .values(**db_values)
        )

    with engine.begin() as conn:  # transactionize SQL statements
        with r.pipeline() as pipe:  # transactionize Redis statements
            result = conn.execute(statement)
            if is_create:
                restaurant_id = result.inserted_primary_key[0]
                try:
                    conn.execute(
                        restaurant_restaurant_admin_table.insert().values(
                            restaurant_id=restaurant_id, admin_id=admin_id
                        )
                    )
                except Exception as e:
                    logger.error(e)
                    raise NibbleError("Admin already associated with a restaurant")
            else:
                restaurant_id = result.fetchone()["id"]

            logger.info("PK: {0}".format(restaurant_id))

            logger.info("Adding record to Elasticsearch")
            index_result = es.index(
                index=es_indices.RESTAURANT_INDEX,
                id=restaurant_id,
                body=get_restaurant_es_document(db_values),
            )
            logger.info(index_result)
            logger.info("Indexed restaurant in Elasticsearch")

            # insert restaurant geolocation data into redis; updates
            # on name conflict
            pipe.geoadd(
                redis_keys.restaurant_geo(db_values["market"]),
                db_values["longitude"],
                db_values["latitude"],
                restaurant_id,
            )
            pipe.execute()
            logger.info("Inserted restaurant to Redis")
        # end Redis transaction
    # end SQL transaction
    return get_restaurant_result(db_values, restaurant_id)


def get_restaurant_db_mapping(restaurant):
    """Gets the fields to insert into the restaurant database from the event"""
    try:
        return {
            "name": restaurant["name"],
            "description": restaurant["description"],
            "disclaimer": restaurant.get("disclaimer", None),
            "logo_url": restaurant["logoUrl"],
            "hero_url": restaurant["heroUrl"],
            "market": restaurant["market"],
            "street_address": restaurant["address"]["streetAddress"],
            "locality": restaurant["address"]["locality"],
            "dependent_locality": restaurant["address"].get("dependentLocality", None),
            "administrative_area": restaurant["address"]["administrativeArea"],
            "country": restaurant["address"]["country"],
            "postal_code": restaurant["address"]["postalCode"],
            "latitude": restaurant["address"]["location"]["latitude"],
            "longitude": restaurant["address"]["location"]["longitude"],
            "active": restaurant["active"],
        }
    except KeyError:
        raise NibbleError("Restaurant input missing required field")


def get_restaurant_result(db_values, restaurant_id):
    return {
        "id": restaurant_id,
        "name": db_values["name"],
        "market": db_values["market"],
        "address": {
            "streetAddress": db_values["street_address"],
            "dependentLocality": db_values["dependent_locality"],
            "locality": db_values["locality"],
            "administrativeArea": db_values["administrative_area"],
            "country": db_values["country"],
            "postalCode": db_values["postal_code"],
            "location": {
                "latitude": db_values["latitude"],
                "longitude": db_values["longitude"],
            },
        },
        "description": db_values["description"],
        "logoUrl": db_values["logo_url"],
        "heroUrl": db_values["hero_url"],
        "disclaimer": db_values["disclaimer"],
        "active": db_values["active"],
    }


def get_restaurant_es_document(db_values):
    return {
        "name": db_values["name"],
        "description": db_values["description"],
        "disclaimer": ""
        if db_values["disclaimer"] is None
        else db_values["disclaimer"],
        "active": db_values["active"],
        "market": db_values["market"],
        "address": {
            "streetAddress": db_values["street_address"],
            "dependentLocality": ""
            if db_values["dependent_locality"] is None
            else db_values["dependent_locality"],
            "locality": db_values["locality"],
            "administrativeArea": db_values["administrative_area"],
            "country": db_values["country"],
            "postalCode": db_values["postal_code"],
            "location": {"lat": db_values["latitude"], "lon": db_values["longitude"]},
        },
        "logoUrl": db_values["logo_url"],
        "heroUrl": db_values["hero_url"],
    }

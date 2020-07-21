import logging
import json
import os
from common import tables, utils, redis_keys
import redis

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    """Resolves adminCreateRestaurant GraphQL requests
    """
    if event["field"] != "adminCreateRestaurant":
        raise RuntimeError(
            "Incorrect request type {0} for adminCreateRestaurant handler".format(
                event["field"]
            )
        )

    restaurant = event["arguments"]["input"]

    # connect to database
    engine = utils.get_engine()
    restaurant_table = tables.get_table_metadata(tables.NibbleTable.RESTAURANT)

    # connect to Redis
    r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])
    r.ping()
    logger.info("Connected to Redis")

    # insert restaurant into database
    try:
        restaurant_name = restaurant["name"]
        restaurant_description = restaurant["description"]
        restaurant_disclaimer = restaurant.get("disclaimer", None)
        restaurant_logo_url = restaurant["logoUrl"]
        restaurant_hero_url = restaurant["heroUrl"]
        restaurant_market = restaurant["market"]
        restaurant_street_address = restaurant["address"]["streetAddress"]
        restaurant_locality = restaurant["address"]["locality"]
        restaurant_dependent_locality = restaurant["address"].get(
            "dependentLocality", None
        )
        restaurant_administrative_area = restaurant["address"]["administrativeArea"]
        restaurant_country = restaurant["address"]["country"]
        restaurant_postal_code = restaurant["address"]["postalCode"]
        restaurant_latitude = restaurant["location"]["latitude"]
        restaurant_longitude = restaurant["location"]["longitude"]
        ins = restaurant_table.insert().values(
            name=restaurant_name,
            description=restaurant_description,
            disclaimer=restaurant_disclaimer,
            logo_url=restaurant_logo_url,
            hero_url=restaurant_hero_url,
            market=restaurant_market,
            street_address=restaurant_street_address,
            locality=restaurant_locality,
            dependent_locality=restaurant_dependent_locality,
            administrative_area=restaurant_administrative_area,
            country=restaurant_country,
            postal_code=restaurant_postal_code,
            latitude=restaurant_latitude,
            longitude=restaurant_longitude,
            active=True,
        )
    except KeyError:
        raise RuntimeError("Restaurant input missing required element")

    with engine.begin() as conn:  # transactionize SQL statements
        with r.pipeline() as pipe:  # transactionize Redis statements
            result = conn.execute(ins)
            restaurant_key = result.inserted_primary_key[0]
            logger.info("PK: {0}".format(restaurant_key))

            # insert restaurant geolocation data into redis
            r.geoadd(
                redis_keys.restaurant_geo(restaurant["market"]),
                restaurant["location"]["longitude"],
                restaurant["location"]["latitude"],
                restaurant_key,
            )
            logger.info("Inserted restaurant to Redis")
        # end Redis transaction
    # end SQL transaction

    restaurant_result = {
        "id": restaurant_key,
        "name": restaurant_name,
        "address": {
            "streetAddress": restaurant_street_address,
            "dependentLocality": restaurant_dependent_locality,
            "locality": restaurant_locality,
            "administrativeArea": restaurant_administrative_area,
            "country": restaurant_country,
            "postalCode": restaurant_postal_code,
        },
        "description": restaurant_description,
        "logoUrl": restaurant_logo_url,
        "heroUrl": restaurant_hero_url,
        "disclaimer": restaurant_disclaimer,
        "active": True,
    }
    logger.info(restaurant_result)
    return restaurant_result

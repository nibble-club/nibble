import logging
import os

import redis
from common import es_indices
from common.errors import NibbleError
from elasticsearch_dsl import Search

# constants
NIBBLE_PROPERTIES = ("Distance", "AvailableNow")
MAX_DISTANCE = 2  # miles
INTERNAL_RESTAURANT_COUNT_LIMIT = 20
RETURN_COUNT = 5

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# connect to Redis
r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])

# connect to Elasticsearch
es = es_indices.get_es_client()


def lambda_handler(event, context):
    """Handles requests for nibbles with a given property
    """
    logger.info(event)
    field = event["field"]
    if field != "nibblesWithProperty":
        raise NibbleError("Invalid field {0} for search resolver".format(field))

    # collect input
    user_location = event["arguments"]["userLocation"]
    nibble_property = event["arguments"]["property"]

    # validation
    if nibble_property not in NIBBLE_PROPERTIES:
        raise NibbleError("Invalid recommendation reason {0}".format(nibble_property))

    # fetch nibbles
    if nibble_property == "Distance":
        # fetch restaurants within distance threshold
        s = (
            Search(using=es, index=es_indices.RESTAURANT_INDEX)
            .filter("term", active=True)
            .filter(
                "geo_distance",
                **{
                    "distance": f"{MAX_DISTANCE}miles",
                    "distance_type": "plane",
                    "address.location": {
                        "lat": user_location["latitude"],
                        "lon": user_location["longitude"],
                    },
                },
            )
            .sort(
                {
                    "_geo_distance": {
                        "address.location": {
                            "lat": user_location["latitude"],
                            "lon": user_location["longitude"],
                        },
                        "order": "asc",
                        "unit": "miles",
                        "distance_type": "plane",
                    }
                }
            )
        )
        nearby_restaurants = s[0:INTERNAL_RESTAURANT_COUNT_LIMIT].execute()
        valid_restaurant_ids = [hit.meta.id for hit in nearby_restaurants]
        # now find nibbles at those restaurants
        nibble_search = (
            Search(using=es, index=es_indices.NIBBLE_INDEX)
            .filter("range", **{"availableFrom": {"lte": "now"}})
            .filter("range", **{"availableTo": {"gte": "now"}})
            .filter("terms", **{"restaurantId": valid_restaurant_ids})
        )

        nibble_response = nibble_search[0:RETURN_COUNT].execute()
        return es_indices.parse_nibble_response(r, nibble_response)

    elif nibble_property == "AvailableNow":
        nibble_search = (
            Search(using=es, index=es_indices.NIBBLE_INDEX)
            .filter("range", **{"availableFrom": {"lte": "now"}})
            .filter("range", **{"availableTo": {"gte": "now"}})
            .sort({"availableTo": {"order": "asc"}})
        )
        nibble_response = nibble_search[0:RETURN_COUNT].execute()
        return es_indices.parse_nibble_response(r, nibble_response)
    else:
        raise NibbleError("Invalid property name {0}".format(nibble_property))

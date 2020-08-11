import logging
import os

import redis
from common import es_indices
from common.errors import NibbleError
from elasticsearch_dsl import Q, Search

# constants
NIBBLE_PROPERTIES = ("Distance", "AvailableNow", "Recommended")
MAX_DISTANCE = 2  # miles
MAX_IRRELEVANT_DISTANCE = 20  # miles
INTERNAL_RESTAURANT_COUNT_LIMIT = 24
RETURN_COUNT = 12

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
    nibble_property = event["arguments"]["property"]
    user_location = event["arguments"]["userLocation"]

    # validation
    if nibble_property not in NIBBLE_PROPERTIES:
        raise NibbleError("Invalid recommendation reason {0}".format(nibble_property))

    # fetch restaurants within distance threshold
    s = (
        Search(using=es, index=es_indices.RESTAURANT_INDEX)
        .query(Q("bool", should=[Q()]))
        .filter("term", active=True)
        .filter(
            "geo_distance",
            **{
                "distance": f"{MAX_IRRELEVANT_DISTANCE}miles",
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
    closer_restaurant_ids = [
        hit.meta.id for hit in nearby_restaurants if hit.meta.sort[0] < MAX_DISTANCE
    ]

    # fetch nibbles within MAX_DISTANCE
    if nibble_property == "Distance":
        # now find nibbles at those restaurants
        nibble_search = (
            Search(using=es, index=es_indices.NIBBLE_INDEX)
            .filter("range", **{"availableTo": {"gte": "now"}})
            .filter("terms", **{"restaurantId": closer_restaurant_ids})
            .sort({"availableFrom": {"order": "asc"}})
        )

        nibble_response = nibble_search[0:RETURN_COUNT].execute()
        return es_indices.parse_nibble_response(r, nibble_response)

    elif nibble_property == "AvailableNow":
        nibble_search = (
            Search(using=es, index=es_indices.NIBBLE_INDEX)
            .filter("range", **{"availableFrom": {"lte": "now"}})
            .filter("range", **{"availableTo": {"gte": "now"}})
            .filter("terms", **{"restaurantId": valid_restaurant_ids})
            .sort({"price": {"order": "asc"}}, {"availableTo": {"order": "asc"}})
        )
        nibble_response = nibble_search[0:RETURN_COUNT].execute()
        return es_indices.parse_nibble_response(r, nibble_response)
    elif nibble_property == "Recommended":
        nibble_search = (
            Search(using=es, index=es_indices.NIBBLE_INDEX)
            .filter("range", **{"availableTo": {"gte": "now"}})
            .filter("terms", **{"restaurantId": valid_restaurant_ids})
            .sort({"price": {"order": "desc"}}, {"availableFrom": {"order": "desc"}})
        )
        nibble_response = nibble_search[0:RETURN_COUNT].execute()
        return es_indices.parse_nibble_response(r, nibble_response)
    else:
        raise NibbleError("Invalid property name {0}".format(nibble_property))

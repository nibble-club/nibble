import logging
import os

import redis
from common import es_indices
from common.errors import NibbleError
from elasticsearch_dsl import Q, Search

# constants
NIBBLE_PROPERTIES = ("Distance", "AvailableNow", "Recommended")
MAX_DISTANCE = 2  # miles
MAX_IRRELEVANT_DISTANCE = 10  # miles
RETURN_COUNT = 12

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# connect to Redis
r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])

# connect to Elasticsearch
es = es_indices.get_es_client()


def lambda_handler(event, context):
    """Handles requests for nibbles with a given property. This is used for
    "intelligent" suggestions, used on the home page.
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

    # fetch nibbles within MAX_DISTANCE, sorted by distance
    if nibble_property == "Distance":
        nibble_search = (
            Search(using=es, index=es_indices.NIBBLE_INDEX)
            .filter("range", **{"availableTo": {"gte": "now"}})
            .filter(
                "geo_distance",
                **{
                    "distance": f"{MAX_DISTANCE}miles",
                    "distance_type": "plane",
                    "location": {
                        "lat": user_location["latitude"],
                        "lon": user_location["longitude"],
                    },
                },
            )
            .sort(
                {
                    "_geo_distance": {
                        "location": {
                            "lat": user_location["latitude"],
                            "lon": user_location["longitude"],
                        },
                        "order": "asc",
                        "unit": "miles",
                        "distance_type": "plane",
                    }
                },
                {"availableFrom": {"order": "asc"}},
            )
        )

        nibble_response = nibble_search[0:RETURN_COUNT].execute()
        return es_indices.parse_nibble_response(r, nibble_response)

    # we care less about distance, most about availability time (push nibbles close to
    # expiration)
    elif nibble_property == "AvailableNow":
        nibble_search = (
            Search(using=es, index=es_indices.NIBBLE_INDEX)
            .filter("range", **{"availableFrom": {"lte": "now"}})
            .filter("range", **{"availableTo": {"gte": "now"}})
            .filter(
                "geo_distance",
                **{
                    "distance": f"{MAX_IRRELEVANT_DISTANCE}miles",
                    "distance_type": "plane",
                    "location": {
                        "lat": user_location["latitude"],
                        "lon": user_location["longitude"],
                    },
                },
            )
            .sort({"availableTo": {"order": "asc"}}, {"price": {"order": "asc"}})
        )
        nibble_response = nibble_search[0:RETURN_COUNT].execute()
        return es_indices.parse_nibble_response(r, nibble_response)

    # should be close by; push more expensive ones currently, then closer, then about to
    # expire
    elif nibble_property == "Recommended":
        nibble_search = (
            Search(using=es, index=es_indices.NIBBLE_INDEX)
            .filter("range", **{"availableTo": {"gte": "now"}})
            .filter(
                "geo_distance",
                **{
                    "distance": f"{MAX_DISTANCE}miles",
                    "distance_type": "plane",
                    "location": {
                        "lat": user_location["latitude"],
                        "lon": user_location["longitude"],
                    },
                },
            )
            .sort(
                {"price": {"order": "desc"}},
                {
                    "_geo_distance": {
                        "location": {
                            "lat": user_location["latitude"],
                            "lon": user_location["longitude"],
                        },
                        "order": "asc",
                        "unit": "miles",
                        "distance_type": "plane",
                    }
                },
                {"availableTo": {"order": "asc"}},
            )
        )
        nibble_response = nibble_search[0:RETURN_COUNT].execute()
        return es_indices.parse_nibble_response(r, nibble_response)
    else:
        raise NibbleError("Invalid property name {0}".format(nibble_property))

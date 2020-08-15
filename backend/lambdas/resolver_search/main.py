import datetime
import json
import logging
import os

import redis
from common import es_indices, redis_keys
from common.errors import NibbleError
from elasticsearch_dsl import Q, Search

# constants
DEFAULT_MAX_DISTANCE = 10  # miles
MAX_MAX_DISTANCE = 50  # miles
MAX_INTERNAL_RESTAURANT_RESULTS = 50
MAX_USER_RESULTS = 30  # each, for restaurants and nibbles
SEARCH_HISTORY_LENGTH = 10

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# connect to Redis
r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])

# connect to Elasticsearch
es = es_indices.get_es_client()


def lambda_handler(event, context):
    """Resolves requests for searches. Currently search will find valid restaurants,
    with a preference for restaurants matching the search term, then for distance from
    the user; then, it will look for nibbles from restaurants in that set (2 searches
    total).
    """
    logger.info(event)
    field = event["field"]
    if field != "search":
        raise NibbleError("Invalid field {0} for search resolver".format(field))

    # collect input
    user_id = event["identity"]["username"]
    user_location = event["arguments"]["userLocation"]
    search_text = event["arguments"]["searchParameters"]["text"]
    search_max_distance = event["arguments"]["searchParameters"].get(
        "maxDistance", None
    )
    if search_max_distance is None:
        search_max_distance = DEFAULT_MAX_DISTANCE
    search_pickup_after = event["arguments"]["searchParameters"].get(
        "pickupAfter", None
    )
    if search_pickup_after is None:
        search_pickup_after = int(datetime.datetime.now().timestamp())

    # validation
    if len(search_text) < 3:
        raise NibbleError("Please type at least 3 characters")
    if search_max_distance > MAX_MAX_DISTANCE:
        raise NibbleError(f"Please select a distance less than {MAX_MAX_DISTANCE}")

    # get restaurant results, must be valid and should match search term
    restaurant_search = (
        Search(using=es, index=es_indices.RESTAURANT_INDEX)
        .query(
            Q(
                "bool",
                filter=[
                    Q("term", active=True),
                    Q(
                        "geo_distance",
                        **{
                            "distance": f"{search_max_distance}miles",
                            "distance_type": "plane",
                            "address.location": {
                                "lat": user_location["latitude"],
                                "lon": user_location["longitude"],
                            },
                        },
                    ),
                ],
                should=[
                    Q(
                        "multi_match",
                        query=search_text,
                        fields=["name^5", "description"],
                        fuzziness="AUTO",
                    )
                ],
            )
        )
        .sort(  # sorts by score, but includes distance calculation in result
            "_score",
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
            },
        )
    )

    logger.info(restaurant_search.to_dict())

    restaurant_response = restaurant_search[0:MAX_INTERNAL_RESTAURANT_RESULTS].execute()
    valid_restaurant_ids = [hit.meta.id for hit in restaurant_response]

    # get available nibbles at valid restaurants
    nibble_search = (
        Search(using=es, index=es_indices.NIBBLE_INDEX)
        .query(
            "multi_match",
            query=search_text,
            fields=["name^5", "description"],
            fuzziness="AUTO",
        )
        .filter("range", **{"availableFrom": {"lte": "now"}})
        .filter("range", **{"availableTo": {"gte": search_pickup_after}})
        .filter("terms", **{"restaurantId": valid_restaurant_ids})
    )

    nibble_response = nibble_search[0:MAX_USER_RESULTS].execute()

    # create GraphQL response object
    nibbles = es_indices.parse_nibble_response(r, nibble_response)
    restaurants = es_indices.parse_restaurant_response(
        restaurant_response, filter_zero_score=True, distance_index=1
    )

    # save search history
    r.lpush(
        redis_keys.user_search_history(user_id),
        json.dumps(event["arguments"]["searchParameters"]),
    )
    r.ltrim(redis_keys.user_search_history(user_id), 0, SEARCH_HISTORY_LENGTH - 1)

    return {
        "nibbles": nibbles,
        "restaurants": restaurants,
    }

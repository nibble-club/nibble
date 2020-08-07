import datetime
import json
import logging
import os

import redis
from common import es_indices, redis_keys, tables, utils, validation
from common.errors import NibbleError
from elasticsearch_dsl import Q, Search
from sqlalchemy.sql import select

# constants
DEFAULT_MAX_DISTANCE = 10  # miles
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
        "maxDistance", DEFAULT_MAX_DISTANCE
    )
    search_latest_pickup = event["arguments"]["searchParameters"].get(
        "latestPickup",
        int((datetime.datetime.now() + datetime.timedelta(days=7)).timestamp()),
    )

    # validation
    if len(search_text) < 3:
        raise NibbleError("Please type at least 3 characters")
    if search_latest_pickup < datetime.datetime.now().timestamp():
        raise NibbleError("Latest pickup time is in the past")
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
        .filter("range", **{"availableTo": {"gte": "now", "lte": search_latest_pickup}})
        .filter("terms", **{"restaurantId": valid_restaurant_ids})
    )

    nibble_response = nibble_search[0:MAX_USER_RESULTS].execute()

    # create GraphQL response object
    nibbles = parse_nibble_response(nibble_response)
    restaurants = parse_restaurant_response(restaurant_response)

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


def parse_nibble_response(nibble_response):
    """Takes Elasticsearch response object for query on Nibble index and creates list of 
    NibbleAvailable GraphQL objects"""

    nibbles = []
    for hit in nibble_response:
        nibble_id = hit.meta.id
        available_count = int(r.hget(redis_keys.NIBBLES_REMAINING, nibble_id))

        nibbles.append(
            {
                "id": nibble_id,
                "name": hit.name,
                "type": hit.type,
                "count": available_count,
                "imageUrl": hit.imageUrl.to_dict(),
                "description": hit.description,
                "price": hit.price,
                "availableFrom": hit.availableFrom,
                "availableTo": hit.availableTo,
            }
        )

    return nibbles


def parse_restaurant_response(restaurant_response):
    """Takes Elasticsearch response object for query on Restaurant index and creates 
    list of Restaurant GraphQL objects"""
    restaurants = []
    for hit in restaurant_response[0:MAX_USER_RESULTS]:
        if hit.meta.score > 0:  # actually matched search term
            restaurants.append(
                {
                    "id": hit.meta.id,
                    "name": hit.name,
                    "market": hit.market,
                    "address": {
                        "streetAddress": hit.address.streetAddress,
                        "dependentLocality": None
                        if len(hit.address.dependentLocality) == 0
                        else hit.address.dependentLocality,
                        "locality": hit.address.locality,
                        "administrativeArea": hit.address.administrativeArea,
                        "country": hit.address.country,
                        "postalCode": hit.address.postalCode,
                        "location": {
                            "latitude": hit.address.location.lat,
                            "longitude": hit.address.location.lon,
                        },
                    },
                    "disclaimer": None if len(hit.disclaimer) == 0 else hit.disclaimer,
                    "description": hit.description,
                    "distance": hit.meta.sort[1],
                    "active": hit.active,
                    "logoUrl": hit.logoUrl.to_dict(),
                    "heroUrl": hit.heroUrl.to_dict(),
                }
            )
    return restaurants

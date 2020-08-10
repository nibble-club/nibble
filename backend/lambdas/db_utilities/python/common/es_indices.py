import logging
import os

from common import redis_keys
from elasticsearch import Elasticsearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth

logger = logging.getLogger()
logger.setLevel(logging.INFO)


RESTAURANT_INDEX = "restaurant"
NIBBLE_INDEX = "nibble"


def get_es_client():
    """Returns an elasticsearch-py Elasticsearch client"""
    tracer = logging.getLogger("elasticsearch.trace")
    tracer.setLevel(logging.INFO)
    logging.getLogger("elasticsearch").setLevel(logging.INFO)

    auth = AWS4Auth(
        os.environ["AWS_ACCESS_KEY_ID"],
        os.environ["AWS_SECRET_ACCESS_KEY"],
        os.environ["AWS_REGION"],
        "es",
        session_token=os.environ["AWS_SESSION_TOKEN"],
    )

    es = Elasticsearch(
        hosts=[{"host": os.environ["ELASTICSEARCH_ENDPOINT"], "port": 443}],
        http_auth=auth,
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection,
    )
    return es


def parse_nibble_response(r, nibble_response):
    """Takes Elasticsearch response object for query on Nibble index and creates list of
    NibbleAvailable GraphQL objects.

    Args:
        r: Redis client
        nibble_response: response from execution of elasticsearch-dsl Search object on
        Nibble index
    """

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


def parse_restaurant_response(
    restaurant_response, filter_zero_score=False, distance_index=0
):
    """Takes Elasticsearch response object for query on Restaurant index and creates
    list of Restaurant GraphQL objects

    Args:
        restaurant_response: response from execution of elasticsearch-dsl Search object
        on restaurant index
        filter_zero_score: whether to filter hits with score of 0.
        distance_index: index of the distance value in the sort field
    """
    restaurants = []
    for hit in restaurant_response:
        if not filter_zero_score or hit.meta.score > 0:
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
                    "distance": hit.meta.sort[distance_index],
                    "active": hit.active,
                    "logoUrl": hit.logoUrl.to_dict(),
                    "heroUrl": hit.heroUrl.to_dict(),
                }
            )
    return restaurants

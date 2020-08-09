import logging
import os

from elasticsearch import Elasticsearch, RequestsHttpConnection, exceptions
from requests_aws4auth import AWS4Auth

from common import es_indices
from common.errors import NibbleError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

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


def lambda_handler(event, context):
    """Migrates ES indices
    """
    logger.info("Beginning creation")
    try:
        es.indices.create(
            es_indices.RESTAURANT_INDEX,
            {
                "mappings": {
                    "properties": {
                        "name": {"type": "text"},
                        "description": {"type": "text"},
                        "disclaimer": {"type": "text", "index": False},
                        "active": {"type": "boolean"},
                        "market": {"type": "keyword"},
                        "address": {
                            "properties": {
                                "streetAddress": {"type": "text"},
                                "dependentLocality": {"type": "text"},
                                "locality": {"type": "text"},
                                "administrativeArea": {"type": "text"},
                                "country": {"type": "text"},
                                "postalCode": {"type": "keyword"},
                                "location": {"type": "geo_point"},
                            }
                        },
                        "logoUrl": {
                            "properties": {
                                "bucket": {"type": "keyword"},
                                "region": {"type": "keyword"},
                                "key": {"type": "keyword"},
                            }
                        },
                        "heroUrl": {
                            "properties": {
                                "bucket": {"type": "keyword"},
                                "region": {"type": "keyword"},
                                "key": {"type": "keyword"},
                            }
                        },
                    }
                }
            },
        )
        logger.info(f"Created index ${es_indices.RESTAURANT_INDEX}")
    except exceptions.RequestError as e:
        if e.error == "resource_already_exists_exception":
            logger.info("Index already created")
        else:
            raise NibbleError("Error creating index", e)
    logger.info("Index info:")
    logger.info(es.indices.get(es_indices.RESTAURANT_INDEX))

    try:
        es.indices.create(
            es_indices.NIBBLE_INDEX,
            {
                "mappings": {
                    "properties": {
                        "name": {"type": "text"},
                        "description": {"type": "text"},
                        "type": {"type": "text"},
                        "count": {"type": "integer"},
                        "price": {"type": "integer"},
                        "restaurantId": {"type": "keyword"},
                        "availableFrom": {"type": "date", "format": "epoch_second"},
                        "availableTo": {"type": "date", "format": "epoch_second"},
                        "imageUrl": {
                            "properties": {
                                "bucket": {"type": "keyword"},
                                "region": {"type": "keyword"},
                                "key": {"type": "keyword"},
                            }
                        },
                    }
                }
            },
        )
        logger.info(f"Created index ${es_indices.NIBBLE_INDEX}")
    except exceptions.RequestError as e:
        if e.error == "resource_already_exists_exception":
            logger.info("Index already created")
        else:
            raise NibbleError("Error creating index", e)

    logger.info("Index info:")
    logger.info(es.indices.get(es_indices.NIBBLE_INDEX))

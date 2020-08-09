import logging
import os

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

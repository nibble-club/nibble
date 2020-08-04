from elasticsearch import Elasticsearch, RequestsHttpConnection, exceptions
from requests_aws4auth import AWS4Auth
import boto3

host = "vpc-dev-adchurch-elasticsearch-6yqskxqq4ttomtf2l6umepixou.us-west-2.es.amazonaws.com"
region = "us-west-2"

service = "es"
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(
    credentials.access_key,
    credentials.secret_key,
    region,
    service,
    session_token=credentials.token,
)

es = Elasticsearch(
    hosts=[{"host": host, "port": 9201}],
    http_auth=awsauth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection,
)

try:
    es.indices.create(
        "restaurant",
        {
            "mappings": {
                "properties": {
                    "name": {"type": "text"},
                    "description": {"type": "text"},
                    "disclaimer": {"type": "text", "index": False},
                    "active": {"type": "boolean"},
                    "address": {
                        "properties": {
                            "streetAddress": {"type": "text"},
                            "locality": {"type": "text"},
                            "administrativeArea": {"type": "text"},
                            "country": {"type": "text"},
                            "postalCode": {"type": "keyword"},
                            "location": {"type": "geo_point"},
                        }
                    },
                }
            }
        },
    )
except exceptions.RequestError as e:
    if e.error == "resource_already_exists_exception":
        print("Index already created")
    else:
        raise RuntimeError("Error creating index", e)


try:
    es.indices.create(
        "nibble",
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
                }
            }
        },
    )
except exceptions.RequestError as e:
    if e.error == "resource_already_exists_exception":
        print("Index already created")
    else:
        raise RuntimeError("Error creating index", e)


print(es.info())
print()
print(es.indices.get("restaurant,nibble"))
print()
print(es.get("restaurant", "3"))

from elasticsearch_dsl import Search, Range

import boto3
from elasticsearch import Elasticsearch, RequestsHttpConnection, exceptions
from requests_aws4auth import AWS4Auth

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

term = "Italian"

s = (
    Search(using=es, index="restaurant")
    .query(
        "multi_match", query=term, fields=["name^5", "description"], fuzziness="AUTO"
    )
    .filter("term", active=True)
)

# s = (
#     Search(using=es, index="nibble")
#     .query(
#         "multi_match", query=term, fields=["name^5", "description"], fuzziness="AUTO"
#     )
#     .filter("range", **{"availableTo": {"gte": "now"}})
#     .filter("range", **{"availableFrom": {"lte": "now"}})
# )


print(s.to_dict())

response = s.execute()

print(response.to_dict())

for hit in response:
    print(hit.to_dict())

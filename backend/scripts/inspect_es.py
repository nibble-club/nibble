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
    hosts=[{"host": host, "port": 9200}],
    http_auth=awsauth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection,
)

# es.indices.delete("restaurant")
# es.indices.delete("nibble")

term = "Pasta"
max_distance = 2.4

# s = (
#     Search(using=es, index="restaurant")
#     # .query(
#     #     "multi_match", query=term, fields=["name^5", "description"], fuzziness="AUTO"
#     # )
#     .filter("term", active=True)
#     .filter(
#         "geo_distance",
#         **{
#             "distance": f"{max_distance}miles",
#             "distance_type": "plane",
#             "address.location": {"lat": 42.3854646, "lon": -71.094187},
#         },
#     )
#     .sort(
#         {
#             "_geo_distance": {
#                 "address.location": {"lat": 42.3854646, "lon": -71.094187},
#                 "order": "asc",
#                 "unit": "miles",
#                 "distance_type": "plane",
#             }
#         }
#     )
# )

s = (
    Search(using=es, index="nibble")
    .query(
        "multi_match", query=term, fields=["name^5", "description"], fuzziness="AUTO"
    )
    .filter("range", **{"availableTo": {"gte": "now"}})
    .filter("range", **{"availableFrom": {"lte": "now"}})
)


print(s.to_dict())

response = s[0:10].execute()

print(response.to_dict())

print(response.hits.total.value)

for hit in response:
    print(hit)
    # print(hit.meta.sort[0])
    print(hit.meta.id)
    print(hit.name)
    # print(hit.market)
    # print(hit.address)
    # print(hit.address.streetAddress)
    # print(hit.address.dependentLocality)
    # print(hit.address.locality)
    # print(hit.address.administrativeArea)
    # print(hit.address.country)
    # print(hit.address.postalCode)
    # print(hit.address.location.lat)
    # print(hit.logoUrl.to_dict())
    # print(hit.address.location.lon)
    print(hit.description)
    # print(hit.disclaimer)
    # print(hit.active)

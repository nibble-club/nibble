import logging

from common import es_indices
from common.errors import NibbleError
from elasticsearch_dsl import Search

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# connect to Elasticsearch
es = es_indices.get_es_client()


def lambda_handler(event, context):
    """Resolves requests for restaurant distance to user
    """
    logger.info(event)
    field = event["field"]
    if field != "closestRestaurants":
        raise NibbleError(
            "Invalid field {0} for closestRestaurants resolver".format(field)
        )

    # parse arguments
    current_latitude = event["arguments"]["location"]["latitude"]
    current_longitude = event["arguments"]["location"]["longitude"]
    pagination_offset = event["arguments"]["paginationInput"]["offset"]
    pagination_limit = event["arguments"]["paginationInput"]["limit"]
    max_distance = event["arguments"]["maxDistance"]

    s = (
        Search(using=es, index=es_indices.RESTAURANT_INDEX)
        .filter("term", active=True)
        .filter(
            "geo_distance",
            **{
                "distance": f"{max_distance}miles",
                "distance_type": "plane",
                "address.location": {"lat": current_latitude, "lon": current_longitude},
            },
        )
        .sort(
            {
                "_geo_distance": {
                    "address.location": {
                        "lat": current_latitude,
                        "lon": current_longitude,
                    },
                    "order": "asc",
                    "unit": "miles",
                    "distance_type": "plane",
                }
            }
        )
    )

    # paginate response
    response = s[pagination_offset : pagination_offset + pagination_limit].execute()

    logger.info(f"{response.hits.total.value} hits total")

    result_restaurants = []
    for hit in response:
        result_restaurants.append(get_restaurant_for_hit(hit))

    return {
        "restaurants": result_restaurants,
        "totalResults": response.hits.total.value,
    }


def get_restaurant_for_hit(hit):
    """Creates GraphQL restaurant object response for Elasticsearch hit"""
    return {
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
        "distance": hit.meta.sort[0],
        "active": hit.active,
        "logoUrl": hit.logoUrl.to_dict(),
        "heroUrl": hit.heroUrl.to_dict(),
    }

import logging
from geopy import distance
from common.errors import NibbleError


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    """Resolves requests for restaurant distance to user
    """
    logger.info(event)
    field = event["field"]
    # field should be Restaurant.distance
    if field != "Restaurant.distance":
        raise NibbleError(
            "Invalid field {0} for restaurant distance resolver".format(field)
        )

    # parse arguments
    current_latitude = event["arguments"]["currentPos"]["latitude"]
    current_longitude = event["arguments"]["currentPos"]["longitude"]
    restaurant_longitude = event["source"]["address"]["location"]["longitude"]
    restaurant_latitude = event["source"]["address"]["location"]["latitude"]

    # calculate distance
    d = distance.great_circle(  # redis uses spherical model so we do too
        (current_latitude, current_longitude),
        (restaurant_latitude, restaurant_longitude),
    ).miles
    logger.info("Calculated distance {0}".format(d))
    return d

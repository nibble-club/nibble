import logging

from common.errors import NibbleError
from zip_code_location_mapping import ZIP_CODE_LOCATION_MAPPING

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    """Resolves requests for restaurant distance to user
    """
    logger.info(event)
    field = event["field"]
    if field != "locationForPostalCode":
        raise NibbleError(
            "Invalid field {0} for locationForPostalCode resolver".format(field)
        )

    zip_code = event["arguments"]["postalCode"]

    # validate
    if len(zip_code) != 5:
        raise NibbleError("Invalid postal code {0}".format(zip_code))

    try:
        return ZIP_CODE_LOCATION_MAPPING[zip_code]
    except KeyError:
        raise NibbleError("Invalid postal code {0}".format(zip_code))

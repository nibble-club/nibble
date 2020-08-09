import json
import logging
import os

import redis
from common import redis_keys
from common.errors import NibbleError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# connect to Redis
r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])


def lambda_handler(event, context):
    """Resolves requests for searches. Currently search will find valid restaurants,
    with a preference for restaurants matching the search term, then for distance from
    the user; then, it will look for nibbles from restaurants in that set (2 searches
    total).
    """
    logger.info(event)
    field = event["field"]
    if field != "recentSearches":
        raise NibbleError("Invalid field {0} for recentSearches resolver".format(field))

    user_id = event["identity"]["username"]
    # fetch recent searches
    parameters_history = r.lrange(redis_keys.user_search_history(user_id), 0, -1)
    result = [json.loads(s) for s in parameters_history]
    logger.info(result)
    return result

"""
Provides easy-to-reference Redis key names
"""

# public
NIBBLES_AVAILABLE = "na"
NIBBLES_REMAINING = "nr"

# private-ish
_RESTAURANT_GEO = "rg"
_NIBBLE_LOCK = "nl"


def restaurant_geo(market):
    """Returns the Redis key for a given market's geographic sorted set in Redis

    Args:
        market (str): the market to search in (e.g. San Francisco)

    Returns:
        str: Redis key for given market
    """
    return "{key}:{market}".format(key=_RESTAURANT_GEO, market=market)


def nibble_lock(nibble_id):
    """Returns the Redis key for lock on the given Nibble

    Args:
        id (ing): the id of the nibble to lock on

    Returns:
        str: Redis key for given nibble
    """
    return "{key}:{nibble_id}".format(key=_NIBBLE_LOCK, nibble_id=nibble_id)

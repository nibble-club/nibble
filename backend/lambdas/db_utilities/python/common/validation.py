"""
Used to validate enumerated types before inserting in database
"""

from datetime import datetime

VALID_NIBBLE_TYPES = ["INGREDIENTS", "PREPARED", "MYSTERY"]


def in_past(epoch_timestamp):
    """Checks if a given epoch timestamp (seconds since Jan 1, 1970 UTC) is in the past.

    Args:
        epoch_timestamp (int): time to compare to now

    Returns:
        bool: True if time is in past, False otherwise
    """
    return datetime.now() > datetime.fromtimestamp(epoch_timestamp)

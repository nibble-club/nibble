import logging

from common import tables, utils
from common.errors import NibbleError
from sqlalchemy.sql import select

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# connect to database
engine = utils.get_engine()
user_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_USER)


def lambda_handler(event, context):
    """Resolves mutations for user info
    """
    logger.info(event)
    event_field = event["field"]
    if event_field not in ("userInfo",):
        raise NibbleError(
            "Incorrect request type {0} for userInfo handler".format(event_field)
        )

    user_id = event["identity"]["username"]
    s = select(
        [
            user_table.c.id,
            user_table.c.full_name,
            user_table.c.email,
            user_table.c.phone_number,
            user_table.c.postal_code,
            user_table.c.profile_url,
        ]
    ).where(user_table.c.id == user_id)

    with engine.connect() as conn:
        result = conn.execute(s)
        user_row = result.fetchone()
        result.close()

    if user_row is None:
        raise NibbleError("User ID {0} not found".format(user_id))

    user = {
        "id": user_id,
        "fullName": user_row["full_name"],
        "profilePicUrl": user_row["profile_url"],
        "email": user_row["email"],
        "phoneNumber": user_row["phone_number"],
        "postalCode": user_row["postal_code"],
    }
    logger.info(user)
    return user

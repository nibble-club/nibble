import logging
import json
import os
from common import tables, utils, validation
from sqlalchemy.sql import select

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    """Resolves requests for user info (not related to Nibble history)
    """
    logger.info(event)
    user_id = event["arguments"]["userId"]

    # connect to database
    engine = utils.get_engine()
    user_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_USER)
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
        raise RuntimeError("User ID ${0} not found".format(user_id))

    user = {
        "id": user_id,
        "fullName": user_row["full_name"],
        "profilePicUrl": user_row["profile_url"],
        "email": user_row["email"],
        "phoneNumber": user_row["phone_number"],
        "postalCode": user_row["postal_code"],
    }

    return user

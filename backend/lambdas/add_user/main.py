from enum import Enum
import logging
import json
import os
from common import tables, utils, validation

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class UserPool(Enum):
    USERS = 1
    RESTAURANT_ADMINS = 2


def lambda_handler(event, context):
    """Triggered when a user confirms their registration"""

    logger.info(event)
    user = event["request"]["userAttributes"]

    user_pool_to_trigger = {
        UserPool.USERS: "PostConfirmation_ConfirmSignUp",
        UserPool.RESTAURANT_ADMINS: "PreSignUp_AdminCreateUser",
    }

    trigger_source = event["triggerSource"]
    logger.info("Trigger source: {0}".format(trigger_source))

    # connect to database
    engine = utils.get_engine()

    if user_pool_to_trigger[UserPool.USERS] in trigger_source:
        logger.info("User confirmation")
        user_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_USER)

        ins = user_table.insert().values(
            id=event.get("userName"),
            full_name=user.get("name"),
            email=user.get("email"),
            profile_url={"bucket": "", "region": "", "key": ""},
        )

        with engine.connect() as conn:
            result = conn.execute(ins)
            logger.info("PK: {0}".format(result.inserted_primary_key))
        logger.info("Successfully inserted user into database")

    elif user_pool_to_trigger[UserPool.RESTAURANT_ADMINS] in trigger_source:
        logger.info("Restaurant admin confirmation")
        restaurant_admin_table = tables.get_table_metadata(
            tables.NibbleTable.RESTAURANT_ADMIN
        )

        ins = restaurant_admin_table.insert().values(
            id=event.get("userName"), email=user.get("email")
        )

        with engine.connect() as conn:
            result = conn.execute(ins)
            logger.info("PK: {0}".format(result.inserted_primary_key))

        event["response"]["autoConfirmUser"] = True
        event["response"]["autoVerifyEmail"] = True
        event["response"]["autoVerifyPhone"] = False
        logger.info("Successfully inserted admin into database")

    return event

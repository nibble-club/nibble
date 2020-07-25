from enum import Enum
import logging
import json
import os
from common import tables, utils, validation

logger = logging.getLogger()
logger.setLevel(logging.INFO)

USER_POOL_TRIGGER_SOURCE = "PostConfirmation_ConfirmSignUp"
ADMIN_POOL_TRIGGER_SOURCE = "PreSignUp_AdminCreateUser"


class UserPool(Enum):
    USERS = 1
    RESTAURANT_ADMINS = 2


def lambda_handler(event, context):
    """Triggered when a user confirms their registration (normal users) or an admin
    creates a user (restaurant admin users)
    """
    logger.info(event)

    # connect to database
    engine = utils.get_engine()
    event = event_type(event)

    if event_type is UserPool.USERS:
        logger.info("User confirmation")
        user_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_USER)

        ins = user_table.insert().values(**user_event_db_mapper(event))

        with engine.connect() as conn:
            result = conn.execute(ins)
            logger.info("PK: {0}".format(result.inserted_primary_key))
        logger.info("Successfully inserted user into database")

    elif event_type is UserPool.RESTAURANT_ADMINS:
        logger.info("Restaurant admin confirmation")
        restaurant_admin_table = tables.get_table_metadata(
            tables.NibbleTable.RESTAURANT_ADMIN
        )

        ins = restaurant_admin_table.insert(**admin_event_db_mapper(event)).values()

        with engine.connect() as conn:
            result = conn.execute(ins)
            logger.info("PK: {0}".format(result.inserted_primary_key))

        event["response"]["autoConfirmUser"] = True
        event["response"]["autoVerifyEmail"] = True
        event["response"]["autoVerifyPhone"] = False
        logger.info("Successfully inserted admin into database")

    return event


def event_type(event):
    """Gets the event type, either users or admins user pool.
    """
    trigger_source = event["triggerSource"]
    if USER_POOL_TRIGGER_SOURCE in trigger_source:
        return UserPool.USERS
    if ADMIN_POOL_TRIGGER_SOURCE in trigger_source:
        return UserPool.RESTAURANT_ADMINS


def user_event_db_mapper(event):
    """Maps the event parameters to a value to insert to the nibble_users table."""
    user = event["request"]["userAttributes"]
    return {
        "id": event.get("userName"),
        "full_name": user.get("name"),
        "email": user.get("email"),
        "profile_url": {"bucket": "PLACEHOLDER", "region": "", "key": "profile"},
        "postal_code": user.get("custom:postal_code"),
    }


def admin_event_db_mapper(event):
    """Maps the event parameters to a value to insert in the restaurant_admins table."""
    user = event["request"]["userAttributes"]
    return {"id": event.get("userName"), "email": user.get("email")}

from enum import Enum
import logging
from common import tables, utils
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# connect to database
engine = utils.get_engine()
user_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_USER)
restaurant_admin_table = tables.get_table_metadata(tables.NibbleTable.RESTAURANT_ADMIN)
cognito_client = boto3.client("cognito-idp")

USER_CONFIRM_EMAIL_TRIGGER_SOURCE = "PostConfirmation_ConfirmSignUp"
ADMIN_CREATED_TRIGGER_SOURCE = "PreSignUp_AdminCreateUser"
ADMIN_CONFIRM_TRIGGER_SOURCE = "TokenGeneration_NewPasswordChallenge"

USER_GROUP_NAME = "users"
ADMIN_GROUP_NAME = "admin"


class UserPoolEvent(Enum):
    USER_CONFIRM_EMAIL = 1
    ADMIN_CREATED = 2
    ADMIN_CONFIRM_PASSWORD = 3


def lambda_handler(event, context):
    """Triggered when a user confirms their registration (normal users) or an admin
    creates a user (restaurant admin users)
    """
    logger.info(event)

    event_type = get_event_type(event)

    if (
        event_type is UserPoolEvent.USER_CONFIRM_EMAIL
        and event["request"]["userAttributes"]["custom:admin"] == "false"
    ):
        logger.info("User confirmation")
        ins = user_table.insert().values(**user_event_db_mapper(event))

        with engine.connect() as conn:
            result = conn.execute(ins)
            logger.info("PK: {0}".format(result.inserted_primary_key[0]))
        logger.info("Successfully inserted user into database")

        cognito_client.admin_add_user_to_group(
            UserPoolId=event["userPoolId"],
            Username=event["userName"],
            GroupName=USER_GROUP_NAME,
        )
        logger.info("Successfully set user's group to {0}".format(USER_GROUP_NAME))
    elif event_type is UserPoolEvent.ADMIN_CONFIRM_PASSWORD:
        logger.info("Admin confirmed sign up")
        cognito_client.admin_add_user_to_group(
            UserPoolId=event["userPoolId"],
            Username=event["userName"],
            GroupName=ADMIN_GROUP_NAME,
        )
        logger.info("Successfully set user's group to {0}".format(ADMIN_GROUP_NAME))
    elif event_type is UserPoolEvent.ADMIN_CREATED:
        logger.info("Restaurant admin confirmation")

        ins = restaurant_admin_table.insert().values(**admin_event_db_mapper(event))

        with engine.connect() as conn:
            result = conn.execute(ins)
            logger.info("PK: {0}".format(result.inserted_primary_key))

        event["response"]["autoConfirmUser"] = False
        event["response"]["autoVerifyEmail"] = False
        event["response"]["autoVerifyPhone"] = False
        logger.info("Successfully inserted admin into database")
    else:  # pre-sign up trigger for user group
        logger.info("Non-admin user in sign up flow")
        event["response"]["autoConfirmUser"] = False
        event["response"]["autoVerifyEmail"] = False
        event["response"]["autoVerifyPhone"] = False

    logger.info(event)
    return event


def get_event_type(event):
    """Gets the event type, either users or admins user pool.
    """
    trigger_source = event["triggerSource"]
    if USER_CONFIRM_EMAIL_TRIGGER_SOURCE in trigger_source:
        return UserPoolEvent.USER_CONFIRM_EMAIL
    if ADMIN_CREATED_TRIGGER_SOURCE in trigger_source:
        return UserPoolEvent.ADMIN_CREATED
    if ADMIN_CONFIRM_TRIGGER_SOURCE in trigger_source:
        return UserPoolEvent.ADMIN_CONFIRM_PASSWORD


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

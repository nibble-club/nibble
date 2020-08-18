import logging
import os

import boto3
from common import tables, utils
from common.errors import NibbleError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# connect to database
engine = utils.get_engine()
user_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_USER)

# connect to cognito
cognito_client = boto3.client("cognito-idp")


def lambda_handler(event, context):
    """Resolves requests for user info (not related to Nibble history)
    """
    logger.info(event)
    event_field = event["field"]
    if event_field not in ("updateUser",):
        raise NibbleError(
            "Incorrect request type {0} for updateUser handler".format(event_field)
        )
    user_id = event["identity"]["username"]
    user_info = event["arguments"]["userInfo"]
    db_values = user_event_db_mapper(user_info)
    s = (
        user_table.update()
        .returning(
            user_table.c.id,
            user_table.c.full_name,
            user_table.c.email,
            user_table.c.phone_number,
            user_table.c.postal_code,
            user_table.c.profile_url,
        )
        .where(user_table.c.id == user_id)
        .values(**db_values)
    )

    with engine.begin() as conn:  # transactionizes SQL update
        result = conn.execute(s)
        user_row = result.fetchone()
        if user_row is None:
            raise NibbleError("User ID {0} not found".format(user_id))

        # change custom attributes in user pool
        response = cognito_client.admin_update_user_attributes(
            UserPoolId=os.environ["COGNITO_USER_POOL_ID"],
            Username=user_id,
            UserAttributes=[
                {"Name": "custom:postal_code", "Value": user_row["postal_code"]}
            ],
        )
        logger.info(response)
        logger.info("Updated user custom attributes in Cognito")

    user = user_event_result_mapper(user_row)
    logger.info(user)
    return user


def user_event_db_mapper(user_info):
    """Gets fields to insert into user database, and validates as well
    """
    # validate input
    if len(user_info["postalCode"]) != 5:
        raise NibbleError("Invalid postal code")

    try:
        return {
            "full_name": user_info["fullName"],
            "profile_url": user_info["profilePicUrl"],
            "phone_number": user_info.get("phoneNumber", None),
            "postal_code": user_info["postalCode"],
        }
    except KeyError:
        raise NibbleError("User input missing required element")


def user_event_result_mapper(db_row):
    """Gets return value from values inserted to db"""
    return {
        "id": db_row["id"],
        "fullName": db_row["full_name"],
        "profilePicUrl": db_row["profile_url"],
        "email": db_row["email"],
        "phoneNumber": db_row["phone_number"],
        "postalCode": db_row["postal_code"],
    }

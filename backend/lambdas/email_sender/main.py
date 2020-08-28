import json
import logging
import os
from datetime import datetime

import arrow
import boto3
from botocore.exceptions import ClientError
from common import tables, utils
from sqlalchemy.sql import and_, select

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# email-related constants
SENDER_NAME = "Nibble"
AWS_REGION = "us-west-2"  # hardcoding region because SES is specific to this region
CHARSET = "UTF-8"  # The character encoding for the email.
TIMEZONE = "US/Eastern"  # default timezone for displaying time
TIME_FORMAT = "h:mm a, dddd MMMM D, YYYY (ZZZ)"

# URL constants
NIBBLE_PAGE_URL = "https://app.nibble.club/nibble"
GOOGLE_MAPS_URL = "https://www.google.com/maps/dir/?api=1&destination="

# connect to database
engine = utils.get_engine()
user_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_USER)
nibble_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE)
reservation_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_RESERVATION)
restaurant_table = tables.get_table_metadata(tables.NibbleTable.RESTAURANT)

# connect to SES
client = boto3.client("ses", region_name=AWS_REGION)


def lambda_handler(event, context):
    """Sends emails based on polling email queue
    """
    logger.info(event)
    with engine.connect() as conn:
        for record in event["Records"]:
            body = json.loads(record["body"])
            try:
                message_type = body["type"]
                payload = body["payload"]
                user_id = body["user_id"]
            except KeyError:
                logger.error("Invalid body, missing required field")
                continue

            # assert valid message type
            if message_type not in [e.value for e in utils.EmailType]:
                logger.error(f"Invalid message type {message_type}")
                continue

            # get user info
            user_row = conn.execute(
                select([user_table.c.id, user_table.c.email]).where(
                    user_table.c.id == user_id
                )
            ).fetchone()
            user_id = user_row["id"]
            user_email = user_row["email"]

            if message_type == utils.EmailType.Reservation.value:
                # get restaurant info
                restaurant_selector = (
                    select([nibble_table.c.restaurant_id])
                    .where(
                        and_(
                            nibble_table.c.id == reservation_table.c.nibble_id,
                            reservation_table.c.user_id == user_id,
                            reservation_table.c.nibble_id == payload["id"],
                        )
                    )
                    .alias()
                )
                restaurant_row = conn.execute(
                    select(
                        [
                            restaurant_table.c.name,
                            restaurant_table.c.street_address,
                            restaurant_table.c.locality,
                            restaurant_table.c.administrative_area,
                            restaurant_table.c.postal_code,
                            restaurant_table.c.latitude,
                            restaurant_table.c.longitude,
                        ]
                    ).where(
                        restaurant_table.c.id == restaurant_selector.c.restaurant_id
                    )
                ).fetchone()
                restaurant_name = restaurant_row["name"]
                restaurant_street_address = restaurant_row["street_address"]
                restaurant_locality = restaurant_row["locality"]
                restaurant_administrative_area = restaurant_row["administrative_area"]
                restaurant_postal_code = restaurant_row["postal_code"]
                restaurant_longitude = restaurant_row["longitude"]
                restaurant_latitude = restaurant_row["latitude"]
                subject = "Your Nibble reservation is confirmed!"
                template_mappings = {
                    "restaurant_name": restaurant_name,
                    "restaurant_address": restaurant_street_address,
                    "restaurant_address_line_2": f"{restaurant_locality}, {restaurant_administrative_area} {restaurant_postal_code}",
                    "restaurant_directions": f"{GOOGLE_MAPS_URL}{restaurant_latitude},{restaurant_longitude}",
                    "nibble_name": payload["name"],
                    "nibble_count": payload["count"],
                    "nibble_image": image_url_mapper(payload["imageUrl"]),
                    "nibble_pickup_by": arrow.get(payload["availableTo"])
                    .to(TIMEZONE)
                    .format(TIME_FORMAT),
                    "reservation_price": payload["price"] / 100,
                    "reservation_page": f"{NIBBLE_PAGE_URL}/{payload['id']}",
                    "current_year": datetime.now().year,
                }

            # send message
            try:
                with open(f"templates/{message_type}.html", "r") as f:
                    body_html = f.read().format(**template_mappings)
                with open(f"templates/{message_type}.txt", "r") as f:
                    body_text = f.read().format(**template_mappings)
                # Provide the contents of the email.
                response = client.send_email(
                    Destination={"ToAddresses": [user_email]},
                    Message={
                        "Body": {
                            "Html": {"Charset": CHARSET, "Data": body_html},
                            "Text": {"Charset": CHARSET, "Data": body_text},
                        },
                        "Subject": {"Charset": CHARSET, "Data": subject},
                    },
                    Source=f"{SENDER_NAME} <{os.environ['SENDER_EMAIL']}>",
                )
            # Display an error if something goes wrong.
            except ClientError as e:
                logger.error(e.response["Error"]["Message"])
            else:
                logger.info("Email sent! Message ID:"),
                logger.info(response["MessageId"])


def image_url_mapper(image):
    """Maps S3Object dictionary to its URL"""
    bucket = image["bucket"]
    region = image["region"]
    key = image["key"]
    if bucket == "PLACEHOLDER":
        return "https://nibble-branding.s3-us-west-2.amazonaws.com/plate.png"
    return f"https://{bucket}.s3-{region}.amazonaws.com/{key}"

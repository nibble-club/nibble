import logging
import os
import uuid

import boto3
from botocore.exceptions import ClientError
from common.errors import NibbleError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client("s3")

ONE_HOUR = 60 * 60


def bucket_name(s3_object_destination):
    """Given an S3ObjectDestination enum member from a GraphQL request, returns
    the name of the bucket

    Args:
        s3_object_destination (str): one of the enum values as defined in the schema
    """
    if s3_object_destination == "UserProfilePictures":
        return os.environ["USER_PROFILE_PICTURES_BUCKET"]
    if s3_object_destination == "RestaurantLogos":
        return os.environ["RESTAURANT_LOGOS_BUCKET"]
    if s3_object_destination == "RestaurantHeros":
        return os.environ["RESTAURANT_HEROS_BUCKET"]
    if s3_object_destination == "NibbleImages":
        return os.environ["NIBBLE_IMAGES_BUCKET"]
    raise NibbleError("Invalid destination for S3 object")


def lambda_handler(event, context):
    """Resolves requests for S3 pre-signed URL to upload image
    """
    logger.info(event)
    if "imageUploadURL" not in event["field"]:
        raise NibbleError(
            "Cannot use S3 presigned URL resolver on field {0}".format(event["field"])
        )
    s3_bucket = bucket_name(event["arguments"]["destination"])
    s3_key = str(uuid.uuid4()) + ".jpg"
    try:
        response = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "ACL": "public-read",
                "Bucket": s3_bucket,
                "Key": s3_key,
                "ContentType": "image/jpeg",
            },
            ExpiresIn=ONE_HOUR,
        )
        return {
            "presignedUrl": response,
            "destination": {
                "bucket": s3_bucket,
                "region": os.environ["AWS_REGION"],
                "key": s3_key,
            },
        }
    except ClientError as e:
        logger.info(e)
        raise NibbleError("Could not get URL to upload image")

import json
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


def lambda_handler(event, context):
    """Resolves requests for S3 pre-signed URL to upload image
    """
    if "imageUploadURL" not in event["field"]:
        raise NibbleError(
            "Cannot use S3 presigned URL resolver on field {0}".format(event["field"])
        )
    s3_bucket = event["arguments"]["bucket"]
    s3_directory = event["arguments"]["directory"]
    s3_key = "{directory}/{key}".format(directory=s3_directory, key=str(uuid.uuid4()))
    try:
        response = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "ACL": "public-read",
                "Bucket": s3_bucket,
                "Key": s3_key,
                "ContentType": "image/*",
            },
            ExpiresIn=ONE_HOUR,
        )
        return response
    except ClientError as e:
        logger.info(e)
        raise NibbleError("Could not get URL to upload image")

"""
Seeds every restaurant with a random subset of several nibbles; the nibbles will be
available for 8 hours, starting between 2 hours before now and 2 hours after now.
Make sure to seed restaurants and admins first - this depends on usernames.json
existing! Nibble information is pulled from nibbles.json.
"""
import base64
import datetime
import getpass
import json
import logging
import os
import random

import boto3
import git
from botocore.errorfactory import ClientError

# set up logging
repo = git.Repo(os.getcwd(), search_parent_directories=True)
nibble_home_dir = repo.working_tree_dir
logging_dir = os.path.join(nibble_home_dir, "var", "log")
if not os.path.exists(logging_dir):
    os.makedirs(logging_dir)
logging_file = os.path.join(logging_dir, "seed_nibbles.log")
logging.basicConfig(
    filename=logging_file,
    filemode="w",
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
)

# set up config
whoami = getpass.getuser()
environment = os.environ["DEPLOY_ENV"]
environment_namespace = (
    f"{environment}_{whoami}" if environment == "dev" else environment
)
account_id = os.environ["AWS_TARGET_ACCOUNT_ID"]
region = os.environ["AWS_REGION"]


image_bucket = f"{account_id}-{environment_namespace}-nibble-images".replace("_", "-")


def upload_nibble_image(image_key):
    file_name = f"imgs/nibbles/{image_key}"
    key = f"seeding/{image_key}"

    s3_client = boto3.client("s3")
    try:
        s3_client.head_object(Bucket=image_bucket, Key=key)
        print(f"Checked  {file_name}")
        logging.info(f"{file_name} exists on S3")
    except ClientError:
        try:
            s3_client.upload_file(
                file_name,
                image_bucket,
                f"seeding/{image_key}",
                ExtraArgs={"ACL": "public-read"},
            )
            print(f"Uploaded {file_name}")
            logging.info(f"Uploaded {file_name} to S3")
        except Exception:
            print("Error uploading")
            logging.error(f"Error uploading {file_name}")
            raise RuntimeError()

    return {
        "bucket": image_bucket,
        "region": "us-west-2",
        "key": f"seeding/{image_key}",
    }


def main():
    print(f"Logs: {logging_file}")
    # get admin usernames
    with open("var/usernames.json", "r") as f:
        usernames = json.load(f)

    # get Nibble info
    with open("data/nibbles.json", "r") as f:
        partial_nibbles = json.load(f)

    # fill out remaining nibble info
    nibbles = []
    for n in partial_nibbles:
        if n["imageName"] == "PLACEHOLDER":
            imageUrl = {"bucket": "PLACEHOLDER", "region": "", "key": "hero"}
        else:
            imageUrl = upload_nibble_image(n["imageName"])

        now = datetime.datetime.now()
        now += datetime.timedelta(
            hours=random.randint(-2, 2), minutes=random.randint(-30, 30)
        )
        then = now + datetime.timedelta(hours=8)

        nibbles.append(
            {
                "name": n["name"],
                "type": n["type"],
                "count": n["count"] + random.randint(-1, 5),
                "imageUrl": imageUrl,
                "description": n["description"],
                "price": n["price"] + 5 * random.randint(-10, 10),
                "availableFrom": int(now.timestamp()),
                "availableTo": int(then.timestamp()),
            }
        )

    # send nibbles
    client = boto3.client("lambda", region_name=region)
    for username in usernames:
        for payload in random.sample(nibbles, 2):
            response = client.invoke(
                FunctionName=f"{environment_namespace}-resolver_admin_nibble_mutation",
                InvocationType="RequestResponse",
                Payload=json.dumps(
                    {
                        "field": "adminCreateNibble",
                        "identity": {"username": username},
                        "arguments": {"input": payload},
                    }
                ),
                LogType="Tail",
            )

            logging.info(f"Lambda invoked for username {username}")
            logging.info(base64.b64decode(response["LogResult"]).decode("utf-8"))
            if response["StatusCode"] != 200:
                print("Lambda invocation failed")
                logging.error("Lambda invocation failed")
                print(response)
                raise RuntimeError()
        print(f"Added nibbles for {username}")
        logging.info(f"Added nibbles for {username}")


if __name__ == "__main__":
    main()

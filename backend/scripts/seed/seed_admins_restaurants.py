import base64
import getpass
import json
import logging
import os
import shutil
import uuid

import boto3
import git
import requests
from botocore.errorfactory import ClientError

# set up logging
repo = git.Repo(os.getcwd(), search_parent_directories=True)
nibble_home_dir = repo.working_tree_dir
logging_dir = os.path.join(nibble_home_dir, "var", "log")
if not os.path.exists(logging_dir):
    os.makedirs(logging_dir)
logging_file = os.path.join(logging_dir, "seed_admins_restaurants.log")
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

hero_bucket = f"{account_id}-{environment_namespace}-restaurant-heros".replace("_", "-")
logo_bucket = f"{account_id}-{environment_namespace}-restaurant-logos".replace("_", "-")


def upload_logo(url, place_id):
    file_name = f"imgs/restaurants/{place_id}_logo.jpg"
    key = f"seeding/{place_id}.jpg"

    if not os.path.isfile(file_name):
        # download and write image file
        print(f"Downloading {file_name}")
        logging.warn(f"Downloading {file_name}")
        r = requests.get(url, stream=True)
        if r.status_code == 200:
            with open(file_name, "wb") as f:
                shutil.copyfileobj(r.raw, f)
        else:
            raise RuntimeError("Failed request")

    s3_client = boto3.client("s3")
    try:
        s3_client.head_object(Bucket=logo_bucket, Key=key)
        print(f"Checked     {file_name}")
        logging.info(f"{file_name} exists on S3")
    except ClientError:
        try:
            s3_client.upload_file(
                file_name, logo_bucket, key, ExtraArgs={"ACL": "public-read"},
            )
            print(f"Uploaded    {file_name}")
            logging.info(f"Uploaded {file_name} to S3")
        except Exception:
            print("Error uploading")
            logging.error(f"Error uploading {file_name}")
            raise RuntimeError()

    return {
        "bucket": logo_bucket,
        "region": "us-west-2",
        "key": key,
    }


def upload_hero_image(photo_reference, place_id):
    file_name = f"imgs/restaurants/{place_id}.jpg"
    key = f"seeding/{place_id}.jpg"
    if not os.path.isfile(file_name):
        # download and write image file
        photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference={photo_reference}&key={os.environ['GOOGLE_API_KEY']}"
        print(f"Downloading {file_name}")
        logging.warn(f"Downloading {file_name}")
        r = requests.get(photo_url, stream=True)
        if r.status_code == 200:
            with open(file_name, "wb") as f:
                shutil.copyfileobj(r.raw, f)
        else:
            raise RuntimeError("Failed request")

    s3_client = boto3.client("s3")
    try:
        s3_client.head_object(Bucket=hero_bucket, Key=key)
        print(f"Checked     {file_name}")
        logging.info(f"{file_name} exists on S3")
    except ClientError:
        try:
            s3_client.upload_file(
                file_name, hero_bucket, key, ExtraArgs={"ACL": "public-read"},
            )
            print(f"Uploaded    {file_name}")
            logging.info(f"Uploaded {file_name} to S3")
        except Exception:
            print("Error uploading")
            logging.error(f"Error uploading {file_name}")
            raise RuntimeError("Error uploading to S3")

    return {
        "bucket": hero_bucket,
        "region": "us-west-2",
        "key": key,
    }


def main():
    print(f"Logs: {logging_file}")
    with open("data/google.json", "r") as google:
        restaurants = json.load(google)

    # collect restaurant payloads from Google info
    restaurant_payloads = []
    for r in restaurants:
        street_address, locality = r["vicinity"].split(", ")
        description = r["description"]
        hero_url = upload_hero_image(r["photos"][0]["photo_reference"], r["place_id"])
        logo_url = upload_logo(r["icon"], r["place_id"])
        name = r["name"]
        latitude = r["geometry"]["location"]["lat"]
        longitude = r["geometry"]["location"]["lng"]
        restaurant_payloads.append(
            {
                "name": name,
                "address": {
                    "streetAddress": street_address,
                    "locality": locality,
                    "administrativeArea": "Massachusetts",
                    "country": "USA",
                    "postalCode": "02144",
                    "location": {"latitude": latitude, "longitude": longitude},
                },
                "market": "Boston",
                "description": description,
                "logoUrl": logo_url,
                "heroUrl": hero_url,
                "disclaimer": "Source: Google Places",
                "active": True,
            }
        )

    # create admin Cognito users, one for each restaurant
    if not os.path.isfile("var/usernames.json"):
        print("Creating new admin users")
        logging.warn("No usernames.json file found, creating new Cognito admin users")
        # get user pool ID from SSM
        ssm_client = boto3.client("ssm", region_name=region)
        ssm_path = (
            f"/environment/{environment_namespace}/frontend_config/cognito_user_pool_id"
        )
        response = ssm_client.get_parameter(Name=ssm_path, WithDecryption=True)

        cognito_user_pool = response["Parameter"]["Value"]
        logging.info(f"Got Cognito user pool ID {cognito_user_pool} from SSM")

        admin_usernames = []
        cognito_client = boto3.client("cognito-idp", region_name=region)
        for _ in restaurant_payloads:
            email = f"{str(uuid.uuid4())}@seed.com"
            response = cognito_client.admin_create_user(
                UserPoolId=cognito_user_pool,
                Username=email,
                UserAttributes=[
                    {"Name": "email", "Value": email},
                    {"Name": "email_verified", "Value": "true"},
                ],
                TemporaryPassword="TempPassword6969!!!",
                DesiredDeliveryMediums=["EMAIL"],
                MessageAction="SUPPRESS",
            )
            admin_usernames.append(response["User"]["Username"])
            print(f"Added user {admin_usernames[-1]}")
            logging.info(f"Added user {admin_usernames[-1]}")
        with open("var/usernames.json", "w") as f:
            json.dump(admin_usernames, f)
    else:
        print("Using existing admin users")
        logging.info("Using existing admin users from usernames.json")
        with open("var/usernames.json", "r") as f:
            admin_usernames = json.load(f)

    client = boto3.client("lambda", region_name=region)
    for payload, username in zip(restaurant_payloads, admin_usernames):
        # add restaurant
        response = client.invoke(
            FunctionName=f"{environment_namespace}-resolver_admin_restaurant_mutation",
            InvocationType="RequestResponse",
            Payload=json.dumps(
                {
                    "field": "adminCreateRestaurant",
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
        print(f"Added restaurant {payload['name']}")
        logging.info(f"Added restaurant {payload['name']}")


if __name__ == "__main__":
    main()

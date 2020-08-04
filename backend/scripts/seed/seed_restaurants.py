import json
import os
import uuid

import requests
import boto3
import shutil

environment_namespace = "dev_adchurch"
account_id = "800344761765"
region = "us-west-2"

cognito_user_pool = "us-west-2_j9CKKHThV"

hero_bucket = f"{account_id}-{environment_namespace}-restaurant-heros".replace("_", "-")
logo_bucket = f"{account_id}-{environment_namespace}-restaurant-logos".replace("_", "-")

# configuration
upload_images = False
new_users = True


def upload_logo(url, place_id):
    if upload_images:
        file_name = f"imgs/{place_id}_logo.jpg"

        if not os.path.isfile(file_name):
            # download and write image file
            print(f"Downloading {file_name}")
            r = requests.get(url, stream=True)
            if r.status_code == 200:
                with open(file_name, "wb") as f:
                    shutil.copyfileobj(r.raw, f)
            else:
                raise RuntimeError("Failed request")

        s3_client = boto3.client("s3")
        try:
            s3_client.upload_file(
                file_name,
                logo_bucket,
                f"seeding/{place_id}.jpg",
                ExtraArgs={"ACL": "public-read"},
            )
            print(f"Uploaded    {file_name}")
        except:
            print("Error uploading")
            raise RuntimeError()

    return {
        "bucket": logo_bucket,
        "region": "us-west-2",
        "key": f"seeding/{place_id}.jpg",
    }


def upload_hero_image(photo_reference, place_id):
    if upload_images:
        file_name = f"imgs/{place_id}.jpg"
        if not os.path.isfile(file_name):
            # download and write image file
            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference={photo_reference}&key={os.environ['GOOGLE_API_KEY']}"
            print(f"Downloading {file_name}")
            r = requests.get(photo_url, stream=True)
            if r.status_code == 200:
                with open(file_name, "wb") as f:
                    shutil.copyfileobj(r.raw, f)
            else:
                raise RuntimeError("Failed request")

        s3_client = boto3.client("s3")
        try:
            s3_client.upload_file(
                file_name,
                hero_bucket,
                f"seeding/{place_id}.jpg",
                ExtraArgs={"ACL": "public-read"},
            )
            print(f"Uploaded    {file_name}")
        except:
            print("Error uploading")
            raise RuntimeError("Error uploading to S3")

    return {
        "bucket": hero_bucket,
        "region": "us-west-2",
        "key": f"seeding/{place_id}.jpg",
    }


def main():
    with open("google.json", "r") as google:
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
                    "location": {"latitude": latitude, "longitude": longitude,},
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
    if new_users:
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
            )
            admin_usernames.append(response["User"]["Username"])
            print(f"Added user {admin_usernames[-1]}")
        with open("usernames.json", "w") as f:
            json.dump(admin_usernames, f)
    else:
        with open("usernames.json", "r") as f:
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
        )
        if response["StatusCode"] != 200:
            print("Lambda invocation failed")
            print(response)
            raise RuntimeError()
        print(f"Added restaurant {payload['name']}")


if __name__ == "__main__":
    main()

"""
Seeds every restaurant with a random subset of several nibbles; the nibbles will be 
available for 8 hours, starting between 2 hours before now and 2 hours after now.
Make sure to seed restaurants and admins first - this depends on usernames.json 
existing! Nibble information is pulled from nibbles.json.
"""
import json
import datetime
import random
import boto3

# configuration
upload_images = False


environment_namespace = "dev_adchurch"
account_id = "800344761765"
region = "us-west-2"


image_bucket = f"{account_id}-{environment_namespace}-nibble-images".replace("_", "-")


def upload_nibble_image(image_key):
    if upload_images:
        file_name = f"imgs/nibbles/{image_key}"

        s3_client = boto3.client("s3")
        try:
            s3_client.upload_file(
                file_name,
                image_bucket,
                f"seeding/{image_key}",
                ExtraArgs={"ACL": "public-read"},
            )
            print(f"Uploaded {file_name}")
        except:
            print("Error uploading")
            raise RuntimeError()

    return {
        "bucket": image_bucket,
        "region": "us-west-2",
        "key": f"seeding/{image_key}",
    }


def main():
    # get admin usernames
    with open("usernames.json", "r") as f:
        usernames = json.load(f)

    # get Nibble info
    with open("nibbles.json", "r") as f:
        partial_nibbles = json.load(f)

    # fill out remaining nibble info
    nibbles = []
    for n in partial_nibbles:
        if n["imageName"] == "PLACEHOLDER":
            imageUrl = {"bucket": "PLACEHOLDER", "region": "", "key": "hero"}
        else:
            imageUrl = upload_nibble_image(n["imageName"])

        now = datetime.datetime.now()
        now += datetime.timedelta(hours=random.randint(-2, 2))
        then = now + datetime.timedelta(hours=8)

        nibbles.append(
            {
                "name": n["name"],
                "type": n["type"],
                "count": n["count"],
                "imageUrl": imageUrl,
                "description": n["description"],
                "price": n["price"],
                "availableFrom": int(now.timestamp()),
                "availableTo": int(then.timestamp()),
            }
        )

    # send nibbles
    client = boto3.client("lambda", region_name=region)
    for username in usernames:
        for payload in random.sample(nibbles, 3):
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
            )
            if response["StatusCode"] != 200:
                print("Lambda invocation failed")
                print(response)
                raise RuntimeError()
        print(f"Added nibbles for {username}")


if __name__ == "__main__":
    main()

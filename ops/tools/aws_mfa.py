"""
Takes an MFA code, and sets up a profile that lasts for 8 hours in ~/.aws
"""

import sys
import boto3
import configparser
import os
import types
from datetime import datetime, timezone, timedelta
import uuid

original_profile = "nibble"
mfa_profile = "nibble-deploy"
duration = 28800

accounts = {
    "nibble-security": "430696291002",
    "nibble-development": "800344761765",
    "nibble-qa": "018002986064",
    "nibble-production": "979473937812",
}


def main():
    args = sys.argv[1:]
    assert (
        len(args) > 0 and len(args) <= 2
    ), "Arguments: mfa_code [target_account_name], e.g. 123456 nibble-development"
    mfa_code = args[0]
    target_account_name = args[1] if len(args) == 2 else "nibble-development"
    print("Assuming role in {0}".format(target_account_name))
    try:
        target_account = accounts[target_account_name]
    except:
        raise RuntimeError("Invalid account name {0}".format(target_account_name))

    # process ~/.aws/config
    aws_config_file = configparser.ConfigParser()
    aws_config_path = os.path.join(os.path.expanduser("~"), ".aws/config")
    aws_config_file.read(aws_config_path)
    aws_config_sections = aws_config_file.sections()
    if len(aws_config_sections) == 0:
        raise EnvironmentError("Missing AWS configuration file at ~/.aws/config")
    profile_name = "profile {0}".format(original_profile)
    if profile_name not in aws_config_sections:
        raise EnvironmentError(
            "Missing {0} profile in configuration file at ~/.aws/config".format(
                original_profile
            )
        )
    # aws_config = types.SimpleNamespace(**aws_config_file[profile_name])

    # process ~/.aws/credentials
    aws_credentials_file = configparser.ConfigParser()
    aws_credentials_path = os.path.join(os.path.expanduser("~"), ".aws/credentials")
    aws_credentials_file.read(aws_credentials_path)
    aws_credentials_sections = aws_credentials_file.sections()
    if len(aws_credentials_sections) == 0:
        raise EnvironmentError("Missing AWS configuration file at ~/.aws/credentials")
    if original_profile not in aws_credentials_sections:
        raise EnvironmentError(
            "Missing {0} profile in credentials file at ~/.aws/config".format(
                original_profile
            )
        )
    aws_credentials = types.SimpleNamespace(**aws_credentials_file[original_profile])
    if not hasattr(aws_credentials, "aws_access_key_id"):
        raise EnvironmentError(
            "Missing `aws_access_key_id` for profile {0}".format(original_profile)
        )
    if not hasattr(aws_credentials, "aws_secret_access_key"):
        raise EnvironmentError(
            "Missing `aws_secret_access_key` for profile {0}".format(original_profile)
        )

    # get user info
    session = boto3.Session(profile_name=original_profile)
    aws_iam_client = session.client("iam")
    user = aws_iam_client.get_user()
    if "User" not in user:
        raise EnvironmentError(
            "Unable to obtain user details for profile {0}".format(original_profile)
        )
    user = types.SimpleNamespace(**user["User"])
    # user_id = user.Arn
    user_name = user.UserName

    # get account info
    aws_sts_client = session.client("sts")
    identity = aws_sts_client.get_caller_identity()
    del identity["ResponseMetadata"]
    identity = types.SimpleNamespace(**identity)
    # account_id = identity.Account

    # get mfa info
    mfa_devices = types.SimpleNamespace(**aws_iam_client.list_mfa_devices())
    if not hasattr(mfa_devices, "MFADevices") or len(mfa_devices.MFADevices) == 0:
        raise EnvironmentError("No MFA devices active on account")
    mfa_devices = [types.SimpleNamespace(**md) for md in mfa_devices.MFADevices]
    mfa_device = sorted(mfa_devices, key=lambda x: x.EnableDate, reverse=True)[0]
    if not hasattr(mfa_device, "SerialNumber"):
        raise EnvironmentError("MFA device does not have serial number")
    serial_number = mfa_device.SerialNumber
    user_name = mfa_device.UserName

    # get credentials
    target_role = "arn:aws:iam::{0}:role/admin/deployment".format(target_account)
    role_session_name = "aws_mfa-" + str(uuid.uuid4())
    credentials = aws_sts_client.assume_role(
        RoleArn=target_role,
        RoleSessionName=role_session_name,
        DurationSeconds=duration,
        SerialNumber=serial_number,
        TokenCode=mfa_code,
    )
    credentials = types.SimpleNamespace(**credentials["Credentials"])

    aws_credentials_file[mfa_profile] = {
        "aws_access_key_id": credentials.AccessKeyId,
        "aws_secret_access_key": credentials.SecretAccessKey,
        "aws_session_token": credentials.SessionToken,
    }

    print("Updating {0} profile in {1}".format(mfa_profile, aws_credentials_path))
    with open(aws_credentials_path, "w") as f:
        aws_credentials_file.write(f)

    if mfa_profile not in aws_config_file:
        aws_config_file[mfa_profile] = dict()
    created = datetime.now(timezone.utc)
    expires = created + timedelta(seconds=duration)
    aws_config_file[mfa_profile].update(
        {
            "source_profile": mfa_profile,
            "role_session_name": role_session_name,
            "duration": str(duration),
            "created": created.astimezone().isoformat(),
            "expires": expires.astimezone().isoformat(),
            "role_arn": target_role,
        }
    )

    print("updating {0} profile in {1}".format(mfa_profile, aws_config_path))
    with open(aws_config_path, "w") as f:
        aws_config_file.write(f)


if __name__ == "__main__":
    main()

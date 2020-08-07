"""
Allows user to set secret variables in SSM
"""

import logging
import os
import sys

import boto3
from botocore.errorfactory import ClientError
import git

# set up logging
repo = git.Repo(os.getcwd(), search_parent_directories=True)
nibble_home_dir = repo.working_tree_dir
logging_dir = os.path.join(nibble_home_dir, "var", "log")
if not os.path.exists(logging_dir):
    os.makedirs(logging_dir)
logging_file = os.path.join(logging_dir, "set_secret_env_var.log")
logging.basicConfig(
    filename=logging_file,
    filemode="w",
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
)

# set up config
environment = os.environ["DEPLOY_ENV"]
region = os.environ["AWS_REGION"]


def main():
    print(f"Logs: {logging_file}")
    # fetch values from command line
    args = sys.argv[1:]
    logging.info("Called with args:")
    logging.info(args)
    # validate
    for arg in args:
        if "=" not in arg:
            raise RuntimeError(
                "Please specify input variables with the format [name]=[value]"
            )

    # set in SSM
    client = boto3.client("ssm", region_name=region)
    ssm_path = f"/environment/{environment}/frontend_config/secret"

    for arg in args:
        name, value = arg.split("=")
        try:
            client.put_parameter(
                Name=f"{ssm_path}/{name}",
                Description="Set from set_secret_env_var.py",
                Value=value,
                Type="SecureString",
                KeyId="alias/account-key",
                Overwrite=True,
                Tier="Standard",
            )
        except Exception as e:
            logging.error("Error setting parameter")
            logging.error(e)
            raise RuntimeError()

    print(f"Set {len(args)} variable{'s' if len(args) != 1 else ''} successfully")


if __name__ == "__main__":
    main()

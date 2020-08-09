"""
Appends secret config vars to the .env file in the frontend folder.
"""

import getpass
import logging
import os

import boto3
import git

# set up logging
repo = git.Repo(os.getcwd(), search_parent_directories=True)
nibble_home_dir = repo.working_tree_dir
logging_dir = os.path.join(nibble_home_dir, "var", "log")
if not os.path.exists(logging_dir):
    os.makedirs(logging_dir)
logging_file = os.path.join(logging_dir, "get_secret_env_vars.log")
logging.basicConfig(
    filename=logging_file,
    filemode="w",
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
)

# set up config
whoami = getpass.getuser()
environment = os.environ["DEPLOY_ENV"]
region = os.environ["AWS_REGION"]


def main():
    print(f"Logs: {logging_file}")
    # fetch values from SSM
    client = boto3.client("ssm", region_name=region)
    ssm_path = f"/environment/{environment}/frontend_config/secret"
    response = client.get_parameters_by_path(
        Path=ssm_path, Recursive=False, WithDecryption=True
    )
    logging.info("Got parameters:")
    logging.info([p["Name"] for p in response["Parameters"]])

    with open(os.path.join(nibble_home_dir, "frontend", ".env"), "a") as f:
        for param in response["Parameters"]:
            param_name = param["Name"].split("/")[-1].upper()
            param_value = param["Value"]
            f.write(f'REACT_APP_{param_name}="{param_value}"\n')

        # also add for storybook
        f.write("\n")
        for param in response["Parameters"]:
            param_name = param["Name"].split("/")[-1].upper()
            param_value = param["Value"]
            f.write(f'STORYBOOK_{param_name}="{param_value}"\n')

    logging.info("Wrote parameters to frontend .env file")


if __name__ == "__main__":
    main()

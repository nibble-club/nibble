# Nibble Ops

This folder contains operational matters, including bootstrapping an AWS environment and adding users.

## Overview

Nibble's AWS architecture involves 4 accounts: a `nibble-security` account, which holds all the users, and then a `nibble-development`, `nibble-qa` and `nibble-production` account, which are deployment environments.

![Accounts Diagram](https://app.lucidchart.com/publicSegments/view/6e31e33f-57b0-4eef-abd2-d7b5e3b5c364/image.png)

When you're added as a user, you will be added to the `nibble-security` account. You can't really do much there; you'll do all your work by _assuming roles_ in other accounts. Everybody in the `developers` group has permissions to assume an admin deployment role in `nibble-development`, which allows you to work on and test your own code and infrastructure. You'll assume that role in the

## Adding yourself

To add yourself as a user, follow these steps:

1. Move to the `iam` folder in the `nibble-security` account (`accounts/nibble-security/iam`).
2. In `users.tf`, add yourself as a user. Make sure your `path` is `"/"`; otherwise, follow the examples in the existing code.
3. In `groups.tf`, add yourself to the `everyone` and `developers` group. Follow the examples in the existing code.

Once that's done, have someone deploy the changes and grant you console access; then [log in to the console](https://nibble-security.signin.aws.amazon.com/console). Your initial password will be **"Happy2JoinTheNibbleClub!"**. First you'll need to [set up multi-factor authentication](https://console.aws.amazon.com/iam/home#/security_credentials), or else you'll get lots of confusing permissions errors. Sign out and sign back in; then you'll need to change your password to something much more secure.

## Bootstrapping

To bootstrap an account, from the root user make a user with full admin access called `bootstrap`.

Then get the AWS _access key ID_ and _secret access key_. Leave the window open for the next step!

Run the following command:

```shell
$ aws configure --profile nibble-bootstrap
AWS Access Key ID [None]: *enter your access key ID here*
AWS Secret Access Key [None]: *enter your secret access key here*
Default region name [None]: us-west-2
Default output format [None]: json
```

This configures the `nibble-bootstrap` profile.

Then move to the correct account directory, and start in the `bootstrap` directory. There, run the `make local-plan` command, then `make local`, which should run Terraform. This will create the Terraform backend (S3 bucket and DynamoDB table). It will give you the name of the bucket and tables; save those values, they will be useful for putting in the `tf-backend` files in other various deployment folders (including `access` and `backend_resources`). This should only happen once!

The `tf-backend` files should include:

```text
encrypt="true"
key="nibble/[pipeline_name]/terraform.tfstate"
bucket="[bucket_name]"
dynamodb_table="[dynamodb_table_name]"
region="[region]"
profile="nibble-deploy" # except for access and iam, which use "nibble-bootstrap"
# optional: role_arn (may need correct role by account)
```

Next move to the `access` directory. Set environment variables with your desired region (for the backend) and profile (should be `nibble-bootstrap`), and run `make init`. Then run `make plan` and `make apply` there. This will set up the appropriate policies as well as a permissions boundary. Ideally you will only ever need to run this once.

For `nibble-security` only:
Next you will make user accounts (including your own). Head to the `iam` directory, and make sure to follow the steps above in "Adding yourself". Add yourself as a user. Then run `make init`, `make plan`, and `make apply`.

For everything but `nibble-security`: Finally head to the `backend_resources` directory. Again, run `make init`, `make plan`, and `make apply`; now everything should be ready for development!

At this point make sure to sign in with your actual user account, and follow the steps in `backend/deployments` to set up your local environment.

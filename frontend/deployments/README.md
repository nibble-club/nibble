# Deployments

This is where you can deploy the Nibble frontend.

To start, get your AWS account and [install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

Then go [here](https://console.aws.amazon.com/iam/home#/security_credentials) to get your AWS _access key ID_ and _secret access key_. Leave the window open for the next step!

Run the following command:

```shell
$ aws configure --profile nibble-deploy
AWS Access Key ID [None]: *enter your access key ID here*
AWS Secret Access Key [None]: *enter your secret access key here*
Default region name [None]: us-west-2
Default output format [None]: json
```

This configures the `nibble-deploy` profile.

Now, in this directory, run `make init`. You should only need to run this once per machine. This creates a Terraform workspace with your name (specifically your machine's response to `whoami`). This is your workspace to do what you want with.

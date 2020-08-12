# Nibble

Welcome to Nibble! This project is split into `backend`, `frontend`, and `ops` directories. Here is an overview of the architecture:

![Nibble Architecture Overview](https://app.lucidchart.com/publicSegments/view/1251ea2e-a8ac-4af8-85d4-4356535dcca0/image.png)

If you're just getting started, follow the [instructions in `ops`](ops/README.md#adding-yourself) to set up your AWS account before doing any of the below steps.

## Development prerequisites

- Some kind of UNIX (MacOS, Linux, WSL all should work)
- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- Follow the instructions below in [first-time setup](#first-time-setup) to set up your AWS user account locally
- [Gradle](https://gradle.org/install/)
- Python (also [set up a virtual environment](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/))
- [Terraform](https://www.terraform.io/downloads.html)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### First Time Setup

First, create a Python virtual environment:

```shell script
python3 -m pip install --user virtualenv
python3 -m venv ~/.venv/nibble
```

Once you get your AWS account (see the `ops` directory for instructions), [install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

Then go [here](https://console.aws.amazon.com/iam/home#/security_credentials) to get your AWS _access key ID_ and _secret access key_. Leave the window open for the next step!

Run the following command:

```shell script
$ aws configure --profile nibble
AWS Access Key ID [None]: *enter your access key ID here*
AWS Secret Access Key [None]: *enter your secret access key here*
Default region name [None]: us-west-2
Default output format [None]: json
```

This configures the `nibble` profile.

Now you'll install the ops tools which will make life much easier:

```shell script
pip3 install -e [nibble dir]/ops/nibble_tools
```

This sets up the `aws_mfa` command you'll use later.

Next, you'll probably want to switch to a useful role in the online AWS console. Click this link to [assume your developer role in `nibble-development`](https://signin.aws.amazon.com/switchrole?roleName=job-function/development/developer&account=nibble-development) in the console.

Next, source the pertinent file in the `local-dev-env` directory (probably `dev.env`). You'll need to do this each time you have a new shell.

Now you need to make an RSA key to access the EC2 instance, useful for debugging. Run the following command:

```shell script
ssh-keygen -P "" -t rsa -b 4096 -m PEM -f /home/[you]/.ssh/dev-ssh_key_pair
cp ~/.ssh/dev-ssh_key_pair ~/.ssh/dev-ssh_key_pair.pem
chmod 400 ~/.ssh/dev-ssh_key_pair.pem
```

The final step is to assume your role in `nibble-development` from the command line. Do do this, call `aws_mfa` with 1 argument: your current MFA code (this will work as long as you ran the `pip3 install` command above). This will create a new profile locally called `nibble-deploy`, in which you are authenticated with MFA (which allows you to do most things) and have assumed the deployment role. It only lasts for 8 hours, so you'll need to do this once (or twice) a day.

Now, in this directory, run `make init`. You should only need to run this once per machine (unless you delete your local .terraform directory, or add a new module). This sets you up locally in your own workspace, so your changes will not affect other people's work.

You're all set up to deploy!

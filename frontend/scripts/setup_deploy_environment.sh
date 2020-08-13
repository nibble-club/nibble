#!/bin/bash

if [ -z "$DEPLOY_ENV" ]
then
  echo "DEPLOY_ENV not set - try sourcing the appropriate file in the local-dev-env directory"
  exit 1
else
  echo "Setting up deployment variables for environment ${DEPLOY_ENV}"
fi

# set up variables
NIBBLE_HOME=$(git rev-parse --show-toplevel)
VARS_FILE="vars/$DEPLOY_ENV.tfvars"
ENV_FILE="$NIBBLE_HOME/frontend/.env"

# should be executed in deployments folder context

# reset
echo "" > $VARS_FILE

# set up AWS config vars
echo "aws_region = \"$AWS_REGION\"" >> $VARS_FILE
echo "aws_profile = \"$AWS_PROFILE\"" >> $VARS_FILE
echo "aws_target_account_id = \"$AWS_TARGET_ACCOUNT_ID\"" >> $VARS_FILE
echo "environment = \"$DEPLOY_ENV\"" >> $VARS_FILE
echo "heroku_team_name = \"nibble-club\"" >> $VARS_FILE

# set up Heroku; just use sensitive by default
echo "" >> $VARS_FILE
echo "heroku_sensitive_config_vars = {" >> $VARS_FILE
sed -e  's/^/  /' $ENV_FILE >> $VARS_FILE
echo "" >> $VARS_FILE
echo "}" >> $VARS_FILE

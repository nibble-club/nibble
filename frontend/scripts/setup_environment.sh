#!/bin/bash

# reset
echo "" > .env

echo 'HTTPS="true"' >> .env

if [ -z "$DEPLOY_ENV" ]
then
  echo "DEPLOY_ENV not set - try sourcing the appropriate file in the local-dev-env directory"
  exit 1
else
  echo "Setting up variables for environment ${DEPLOY_ENV}"
fi

cat environments/${DEPLOY_ENV}.env >> .env
echo "" >> .env
python3 scripts/get_backend_env_vars.py
echo "" >> .env
python3 scripts/get_secret_env_vars.py
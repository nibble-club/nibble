.PHONY: build

BUILDS_DIR ?= $(PWD)/build
PACKAGES_DIR ?= $(PWD)/packages

include $(shell git rev-parse --show-toplevel)/backend/common.mk

LAMBDAS_S3_BUCKET = $(AWS_TARGET_ACCOUNT_ID)-$(AWS_REGION)-$(DEPLOY_ENV)-lambdas


# calculates a hash of all .py and the requirements.txt file in the lambda's folder
SOURCE_LAMBDA_PACKAGE_NAME := $(shell basename $(shell pwd))
TARGET_LAMBDA_PACKAGE_NAME := $(SOURCE_LAMBDA_PACKAGE_NAME)-$(LAMBDA_CODE_HASH)

# create s3 file locations
ifeq ($(DEPLOY_ENV),dev)
LAMBDA_NAMESPACE := "dev_$(shell whoami)"
else
LAMBDA_NAMESPACE := $(DEPLOY_ENV)
endif

S3_DESTINATION := "s3://$(LAMBDAS_S3_BUCKET)/$(LAMBDA_NAMESPACE)/$(SOURCE_LAMBDA_PACKAGE_NAME)/$(TARGET_LAMBDA_PACKAGE_NAME).zip"

# find path of tfvars file to update, and value to update with
ENV_VARS_FILE := $(BACKEND_HOME)/deployments/vars/$(DEPLOY_ENV).tfvars
NAME_ENV_VAR := $(SOURCE_LAMBDA_PACKAGE_NAME)_lambda_name
NAME_ENV_VAR_SET := $(NAME_ENV_VAR) = "$(SOURCE_LAMBDA_PACKAGE_NAME)"
ARTIFACT_ENV_VAR := $(SOURCE_LAMBDA_PACKAGE_NAME)_lambda_artifact
ARTIFACT_ENV_VAR_SET := $(ARTIFACT_ENV_VAR) = "$(TARGET_LAMBDA_PACKAGE_NAME).zip"

build: compile test

archive:
	@echo "Uploading artifact..."
# upload to s3
	@aws s3 cp $(BUILDS_DIR)/$(SOURCE_LAMBDA_PACKAGE_NAME).zip $(S3_DESTINATION) --profile nibble-deploy
# edit pertinent variable in .tfvars file, for deployment (replace if exists, overwrite otherwise)
	@echo "Lambda artifact name: $(TARGET_LAMBDA_PACKAGE_NAME).zip"
	@grep -q "^$(ARTIFACT_ENV_VAR)" $(ENV_VARS_FILE) \
		&& perl -pi -e 's/^$(NAME_ENV_VAR).*/$(NAME_ENV_VAR_SET)/g' $(ENV_VARS_FILE) \
		|| echo '$(NAME_ENV_VAR_SET)' >> $(ENV_VARS_FILE)
	@grep -q "^$(ARTIFACT_ENV_VAR)" $(ENV_VARS_FILE) \
		&& perl -pi -e 's/^$(ARTIFACT_ENV_VAR).*/$(ARTIFACT_ENV_VAR_SET)/g' $(ENV_VARS_FILE) \
		|| echo '$(ARTIFACT_ENV_VAR_SET)' >> $(ENV_VARS_FILE)
	@echo "Wrote lambda artifact and name to $(ENV_VARS_FILE)"

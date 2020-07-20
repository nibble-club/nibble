.PHONY: init

AWS_PROFILE ?= nibble-deploy
PIPELINE_NAME := $(shell basename $(shell pwd))

# check for correct environment
ERROR_MESSAGE = "is not set - try sourcing the appropriate file from the local-dev-env directory in the backend directory"
ifeq ($(DEPLOY_ENV),)
$(error "DEPLOY_ENV $(ERROR_MESSAGE)")
endif
ifeq ($(AWS_PROFILE),)
$(error "AWS_PROFILE $(ERROR_MESSAGE)")
endif
ifeq ($(AWS_TARGET_ACCOUNT_ID),)
$(error "AWS_TARGET_ACCOUNT_ID $(ERROR_MESSAGE)")
endif
ifneq ($(AWS_TARGET_ACCOUNT_ID),$(INTENDED_ACCOUNT))
$(error "You are targeting the wrong account; intended account is $(INTENDED_ACCOUNT), but you're targeting $(AWS_TARGET_ACCOUNT_ID))
endif
AWS_REGION ?= "us-west-2"


init:
	terraform init \
		-backend-config="encrypt=true" \
		-backend-config="key=nibble/$(PIPELINE_NAME)/terraform.tfstate" \
		-backend-config="bucket=$(AWS_TARGET_ACCOUNT_ID)-$(AWS_REGION)-terraform-state" \
		-backend-config="dynamodb_table=$(AWS_TARGET_ACCOUNT_ID)-$(AWS_REGION)-terraform-state-lock" \
		-backend-config="region=$(AWS_REGION)" \
		-backend-config="profile=$(AWS_PROFILE)"

# plan/apply clones

plan: fmt
	terraform plan \
		-var="aws_region=$(AWS_REGION)" \
		-var="aws_profile=$(AWS_PROFILE)" \
		-out=./.terraform/plan.tfplan

apply:
	terraform apply ./.terraform/plan.tfplan

fmt:
	terraform fmt

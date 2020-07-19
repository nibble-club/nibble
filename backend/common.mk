# directories
BACKEND_HOME := $(shell git rev-parse --show-toplevel)/backend

# check for correct environment
ERROR_MESSAGE = "is not set - try sourcing the appropriate file from the local-dev-env directory"
ifeq ($(DEPLOY_ENV),)
$(error "DEPLOY_ENV $(ERROR_MESSAGE)")
endif
ifeq ($(AWS_PROFILE),)
$(error "AWS_PROFILE $(ERROR_MESSAGE)")
endif
ifeq ($(AWS_TARGET_ACCOUNT_ID),)
$(error "AWS_TARGET_ACCOUNT_ID $(ERROR_MESSAGE)")
endif
AWS_REGION ?= "us-west-2"
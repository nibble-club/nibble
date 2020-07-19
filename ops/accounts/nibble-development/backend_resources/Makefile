.PHONY: init

AWS_PROFILE ?= nibble-bootstrap

# check for correct environment
ERROR_MESSAGE = "is not set - please export an environment variable with your desired value"
ifeq ($(AWS_REGION),)
$(error "AWS_REGION $(ERROR_MESSAGE)")
endif
ifeq ($(AWS_PROFILE),)
$(error "AWS_PROFILE $(ERROR_MESSAGE)")
endif
ifeq ($(AWS_PROFILE),nibble-deploy)
$(error "Use nibble-bootstrap profile")
endif

init:
	terraform init -backend-config=$(shell pwd)/tf-backend/$(AWS_REGION)


# plan/apply clones
# note this assumes environments are all within the same account; in a multi-account future
# there would only be one plan and apply.

plan: fmt
	terraform plan \
		-var="environment_namespace=dev" \
		-var="aws_region=$(AWS_REGION)" \
		-var="aws_profile=$(AWS_PROFILE)" \
		-var="vpc_cidr_block=10.0.0.0/16" \
		-var="private_subnet_count=2" \
		-out=./.terraform/dev.tfplan

apply:
	terraform apply ./.terraform/dev.tfplan

fmt:
	terraform fmt

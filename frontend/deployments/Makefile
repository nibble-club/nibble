.PHONY:
NIBBLE_HOME = $(shell git rev-parse --show-toplevel)
PERSONAL_WORKSPACE = $(shell whoami)

init:
	terraform init -backend-config=$(NIBBLE_HOME)/frontend/deployments/tf-backend/us-west-2
	terraform workspace new $(PERSONAL_WORKSPACE)

fmt:
	terraform fmt

plan: fmt my-workspace
	terraform plan -var-file=./vars/dev.tfvars -out=./.terraform/$(PERSONAL_WORKSPACE).tfplan

apply: my-workspace
	terraform apply ./.terraform/$(PERSONAL_WORKSPACE).tfplan

my-workspace:
	terraform workspace select $(PERSONAL_WORKSPACE)

qa-workspace:
	terraform workspace select qa

prod-workspace:
	terraform workspace select prod

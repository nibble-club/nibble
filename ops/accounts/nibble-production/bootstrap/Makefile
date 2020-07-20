.PHONY: local

# initial bootstrapping, before remote backend is set up
local: local.tfplan
	terraform apply local.tfplan
	@echo "Copy the outputs to the appropriate files in local-dev-env if necessary"

local-plan local.tfplan:
	@echo "Run this once per AWS account"
	NO_BACKEND=true terraform init
	terraform plan -var="aws_profile=nibble-bootstrap" -out=local.tfplan
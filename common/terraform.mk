include $(shell git rev-parse --show-toplevel)/common/common.mk


init:
	terraform init \
		-backend-config="encrypt=true" \
		-backend-config="key=nibble/$(PIPELINE_NAME)/terraform.tfstate" \
		-backend-config="bucket=$(AWS_TARGET_ACCOUNT_ID)-$(AWS_REGION)-terraform-state" \
		-backend-config="dynamodb_table=$(AWS_TARGET_ACCOUNT_ID)-$(AWS_REGION)-terraform-state-lock" \
		-backend-config="region=$(AWS_REGION)" \
		-backend-config="profile=$(AWS_PROFILE)"
	@terraform workspace new $(PERSONAL_WORKSPACE) > /dev/null 2>&1 || echo "Workspace already created, you're good to go!"

fmt:
	terraform fmt

# plan/apply clones

plan: my-workspace fmt prepare
	terraform plan \
		-var-file=./vars/dev.tfvars \
		-var="environment_namespace=dev_$(PERSONAL_WORKSPACE)" \
		-out=./.terraform/$(PERSONAL_WORKSPACE).tfplan

apply: my-workspace
	terraform apply ./.terraform/$(PERSONAL_WORKSPACE).tfplan

destroy: my-workspace
	terraform destroy \
		-var-file=./vars/dev.tfvars \
		-var="environment_namespace=dev_$(PERSONAL_WORKSPACE)"

plan-qa: qa-workspace fmt prepare
	terraform plan
		-var-file=./vars/qa.tfvars \
		-var="environment_namespace=qa" \
		-out=./.terraform/qa.tfplan

apply-qa: qa-workspace 
	terraform apply ./.terraform/qa.tfplan

plan-prod: prod-workspace fmt prepare
	terraform plan
		-var-file=./vars/prod.tfvars \
		-var="environment_namespace=qa" \
		-out=./.terraform/qa.tfplan

apply-prod: prod-workspace
	terraform apply ./.terraform/prod.tfplan

my-workspace:
	terraform workspace select $(PERSONAL_WORKSPACE)

qa-workspace:
	terraform workspace select qa

prod-workspace:
	terraform workspace select prod


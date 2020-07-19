.PHONY:
PERSONAL_WORKSPACE = $(shell whoami)

include $(shell git rev-parse --show-toplevel)/backend/common.mk

DB_SCHEMAS_S3_BUCKET = $(AWS_TARGET_ACCOUNT_ID)-$(AWS_REGION)-$(DEPLOY_ENV)-db-schemas

init:
	# TODO: refactor this to compute tf-backend variables
	terraform init -backend-config=$(BACKEND_HOME)/deployments/tf-backend/us-west-2
	@terraform workspace new $(PERSONAL_WORKSPACE) > /dev/null 2>&1 || echo "Workspace already created, you're good to go!"

fmt:
	terraform fmt

# plan/apply clones

plan: my-workspace fmt
	terraform plan \
		-var-file=./vars/dev.tfvars \
		-var="environment_namespace=dev_$(PERSONAL_WORKSPACE)" \
		-out=./.terraform/$(PERSONAL_WORKSPACE).tfplan

apply: my-workspace
	terraform apply ./.terraform/$(PERSONAL_WORKSPACE).tfplan

plan-qa: qa-workspace fmt
	terraform plan
		-var-file=./vars/qa.tfvars \
		-var="environment_namespace=qa" \
		-out=./.terraform/qa.tfplan

apply-qa: qa-workspace
	terraform apply ./.terraform/qa.tfplan

plan-prod: prod-workspace fmt
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

# manage database schemas

# checks for existence first, then pushes local schemas/postgres folder
sync-postgres-schemas:
	@echo "Syncing local schemas folder..."
ifeq ($(DEPLOY_ENV),dev)
	aws s3api head-bucket --bucket $(DB_SCHEMAS_S3_BUCKET)
	aws s3 sync $(BACKEND_HOME)/schemas/postgres s3://$(DB_SCHEMAS_S3_BUCKET)/$(DEPLOY_ENV)/$(PERSONAL_WORKSPACE)/postgres
else
	aws s3api head-bucket --bucket $(DB_SCHEMAS_S3_BUCKET)
	aws s3 sync $(BACKEND_HOME)/schemas/postgres s3://$(DB_SCHEMAS_S3_BUCKET)/$(DEPLOY_ENV)/postgres
endif

migrate-postgres-schemas:
	@echo "Migrating schemas..."
ifeq ($(DEPLOY_ENV),dev)
	aws lambda invoke --function-name $(DEPLOY_ENV)_$(PERSONAL_WORKSPACE)-migrate_database --log-type Tail /dev/null
else
	aws lambda invoke --function-name $(DEPLOY_ENV)-migrate_database --log-type Tail /dev/null
endif

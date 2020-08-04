.PHONY:
PERSONAL_WORKSPACE = $(shell whoami)

include $(shell git rev-parse --show-toplevel)/backend/common.mk

DB_SCHEMAS_S3_BUCKET = $(AWS_TARGET_ACCOUNT_ID)-$(AWS_REGION)-$(DEPLOY_ENV)-db-schemas

init:
	terraform init \
		-backend-config="encrypt=true" \
		-backend-config="key=nibble/backend/terraform.tfstate" \
		-backend-config="bucket=$(AWS_TARGET_ACCOUNT_ID)-$(AWS_REGION)-terraform-state" \
		-backend-config="dynamodb_table=$(AWS_TARGET_ACCOUNT_ID)-$(AWS_REGION)-terraform-state-lock" \
		-backend-config="region=$(AWS_REGION)" \
		-backend-config="profile=$(AWS_PROFILE)"
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
	@aws s3api head-bucket --bucket $(DB_SCHEMAS_S3_BUCKET)
	@aws s3 sync $(BACKEND_HOME)/schemas/postgres s3://$(DB_SCHEMAS_S3_BUCKET)/$(DEPLOY_ENV)_$(PERSONAL_WORKSPACE)-postgres --delete
else
	@aws s3api head-bucket --bucket $(DB_SCHEMAS_S3_BUCKET)
	@aws s3 sync $(BACKEND_HOME)/schemas/postgres s3://$(DB_SCHEMAS_S3_BUCKET)/$(DEPLOY_ENV)-postgres --delete
endif
	@echo "Schemas synced successfully"

migrate-postgres-schemas:
	@echo "Migrating schemas..."
ifeq ($(DEPLOY_ENV),dev)
	@aws lambda invoke --function-name $(DEPLOY_ENV)_$(PERSONAL_WORKSPACE)-migrate_database \
		--log-type Tail \
		--query 'LogResult' \
		--output text /dev/null | base64 -d
else
	@aws lambda invoke --function-name $(DEPLOY_ENV)-migrate_database \
		--log-type Tail \
		--query 'LogResult' \
		--output text /dev/null | base64 -d
endif

migrate-elasticsearch-schemas:
	@echo "Migrating Elasticsearch schemas..."
ifeq ($(DEPLOY_ENV),dev)
	@aws lambda invoke --function-name $(DEPLOY_ENV)_$(PERSONAL_WORKSPACE)-migrate_elasticsearch \
		--log-type Tail \
		--query 'LogResult' \
		--output text /dev/null | base64 -d
else
	@aws lambda invoke --function-name $(DEPLOY_ENV)-migrate_elasticsearch \
		--log-type Tail \
		--query 'LogResult' \
		--output text /dev/null | base64 -d
endif

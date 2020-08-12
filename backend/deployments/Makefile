.PHONY:
PERSONAL_WORKSPACE = $(shell whoami)
PIPELINE_NAME = backend

include $(shell git rev-parse --show-toplevel)/common/terraform.mk

DB_SCHEMAS_S3_BUCKET = $(AWS_TARGET_ACCOUNT_ID)-$(AWS_REGION)-$(DEPLOY_ENV)-db-schemas

# empty target, needed by terraform.mk
prepare:
	@echo "Backend prepared"

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

# seed data
seed-admins-and-restaurants:
	@echo "Seeding admins and restaurants..."
	@cd $(shell git rev-parse --show-toplevel)/backend/scripts/seed ; \
		python3 seed_admins_restaurants.py

seed-nibbles:
	@echo "Seeding nibbles..."
	@cd $(shell git rev-parse --show-toplevel)/backend/scripts/seed ; \
		python3 seed_nibbles.py

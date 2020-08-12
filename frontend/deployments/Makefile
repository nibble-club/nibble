.PHONY:
NIBBLE_HOME = $(shell git rev-parse --show-toplevel)
PERSONAL_WORKSPACE = $(shell whoami)
PIPELINE_NAME = frontend

include $(NIBBLE_HOME)/common/terraform.mk

login-heroku:
	@heroku login


prepare: update-config
	@rm -rf build || true
	@echo "Creating tarball of frontend code..."
	@mkdir build
	@tar \
		--exclude='$(NIBBLE_HOME)/$(PIPELINE_NAME)/deployments' \
		--exclude='$(NIBBLE_HOME)/$(PIPELINE_NAME)/scripts' \
		--exclude='$(NIBBLE_HOME)/$(PIPELINE_NAME)/node_modules' \
		--exclude='$(NIBBLE_HOME)/$(PIPELINE_NAME)/environments' \
		--exclude='$(NIBBLE_HOME)/$(PIPELINE_NAME)/.env' \
		-zcf build/frontend.tar.gz $(NIBBLE_HOME)/$(PIPELINE_NAME) > /dev/null 2>&1


update-config:
	@echo "Syncing Heroku environment variables..."
	@cd $(NIBBLE_HOME)/$(PIPELINE_NAME) ; yarn env
	@$(NIBBLE_HOME)/$(PIPELINE_NAME)/scripts/setup_deploy_environment.sh
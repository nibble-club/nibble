LAMBDA_CODE_HASH := $(shell find . -maxdepth 1 -type f \( -name "*.py" -o -name "requirements.txt" \) -print0 | sort -z | xargs -0 sha1sum | sha1sum | awk '{print substr($$1, 1, 10)}')

include $(shell git rev-parse --show-toplevel)/backend/lambdas/lambda.mk


compile:
	@mkdir -p build
	@echo "Installing required packages..."
	@rm -rf $(PACKAGES_DIR) || true
	@rm -f $(BUILDS_DIR)/$(SOURCE_LAMBDA_PACKAGE_NAME).zip || true
	@python3 -m pip install -r requirements.txt -t $(PACKAGES_DIR) --force-reinstall -q
	@echo "Zipping files..."
	@cd $(PACKAGES_DIR); \
		zip -r9 $(BUILDS_DIR)/$(SOURCE_LAMBDA_PACKAGE_NAME).zip . > /dev/null ; \
		cd .. ; \
		zip -g $(BUILDS_DIR)/$(SOURCE_LAMBDA_PACKAGE_NAME) ./*.py > /dev/null ;

test:
	@echo "Installing packages for testing locally..."
	@python3 -m pip install -r requirements.txt -q
	@echo "Testing..."
	# python3 -m unittest test/test_main.py
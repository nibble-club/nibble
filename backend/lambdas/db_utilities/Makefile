LAMBDA_CODE_HASH := $(shell find ./python/common -maxdepth 1 -type f \( -name "*.py" -o -name "requirements.txt" \) -print0 | sort -z | xargs -0 sha1sum | sha1sum | awk '{print substr($$1, 1, 10)}')

include $(shell git rev-parse --show-toplevel)/backend/lambdas/lambda.mk

# Note: this is just pulled from https://github.com/jkehler/awslambda-psycopg2

compile:
	@mkdir -p build
	@echo "Installing required packages..."
	@python3 -m pip install -r requirements.txt -t ./python --upgrade -q 
	@rm -f $(BUILDS_DIR)/$(SOURCE_LAMBDA_PACKAGE_NAME).zip || true
	@echo "Zipping files..."
	@zip -r9 $(BUILDS_DIR)/$(SOURCE_LAMBDA_PACKAGE_NAME).zip python > /dev/null ;

test:
	@echo "No tests to run"

BUILDS_DIR := $(PWD)/build/distributions
LAMBDA_CODE_HASH := $(shell sha1sum $(shell pwd)/src/main/java/lambda/Handler.java | awk '{print substr($$1, 1, 10)}')

include $(shell git rev-parse --show-toplevel)/backend/lambdas/lambda.mk

compile:
	@gradle build

test:
	
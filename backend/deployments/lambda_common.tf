resource aws_lambda_layer_version db_utilities {
  compatible_runtimes = ["python3.7"]
  description         = "Provides specially compiled libraries and common utilities for database access"
  layer_name          = "${var.environment_namespace}-db_utilities"
  s3_bucket           = local.lambdas_bucket
  s3_key              = "${var.environment_namespace}/${var.db_utilities_lambda_name}/${var.db_utilities_lambda_artifact}"
}

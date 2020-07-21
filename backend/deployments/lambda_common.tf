data aws_iam_policy_document lambda_assume_role {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      identifiers = ["lambda.amazonaws.com"]
      type        = "Service"
    }
  }
}

resource aws_lambda_layer_version db_utilities {
  layer_name          = "${var.environment_namespace}-db_utilities"
  s3_bucket           = local.lambdas_bucket
  s3_key              = "${var.environment_namespace}/${var.db_utilities_lambda_name}/${var.db_utilities_lambda_artifact}"
  compatible_runtimes = ["python3.7"]
  description         = "Provides specially compiled libraries and common utilities for database access"
}

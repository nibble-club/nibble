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

resource aws_lambda_layer_version postgres_lib {
  layer_name = "${var.environment_namespace}-postgres_lib"
  s3_bucket = local.lambdas_bucket
  s3_key             = "${var.environment_namespace}/${var.psycopg2_lambda_name}/${var.psycopg2_lambda_artifact}"
  
}

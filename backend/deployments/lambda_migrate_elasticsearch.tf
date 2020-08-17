module migrate_elasticsearch_lambda {
  source = "./modules/lambda"

  description              = "Migrates Elasticsearch on invocation"
  environment_namespace    = var.environment_namespace
  function_name            = "migrate_elasticsearch"
  handler                  = "main.lambda_handler"
  permissions_boundary_arn = local.permissions_boundary_arn
  release_alias_name       = "release"
  release_version          = var.migrate_elasticsearch_lambda_release_version # defaults to ""
  runtime                  = "python3.7"
  s3_bucket                = local.lambdas_bucket
  s3_key                   = "${var.environment_namespace}/${var.migrate_elasticsearch_lambda_name}/${var.migrate_elasticsearch_lambda_artifact}"
  timeout                  = 3

  environment = {
    ELASTICSEARCH_ENDPOINT = aws_elasticsearch_domain.elasticsearch.endpoint
  }

  lambda_policies = [aws_iam_policy.migrate_elasticsearch.arn]

  layers = [aws_lambda_layer_version.db_utilities.arn]

  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
data aws_iam_policy_document migrate_elasticsearch {
  # update Elasticsearch
  statement {
    actions = [
      "es:*"
    ]
    effect = "Allow"
    resources = [
      aws_elasticsearch_domain.elasticsearch.arn,
      "${aws_elasticsearch_domain.elasticsearch.arn}/*"
    ]
  }

}

resource aws_iam_policy migrate_elasticsearch {
  name   = "${var.environment_namespace}-migrate_elasticsearch"
  policy = data.aws_iam_policy_document.migrate_elasticsearch.json
}

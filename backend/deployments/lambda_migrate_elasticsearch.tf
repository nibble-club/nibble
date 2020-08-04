module migrate_elasticsearch_lambda {
  source = "./modules/lambda"

  s3_bucket          = local.lambdas_bucket
  s3_key             = "${var.environment_namespace}/${var.migrate_elasticsearch_lambda_name}/${var.migrate_elasticsearch_lambda_artifact}"
  function_name      = "${var.environment_namespace}-migrate_elasticsearch"
  handler            = "main.lambda_handler"
  description        = "Migrates Elasticsearch on invocation"
  release_alias_name = "release"
  release_version    = var.migrate_elasticsearch_lambda_release_version # defaults to ""
  role_arn           = aws_iam_role.migrate_elasticsearch.arn
  role_name          = aws_iam_role.migrate_elasticsearch.name
  runtime            = "python3.7"
  timeout            = 3
  layers             = [aws_lambda_layer_version.db_utilities.arn]
  environment = {
    ELASTICSEARCH_ENDPOINT = aws_elasticsearch_domain.elasticsearch.endpoint
  }
  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
resource aws_iam_role migrate_elasticsearch {
  name                 = "${var.environment_namespace}-migrate_elasticsearch_lambda"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  permissions_boundary = local.permissions_boundary_arn
}

data aws_iam_policy_document migrate_elasticsearch {
  statement {
    actions   = ["lambda:GetLayerVersion"]
    effect    = "Allow"
    resources = [aws_lambda_layer_version.db_utilities.arn]
  }

  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
    ]
    effect    = "Allow"
    resources = ["*"]
  }

  // interface with VPC resources
  statement {
    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface"
    ]
    effect = "Allow"
    resources = [
      "*"
    ]
  }

  // update Elasticsearch
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

resource aws_iam_role_policy_attachment migrate_elasticsearch {
  role       = aws_iam_role.migrate_elasticsearch.name
  policy_arn = aws_iam_policy.migrate_elasticsearch.arn
}

module resolver_nibble_lambda {
  source = "./modules/lambda"

  s3_bucket          = local.lambdas_bucket
  s3_key             = "${var.environment_namespace}/${var.resolver_nibble_lambda_name}/${var.resolver_nibble_lambda_artifact}"
  function_name      = "${var.environment_namespace}-resolver_nibble"
  handler            = "main.lambda_handler"
  description        = "Resolves information about nibbles (particularly AvailableNibbles) in GraphQL queries"
  release_alias_name = "release"
  release_version    = var.resolver_nibble_lambda_release_version # defaults to ""
  role_arn           = aws_iam_role.resolver_nibble.arn
  role_name          = aws_iam_role.resolver_nibble.name
  runtime            = "python3.7"
  timeout            = 10
  layers             = [aws_lambda_layer_version.db_utilities.arn]
  environment = {
    DB_HOST     = aws_db_instance.postgres.address
    DB_PORT     = aws_db_instance.postgres.port
    DB_NAME     = aws_db_instance.postgres.name
    DB_USERNAME = aws_db_instance.postgres.username
    DB_PASSWORD = aws_db_instance.postgres.password
    REDIS_HOST  = aws_elasticache_cluster.redis.cache_nodes[0].address
    REDIS_PORT  = aws_elasticache_cluster.redis.cache_nodes[0].port
  }
  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
resource aws_iam_role resolver_nibble {
  name                 = "${var.environment_namespace}-resolver_nibble_lambda"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  permissions_boundary = local.permissions_boundary_arn
}

data aws_iam_policy_document resolver_nibble {
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
      "logs:DescribeLogStream",
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
}

resource aws_iam_policy resolver_nibble {
  name   = "${var.environment_namespace}-resolver_nibble"
  policy = data.aws_iam_policy_document.resolver_nibble.json
}

resource aws_iam_role_policy_attachment resolver_nibble {
  role       = aws_iam_role.resolver_nibble.name
  policy_arn = aws_iam_policy.resolver_nibble.arn
}

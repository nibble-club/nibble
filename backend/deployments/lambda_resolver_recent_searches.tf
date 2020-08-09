module resolver_recent_searches_lambda {
  source = "./modules/lambda"

  s3_bucket          = local.lambdas_bucket
  s3_key             = "${var.environment_namespace}/${var.resolver_recent_searches_lambda_name}/${var.resolver_recent_searches_lambda_artifact}"
  function_name      = "${var.environment_namespace}-resolver_recent_searches"
  handler            = "main.lambda_handler"
  description        = "Resolves search queries"
  release_alias_name = "release"
  release_version    = var.resolver_recent_searches_lambda_release_version # defaults to ""
  role_arn           = aws_iam_role.resolver_recent_searches.arn
  role_name          = aws_iam_role.resolver_recent_searches.name
  runtime            = "python3.7"
  timeout            = 3
  layers             = [aws_lambda_layer_version.db_utilities.arn]
  environment = {
    REDIS_HOST = aws_elasticache_cluster.redis.cache_nodes[0].address
    REDIS_PORT = aws_elasticache_cluster.redis.cache_nodes[0].port
  }
  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
resource aws_iam_role resolver_recent_searches {
  name                 = "${var.environment_namespace}-resolver_recent_searches_lambda"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  permissions_boundary = local.permissions_boundary_arn
}

data aws_iam_policy_document resolver_recent_searches {
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
}

resource aws_iam_policy resolver_recent_searches {
  name   = "${var.environment_namespace}-resolver_recent_searches"
  policy = data.aws_iam_policy_document.resolver_recent_searches.json
}

resource aws_iam_role_policy_attachment resolver_recent_searches {
  role       = aws_iam_role.resolver_recent_searches.name
  policy_arn = aws_iam_policy.resolver_recent_searches.arn
}

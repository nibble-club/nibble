module resolver_admin_nibble_mutation_lambda {
  source = "./modules/lambda"

  s3_bucket          = local.lambdas_bucket
  s3_key             = "${var.environment_namespace}/${var.resolver_admin_nibble_mutation_lambda_name}/${var.resolver_admin_nibble_mutation_lambda_artifact}"
  function_name      = "${var.environment_namespace}-resolver_admin_nibble_mutation"
  handler            = "main.lambda_handler"
  description        = "Resolves adminCreateNibble, adminUpdateNibble GraphQL mutations"
  release_alias_name = "release"
  release_version    = var.resolver_admin_nibble_mutation_lambda_release_version # defaults to ""
  role_arn           = aws_iam_role.resolver_admin_nibble_mutation.arn
  role_name          = aws_iam_role.resolver_admin_nibble_mutation.name
  runtime            = "python3.7"
  timeout            = 10
  layers             = [aws_lambda_layer_version.db_utilities.arn]
  environment = {
    DB_HOST                = aws_db_instance.postgres.address
    DB_PORT                = aws_db_instance.postgres.port
    DB_NAME                = aws_db_instance.postgres.name
    DB_USERNAME            = aws_db_instance.postgres.username
    DB_PASSWORD            = aws_db_instance.postgres.password
    REDIS_HOST             = aws_elasticache_cluster.redis.cache_nodes[0].address
    REDIS_PORT             = aws_elasticache_cluster.redis.cache_nodes[0].port
    ELASTICSEARCH_ENDPOINT = aws_elasticsearch_domain.elasticsearch.endpoint
  }
  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
resource aws_iam_role resolver_admin_nibble_mutation {
  name                 = "${var.environment_namespace}-resolver_admin_nibble_mutation_lambda"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  permissions_boundary = local.permissions_boundary_arn
}

data aws_iam_policy_document resolver_admin_nibble_mutation {
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
    effect    = "Allow"
    resources = ["*"]
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

resource aws_iam_policy resolver_admin_nibble_mutation {
  name   = "${var.environment_namespace}-resolver_admin_nibble_mutation"
  policy = data.aws_iam_policy_document.resolver_admin_nibble_mutation.json
}

resource aws_iam_role_policy_attachment resolver_admin_nibble_mutation {
  role       = aws_iam_role.resolver_admin_nibble_mutation.name
  policy_arn = aws_iam_policy.resolver_admin_nibble_mutation.arn
}

module resolver_nibbles_with_property_lambda {
  source = "./modules/lambda"

  description              = "Resolves search queries"
  environment_namespace    = var.environment_namespace
  function_name            = "resolver_nibbles_with_property"
  handler                  = "main.lambda_handler"
  permissions_boundary_arn = local.permissions_boundary_arn
  release_alias_name       = "release"
  release_version          = var.resolver_nibbles_with_property_lambda_release_version # defaults to ""
  runtime                  = "python3.7"
  s3_bucket                = local.lambdas_bucket
  s3_key                   = "${var.environment_namespace}/${var.resolver_nibbles_with_property_lambda_name}/${var.resolver_nibbles_with_property_lambda_artifact}"
  timeout                  = 3

  environment = {
    ELASTICSEARCH_ENDPOINT = aws_elasticsearch_domain.elasticsearch.endpoint
    REDIS_HOST             = aws_elasticache_cluster.redis.cache_nodes[0].address
    REDIS_PORT             = aws_elasticache_cluster.redis.cache_nodes[0].port
  }

  lambda_policies = [aws_iam_policy.resolver_nibbles_with_property.arn]

  layers = [aws_lambda_layer_version.db_utilities.arn]

  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
data aws_iam_policy_document resolver_nibbles_with_property {
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

resource aws_iam_policy resolver_nibbles_with_property {
  name   = "${var.environment_namespace}-resolver_nibbles_with_property"
  policy = data.aws_iam_policy_document.resolver_nibbles_with_property.json
}

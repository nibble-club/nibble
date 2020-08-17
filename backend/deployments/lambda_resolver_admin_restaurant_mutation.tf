module resolver_admin_restaurant_mutation_lambda {
  source = "./modules/lambda"

  description              = "Resolves adminCreateRestaurant GraphQL mutations"
  environment_namespace    = var.environment_namespace
  function_name            = "resolver_admin_restaurant_mutation"
  handler                  = "main.lambda_handler"
  permissions_boundary_arn = local.permissions_boundary_arn
  release_alias_name       = "release"
  release_version          = var.resolver_admin_restaurant_mutation_lambda_release_version # defaults to ""
  runtime                  = "python3.7"
  s3_bucket                = local.lambdas_bucket
  s3_key                   = "${var.environment_namespace}/${var.resolver_admin_restaurant_mutation_lambda_name}/${var.resolver_admin_restaurant_mutation_lambda_artifact}"
  timeout                  = 10

  environment = {
    DB_HOST                = aws_db_instance.postgres.address
    DB_NAME                = aws_db_instance.postgres.name
    DB_PASSWORD            = aws_db_instance.postgres.password
    DB_PORT                = aws_db_instance.postgres.port
    DB_USERNAME            = aws_db_instance.postgres.username
    ELASTICSEARCH_ENDPOINT = aws_elasticsearch_domain.elasticsearch.endpoint
    REDIS_HOST             = aws_elasticache_cluster.redis.cache_nodes[0].address
    REDIS_PORT             = aws_elasticache_cluster.redis.cache_nodes[0].port
  }

  lambda_policies = [aws_iam_policy.resolver_admin_restaurant_mutation.arn]

  layers = [aws_lambda_layer_version.db_utilities.arn]

  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
data aws_iam_policy_document resolver_admin_restaurant_mutation {
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

resource aws_iam_policy resolver_admin_restaurant_mutation {
  name   = "${var.environment_namespace}-resolver_admin_restaurant_mutation"
  policy = data.aws_iam_policy_document.resolver_admin_restaurant_mutation.json
}

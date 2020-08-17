module resolver_recent_searches_lambda {
  source = "./modules/lambda"

  description              = "Resolves recent search queries"
  environment_namespace    = var.environment_namespace
  function_name            = "resolver_recent_searches"
  handler                  = "main.lambda_handler"
  permissions_boundary_arn = local.permissions_boundary_arn
  release_alias_name       = "release"
  release_version          = var.resolver_recent_searches_lambda_release_version # defaults to ""
  runtime                  = "python3.7"
  s3_bucket                = local.lambdas_bucket
  s3_key                   = "${var.environment_namespace}/${var.resolver_recent_searches_lambda_name}/${var.resolver_recent_searches_lambda_artifact}"
  timeout                  = 3

  environment = {
    REDIS_HOST = aws_elasticache_cluster.redis.cache_nodes[0].address
    REDIS_PORT = aws_elasticache_cluster.redis.cache_nodes[0].port
  }

  layers = [aws_lambda_layer_version.db_utilities.arn]

  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

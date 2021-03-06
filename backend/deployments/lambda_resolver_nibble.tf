module resolver_nibble_lambda {
  source = "./modules/lambda"

  description              = "Resolves information about nibbles (particularly AvailableNibbles) in GraphQL queries"
  environment_namespace    = var.environment_namespace
  function_name            = "resolver_nibble"
  handler                  = "main.lambda_handler"
  permissions_boundary_arn = local.permissions_boundary_arn
  release_alias_name       = "release"
  release_version          = var.resolver_nibble_lambda_release_version # defaults to ""
  runtime                  = "python3.7"
  s3_bucket                = local.lambdas_bucket
  s3_key                   = "${var.environment_namespace}/${var.resolver_nibble_lambda_name}/${var.resolver_nibble_lambda_artifact}"
  timeout                  = 10

  environment = {
    DB_HOST     = aws_db_instance.postgres.address
    DB_NAME     = aws_db_instance.postgres.name
    DB_PASSWORD = aws_db_instance.postgres.password
    DB_PORT     = aws_db_instance.postgres.port
    DB_USERNAME = aws_db_instance.postgres.username
    REDIS_HOST  = aws_elasticache_cluster.redis.cache_nodes[0].address
    REDIS_PORT  = aws_elasticache_cluster.redis.cache_nodes[0].port
  }

  layers = [aws_lambda_layer_version.db_utilities.arn]

  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

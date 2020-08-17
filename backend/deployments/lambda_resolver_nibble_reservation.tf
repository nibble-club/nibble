module resolver_nibble_reservation_lambda {
  source = "./modules/lambda"

  description              = "Handles reserving nibbles, including updating and cancelling"
  environment_namespace    = var.environment_namespace
  function_name            = "resolver_nibble_reservation"
  handler                  = "main.lambda_handler"
  permissions_boundary_arn = local.permissions_boundary_arn
  release_alias_name       = "release"
  release_version          = var.resolver_nibble_reservation_lambda_release_version # defaults to ""
  runtime                  = "python3.7"
  s3_bucket                = local.lambdas_bucket
  s3_key                   = "${var.environment_namespace}/${var.resolver_nibble_reservation_lambda_name}/${var.resolver_nibble_reservation_lambda_artifact}"
  timeout                  = 10

  environment = {
    CANCELLED_QUEUE = aws_sqs_queue.cancelled_reservations.id
    DB_HOST         = aws_db_instance.postgres.address
    DB_NAME         = aws_db_instance.postgres.name
    DB_PASSWORD     = aws_db_instance.postgres.password
    DB_PORT         = aws_db_instance.postgres.port
    DB_USERNAME     = aws_db_instance.postgres.username
    ENDPOINT        = reverse(aws_vpc_endpoint.sqs_access_endpoint.dns_entry)[0].dns_name
    REDIS_HOST      = aws_elasticache_cluster.redis.cache_nodes[0].address
    REDIS_PORT      = aws_elasticache_cluster.redis.cache_nodes[0].port
  }

  lambda_policies = [aws_iam_policy.resolver_nibble_reservation.arn]

  layers = [aws_lambda_layer_version.db_utilities.arn]

  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
data aws_iam_policy_document resolver_nibble_reservation {
  # push to SQS queue
  statement {
    actions = [
      "sqs:SendMessage",
      "sqs:GetQueueUrl",
    ]
    effect = "Allow"
    resources = [
      aws_sqs_queue.cancelled_reservations.arn
    ]
  }
}

resource aws_iam_policy resolver_nibble_reservation {
  name   = "${var.environment_namespace}-resolver_nibble_reservation"
  policy = data.aws_iam_policy_document.resolver_nibble_reservation.json
}

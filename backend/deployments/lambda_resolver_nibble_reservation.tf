module resolver_nibble_reservation_lambda {
  source = "./modules/lambda"

  s3_bucket          = local.lambdas_bucket
  s3_key             = "${var.environment_namespace}/${var.resolver_nibble_reservation_lambda_name}/${var.resolver_nibble_reservation_lambda_artifact}"
  function_name      = "${var.environment_namespace}-resolver_nibble_reservation"
  handler            = "main.lambda_handler"
  description        = "Handles reserving nibbles, including updating and cancelling"
  release_alias_name = "release"
  release_version    = var.resolver_nibble_reservation_lambda_release_version # defaults to ""
  role_arn           = aws_iam_role.resolver_nibble_reservation.arn
  role_name          = aws_iam_role.resolver_nibble_reservation.name
  runtime            = "python3.7"
  timeout            = 10
  layers             = [aws_lambda_layer_version.db_utilities.arn]
  environment = {
    DB_HOST         = aws_db_instance.postgres.address
    DB_PORT         = aws_db_instance.postgres.port
    DB_NAME         = aws_db_instance.postgres.name
    DB_USERNAME     = aws_db_instance.postgres.username
    DB_PASSWORD     = aws_db_instance.postgres.password
    REDIS_HOST      = aws_elasticache_cluster.redis.cache_nodes[0].address
    REDIS_PORT      = aws_elasticache_cluster.redis.cache_nodes[0].port
    ENDPOINT        = reverse(aws_vpc_endpoint.sqs_access_endpoint.dns_entry)[0].dns_name
    CANCELLED_QUEUE = aws_sqs_queue.cancelled_reservations.id
  }
  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
resource aws_iam_role resolver_nibble_reservation {
  name                 = "${var.environment_namespace}-resolver_nibble_reservation_lambda"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  permissions_boundary = local.permissions_boundary_arn
}

data aws_iam_policy_document resolver_nibble_reservation {
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

  // push to SQS queue
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

resource aws_iam_role_policy_attachment resolver_nibble_reservation {
  role       = aws_iam_role.resolver_nibble_reservation.name
  policy_arn = aws_iam_policy.resolver_nibble_reservation.arn
}

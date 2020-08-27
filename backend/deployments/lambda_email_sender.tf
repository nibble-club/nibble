module email_sender_lambda {
  source = "./modules/lambda"

  description              = "Sends all email message notifications"
  environment_namespace    = var.environment_namespace
  function_name            = "email_sender"
  handler                  = "main.lambda_handler"
  permissions_boundary_arn = local.permissions_boundary_arn
  release_alias_name       = "release"
  release_version          = var.email_sender_lambda_release_version # defaults to ""
  runtime                  = "python3.7"
  s3_bucket                = local.lambdas_bucket
  s3_key                   = "${var.environment_namespace}/${var.email_sender_lambda_name}/${var.email_sender_lambda_artifact}"
  timeout                  = 10

  environment = {
    DB_HOST      = aws_db_instance.postgres.address
    DB_NAME      = aws_db_instance.postgres.name
    DB_PASSWORD  = aws_db_instance.postgres.password
    DB_PORT      = aws_db_instance.postgres.port
    DB_USERNAME  = aws_db_instance.postgres.username
    SENDER_EMAIL = aws_ses_email_identity.default.email
  }

  lambda_policies = [aws_iam_policy.email_sender.arn]

  layers = [aws_lambda_layer_version.db_utilities.arn]

  vpc_config = {
    security_group_ids = [
      aws_security_group.lambda_security_group.id,
      aws_security_group.lambda_internet_access_security_group.id
    ]
    subnet_ids = var.private_subnet_ids
  }
}

# roles and policies
data aws_iam_policy_document email_sender {
  # receive events from SQS
  statement {
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes"
    ]
    effect    = "Allow"
    resources = [aws_sqs_queue.email_notifications.arn]
  }

  # send emails
  statement {
    actions = [
      "ses:SendEmail"
    ]
    effect    = "Allow"
    resources = ["*"]
  }
}

resource aws_iam_policy email_sender {
  name   = "${var.environment_namespace}-email_sender"
  policy = data.aws_iam_policy_document.email_sender.json
}

# map lambda to SQS queue
resource aws_lambda_event_source_mapping email_sender_sqs_source {
  event_source_arn = aws_sqs_queue.email_notifications.arn
  function_name    = module.email_sender_lambda.arn
}

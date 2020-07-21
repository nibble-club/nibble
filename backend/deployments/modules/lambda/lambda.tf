resource aws_lambda_function lambda {
  s3_bucket     = var.s3_bucket
  s3_key        = var.s3_key
  function_name = var.function_name
  handler       = var.handler
  role          = var.role_arn
  runtime       = var.runtime
  publish       = true
  memory_size   = var.memory_size
  timeout       = var.timeout
  description   = var.description
  layers        = var.layers

  dynamic dead_letter_config {
    for_each = var.dead_letter_config == null ? [] : [var.dead_letter_config]
    content {
      target_arn = var.dead_letter_config.target_arn
    }
  }

  vpc_config {
    security_group_ids = var.vpc_config.security_group_ids
    subnet_ids         = var.vpc_config.subnet_ids
  }

  environment {
    variables = var.environment
  }

  tags       = var.tags
  depends_on = [aws_cloudwatch_log_group.log_group, aws_iam_role_policy_attachment.lambda_logs]
}

resource aws_lambda_alias release_alias {
  function_name    = aws_lambda_function.lambda.arn
  function_version = coalesce(var.release_version, "$LATEST")
  name             = var.release_alias_name
  description      = "Release alias"
}
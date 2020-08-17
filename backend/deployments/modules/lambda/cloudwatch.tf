resource aws_cloudwatch_log_group log_group {
  name              = "/aws/lambda/${var.environment_namespace}-${var.function_name}"
  retention_in_days = "30"
}

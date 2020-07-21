resource aws_cloudwatch_log_group log_group {
  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = "30"
}

resource aws_iam_policy lambda_logs {
  name   = "${var.function_name}-lambda_logging"
  policy = data.aws_iam_policy_document.lambda_logs.json
}

data aws_iam_policy_document lambda_logs {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    effect = "Allow"
    resources = [
      aws_cloudwatch_log_group.log_group.arn
    ]
  }
}

resource aws_iam_role_policy_attachment lambda_logs {
  policy_arn = aws_iam_policy.lambda_logs.arn
  role       = var.role_name
}
resource aws_lambda_function lambda {
  description   = var.description
  function_name = "${var.environment_namespace}-${var.function_name}"
  handler       = var.handler
  layers        = var.layers
  memory_size   = var.memory_size
  publish       = true
  role          = aws_iam_role.lambda_role.arn
  runtime       = var.runtime
  s3_bucket     = var.s3_bucket
  s3_key        = var.s3_key
  timeout       = var.timeout

  dynamic dead_letter_config {
    for_each = var.dead_letter_config == null ? [] : [var.dead_letter_config]
    content {
      target_arn = var.dead_letter_config.target_arn
    }
  }

  environment {
    variables = var.environment
  }

  tracing_config {
    mode = "Active"
  }

  vpc_config {
    security_group_ids = var.vpc_config.security_group_ids
    subnet_ids         = var.vpc_config.subnet_ids
  }

  tags = var.tags

  depends_on = [aws_iam_role.lambda_role]
}

resource aws_lambda_alias release_alias {
  function_name    = aws_lambda_function.lambda.arn
  function_version = coalesce(var.release_version, "$LATEST")
  name             = var.release_alias_name
  description      = "Release alias"
}

# roles and policies
data aws_iam_policy_document lambda_assume_role {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      identifiers = ["lambda.amazonaws.com"]
      type        = "Service"
    }
  }
}

resource aws_iam_role lambda_role {
  name                 = "${var.environment_namespace}-${var.function_name}_lambda"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  permissions_boundary = var.permissions_boundary_arn
}

data aws_iam_policy_document common_lambda_policy {
  # use given layers
  statement {
    actions = [
      "lambda:GetLayerVersion"
    ]
    effect    = "Allow"
    resources = ["*"]
  }

  # cloudwatch logging
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
    ]
    effect = "Allow"
    resources = [
      aws_cloudwatch_log_group.log_group.arn
    ]
  }

  # make xray traces
  statement {
    actions = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
      "xray:GetSamplingRules",
      "xray:GetSamplingTargets",
      "xray:GetSamplingStatisticSummaries"
    ]
    effect    = "Allow"
    resources = ["*"]
  }

  # interface with VPC resources
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
}

resource aws_iam_policy common_lambda_policy {
  name   = "${var.environment_namespace}-${var.function_name}_common"
  policy = data.aws_iam_policy_document.common_lambda_policy.json
}

resource aws_iam_role_policy_attachment common_lambda_policy {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.common_lambda_policy.arn
}

# attach custom policies
resource aws_iam_role_policy_attachment custom_lambda_policies {
  count      = length(var.lambda_policies)
  role       = aws_iam_role.lambda_role.name
  policy_arn = var.lambda_policies[count.index]
}

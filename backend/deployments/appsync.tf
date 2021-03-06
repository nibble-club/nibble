resource aws_appsync_graphql_api api {
  authentication_type = "AMAZON_COGNITO_USER_POOLS"
  name                = "${var.environment_namespace}-api"

  schema       = file("./schema.graphql")
  xray_enabled = true

  user_pool_config {
    default_action = "ALLOW"
    user_pool_id   = aws_cognito_user_pool.users.id
  }
  log_config {
    cloudwatch_logs_role_arn = aws_iam_role.appsync_role.arn
    field_log_level          = "ALL"
  }
}

# policies
data aws_iam_policy_document appsync_assume_role {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      identifiers = ["appsync.amazonaws.com"]
      type        = "Service"
    }
  }
}

resource aws_iam_role appsync_role {
  name                 = "${var.environment_namespace}-appsync_assume_role"
  assume_role_policy   = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary = local.permissions_boundary_arn
}

data aws_iam_policy_document appsync_permissions {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["*"]
  }

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
}

resource aws_iam_policy appsync_permissions {
  name   = "${var.environment_namespace}-appsync_permissions"
  policy = data.aws_iam_policy_document.appsync_permissions.json
}

resource aws_iam_role_policy_attachment appsync_permissions {
  policy_arn = aws_iam_policy.appsync_permissions.arn
  role       = aws_iam_role.appsync_role.name
}

resource aws_appsync_datasource data_source {
  api_id           = var.appsync_graphql_api_id
  name             = "${var.environment_namespace}_${var.name}"
  service_role_arn = aws_iam_role.data_source.arn
  type             = "AWS_LAMBDA"
  description      = var.description
  lambda_config {
    function_arn = var.function_arn
  }
}

resource aws_iam_role data_source {
  name                 = "${var.environment_namespace}-${var.name}"
  assume_role_policy   = var.assume_role_policy_json
  permissions_boundary = var.permissions_boundary_arn
}

data aws_iam_policy_document data_source {
  statement {
    actions = [
      "lambda:InvokeFunction",
    ]
    effect    = "Allow"
    resources = [var.function_arn]
  }
}

resource aws_iam_policy data_source {
  name   = "${var.environment_namespace}-${var.name}"
  policy = data.aws_iam_policy_document.data_source.json
}

resource aws_iam_role_policy_attachment appsync_admin_create_nibble {
  policy_arn = aws_iam_policy.data_source.arn
  role       = aws_iam_role.data_source.name
}

module add_user_lambda {
  source = "./modules/lambda"

  s3_bucket          = local.lambdas_bucket
  s3_key             = "${var.environment_namespace}/${var.add_user_lambda_name}/${var.add_user_lambda_artifact}"
  function_name      = "${var.environment_namespace}-add_user"
  handler            = "main.lambda_handler"
  description        = "Triggered when user/admin is added in Cognito"
  release_alias_name = "release"
  release_version    = var.add_user_lambda_release_version # defaults to ""
  role_arn           = aws_iam_role.add_user.arn
  role_name          = aws_iam_role.add_user.name
  runtime            = "python3.7"
  timeout            = 10
  layers             = [aws_lambda_layer_version.db_utilities.arn]
  environment = {
    DB_HOST     = aws_db_instance.postgres.address
    DB_PORT     = aws_db_instance.postgres.port
    DB_NAME     = aws_db_instance.postgres.name
    DB_USERNAME = aws_db_instance.postgres.username
    DB_PASSWORD = aws_db_instance.postgres.password
  }
  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id, aws_security_group.lambda_internet_access_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
resource aws_iam_role add_user {
  name                 = "${var.environment_namespace}-add_user_lambda"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  permissions_boundary = local.permissions_boundary_arn
}

data aws_iam_policy_document add_user {
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
      "logs:DescribeLogStreams",
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
    effect    = "Allow"
    resources = ["*"]
  }

  // set user's group in cognito
  statement {
    actions = [
      "cognito-idp:AdminAddUserToGroup"
    ]
    effect    = "Allow"
    resources = [aws_cognito_user_pool.users.arn]
  }
}

resource aws_iam_policy add_user {
  name   = "${var.environment_namespace}-add_user"
  policy = data.aws_iam_policy_document.add_user.json
}

resource aws_iam_role_policy_attachment add_user {
  role       = aws_iam_role.add_user.name
  policy_arn = aws_iam_policy.add_user.arn
}

resource aws_lambda_permission user_cognito_invocation {
  statement_id  = "AllowExecutionFromUserCognito"
  action        = "lambda:InvokeFunction"
  function_name = module.add_user_lambda.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.users.arn
}

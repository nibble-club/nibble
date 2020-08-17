module add_user_lambda {
  source = "./modules/lambda"

  description              = "Triggered when user/admin is added in Cognito"
  environment_namespace    = var.environment_namespace
  function_name            = "add_user"
  handler                  = "main.lambda_handler"
  permissions_boundary_arn = local.permissions_boundary_arn
  release_alias_name       = "release"
  release_version          = var.add_user_lambda_release_version # defaults to ""
  runtime                  = "python3.7"
  s3_bucket                = local.lambdas_bucket
  s3_key                   = "${var.environment_namespace}/${var.add_user_lambda_name}/${var.add_user_lambda_artifact}"
  timeout                  = 10

  environment = {
    DB_HOST     = aws_db_instance.postgres.address
    DB_NAME     = aws_db_instance.postgres.name
    DB_PASSWORD = aws_db_instance.postgres.password
    DB_PORT     = aws_db_instance.postgres.port
    DB_USERNAME = aws_db_instance.postgres.username
  }

  lambda_policies = [aws_iam_policy.add_user.arn]

  layers = [aws_lambda_layer_version.db_utilities.arn]

  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id, aws_security_group.lambda_internet_access_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
data aws_iam_policy_document add_user {
  # set user's group in cognito
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

# allow cognito to invoke this lambda
resource aws_lambda_permission user_cognito_invocation {
  statement_id  = "AllowExecutionFromUserCognito"
  action        = "lambda:InvokeFunction"
  function_name = module.add_user_lambda.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.users.arn
}

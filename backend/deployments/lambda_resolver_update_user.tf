module resolver_update_user_lambda {
  source = "./modules/lambda"

  description              = "Resolves updateUser GraphQL mutations, including updating Cognito custom attributes"
  environment_namespace    = var.environment_namespace
  function_name            = "resolver_update_user"
  handler                  = "main.lambda_handler"
  permissions_boundary_arn = local.permissions_boundary_arn
  release_alias_name       = "release"
  release_version          = var.resolver_update_user_lambda_release_version # defaults to ""
  runtime                  = "python3.7"
  s3_bucket                = local.lambdas_bucket
  s3_key                   = "${var.environment_namespace}/${var.resolver_update_user_lambda_name}/${var.resolver_update_user_lambda_artifact}"
  timeout                  = 3

  environment = {
    COGNITO_USER_POOL_ID = aws_cognito_user_pool.users.id
    DB_HOST              = aws_db_instance.postgres.address
    DB_NAME              = aws_db_instance.postgres.name
    DB_PASSWORD          = aws_db_instance.postgres.password
    DB_PORT              = aws_db_instance.postgres.port
    DB_USERNAME          = aws_db_instance.postgres.username
  }

  lambda_policies = [aws_iam_policy.resolver_update_user.arn]

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
data aws_iam_policy_document resolver_update_user {
  # update user attributes in Cognito
  statement {
    actions = [
      "cognito-idp:AdminUpdateUserAttributes"
    ]
    effect    = "Allow"
    resources = [aws_cognito_user_pool.users.arn]
  }
}

resource aws_iam_policy resolver_update_user {
  name   = "${var.environment_namespace}-resolver_update_user"
  policy = data.aws_iam_policy_document.resolver_update_user.json
}

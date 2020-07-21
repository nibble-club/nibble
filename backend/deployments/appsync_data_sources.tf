module admin_create_nibble_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "admin_create_nibble"
  description  = "Data source for adminCreateNibble requests"
  function_arn = module.resolver_admin_nibble_mutation_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module admin_create_restaurant_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "admin_create_restaurant"
  description  = "Data source for adminCreateRestaurant requests"
  function_arn = module.resolver_admin_restaurant_mutation_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module user_info_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "user_info"
  description  = "Data source for userInfo requests"
  function_arn = module.resolver_user_info_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

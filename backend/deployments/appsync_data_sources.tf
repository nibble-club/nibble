module admin_nibble_mutation_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "admin_nibble_mutation"
  description  = "Data source for adminCreateNibble requests"
  function_arn = module.resolver_admin_nibble_mutation_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module admin_restaurant_mutation_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "admin_restaurant_mutation"
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

module restaurant_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "restaurant"
  description  = "Data source for restaurant information"
  function_arn = module.resolver_restaurant_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module restaurant_distance_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "restaurant_distance"
  description  = "Data source for restaurant distance calculations"
  function_arn = module.resolver_restaurant_distance_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module available_nibble_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "available_nibble"
  description  = "Data source for available nibbles"
  function_arn = module.resolver_nibble_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

# HTTP data sources
resource aws_appsync_datasource geocodio_api {
  api_id      = aws_appsync_graphql_api.api.id
  name        = "${var.environment_namespace}_geocodio_http"
  type        = "HTTP"
  description = "Allows geocoding requests to Geocodio API"

  http_config {
    endpoint = "https://api.geocod.io"
  }
}

# lambda data sources
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

module nibble_history_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "nibble_history"
  description  = "Data source for nibble reservation history"
  function_arn = module.resolver_nibble_history_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module nibble_reservation_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "nibble_reservations"
  description  = "Data source for making, updating, and deleting reservations"
  function_arn = module.resolver_nibble_reservation_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module image_upload_url_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "image_upload_url"
  description  = "Data source for getting presigned S3 image upload URLs"
  function_arn = module.resolver_image_upload_url_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module closest_restaurants_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "closest_restaurants"
  description  = "Data source for getting closest restaurants"
  function_arn = module.resolver_closest_restaurants_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module search_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "search"
  description  = "Data source for searching nibbles and restaurants"
  function_arn = module.resolver_search_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}


module recent_searches_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "recent_searches"
  description  = "Data source for fetching recent searches"
  function_arn = module.resolver_recent_searches_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module location_for_postal_code_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "location_for_postal_code"
  description  = "Data source for fetching lat/lon pair from postal code"
  function_arn = module.resolver_location_for_postal_code_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module nibbles_with_property_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "nibbles_with_property"
  description  = "Data source for fetching nibbles with given property"
  function_arn = module.resolver_nibbles_with_property_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module update_user_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "update_user"
  description  = "Data source for updating user info"
  function_arn = module.resolver_update_user_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module admin_nibble_reservations_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "admin_nibble_reservations"
  description  = "Data source for reservations on a given Nibble"
  function_arn = module.resolver_admin_nibble_reservations_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

module admin_deactivate_restaurant_datasource {
  source = "./modules/appsync_lambda_data_source"

  name         = "admin_deactivate_restaurant"
  description  = "Data source for deactivating restaurant"
  function_arn = module.resolver_admin_deactivate_restaurant_lambda.arn

  appsync_graphql_api_id   = aws_appsync_graphql_api.api.id
  environment_namespace    = var.environment_namespace
  assume_role_policy_json  = data.aws_iam_policy_document.appsync_assume_role.json
  permissions_boundary_arn = local.permissions_boundary_arn
}

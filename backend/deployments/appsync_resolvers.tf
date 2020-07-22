resource aws_appsync_resolver admin_create_nibble {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "adminCreateNibble"
  type              = "Mutation"
  data_source       = module.admin_nibble_mutation_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "adminCreateNibble" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver admin_edit_nibble {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "adminEditNibble"
  type              = "Mutation"
  data_source       = module.admin_nibble_mutation_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "adminEditNibble" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver admin_create_restaurant {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "adminCreateRestaurant"
  type              = "Mutation"
  data_source       = module.admin_restaurant_mutation_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "adminCreateRestaurant" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver admin_edit_restaurant {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "adminEditRestaurant"
  type              = "Mutation"
  data_source       = module.admin_restaurant_mutation_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "adminEditRestaurant" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver user_info {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "userInfo"
  type              = "Query"
  data_source       = module.user_info_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "userInfo" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver nibble_available_restaurant {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "restaurant"
  type              = "NibbleAvailable"
  data_source       = module.restaurant_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "Nibble.restaurant" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver restaurant_info {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "restaurantInfo"
  type              = "Query"
  data_source       = module.restaurant_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "Query.restaurantInfo" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver restaurant_distance {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "distance"
  type              = "Restaurant"
  data_source       = module.restaurant_distance_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "Restaurant.distance" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver restaurant_nibbles_available {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "nibblesAvailable"
  type              = "Restaurant"
  data_source       = module.available_nibble_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "Restaurant.nibblesAvailable" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

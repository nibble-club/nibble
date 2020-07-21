resource aws_appsync_resolver admin_create_nibble {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "adminCreateNibble"
  type              = "Mutation"
  data_source       = module.admin_create_nibble_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "adminCreateNibble" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver admin_create_restaurant {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "adminCreateRestaurant"
  type              = "Mutation"
  data_source       = module.admin_create_restaurant_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "adminCreateRestaurant" })
  response_template = file("./resolver_templates/response_lambda.vm")
  depends_on        = [module.admin_create_restaurant_datasource]
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


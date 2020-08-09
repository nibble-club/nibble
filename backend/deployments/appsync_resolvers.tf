// http resolvers
resource aws_appsync_resolver geocode_address {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "geocodeAddress"
  type              = "Query"
  data_source       = aws_appsync_datasource.geocodio_api.name
  request_template  = templatefile("./resolver_templates/request_http_geocode.vm", { api_key = data.aws_ssm_parameter.geocodio_api_key.value })
  response_template = file("./resolver_templates/response_http_geocode.vm")
}


// lambda resolvers
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

resource aws_appsync_resolver nibble_reserved_restaurant {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "restaurant"
  type              = "NibbleReserved"
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

resource aws_appsync_resolver restaurant_info_for_admin {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "restaurantForAdmin"
  type              = "Query"
  data_source       = module.restaurant_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "Query.restaurantForAdmin" })
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

resource aws_appsync_resolver nibble_info {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "nibbleInfo"
  type              = "Query"
  data_source       = module.available_nibble_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "Query.nibbleInfo" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver nibbles_reserved {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "nibblesReserved"
  type              = "User"
  data_source       = module.nibble_history_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "User.nibblesReserved" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver nibbles_history {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "nibblesHistory"
  type              = "User"
  data_source       = module.nibble_history_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "User.nibblesHistory" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver nibble_create_reservation {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "nibbleCreateReservation"
  type              = "Mutation"
  data_source       = module.nibble_reservation_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "nibbleCreateReservation" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver nibble_edit_reservation {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "nibbleEditReservation"
  type              = "Mutation"
  data_source       = module.nibble_reservation_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "nibbleEditReservation" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver nibble_admin_delete_reservation {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "adminCancelReservation"
  type              = "Mutation"
  data_source       = module.nibble_reservation_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "adminCancelReservation" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver nibble_delete_reservation {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "nibbleCancelReservation"
  type              = "Mutation"
  data_source       = module.nibble_reservation_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "nibbleCancelReservation" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver image_upload_url {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "imageUploadURL"
  type              = "Query"
  data_source       = module.image_upload_url_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "imageUploadURL" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver closest_restaurants {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "closestRestaurants"
  type              = "Query"
  data_source       = module.closest_restaurants_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "closestRestaurants" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver search {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "search"
  type              = "Query"
  data_source       = module.search_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "search" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

resource aws_appsync_resolver recent_searches {
  api_id            = aws_appsync_graphql_api.api.id
  kind              = "UNIT"
  field             = "recentSearches"
  type              = "Query"
  data_source       = module.recent_searches_datasource.name
  request_template  = templatefile("./resolver_templates/request_lambda.vm", { field = "recentSearches" })
  response_template = file("./resolver_templates/response_lambda.vm")
}

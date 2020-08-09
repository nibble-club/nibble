output ssh_instance_address {
  value = aws_instance.ssh_instance.public_dns
}

// variables used in frontend
resource aws_ssm_parameter aws_region {
  name  = "${local.frontend_config_var_namespace}/aws_region"
  type  = "String"
  value = var.aws_region
}

resource aws_ssm_parameter cognito_user_pool_id {
  name  = "${local.frontend_config_var_namespace}/cognito_user_pool_id"
  type  = "String"
  value = aws_cognito_user_pool.users.id
}

resource aws_ssm_parameter cognito_user_pool_client_id {
  name  = "${local.frontend_config_var_namespace}/cognito_user_pool_client_id"
  type  = "String"
  value = aws_cognito_user_pool_client.users.id
}

resource aws_ssm_parameter appsync_graphql_endpoint {
  name  = "${local.frontend_config_var_namespace}/appsync_graphql_endpoint"
  type  = "String"
  value = aws_appsync_graphql_api.api.uris["GRAPHQL"]
}

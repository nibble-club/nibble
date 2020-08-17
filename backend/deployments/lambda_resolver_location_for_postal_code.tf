module resolver_location_for_postal_code_lambda {
  source = "./modules/lambda"

  description              = "Resolves postal code to lat/lon mappings"
  environment_namespace    = var.environment_namespace
  function_name            = "resolver_location_for_postal_code"
  handler                  = "main.lambda_handler"
  memory_size              = 512
  permissions_boundary_arn = local.permissions_boundary_arn
  release_alias_name       = "release"
  release_version          = var.resolver_location_for_postal_code_lambda_release_version # defaults to ""
  runtime                  = "python3.7"
  s3_bucket                = local.lambdas_bucket
  s3_key                   = "${var.environment_namespace}/${var.resolver_location_for_postal_code_lambda_name}/${var.resolver_location_for_postal_code_lambda_artifact}"
  timeout                  = 3

  environment = {
    ENVIRONMENT = var.environment_namespace
  }

  layers = [aws_lambda_layer_version.db_utilities.arn]

  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

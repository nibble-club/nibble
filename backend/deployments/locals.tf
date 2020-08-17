data aws_region current {}

locals {
  ALL_IP_ADDRESSES = "0.0.0.0/0"

  db_schemas_bucket = "${var.aws_target_account_id}-${var.aws_region}-${var.environment}-db-schemas"
  lambdas_bucket    = "${var.aws_target_account_id}-${var.aws_region}-${var.environment}-lambdas"

  frontend_config_var_namespace = "/environment/${var.environment_namespace}/frontend_config"
  frontend_deploy_var_namespace = "/environment/${var.environment_namespace}/frontend_deploy"

  permissions_boundary_arn = "arn:aws:iam::${var.aws_target_account_id}:policy/admin/permissions_boundary"

  nibble_images_bucket         = replace("${var.aws_target_account_id}-${var.environment_namespace}-nibble-images", "_", "-")
  restaurant_heros_bucket      = replace("${var.aws_target_account_id}-${var.environment_namespace}-restaurant-heros", "_", "-")
  restaurant_logos_bucket      = replace("${var.aws_target_account_id}-${var.environment_namespace}-restaurant-logos", "_", "-")
  user_profile_pictures_bucket = replace("${var.aws_target_account_id}-${var.environment_namespace}-profile-pics", "_", "-")
}

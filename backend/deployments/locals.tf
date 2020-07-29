data aws_region current {}

locals {
  ALL_IP_ADDRESSES             = "0.0.0.0/0"
  permissions_boundary_arn     = "arn:aws:iam::${var.aws_target_account_id}:policy/admin/permissions_boundary"
  db_schemas_bucket            = "${var.aws_target_account_id}-${var.aws_region}-${var.environment}-db-schemas"
  lambdas_bucket               = "${var.aws_target_account_id}-${var.aws_region}-${var.environment}-lambdas"
  user_profile_pictures_bucket = replace("${var.aws_target_account_id}-${var.environment_namespace}-profile-pics", "_", "-")
  restaurant_logos_bucket      = replace("${var.aws_target_account_id}-${var.environment_namespace}-restaurant-logos", "_", "-")
  restaurant_heros_bucket      = replace("${var.aws_target_account_id}-${var.environment_namespace}-restaurant-heros", "_", "-")
}
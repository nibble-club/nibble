data aws_region current {}

locals {
  permissions_boundary_arn      = "arn:aws:iam::${var.aws_target_account_id}:policy/admin/permissions_boundary"
  frontend_config_var_namespace = "/environment/${var.environment_namespace}/frontend_config"
  frontend_deploy_var_namespace = "/environment/${var.environment_namespace}/frontend_deploy"
  subdomain_name                = var.environment == "prod" ? "app" : replace(var.environment_namespace, "_", "-")
}

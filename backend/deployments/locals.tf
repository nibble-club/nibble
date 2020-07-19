data aws_region current {}

locals {
  ALL_IP_ADDRESSES         = "0.0.0.0/0"
  permissions_boundary_arn = "arn:aws:iam::${var.aws_target_account_id}:policy/admin/permissions_boundary"
  db_schemas_bucket        = "${var.aws_target_account_id}-${var.aws_region}-${var.environment}-db-schemas"
  lambdas_bucket           = "${var.aws_target_account_id}-${var.aws_region}-${var.environment}-lambdas"
}
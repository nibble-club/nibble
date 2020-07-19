data aws_region current {}

data aws_caller_identity current {}

locals {
  name_prefix = "${data.aws_caller_identity.current.account_id}-${data.aws_region.current.name}"
  # deterministically defined ARN, based on path created in access module
  boundary_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/admin/permissions_boundary"
}
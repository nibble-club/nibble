data aws_caller_identity current {}

data aws_region current {}

locals {
  ALL_IP_ADDRESSES = "0.0.0.0/0"
  boundary_arn     = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/admin/permissions_boundary"
}
data aws_region current {}

data aws_caller_identity current {}

locals {
  name_prefix = "${data.aws_caller_identity.current.account_id}-${data.aws_region.current.name}"
}
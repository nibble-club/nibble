module backend_resources {
  source = "../../../modules/backend_resources"

  environment_namespace = var.environment_namespace
  vpc_cidr_block        = var.vpc_cidr_block
  private_subnet_count  = var.private_subnet_count
  route53_zone_id       = var.route53_zone_id
}

data aws_vpc vpc {
  id = var.vpc_id
}

data aws_subnet public_subnet {
  id = var.public_subnet_id
}

data aws_subnet private_subnets {
  count = length(var.private_subnet_ids)
  id    = var.private_subnet_ids[count.index]
}

data aws_vpc_endpoint s3_access_endpoint {
  id = var.vpc_endpoint_id
}
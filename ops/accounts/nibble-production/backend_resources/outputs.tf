output vpc_id {
  value = module.backend_resources.vpc_id
}

output public_subnet_id {
  value = module.backend_resources.public_subnet_id
}

output private_subnet_ids {
  value = module.backend_resources.private_subnet_ids
}

output s3_vpc_endpoint_id {
  value = module.backend_resources.s3_vpc_endpoint_id
}

output lambdas_bucket {
  value = module.backend_resources.lambdas_bucket
}

output db_schemas_bucket {
  value = module.backend_resources.db_schemas_bucket
}
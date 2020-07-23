output vpc_id {
  value = aws_vpc.vpc.id
}

output public_subnet_id {
  value = aws_subnet.public_subnet.id
}

output private_subnet_ids {
  value = aws_subnet.private_subnets.*.id
}

output s3_vpc_endpoint_id {
  value = aws_vpc_endpoint.s3_access_endpoint.id
}

output lambdas_bucket {
  value = aws_s3_bucket.lambdas_bucket.bucket
}

output db_schemas_bucket {
  value = aws_s3_bucket.db_schema_bucket.bucket
}
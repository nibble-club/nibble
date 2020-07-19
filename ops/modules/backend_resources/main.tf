# db schemas bucket
resource aws_s3_bucket db_schema_bucket {
  bucket = "${data.aws_caller_identity.current.account_id}-${data.aws_region.current.name}-${var.environment_namespace}-db-schemas"
  acl    = "private"

  tags = {
    Name        = "${data.aws_caller_identity.current.account_id}-${data.aws_region.current.name}-${var.environment_namespace}-db-schemas"
    Environment = var.environment_namespace
    Terraformed = "ops/modules/backend_resources"
  }
}

resource aws_s3_bucket_public_access_block block_db_schema_bucket_public_access {
  bucket                  = aws_s3_bucket.db_schema_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# lambdas bucket
resource aws_s3_bucket lambdas_bucket {
  bucket = "${data.aws_caller_identity.current.account_id}-${data.aws_region.current.name}-${var.environment_namespace}-lambdas"
  acl    = "private"

  tags = {
    Name        = "${data.aws_caller_identity.current.account_id}-${data.aws_region.current.name}-${var.environment_namespace}-lambdas"
    Environment = var.environment_namespace
    Terraformed = "ops/modules/backend_resources"
  }
}

resource aws_s3_bucket_public_access_block block_lambdas_bucket_public_access {
  bucket                  = aws_s3_bucket.lambdas_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

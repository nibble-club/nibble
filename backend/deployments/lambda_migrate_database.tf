module migrate_database_lambda {
  source = "./modules/lambda"

  description              = "Migrates database on invocation"
  environment_namespace    = var.environment_namespace
  function_name            = "migrate_database"
  handler                  = "lambda.Handler"
  memory_size              = 1024
  permissions_boundary_arn = local.permissions_boundary_arn
  release_alias_name       = "release"
  release_version          = var.migrate_database_lambda_release_version # defaults to ""
  runtime                  = "java8"
  s3_bucket                = local.lambdas_bucket
  s3_key                   = "${var.environment_namespace}/${var.migrate_database_lambda_name}/${var.migrate_database_lambda_artifact}"
  timeout                  = 60

  environment = {
    DB_PASSWORD = aws_db_instance.postgres.password
    DB_URL      = "jdbc:postgresql://${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/${aws_db_instance.postgres.name}"
    DB_USERNAME = aws_db_instance.postgres.username
    S3_BUCKET   = local.db_schemas_bucket
    S3_KEY      = "${var.environment_namespace}-postgres"
  }

  lambda_policies = [aws_iam_policy.migrate_database.arn]

  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

data aws_s3_bucket db_schemas {
  bucket = local.db_schemas_bucket
}

# roles and policies
data aws_iam_policy_document migrate_database {
  statement {
    actions = [
      "s3:GetObject",
      "s3:ListBucket"
    ]
    effect = "Allow"
    resources = [
      data.aws_s3_bucket.db_schemas.arn,
      "${data.aws_s3_bucket.db_schemas.arn}/*"
    ]
  }
}

resource aws_iam_policy migrate_database {
  name   = "${var.environment_namespace}-migrate_database"
  policy = data.aws_iam_policy_document.migrate_database.json
}

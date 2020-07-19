module migrate_database_lambda {
  source = "./modules/lambda"

  s3_bucket          = local.lambdas_bucket
  s3_key             = "${var.environment_namespace}/${var.migrate_database_lambda_name}/${var.migrate_database_lambda_artifact}"
  function_name      = "${var.environment_namespace}-migrate_database"
  handler            = "lambda.Handler"
  description        = "Migrates database on invocation"
  release_alias_name = "release"
  release_version    = var.migrate_database_lambda_release_version # defaults to ""
  role_arn           = aws_iam_role.migrate_database.arn
  role_name          = aws_iam_role.migrate_database.name
  runtime            = "java8"
  timeout            = 60
  memory_size        = 1024
  environment = {
    S3_BUCKET   = local.db_schemas_bucket
    S3_KEY      = "postgres"
    DB_URL      = "jdbc:postgresql://${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/${aws_db_instance.postgres.name}"
    DB_USERNAME = aws_db_instance.postgres.username
    DB_PASSWORD = aws_db_instance.postgres.password
  }
  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

data aws_s3_bucket db_schemas {
  bucket = local.db_schemas_bucket
}

# roles and policies
resource aws_iam_role migrate_database {
  name                 = "${var.environment_namespace}-migrate_database_lambda"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  permissions_boundary = local.permissions_boundary_arn
}

data aws_iam_policy_document migrate_database {
  // interface with VPC resources
  statement {
    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface"
    ]
    effect = "Allow"
    resources = [
      "*"
    ]
  }
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

resource aws_iam_role_policy_attachment migrate_database {
  role       = aws_iam_role.migrate_database.name
  policy_arn = aws_iam_policy.migrate_database.arn
}

module resolver_admin_create_nibble_lambda {
  source = "./modules/lambda"

  s3_bucket          = local.lambdas_bucket
  s3_key             = "${var.environment_namespace}/${var.resolver_admin_create_nibble_lambda_name}/${var.resolver_admin_create_nibble_lambda_artifact}"
  function_name      = "${var.environment_namespace}-resolver_admin_create_nibble"
  handler            = "main.lambda_handler"
  description        = "Resolves adminCreateNibble GraphQL mutations"
  release_alias_name = "release"
  release_version    = var.resolver_admin_create_nibble_lambda_release_version # defaults to ""
  role_arn           = aws_iam_role.resolver_admin_create_nibble.arn
  role_name          = aws_iam_role.resolver_admin_create_nibble.name
  runtime            = "python3.8"
  timeout            = 5
  environment = {
    DB_URL      = aws_db_instance.postgres.address
    DB_PORT     = aws_db_instance.postgres.port
    DB_USERNAME = aws_db_instance.postgres.username
    DB_PASSWORD = aws_db_instance.postgres.password
  }
  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
resource aws_iam_role resolver_admin_create_nibble {
  name                 = "${var.environment_namespace}-resolver_admin_create_nibble_lambda"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  permissions_boundary = local.permissions_boundary_arn
}

data aws_iam_policy_document resolver_admin_create_nibble {
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
}

resource aws_iam_policy resolver_create_admin_nibble {
  name   = "${var.environment_namespace}-resolver_create_admin_nibble"
  policy = data.aws_iam_policy_document.resolver_admin_create_nibble.json
}

resource aws_iam_role_policy_attachment resolver_create_admin_nibble {
  role       = aws_iam_role.resolver_admin_create_nibble.name
  policy_arn = aws_iam_policy.resolver_create_admin_nibble.arn
}

module resolver_restaurant_distance_lambda {
  source = "./modules/lambda"

  s3_bucket          = local.lambdas_bucket
  s3_key             = "${var.environment_namespace}/${var.resolver_restaurant_distance_lambda_name}/${var.resolver_restaurant_distance_lambda_artifact}"
  function_name      = "${var.environment_namespace}-resolver_restaurant_distance"
  handler            = "main.lambda_handler"
  description        = "Resolves information about restaurant distance in GraphQL queries"
  release_alias_name = "release"
  release_version    = var.resolver_restaurant_distance_lambda_release_version # defaults to ""
  role_arn           = aws_iam_role.resolver_restaurant_distance.arn
  role_name          = aws_iam_role.resolver_restaurant_distance.name
  runtime            = "python3.7"
  timeout            = 3
  layers             = [aws_lambda_layer_version.db_utilities.arn]
  environment = {
    ENVIRONMENT = var.environment_namespace
  }
  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
resource aws_iam_role resolver_restaurant_distance {
  name                 = "${var.environment_namespace}-resolver_restaurant_distance_lambda"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  permissions_boundary = local.permissions_boundary_arn
}

data aws_iam_policy_document resolver_restaurant_distance {
  statement {
    actions   = ["lambda:GetLayerVersion"]
    effect    = "Allow"
    resources = [aws_lambda_layer_version.db_utilities.arn]
  }

  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
    ]
    effect    = "Allow"
    resources = ["*"]
  }
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

resource aws_iam_policy resolver_restaurant_distance {
  name   = "${var.environment_namespace}-resolver_restaurant_distance"
  policy = data.aws_iam_policy_document.resolver_restaurant_distance.json
}

resource aws_iam_role_policy_attachment resolver_restaurant_distance {
  role       = aws_iam_role.resolver_restaurant_distance.name
  policy_arn = aws_iam_policy.resolver_restaurant_distance.arn
}

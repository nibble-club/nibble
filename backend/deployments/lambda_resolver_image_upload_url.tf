module resolver_image_upload_url_lambda {
  source = "./modules/lambda"

  s3_bucket          = local.lambdas_bucket
  s3_key             = "${var.environment_namespace}/${var.resolver_image_upload_url_lambda_name}/${var.resolver_image_upload_url_lambda_artifact}"
  function_name      = "${var.environment_namespace}-resolver_image_upload_url"
  handler            = "main.lambda_handler"
  description        = "Gets presigned S3 image upload URL"
  release_alias_name = "release"
  release_version    = var.resolver_image_upload_url_lambda_release_version # defaults to ""
  role_arn           = aws_iam_role.resolver_image_upload_url.arn
  role_name          = aws_iam_role.resolver_image_upload_url.name
  runtime            = "python3.7"
  timeout            = 5
  layers             = [aws_lambda_layer_version.db_utilities.arn]
  environment = {
    USER_PROFILE_PICTURES_BUCKET = aws_s3_bucket.user_profile_pictures.bucket
    RESTAURANT_LOGOS_BUCKET      = aws_s3_bucket.restaurant_logos.bucket
    RESTAURANT_HEROS_BUCKET      = aws_s3_bucket.restaurant_heros.bucket
    NIBBLE_IMAGES_BUCKET         = aws_s3_bucket.nibble_images.bucket
  }
  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
resource aws_iam_role resolver_image_upload_url {
  name                 = "${var.environment_namespace}-resolver_image_upload_url_lambda"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  permissions_boundary = local.permissions_boundary_arn
}

data aws_iam_policy_document resolver_image_upload_url {
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
  statement {
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:PutObjectAcl",
    ]
    effect = "Allow"
    resources = [
      aws_s3_bucket.restaurant_heros.arn,
      "${aws_s3_bucket.restaurant_heros.arn}/*",
      aws_s3_bucket.restaurant_logos.arn,
      "${aws_s3_bucket.restaurant_logos.arn}/*",
      aws_s3_bucket.user_profile_pictures.arn,
      "${aws_s3_bucket.user_profile_pictures.arn}/*",
      aws_s3_bucket.nibble_images.arn,
      "${aws_s3_bucket.nibble_images.arn}/*",
    ]
  }
}

resource aws_iam_policy resolver_image_upload_url {
  name   = "${var.environment_namespace}-resolver_image_upload_url"
  policy = data.aws_iam_policy_document.resolver_image_upload_url.json
}

resource aws_iam_role_policy_attachment resolver_image_upload_url {
  role       = aws_iam_role.resolver_image_upload_url.name
  policy_arn = aws_iam_policy.resolver_image_upload_url.arn
}

module resolver_image_upload_url_lambda {
  source = "./modules/lambda"

  description              = "Gets presigned S3 image upload URL"
  environment_namespace    = var.environment_namespace
  function_name            = "resolver_image_upload_url"
  handler                  = "main.lambda_handler"
  permissions_boundary_arn = local.permissions_boundary_arn
  release_alias_name       = "release"
  release_version          = var.resolver_image_upload_url_lambda_release_version # defaults to ""
  runtime                  = "python3.7"
  s3_bucket                = local.lambdas_bucket
  s3_key                   = "${var.environment_namespace}/${var.resolver_image_upload_url_lambda_name}/${var.resolver_image_upload_url_lambda_artifact}"
  timeout                  = 5

  environment = {
    NIBBLE_IMAGES_BUCKET         = aws_s3_bucket.nibble_images.bucket
    RESTAURANT_HEROS_BUCKET      = aws_s3_bucket.restaurant_heros.bucket
    RESTAURANT_LOGOS_BUCKET      = aws_s3_bucket.restaurant_logos.bucket
    USER_PROFILE_PICTURES_BUCKET = aws_s3_bucket.user_profile_pictures.bucket
  }

  lambda_policies = [aws_iam_policy.resolver_image_upload_url.arn]

  layers = [aws_lambda_layer_version.db_utilities.arn]

  vpc_config = {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = var.private_subnet_ids
  }
}

# roles and policies
data aws_iam_policy_document resolver_image_upload_url {
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

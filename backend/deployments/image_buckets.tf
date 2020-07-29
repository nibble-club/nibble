resource aws_s3_bucket user_profile_pictures {
  bucket = local.user_profile_pictures_bucket
  acl    = "public-read"

  cors_rule {
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["*"]
    allowed_headers = ["*"]
  }

  tags = {
    Environment = var.environment
  }
}

resource aws_s3_bucket restaurant_logos {
  bucket = local.restaurant_logos_bucket
  acl    = "public-read"

  cors_rule {
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["*"]
    allowed_headers = ["*"]
  }

  tags = {
    Environment = var.environment
  }
}

resource aws_s3_bucket restaurant_heros {
  bucket = local.restaurant_heros_bucket
  acl    = "public-read"

  cors_rule {
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["*"]
    allowed_headers = ["*"]
  }

  tags = {
    Environment = var.environment
  }
}
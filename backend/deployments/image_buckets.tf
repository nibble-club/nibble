resource aws_s3_bucket user_profile_pictures {
  bucket = replace("${var.aws_target_account_id}-${var.environment_namespace}-profile-pics", "_", "-")
  acl    = "public-read"

  tags = {
    Environment = var.environment
  }
}

resource aws_s3_bucket restaurant_logos {
  bucket = replace("${var.aws_target_account_id}-${var.environment_namespace}-restaurant-logos", "_", "-")
  acl    = "public-read"

  tags = {
    Environment = var.environment
  }
}

resource aws_s3_bucket restaurant_heros {
  bucket = replace("${var.aws_target_account_id}-${var.environment_namespace}-restaurant-heros", "_", "-")
  acl    = "public-read"

  tags = {
    Environment = var.environment
  }
}
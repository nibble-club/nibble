output ssh_instance_address {
  value = aws_instance.ssh_instance.public_dns
}

output cognito_user_pool_id {
  value = aws_cognito_user_pool.users.id
}

output cognito_user_pool_client_id {
  value = aws_cognito_user_pool_client.users.id
}

output restaurant_hero_image_bucket {
  value = aws_s3_bucket.restaurant_heros.bucket
}

output restaurant_logo_image_bucket {
  value = aws_s3_bucket.restaurant_logos.bucket
}

output user_profile_picture_image_bucket {
  value = aws_s3_bucket.user_profile_pictures.bucket
}
output ssh_instance_address {
  value = aws_instance.ssh_instance.public_dns
}

output cognito_user_pool_id {
  value = aws_cognito_user_pool.users.id
}

output cognito_user_pool_client_id {
  value = aws_cognito_user_pool_client.users.id
}

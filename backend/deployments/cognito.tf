resource aws_cognito_user_pool users {
  name                     = "${var.environment_namespace}-users"
  mfa_configuration        = "OFF"
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  device_configuration {
    challenge_required_on_new_device      = false
    device_only_remembered_on_user_prompt = true
  }

  email_configuration {
    from_email_address    = "Nibble <${aws_ses_email_identity.default.email}>"
    source_arn            = aws_ses_email_identity.default.arn
    email_sending_account = "DEVELOPER"
  }

  lambda_config {
    pre_sign_up          = module.add_user_lambda.arn
    pre_token_generation = module.add_user_lambda.arn
    post_confirmation    = module.add_user_lambda.arn
  }

  password_policy {
    minimum_length                   = 12
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "name"
    required                 = true

    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "admin"
    required                 = false
    string_attribute_constraints {
      max_length = "5"
      min_length = "4"
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "postal_code"
    required                 = false

    string_attribute_constraints {
      max_length = "5"
      min_length = "5"
    }
  }

  username_configuration {
    case_sensitive = false
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_message        = "Thank you for signing up with Nibble! Enter this code to finish creating your account: {####}."
    email_subject        = "Finish creating your Nibble account"
  }
}

resource aws_cognito_user_pool_client users {
  name         = "${var.environment_namespace}-users_client"
  user_pool_id = aws_cognito_user_pool.users.id

  allowed_oauth_flows                  = ["implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  callback_urls                        = ["https://localhost:3000"]
  explicit_auth_flows                  = ["ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_PASSWORD_AUTH", "ALLOW_USER_SRP_AUTH"]
  generate_secret                      = false
  logout_urls                          = ["https://localhost:3000"]
  prevent_user_existence_errors        = "ENABLED"
  read_attributes = [
    "email",
    "email_verified",
    "name",
    "custom:postal_code",
    "custom:admin"
  ]
  refresh_token_validity       = 30
  supported_identity_providers = ["COGNITO"]
  write_attributes = [
    "email",
    "name",
    "custom:postal_code",
    "custom:admin",
  ]
}

resource aws_cognito_user_pool_domain users {
  domain       = replace("${var.environment_namespace}-nibble-club", "_", "-")
  user_pool_id = aws_cognito_user_pool.users.id
}

resource aws_cognito_user_group users {
  name         = "users"
  user_pool_id = aws_cognito_user_pool.users.id
  description  = "Normal application users"
}

resource aws_cognito_user_group admins {
  name         = "admin"
  user_pool_id = aws_cognito_user_pool.users.id
  description  = "Restaurant admins"
}

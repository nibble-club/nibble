terraform {
  required_version = "0.12.28"
  required_providers {
    aws    = "~> 2.70"
    heroku = "~> 2.6.0"
  }
  backend s3 {}
}

provider aws {
  version = "~> 2.70"
  region  = var.aws_region
  profile = var.aws_profile
}

provider heroku {
  version = "~> 2.6.0"
}

data aws_kms_key account_key {
  key_id = "alias/account-key"
}

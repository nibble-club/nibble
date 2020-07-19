module dev_bootstrap_default {
  source = "../../../modules/bootstrap"
}

module dev_bootstrap_us_west_1 {
  source = "../../../modules/bootstrap"
  providers = {
    aws = aws.us-west-1
  }
}

module dev_bootstrap_us_east_1 {
  source = "../../../modules/bootstrap"
  providers = {
    aws = aws.us-east-1
  }
}

module dev_bootstrap_us_east_2 {
  source = "../../../modules/bootstrap"
  providers = {
    aws = aws.us-east-2
  }
}
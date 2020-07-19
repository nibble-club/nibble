terraform {
  required_version = "0.12.28"

  required_providers {
    aws = "~> 2.70"
  }
}

variable aws_profile {}

provider aws {
  version = "~> 2.70"
  region  = "us-west-2"
  profile = var.aws_profile
}

provider aws {
  version = "~> 2.70"
  alias = "us-west-1"
  region  = "us-west-1"
  profile = var.aws_profile
}

provider aws {
  version = "~> 2.70"
  alias = "us-east-1"
  region  = "us-east-1"
  profile = var.aws_profile
}

provider aws {
  version = "~> 2.70"
  alias = "us-east-2"
  region  = "us-east-2"
  profile = var.aws_profile
}
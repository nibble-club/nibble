variable aws_region {
  type        = string
  description = "AWS region to deploy resources to"
  default     = "us-west-2"
}

variable aws_profile {
  type        = string
  description = "Local AWS profile to use for deployments (see ~/.aws/credentials)"
  default     = "nibble-deploy"
}

variable graphql_client {
  type        = string
  description = "GraphQL client to point Heroku deployment at. "
}
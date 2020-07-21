variable environment_namespace {
  description = "Namespace to use for all resources created"
  type = string
}

variable appsync_graphql_api_id {
  description = "The ID of the AppSync API to attach this data source to"
  type = string
}

variable name {
  description = "The name of this data source"
  type = string
}

variable description {
  description = "Description of this data source"
  type = string
  default = "Managed by Terraform"
}

variable function_arn {
  description = "The ARN of the Lambda to attach to this data source"
  type = string
}

variable assume_role_policy_json {
  description = "The JSON of a policy allowing this data source to assume a role"
  type = string
}

variable permissions_boundary_arn {
  description = "The ARN of the permissions boundary to give the role passed to this data source"
  type = string
}

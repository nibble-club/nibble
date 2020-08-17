variable dead_letter_config {
  type        = object({ target_arn = string })
  description = "The location to send failure records. Should contain one value: `target_arn` (the ARN of the dead letter queue to use)"
  default     = null
}

variable description {
  type        = string
  description = "The Lambda function's description"
  default     = "Lambda created by Terraform"
}

variable environment {
  type        = map(string)
  description = "The environment variables accessible to the Lambda"
}

variable environment_namespace {
  type        = string
  description = "The environment namespace to prefix created resources with"
}

variable function_name {
  type        = string
  description = "The Lambda function's name"
}

variable handler {
  type        = string
  description = "The name of the handler function within the Lambda's code, e.g. 'main.lambda_handler'"
}

variable lambda_policies {
  type        = list(string)
  description = "Set of policy ARNs to attach to this Lambda's execution role"
  default     = []
}

variable layers {
  type        = list(string)
  description = "Lambda Layers to use with this Lambda (limit 5). Should contain layer ARNs."
  default     = []
}

variable memory_size {
  type        = number
  description = "Amount of memory to give to Lambda"
  default     = 128
}

variable permissions_boundary_arn {
  type        = string
  description = "Permissions boundary to apply to generated Lambda execution role"
}

variable release_alias_name {
  type        = string
  description = "Name of the Lambda's release alias to create, e.g. 'release'"
}

variable release_version {
  type        = string
  description = "The version of the Lambda to tie the release alias to. If not included, release alias will be tied to latest version."
}

variable runtime {
  type        = string
  description = "Name of the runtime the Lambda will use, e.g. 'python3.7'"
}

variable s3_bucket {
  type        = string
  description = "The S3 bucket the Lambda's source code is stored in"
}

variable s3_key {
  type        = string
  description = "The S3 key the Lambda's source code is stored in"
}

variable tags {
  type        = map(string)
  description = "Tags to apply to the Lambda"
  default     = {}
}

variable timeout {
  type        = number
  description = "Amount of time Lambda will stay alive before timing out on execution"
  default     = 3
}

variable vpc_config {
  type = object({
    security_group_ids = list(string)
    subnet_ids         = list(string)
  })
  description = "The VPC configuration for the lambda. Should contain two values: `security_group_ids` (a list of VPC security group IDs) and `subnet_ids` (a list of VPC subnet IDs)."
  default = {
    security_group_ids = []
    subnet_ids         = []
  }
}

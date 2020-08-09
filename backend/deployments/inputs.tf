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

variable aws_target_account_id {
  type        = string
  description = "The targeted AWS account, used for accessing lambda/db schema buckets"
  default     = "800344761765"
}

variable environment {
  type        = string
  description = "Name of current deployment environment (e.g. dev, qa, prod)"
}

variable environment_namespace {
  type        = string
  description = "Namespace to use for resources; for qa/prod this is just qa/prod; for dev it should be dev_(username)"
}

# networking configuration
variable vpc_id {
  type        = string
  description = "ID of VPC for given environment created in backend_resources"
}

variable public_subnet_id {
  type        = string
  description = "ID of the public subnet in the network created in backend_resources"
}

variable private_subnet_ids {
  type        = list(string)
  description = "IDs of the private subnets in the network created in backend_resources"
}

variable vpc_endpoint_id {
  type        = string
  description = "ID of the VPC endpoint created in backend_resources"
}

# service-specific configurations
variable maintenance_window {
  type        = string
  description = "When maintenance should be performed on resources such as RDS and ElastiCache"
  default     = "sun:05:00-sun:09:00"
}

variable postgres_instance_class {
  type        = string
  description = "Instance class type to use for Postgres RDS DB"
}

variable elasticsearch_instance_class {
  type        = string
  description = "Instance class type to use for Elasticsearch domain data nodes"
}

variable elasticsearch_master_instance_class {
  type        = string
  description = "Instance class type to use for Elasticsearch domain dedicated master nodes"
}

variable ssh_public_key_path {
  type        = string
  description = "Path to public key for key pair to use for SSH connection. See https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html for instructions."

}

# secure parameters
data aws_ssm_parameter postgres_password {
  name = "/environment/${var.environment_namespace}/postgres_password"
}

data aws_ssm_parameter geocodio_api_key {
  name = "/environment/${var.environment}/geocodio_api_key"
}

# lambda artifacts
variable resolver_admin_nibble_mutation_lambda_name {
  type = string
}

variable resolver_admin_nibble_mutation_lambda_artifact {
  type = string
}

variable resolver_admin_nibble_mutation_lambda_release_version {
  type    = string
  default = ""
}

variable resolver_admin_restaurant_mutation_lambda_name {
  type = string
}

variable resolver_admin_restaurant_mutation_lambda_artifact {
  type = string
}

variable resolver_admin_restaurant_mutation_lambda_release_version {
  type    = string
  default = ""
}

variable resolver_user_info_lambda_name {
  type = string
}

variable resolver_user_info_lambda_artifact {
  type = string
}

variable resolver_user_info_lambda_release_version {
  type    = string
  default = ""
}

variable migrate_database_lambda_name {
  type = string
}

variable migrate_database_lambda_artifact {
  type = string
}

variable migrate_database_lambda_release_version {
  type    = string
  default = ""
}

variable migrate_elasticsearch_lambda_name {
  type = string
}

variable migrate_elasticsearch_lambda_artifact {
  type = string
}

variable migrate_elasticsearch_lambda_release_version {
  type    = string
  default = ""
}


variable db_utilities_lambda_name {
  type = string
}

variable db_utilities_lambda_artifact {
  type = string
}

variable db_utilities_lambda_release_version {
  type    = string
  default = ""
}

variable add_user_lambda_name {
  type = string
}

variable add_user_lambda_artifact {
  type = string
}

variable add_user_lambda_release_version {
  type    = string
  default = ""
}

variable resolver_restaurant_lambda_name {
  type = string
}

variable resolver_restaurant_lambda_artifact {
  type = string
}

variable resolver_restaurant_lambda_release_version {
  type    = string
  default = ""
}

variable resolver_restaurant_distance_lambda_name {
  type = string
}

variable resolver_restaurant_distance_lambda_artifact {
  type = string
}

variable resolver_restaurant_distance_lambda_release_version {
  type    = string
  default = ""
}

variable resolver_nibble_lambda_name {
  type = string
}

variable resolver_nibble_lambda_artifact {
  type = string
}

variable resolver_nibble_lambda_release_version {
  type    = string
  default = ""
}

variable resolver_nibble_history_lambda_name {
  type = string
}

variable resolver_nibble_history_lambda_artifact {
  type = string
}

variable resolver_nibble_history_lambda_release_version {
  type    = string
  default = ""
}

variable resolver_nibble_reservation_lambda_name {
  type = string
}

variable resolver_nibble_reservation_lambda_artifact {
  type = string
}

variable resolver_nibble_reservation_lambda_release_version {
  type    = string
  default = ""
}

variable resolver_image_upload_url_lambda_name {
  type = string
}

variable resolver_image_upload_url_lambda_artifact {
  type = string
}

variable resolver_image_upload_url_lambda_release_version {
  type    = string
  default = ""
}

variable resolver_closest_restaurants_lambda_name {
  type = string
}

variable resolver_closest_restaurants_lambda_artifact {
  type = string
}

variable resolver_closest_restaurants_lambda_release_version {
  type    = string
  default = ""
}

variable resolver_search_lambda_name {
  type = string
}

variable resolver_search_lambda_artifact {
  type = string
}

variable resolver_search_lambda_release_version {
  type    = string
  default = ""
}

variable resolver_recent_searches_lambda_name {
  type = string
}

variable resolver_recent_searches_lambda_artifact {
  type = string
}

variable resolver_recent_searches_lambda_release_version {
  type    = string
  default = ""
}

variable resolver_location_for_postal_code_lambda_name {
  type = string
}

variable resolver_location_for_postal_code_lambda_artifact {
  type = string
}

variable resolver_location_for_postal_code_lambda_release_version {
  type    = string
  default = ""
}

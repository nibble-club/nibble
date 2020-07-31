aws_region = "us-west-2"
aws_profile = "nibble-deploy"
aws_target_account_id = "800344761765"
environment = "dev"

vpc_id = "vpc-0a2054a5185889ec2"
public_subnet_id = "subnet-0e3164b9400be820d"
private_subnet_ids = [
  "subnet-0a51cc8ab7b636a8f",
  "subnet-074a3e5c344df5111",
]
vpc_endpoint_id = "vpce-01bd0ead8b8be92a0"

postgres_instance_class = "db.t2.micro"

ssh_public_key_path = "~/.ssh/dev-ssh_key_pair.pub"

resolver_admin_nibble_mutation_lambda_name = "resolver_admin_nibble_mutation"
resolver_admin_nibble_mutation_lambda_artifact = "resolver_admin_nibble_mutation-fdcb77f601.zip"
migrate_database_lambda_name = "migrate_database"
migrate_database_lambda_artifact = "migrate_database-d936d73da0.zip"
resolver_admin_restaurant_mutation_lambda_name = "resolver_admin_restaurant_mutation"
resolver_admin_restaurant_mutation_lambda_artifact = "resolver_admin_restaurant_mutation-5c2030b67e.zip"
db_utilities_lambda_name = "db_utilities"
db_utilities_lambda_artifact = "db_utilities-445e94ad99.zip"
add_user_lambda_name = "add_user"
add_user_lambda_artifact = "add_user-cfab0b4509.zip"
resolver_user_info_lambda_name = "resolver_user_info"
resolver_user_info_lambda_artifact = "resolver_user_info-7cb8d9d892.zip"
resolver_restaurant_lambda_name = "resolver_restaurant"
resolver_restaurant_lambda_artifact = "resolver_restaurant-9ce0f5ffc5.zip"
resolver_restaurant_distance_lambda_name = "resolver_restaurant_distance"
resolver_restaurant_distance_lambda_artifact = "resolver_restaurant_distance-d6ae7a81e1.zip"
resolver_nibble_lambda_name = "resolver_nibble"
resolver_nibble_lambda_artifact = "resolver_nibble-b26dc93dd9.zip"
resolver_nibble_history_lambda_name = "resolver_nibble_history"
resolver_nibble_history_lambda_artifact = "resolver_nibble_history-3d09125d94.zip"
resolver_nibble_reservation_lambda_name = "resolver_nibble_reservation"
resolver_nibble_reservation_lambda_artifact = "resolver_nibble_reservation-02646b4b21.zip"
resolver_image_upload_url_lambda_name = "resolver_image_upload_url"
resolver_image_upload_url_lambda_artifact = "resolver_image_upload_url-19c732a283.zip"

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
resolver_admin_nibble_mutation_lambda_artifact = "resolver_admin_nibble_mutation-065183efe3.zip"
migrate_database_lambda_name = "migrate_database"
migrate_database_lambda_artifact = "migrate_database-d936d73da0.zip"
resolver_admin_restaurant_mutation_lambda_name = "resolver_admin_restaurant_mutation"
resolver_admin_restaurant_mutation_lambda_artifact = "resolver_admin_restaurant_mutation-0ed80659fb.zip"
db_utilities_lambda_name = "db_utilities"
db_utilities_lambda_artifact = "db_utilities-3e98c6255d.zip"
add_user_lambda_name = "add_user"
add_user_lambda_artifact = "add_user-7fa2573cb3.zip"
resolver_user_info_lambda_name = "resolver_user_info"
resolver_user_info_lambda_artifact = "resolver_user_info-cb49bf3e29.zip"
resolver_restaurant_lambda_name = "resolver_restaurant"
resolver_restaurant_lambda_artifact = "resolver_restaurant-4fbc7912ec.zip"
resolver_restaurant_distance_lambda_name = "resolver_restaurant_distance"
resolver_restaurant_distance_lambda_artifact = "resolver_restaurant_distance-5f48f9acab.zip"
resolver_nibble_lambda_name = "resolver_nibble"
resolver_nibble_lambda_artifact = "resolver_nibble-4a578027c4.zip"
resolver_nibble_history_lambda_name = "resolver_nibble_history"
resolver_nibble_history_lambda_artifact = "resolver_nibble_history-6790393167.zip"
resolver_nibble_reservation_lambda_name = "resolver_nibble_reservation"
resolver_nibble_reservation_lambda_artifact = "resolver_nibble_reservation-8dc56266f3.zip"

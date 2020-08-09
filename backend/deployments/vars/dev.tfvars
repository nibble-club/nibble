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
elasticsearch_instance_class = "t2.small.elasticsearch"
elasticsearch_master_instance_class = "t2.small.elasticsearch"

ssh_public_key_path = "~/.ssh/dev-ssh_key_pair.pub"

resolver_admin_nibble_mutation_lambda_name = "resolver_admin_nibble_mutation"
resolver_admin_nibble_mutation_lambda_artifact = "resolver_admin_nibble_mutation-a29eca5b55.zip"
migrate_database_lambda_name = "migrate_database"
migrate_database_lambda_artifact = "migrate_database-d936d73da0.zip"
resolver_admin_restaurant_mutation_lambda_name = "resolver_admin_restaurant_mutation"
resolver_admin_restaurant_mutation_lambda_artifact = "resolver_admin_restaurant_mutation-793b4a4670.zip"
db_utilities_lambda_name = "db_utilities"
db_utilities_lambda_artifact = "db_utilities-86b8bb902b.zip"
add_user_lambda_name = "add_user"
add_user_lambda_artifact = "add_user-790f8d24dd.zip"
resolver_user_info_lambda_name = "resolver_user_info"
resolver_user_info_lambda_artifact = "resolver_user_info-118e0140dd.zip"
resolver_restaurant_lambda_name = "resolver_restaurant"
resolver_restaurant_lambda_artifact = "resolver_restaurant-b66f48177a.zip"
resolver_restaurant_distance_lambda_name = "resolver_restaurant_distance"
resolver_restaurant_distance_lambda_artifact = "resolver_restaurant_distance-46f20a8430.zip"
resolver_nibble_lambda_name = "resolver_nibble"
resolver_nibble_lambda_artifact = "resolver_nibble-c0346f62e9.zip"
resolver_nibble_history_lambda_name = "resolver_nibble_history"
resolver_nibble_history_lambda_artifact = "resolver_nibble_history-8a8e15522f.zip"
resolver_nibble_reservation_lambda_name = "resolver_nibble_reservation"
resolver_nibble_reservation_lambda_artifact = "resolver_nibble_reservation-91b958586d.zip"
resolver_image_upload_url_lambda_name = "resolver_image_upload_url"
resolver_image_upload_url_lambda_artifact = "resolver_image_upload_url-c68b038f4a.zip"
migrate_elasticsearch_lambda_name = "migrate_elasticsearch"
migrate_elasticsearch_lambda_artifact = "migrate_elasticsearch-e0004ec218.zip"
resolver_closest_restaurants_lambda_name = "resolver_closest_restaurants"
resolver_closest_restaurants_lambda_artifact = "resolver_closest_restaurants-bfe66a29f7.zip"
resolver_search_lambda_name = "resolver_search"
resolver_search_lambda_artifact = "resolver_search-489d213ccd.zip"
resolver_recent_searches_lambda_name = "resolver_recent_searches"
resolver_recent_searches_lambda_artifact = "resolver_recent_searches-64f5938b54.zip"

aws_region = "us-west-2"
aws_profile = "nibble-deploy"
aws_target_account_id = "018002986064"
environment = "qa"

vpc_id = "vpc-0ccd4611785a9a2bb"
public_subnet_id = "subnet-0b4b92fd9281d541b"
private_subnet_ids = [
  "subnet-0fe2f56efed741610",
  "subnet-0dd79a5131defba7f",
]
vpc_endpoint_id = "vpce-034304dfd95a2aebb"
route53_zone_id = "Z09681113G8LJGJABLD8A"

postgres_instance_class = "db.t2.micro"

ssh_public_key_path = "~/.ssh/dev-ssh_key_pair.pub"

add_user_lambda_name = "add_user"
add_user_lambda_artifact = "add_user-ea7160c4c4.zip"
db_utilities_lambda_name = "db_utilities"
db_utilities_lambda_artifact = "db_utilities-5161211d4b.zip"
migrate_database_lambda_name = "migrate_database"
migrate_database_lambda_artifact = "migrate_database-d936d73da0.zip"
migrate_elasticsearch_lambda_name = "migrate_elasticsearch"
migrate_elasticsearch_lambda_artifact = "migrate_elasticsearch-25b57f1398.zip"
resolver_admin_nibble_mutation_lambda_name = "resolver_admin_nibble_mutation"
resolver_admin_nibble_mutation_lambda_artifact = "resolver_admin_nibble_mutation-1504aede13.zip"
resolver_admin_restaurant_mutation_lambda_name = "resolver_admin_restaurant_mutation"
resolver_admin_restaurant_mutation_lambda_artifact = "resolver_admin_restaurant_mutation-d133501213.zip"
resolver_closest_restaurants_lambda_name = "resolver_closest_restaurants"
resolver_closest_restaurants_lambda_artifact = "resolver_closest_restaurants-a880511ea9.zip"
resolver_image_upload_url_lambda_name = "resolver_image_upload_url"
resolver_image_upload_url_lambda_artifact = "resolver_image_upload_url-30e5704a33.zip"
resolver_location_for_postal_code_lambda_name = "resolver_location_for_postal_code"
resolver_location_for_postal_code_lambda_artifact = "resolver_location_for_postal_code-e7d336454b.zip"
resolver_nibble_lambda_name = "resolver_nibble"
resolver_nibble_lambda_artifact = "resolver_nibble-138e2e3ecc.zip"
resolver_nibble_history_lambda_name = "resolver_nibble_history"
resolver_nibble_history_lambda_artifact = "resolver_nibble_history-85482b689e.zip"
resolver_nibble_reservation_lambda_name = "resolver_nibble_reservation"
resolver_nibble_reservation_lambda_artifact = "resolver_nibble_reservation-e6bc281668.zip"
resolver_nibbles_with_property_lambda_name = "resolver_nibbles_with_property"
resolver_nibbles_with_property_lambda_artifact = "resolver_nibbles_with_property-78d19802c9.zip"
resolver_recent_searches_lambda_name = "resolver_recent_searches"
resolver_recent_searches_lambda_artifact = "resolver_recent_searches-64f5938b54.zip"
resolver_restaurant_lambda_name = "resolver_restaurant"
resolver_restaurant_lambda_artifact = "resolver_restaurant-faf679b197.zip"
resolver_restaurant_distance_lambda_name = "resolver_restaurant_distance"
resolver_restaurant_distance_lambda_artifact = "resolver_restaurant_distance-87c7a9a9a5.zip"
resolver_search_lambda_name = "resolver_search"
resolver_search_lambda_artifact = "resolver_search-3a30bce03a.zip"
resolver_update_user_lambda_name = "resolver_update_user"
resolver_update_user_lambda_artifact = "resolver_update_user-dd009d0ed8.zip"
resolver_user_info_lambda_name = "resolver_user_info"
resolver_user_info_lambda_artifact = "resolver_user_info-3f7bdf5702.zip"

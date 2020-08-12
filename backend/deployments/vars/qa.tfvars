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

resolver_admin_nibble_mutation_lambda_name = "resolver_admin_nibble_mutation"
resolver_admin_nibble_mutation_lambda_artifact = "resolver_admin_nibble_mutation-4e8b69e3c0.zip"
migrate_database_lambda_name = "migrate_database"
migrate_database_lambda_artifact = "migrate_database-3ebd831858.zip"

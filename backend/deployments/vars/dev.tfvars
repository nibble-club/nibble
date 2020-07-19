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

resolver_admin_create_nibble_lambda_name = "resolver_admin_create_nibble"
resolver_admin_create_nibble_lambda_artifact = "resolver_admin_create_nibble-4e8b69e3c0.zip"
migrate_database_lambda_name = "migrate_database"
migrate_database_lambda_artifact = "migrate_database-3ebd831858.zip"

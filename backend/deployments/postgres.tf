resource aws_db_instance postgres {
  instance_class            = var.postgres_instance_class
  allocated_storage         = 20
  storage_type              = "gp2"
  engine                    = "postgres"
  engine_version            = "12.3"
  name                      = replace("${var.environment_namespace}postgresdb", "/(-|_)/", "") # clear hyphens and underscores
  username                  = "nibble"
  password                  = data.aws_ssm_parameter.postgres_password.value
  port                      = 5432
  db_subnet_group_name      = aws_db_subnet_group.postgres_subnets.name
  identifier                = replace(var.environment_namespace, "_", "-")
  final_snapshot_identifier = replace("${var.environment_namespace}-final-snapshot", "_", "-")
  apply_immediately         = true
  vpc_security_group_ids    = [aws_security_group.postgres_security_group.id]
}

resource aws_db_subnet_group postgres_subnets {
  name       = "${var.environment_namespace}-postgres_subnet_group"
  subnet_ids = var.private_subnet_ids
  tags = {
    Name = "${var.environment_namespace}-postgres_subnet_group"
  }
}
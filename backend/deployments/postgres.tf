resource aws_db_instance postgres {
  allocated_storage               = 20
  apply_immediately               = true
  backup_window                   = "09:45-10:16"
  backup_retention_period         = 7
  db_subnet_group_name            = aws_db_subnet_group.postgres_subnets.name
  engine                          = "postgres"
  engine_version                  = "12.3"
  final_snapshot_identifier       = replace("${var.environment_namespace}-final-snapshot", "_", "-")
  identifier                      = replace(var.environment_namespace, "_", "-")
  instance_class                  = var.postgres_instance_class
  name                            = replace("${var.environment_namespace}postgresdb", "/(-|_)/", "") # clear hyphens and underscores
  password                        = data.aws_ssm_parameter.postgres_password.value
  performance_insights_enabled    = true
  performance_insights_kms_key_id = data.aws_kms_key.account_key.arn
  port                            = 5432
  storage_type                    = "gp2"
  username                        = "nibble"
  vpc_security_group_ids          = [aws_security_group.postgres_security_group.id]
}

resource aws_db_subnet_group postgres_subnets {
  name       = "${var.environment_namespace}-postgres_subnet_group"
  subnet_ids = var.private_subnet_ids
  tags = {
    Name = "${var.environment_namespace}-postgres_subnet_group"
  }
}

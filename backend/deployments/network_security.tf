# define security groups

# ssh access; use security group rules to avoid circular dependencies
resource aws_security_group ssh_security_group {
  name        = "${var.environment_namespace}-ssh_security_group"
  description = "Used to allow SSH instance access to various resources"
  vpc_id      = data.aws_vpc.vpc.id
  tags = {
    Name = "${var.environment_namespace}-ssh_security_group"
  }
}

resource aws_security_group_rule allow_ssh_in {
  from_port         = 22
  protocol          = "tcp"
  to_port           = 22
  type              = "ingress"
  description       = "Allow all incoming SSH connections (authentication happens on instance)"
  cidr_blocks       = [local.ALL_IP_ADDRESSES]
  security_group_id = aws_security_group.ssh_security_group.id
}

resource aws_security_group_rule allow_ssh_to_postgres {
  from_port         = 5432
  protocol          = "tcp"
  to_port           = 5432
  description       = "Allow SSH to Postgres access"
  type              = "egress"
  security_group_id = aws_security_group.ssh_security_group.id
  # actually the destination in the case of egress
  source_security_group_id = aws_security_group.postgres_security_group.id
}

resource aws_security_group_rule allow_ssh_to_redis {
  from_port         = 6379
  protocol          = "tcp"
  to_port           = 6379
  description       = "Allow SSH to Redis access"
  type              = "egress"
  security_group_id = aws_security_group.ssh_security_group.id
  # actually the destination in the case of egress
  source_security_group_id = aws_security_group.redis_security_group.id
}

resource aws_security_group_rule allow_ssh_to_internet {
  from_port         = 0
  protocol          = "-1"
  to_port           = 0
  type              = "egress"
  description       = "Allow outgoing internet access"
  cidr_blocks       = [local.ALL_IP_ADDRESSES]
  security_group_id = aws_security_group.ssh_security_group.id
}

# lambdas; use security group rules as opposed to inline here to avoid circular dependencies
resource aws_security_group lambda_security_group {
  name        = "${var.environment_namespace}-lambda_security_group"
  description = "Used to allow Lambdas access to various resources"
  vpc_id      = data.aws_vpc.vpc.id
  tags = {
    Name = "${var.environment_namespace}-lambda_security_group"
  }
}

resource aws_security_group_rule allow_lambda_to_postgres {
  from_port         = 5432
  to_port           = 5432
  protocol          = "tcp"
  type              = "egress"
  description       = "Lambda to Postgres permission"
  security_group_id = aws_security_group.lambda_security_group.id
  # actually the destination in the case of egress
  source_security_group_id = aws_security_group.postgres_security_group.id
}

resource aws_security_group_rule allow_lambda_to_redis {
  from_port         = 6379
  to_port           = 6379
  protocol          = "tcp"
  type              = "egress"
  description       = "Lambda to Redis permission"
  security_group_id = aws_security_group.lambda_security_group.id
  # actually destination
  source_security_group_id = aws_security_group.redis_security_group.id
}

resource aws_security_group_rule allow_lambda_to_s3 {
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  type              = "egress"
  description       = "Lambda to S3 permission"
  cidr_blocks       = data.aws_vpc_endpoint.s3_access_endpoint.cidr_blocks
  security_group_id = aws_security_group.lambda_security_group.id
}

resource aws_security_group_rule allow_lambda_to_sqs {
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  type              = "egress"
  description       = "Lambda to SQS permission via VPC endpoint"
  security_group_id = aws_security_group.lambda_security_group.id
  # actually destination
  source_security_group_id = aws_security_group.sqs_security_group.id
}

resource aws_security_group lambda_internet_access_security_group {
  name        = "${var.environment_namespace}-lambda_internet_access_security_group"
  description = "Used to allow Lambdas access to internet"
  vpc_id      = data.aws_vpc.vpc.id
  tags = {
    Name = "${var.environment_namespace}-lambda_internet_access_security_group"
  }
  egress {
    from_port   = 0
    protocol    = "-1"
    to_port     = 0
    cidr_blocks = [local.ALL_IP_ADDRESSES]
  }
}

# postgres
resource aws_security_group postgres_security_group {
  name        = "${var.environment_namespace}-postgres_security_group"
  description = "Permissions to allow access to Postgres instance"
  vpc_id      = data.aws_vpc.vpc.id
  ingress {
    description     = "Access from Lambdas and SSH"
    from_port       = 5432
    protocol        = "tcp"
    to_port         = 5432
    security_groups = [aws_security_group.lambda_security_group.id, aws_security_group.ssh_security_group.id]
  }
  tags = {
    Name = "${var.environment_namespace}-postgres_security_group"
  }
}

# redis
resource aws_security_group redis_security_group {
  name        = "${var.environment_namespace}-redis_security_group"
  description = "Permissions to allow access to Redis instance"
  vpc_id      = data.aws_vpc.vpc.id
  ingress {
    description     = "Access from Lambdas and SSH"
    from_port       = 6379
    protocol        = "tcp"
    to_port         = 6379
    security_groups = [aws_security_group.lambda_security_group.id, aws_security_group.ssh_security_group.id]
  }
  tags = {
    Name = "${var.environment_namespace}-redis_security_group"
  }
}

# sqs
resource aws_security_group sqs_security_group {
  name        = "${var.environment_namespace}-sqs_security_group"
  description = "Allows resources to access SQS, via VPC endpoint (interface type)"
  vpc_id      = data.aws_vpc.vpc.id
  ingress {
    description     = "Allow access from Lambdas"
    from_port       = 0
    protocol        = "-1"
    to_port         = 0
    security_groups = [aws_security_group.lambda_security_group.id]
  }
  tags = {
    Name = "${var.environment_namespace}-sqs_security_group"
  }
}

# elasticsearch
//resource aws_security_group elasticsearch_security_group {
//  name = "${var.environment_namespace}-elasticsearch_security_group"
//  description = "Allows resources to access Elasticsearch"
//  vpc_id = data.aws_vpc.vpc.id
//
//  tags = {
//    Name = "${var.environment_namespace}-elasticsearch_security_group"
//  }
//
//}

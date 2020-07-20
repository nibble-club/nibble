data aws_ami ubuntu {
  most_recent = "true"

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"]
}

resource aws_key_pair ssh_access_key {
  key_name   = "${var.environment_namespace}-ssh_key_pair"
  public_key = file(var.ssh_public_key_path)
}

resource aws_instance ssh_instance {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t2.micro"
  key_name                    = aws_key_pair.ssh_access_key.key_name
  vpc_security_group_ids      = [aws_security_group.ssh_security_group.id]
  subnet_id                   = var.public_subnet_id
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.db_schema_fetcher.name

  user_data = templatefile("ssh_bootstrap.sh", {
    redis_address = aws_elasticache_cluster.redis.cache_nodes[0].address
    redis_port    = aws_elasticache_cluster.redis.cache_nodes[0].port
    db_address    = aws_db_instance.postgres.address,
    db_port       = aws_db_instance.postgres.port,
    db_name       = aws_db_instance.postgres.name
    db_username   = aws_db_instance.postgres.username,
    db_password   = aws_db_instance.postgres.password
  })
  tags = {
    Name = "${var.environment_namespace}-ssh_instance"
  }
}

# database schema deployment resources
resource aws_iam_role db_schema_fetcher {
  name                 = "${var.environment_namespace}-db_schema_fetcher"
  assume_role_policy   = data.aws_iam_policy_document.db_schema_fetcher_assume_role.json
  permissions_boundary = local.permissions_boundary_arn
}

data aws_iam_policy_document db_schema_fetcher_assume_role {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      identifiers = ["ec2.amazonaws.com"]
      type        = "Service"
    }
  }
}

data aws_iam_policy_document db_schema_fetcher {
  statement {
    actions = [
      "s3:Get*",
      "s3:List*"
    ]
    effect    = "Allow"
    resources = [data.aws_s3_bucket.db_schemas.arn]
  }
}

resource aws_iam_policy db_schema_fetcher {
  name   = "${var.environment_namespace}-db_schema_fetcher"
  policy = data.aws_iam_policy_document.db_schema_fetcher.json
}

resource aws_iam_role_policy_attachment db_schema_fetcher {
  role       = aws_iam_role.db_schema_fetcher.name
  policy_arn = aws_iam_policy.db_schema_fetcher.arn
}

resource aws_iam_instance_profile db_schema_fetcher {
  name = "${var.environment_namespace}-db_schema_fetcher"
  role = aws_iam_role.db_schema_fetcher.name
}
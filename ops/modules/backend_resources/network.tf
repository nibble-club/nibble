resource aws_vpc vpc {
  cidr_block           = var.vpc_cidr_block
  enable_dns_hostnames = true
  tags = {
    Name = "${var.environment_namespace}-vpc"
  }
}

data aws_availability_zones available {}

resource aws_subnet private_subnets {
  count             = var.private_subnet_count
  vpc_id            = aws_vpc.vpc.id
  availability_zone = data.aws_availability_zones.available.names[count.index]
  cidr_block        = cidrsubnet(aws_vpc.vpc.cidr_block, 8, count.index)
  tags = {
    Name = "${var.environment_namespace}-private_subnet_${data.aws_availability_zones.available.names[count.index]}"
  }
}

resource aws_subnet public_subnet {
  vpc_id                  = aws_vpc.vpc.id
  availability_zone       = data.aws_availability_zones.available.names[0]
  cidr_block              = cidrsubnet(aws_vpc.vpc.cidr_block, 8, var.private_subnet_count)
  map_public_ip_on_launch = true
  tags = {
    Name = "${var.environment_namespace}-public_subnet_${data.aws_availability_zones.available.names[0]}"
  }
}

# internet access for public subnet
resource aws_route_table public_route_table {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block = local.ALL_IP_ADDRESSES
    gateway_id = aws_internet_gateway.public_internet_gateway.id
  }
  tags = {
    Name = "${var.environment_namespace}-public_route_table"
  }
}

resource aws_route_table_association public_internet_association {
  route_table_id = aws_route_table.public_route_table.id
  subnet_id      = aws_subnet.public_subnet.id
}

resource aws_internet_gateway public_internet_gateway {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "${var.environment_namespace}-public_internet_gateway"
  }
}

# nat gateway for private subnets' internet
resource aws_eip nat_eip {
  vpc = true
  tags = {
    Name = "${var.environment_namespace}-nat_gateway_eip"
  }
  depends_on = [aws_vpc.vpc]
}

resource aws_nat_gateway private_subnet_internet_access {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_subnet.id
  depends_on    = [aws_internet_gateway.public_internet_gateway]
  tags = {
    Name = "${var.environment_namespace}-nat_gateway"
  }
}

# gateway endpoint to allow access to S3
resource aws_vpc_endpoint s3_access_endpoint {
  vpc_endpoint_type = "Gateway"
  vpc_id            = aws_vpc.vpc.id
  service_name      = "com.amazonaws.${data.aws_region.current.name}.s3"
  route_table_ids   = [aws_route_table.private_route_table.id]
}

# route private subnets to NAT gateway
resource aws_route_table private_route_table {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block     = local.ALL_IP_ADDRESSES
    nat_gateway_id = aws_nat_gateway.private_subnet_internet_access.id
  }
  tags = {
    Name = "${var.environment_namespace}-private_route_table"
  }
}

resource aws_route_table_association private_subnet_associations {
  count          = var.private_subnet_count
  route_table_id = aws_route_table.private_route_table.id
  subnet_id      = aws_subnet.private_subnets[count.index].id
}

# log network activity
resource aws_flow_log vpc_activity {
  iam_role_arn    = aws_iam_role.flow_log.arn
  log_destination = aws_cloudwatch_log_group.vpc_network_activity.arn
  traffic_type    = "ALL"
  vpc_id          = aws_vpc.vpc.id
}

resource aws_cloudwatch_log_group vpc_network_activity {
  name              = "/network/${var.environment_namespace}-vpc_network_activity"
  retention_in_days = 30
}

# permissions for logging
resource aws_iam_role flow_log {
  name                 = "${var.environment_namespace}-flow_log_role"
  assume_role_policy   = data.aws_iam_policy_document.flow_log_assume_role.json
  permissions_boundary = local.boundary_arn
}

data aws_iam_policy_document flow_log_assume_role {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      identifiers = ["vpc-flow-logs.amazonaws.com"]
      type        = "Service"
    }
  }
}

data aws_iam_policy_document flow_log_permissions {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams"
    ]
    effect = "Allow"
    resources = [
      "*"
    ]
  }
}

resource aws_iam_policy flow_log {
  name   = "${var.environment_namespace}-flow_log"
  policy = data.aws_iam_policy_document.flow_log_permissions.json
}

resource aws_iam_role_policy_attachment flow_log {
  policy_arn = aws_iam_policy.flow_log.arn
  role       = aws_iam_role.flow_log.name
}
resource aws_sqs_queue cancelled_reservations {
  name = "${var.environment_namespace}-cancelled_reservations"
}

resource aws_sqs_queue email_notifications {
  name = "${var.environment_namespace}-email_notifications"
}


resource aws_vpc_endpoint sqs_access_endpoint {
  vpc_endpoint_type   = "Interface"
  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${data.aws_region.current.name}.sqs"
  private_dns_enabled = true
  subnet_ids          = var.private_subnet_ids
  security_group_ids  = [aws_security_group.sqs_security_group.id]
}

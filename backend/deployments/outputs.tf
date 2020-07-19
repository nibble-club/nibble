output ssh_instance_address {
  value = aws_instance.ssh_instance.public_dns
}
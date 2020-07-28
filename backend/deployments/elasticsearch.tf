//resource aws_elasticsearch_domain {
//  domain_name = replace("${var.environment_namespace}-elasticsearch", "_", "-")
//  elasticsearch_version = "7.7"
//
//  vpc_options {
//    subnet_ids = var.private_subnet_ids
//    security_group_ids = []
//  }
//}
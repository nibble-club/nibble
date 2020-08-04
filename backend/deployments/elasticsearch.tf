resource aws_elasticsearch_domain elasticsearch {
  domain_name           = replace("${var.environment_namespace}-elasticsearch", "_", "-")
  elasticsearch_version = "7.7"

  advanced_options = {
    "rest.action.multi.allow_explicit_index" = "true"
  }

  cluster_config {
    instance_type            = var.elasticsearch_instance_class
    instance_count           = 2 * length(var.private_subnet_ids)
    zone_awareness_enabled   = true
    dedicated_master_enabled = true
    dedicated_master_type    = var.elasticsearch_master_instance_class
    dedicated_master_count   = 3
    warm_enabled             = false
    zone_awareness_config {
      availability_zone_count = length(var.private_subnet_ids)
    }
  }

  domain_endpoint_options {
    enforce_https       = true
    tls_security_policy = "Policy-Min-TLS-1-2-2019-07"
  }

  log_publishing_options {
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.elasticsearch.arn
    log_type                 = "SEARCH_SLOW_LOGS"
  }

  vpc_options {
    subnet_ids = var.private_subnet_ids
    security_group_ids = [
      aws_security_group.elasticsearch_security_group.id
    ]
  }

  ebs_options {
    ebs_enabled = true
    volume_type = "gp2"
    volume_size = 10
  }

  tags = {
    Name = replace("${var.environment_namespace}-elasticsearch", "_", "-")
  }

  depends_on = [aws_iam_service_linked_role.elasticsearch]
}

resource aws_iam_service_linked_role elasticsearch {
  aws_service_name = "es.amazonaws.com"
}

resource aws_elasticsearch_domain_policy elasticsearch {
  domain_name     = aws_elasticsearch_domain.elasticsearch.domain_name
  access_policies = data.aws_iam_policy_document.elasticsearch_access.json
}

data aws_iam_policy_document elasticsearch_access {
  // lambda access
  statement {
    effect = "Allow"
    principals {
      identifiers = [
        aws_iam_role.resolver_admin_restaurant_mutation.arn,
        aws_iam_role.resolver_admin_nibble_mutation.arn,
      ]
      type = "AWS"
    }
    actions = ["es:ESHttpPut"]
    resources = [
      "${aws_elasticsearch_domain.elasticsearch.arn}/*"
    ]
  }

  // allow developer access
  statement {
    effect = "Allow"
    principals {
      identifiers = [
        "arn:aws:iam::${var.aws_target_account_id}:role/job-function/development/developer",
        "arn:aws:iam::${var.aws_target_account_id}:role/admin/deployment",
        "arn:aws:iam::${var.aws_target_account_id}:role/admin/full-access",
      ]
      type = "AWS"
    }
    resources = [
      "${aws_elasticsearch_domain.elasticsearch.arn}/*"
    ]
  }

  // open access
  //  statement {
  //    effect = "Allow"
  //    principals {
  //      identifiers = ["*"]
  //      type        = "AWS"
  //    }
  //    resources = [
  //      "${aws_elasticsearch_domain.elasticsearch.arn}/*"
  //    ]
  //  }
}

resource aws_cloudwatch_log_group elasticsearch {
  name = "/aws/elasticsearch/${var.environment_namespace}-elasticsearch"
}

data aws_iam_policy_document elasticsearch_logs {
  statement {
    effect = "Allow"
    principals {
      identifiers = ["es.amazonaws.com"]
      type        = "Service"
    }
    actions = [
      "logs:PutLogEvents",
      "logs:PutLogEventsBatch",
      "logs:CreateLogStream",
    ]
    resources = [
      "arn:aws:logs:*",
    ]
  }
}

resource aws_cloudwatch_log_resource_policy elasticsearch {
  policy_name     = "${var.environment_namespace}-elasticsearch_logs"
  policy_document = data.aws_iam_policy_document.elasticsearch_logs.json
}

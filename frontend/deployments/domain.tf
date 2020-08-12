data aws_ssm_parameter domain_name {
  name = "${local.frontend_deploy_var_namespace}/domain_name"
}

data aws_route53_zone domain {
  name = data.aws_ssm_parameter.domain_name.value
}

resource heroku_domain frontend {
  app      = heroku_app.frontend.id
  hostname = "${local.subdomain_name}.${trimsuffix(data.aws_route53_zone.domain.name, ".")}"
}

resource aws_route53_record frontend {
  name    = local.subdomain_name
  type    = "CNAME"
  zone_id = data.aws_route53_zone.domain.id
  ttl     = 60
  records = [heroku_domain.frontend.cname]
}

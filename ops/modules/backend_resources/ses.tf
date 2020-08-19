data aws_route53_zone domain {
  zone_id = var.route53_zone_id
}

resource aws_ses_domain_identity env_domain {
  domain = trimsuffix(data.aws_route53_zone.domain.name, ".")
}

resource aws_route53_record ses_verification_record {
  zone_id = data.aws_route53_zone.domain.zone_id
  name    = "_amazonses.${aws_ses_domain_identity.env_domain.domain}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.env_domain.verification_token]
}

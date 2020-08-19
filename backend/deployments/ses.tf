resource aws_ses_email_identity default {
  email = "hello${var.environment == "prod" ? "" : "+${var.environment_namespace}"}@nibble.club"
}

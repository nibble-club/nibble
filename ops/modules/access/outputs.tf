output aws_iam_policy_account_secret_arn {
  value = aws_iam_policy.account_secret.arn
}

output aws_iam_policy_account_encryption_arn {
  value = aws_iam_policy.account_encryption.arn
}

output aws_iam_role_deployment_arn {
  value = aws_iam_role.deployment.arn
}

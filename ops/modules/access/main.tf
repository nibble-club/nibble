## Things created here must be denied by boundary policy

resource aws_iam_account_password_policy strict {
  allow_users_to_change_password = true
  max_password_age               = 60
  minimum_password_length        = 20
  password_reuse_prevention      = 24
  require_lowercase_characters   = true
  require_numbers                = true
  require_symbols                = true
  require_uppercase_characters   = true
}

# account encryption key

resource aws_kms_key account {
  description             = "Account-wide encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = {
    Terraformed = "ops/modules/access"
    Resource    = "aws_kms_key.account"
    Purpose     = "Account-wide security"
  }
}

resource aws_kms_alias account {
  name          = "alias/account-key"
  target_key_id = aws_kms_key.account.key_id
}

data aws_iam_policy_document account_secret {
  statement {
    effect = "Allow"
    actions = [
      "kms:Decrypt",
      "kms:DescribeKey",
      "kms:Encrypt",
      "kms:ListAliases",
      "kms:ListGrants",
      "kms:ListKeys",
      "kms:ListResourceTags",
      "kms:ReEncryptFrom",
      "kms:ReEncryptTo",
      "kms:Sign",
      "kms:Verify",
    ]

    resources = [
      aws_kms_key.account.arn,
      aws_kms_alias.account.arn,
    ]
  }
}

resource aws_iam_policy account_secret {
  name        = "account_security"
  path        = "/account/secret/"
  description = "Full access to account-wide secrets"
  policy      = data.aws_iam_policy_document.account_secret.json
}

data aws_iam_policy_document account_encrypt {
  statement {
    effect = "Allow"
    actions = [
      "kms:DescribeKey",
      "kms:Encrypt",
      "kms:ListAliases",
      "kms:ListGrants",
      "kms:ListKeys",
      "kms:ListResourceTags",
      "kms:ReEncryptFrom",
      "kms:ReEncryptTo",
      "kms:Sign",
      "kms:Verify",
    ]
    resources = [
      aws_kms_key.account.arn,
      aws_kms_alias.account.arn,
    ]
  }
}

resource aws_iam_policy account_encryption {
  name        = "account_security_encrypt"
  path        = "/account/encrypt/"
  description = "Used only for encryption, does not allow decryption."
  policy      = data.aws_iam_policy_document.account_encrypt.json
}

# roles and policies for deployment

resource aws_iam_policy boundary {
  name   = "permissions_boundary"
  path   = "/admin/"
  policy = var.boundary_json
}

data aws_iam_policy_document assume {
  statement {
    actions = [
      "sts:AssumeRole",
    ]
    principals {
      identifiers = [
        local.accounts["nibble-security"]
      ]
      type = "AWS"
    }
    principals {
      identifiers = ["ec2.amazonaws.com"]
      type        = "Service"
    }
  }
}

resource aws_iam_role deployment {
  name                 = "deployment"
  path                 = "/admin/"
  max_session_duration = 28800
  assume_role_policy   = data.aws_iam_policy_document.assume.json
  permissions_boundary = aws_iam_policy.boundary.arn

  tags = {
    Terraformed = "ops/modules/access"
    Resource    = "aws_iam_role.deployment"
    Purpose     = "Account deployments"
  }
}

resource aws_iam_role_policy_attachment deployment {
  role       = aws_iam_role.deployment.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource aws_iam_instance_profile deployment {
  name = "deployment"
  role = aws_iam_role.deployment.name
}

# roles and policies for development

resource aws_iam_role developer {
  name                 = "developer"
  path                 = "/job-function/development/"
  max_session_duration = 43200
  assume_role_policy   = data.aws_iam_policy_document.assume.json
  permissions_boundary = aws_iam_policy.boundary.arn

  tags = {
    Terraformed = "ops/modules/access"
    Resource    = "aws_iam_role.development"
    Purpose     = "Developer access"
  }
}

resource aws_iam_role_policy_attachment developer {
  role       = aws_iam_role.developer.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

# full access

resource aws_iam_role admin_full {
  name                 = "full-access"
  path                 = "/admin/"
  max_session_duration = 28800
  assume_role_policy   = data.aws_iam_policy_document.assume.json

  tags = {
    Terraformed = "ops/modules/access"
    Resource    = "aws_iam_role.admin_full"
    Purpose     = "Account admin access"
  }
}

resource aws_iam_role_policy_attachment admin_full {
  role       = aws_iam_role.admin_full.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

# billing access

resource aws_iam_role billing_admin {
  name                 = "billing-admin"
  path                 = "/job-function/billing/"
  max_session_duration = 28800
  assume_role_policy   = data.aws_iam_policy_document.assume.json

  tags = {
    Terraformed = "ops/modules/access"
    Resource    = "aws_iam_role.billing_admin"
    Purpose     = "Billing admin access"
  }
}

resource aws_iam_role_policy_attachment billing_admin {
  role       = aws_iam_role.billing_admin.name
  policy_arn = "arn:aws:iam::aws:policy/job-function/Billing"
}

resource aws_iam_role_policy_attachment billing_readonly {
  role       = aws_iam_role.billing_admin.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess"
}

# full read-only access
resource aws_iam_role admin_full_read_only {
  name                 = "full-read-only-access"
  path                 = "/admin/"
  max_session_duration = 28800
  assume_role_policy   = data.aws_iam_policy_document.assume.json

  tags = {
    Terraformed = "ops/modules/access"
    Resource    = "aws_iam_role.admin_full_read_only"
    Purpose     = "Full read-only admin access"
  }
}

resource aws_iam_role_policy_attachment admin_full_read_only {
  role       = aws_iam_role.admin_full_read_only.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

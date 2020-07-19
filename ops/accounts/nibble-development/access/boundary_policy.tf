data aws_iam_policy_document boundary {
  statement {
    effect    = "Allow"
    resources = ["*"]
    actions   = ["*"]
  }

  # deny access to things related to roles
  statement {
    effect    = "Deny"
    resources = ["*"]
    actions = [
      "iam:CreateUser",
      "iam:CreateRole",
      "iam:Put*PermissionsBoundary",
    ]

    # unless they're using this permissions boundary
    # this means you can only do the above changes if you're using
    # this permissions boundary
    condition {
      test     = "StringNotEquals"
      variable = "iam:PermissionsBoundary"
      values   = [local.boundary_arn]
    }
  }

  # read-only access to admin roles, meaning admins constrained by this
  # boundary policy cannot edit this boundary policy
  statement {
    effect = "Deny"
    not_actions = [
      "iam:Describe*",
      "iam:List*",
      "iam:Get*",
    ]
    resources = [
      "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/admin/*",
      "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/job-function/*",
      "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/account/*",
      "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/admin/*",
      "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/job-function/*",
      "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/account/*",
    ]
  }

  # deny password policy changes
  statement {
    effect    = "Deny"
    resources = ["*"]
    actions = [
      "iam:UpdateAccountPasswordPolicy",
      "iam:DeleteAccountPasswordPolicy",
    ]
  }
}
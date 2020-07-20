# everyone

resource aws_iam_group everyone {
  name = "everyone"
  path = "/users/"
}

resource aws_iam_group_membership everyone {
  name  = "everyone-group-membership"
  group = aws_iam_group.everyone.name

  users = [
    aws_iam_user.a_churchill.name,
    aws_iam_user.wendy.name,
  ]
}

resource aws_iam_group_policy_attachment enable_access_key {
  group      = aws_iam_group.everyone.name
  policy_arn = aws_iam_policy.enable_access_key.arn
}

resource aws_iam_group_policy_attachment require_mfa {
  group      = aws_iam_group.everyone.name
  policy_arn = aws_iam_policy.require_mfa.arn
}

# developers

resource aws_iam_group developers {
  name = "developers"
  path = "/developers/"
}

resource aws_iam_group_membership developers {
  name  = "developers-group-membership"
  group = aws_iam_group.developers.name

  users = [
    aws_iam_user.a_churchill.name
  ]
}

data aws_iam_policy_document developers {
  statement {
    actions = [
      "sts:AssumeRole"
    ]

    resources = [
      "arn:aws:iam::${local.accounts.nibble-development}:role/job-function/development/developer"
    ]
  }
}

resource aws_iam_policy developers_assume_bounded_admin {
  name   = "assume_bounded_admin"
  path   = "/admin/"
  policy = data.aws_iam_policy_document.developers.json
}

resource aws_iam_group_policy_attachment developers_assume_bounded_admin {
  group      = aws_iam_group.developers.name
  policy_arn = aws_iam_policy.developers_assume_bounded_admin.arn
}

data aws_iam_policy_document deployment {
  statement {
    actions = [
      "sts:AssumeRole"
    ]

    resources = [
      "arn:aws:iam::${local.accounts.nibble-development}:role/admin/deployment"
    ]
  }
}

resource aws_iam_policy developers_assume_bounded_deployment {
  name   = "assume_bounded_deployment"
  path   = "/admin/"
  policy = data.aws_iam_policy_document.deployment.json
}

resource aws_iam_group_policy_attachment developers_assume_bounded_deployment {
  group      = aws_iam_group.developers.name
  policy_arn = aws_iam_policy.developers_assume_bounded_deployment.arn
}

# admins

resource aws_iam_group admins {
  name = "admins"
  path = "/"
}

resource aws_iam_group_membership admins {
  name  = "admin-membership"
  group = aws_iam_group.admins.name

  users = [
    aws_iam_user.a_churchill.name
  ]
}

data aws_iam_policy_document admin_full {
  for_each = local.accounts
  statement {
    actions = ["sts:AssumeRole"]

    resources = [
      "arn:aws:iam::${each.value}:role/admin/full-access"
    ]
  }
}

resource aws_iam_policy admin_full {
  for_each = local.accounts
  name     = "${each.value}_${each.key}_assume_full_admin"
  path     = "/admin/"
  policy   = data.aws_iam_policy_document.admin_full[each.key].json
}

resource aws_iam_group_policy_attachment admin_full {
  for_each   = local.accounts
  group      = aws_iam_group.admins.name
  policy_arn = aws_iam_policy.admin_full[each.key].arn
}

# billing

resource aws_iam_group billing {
  name = "billing"
  path = "/"
}

resource aws_iam_group_membership billing {
  name  = "billing-membership"
  group = aws_iam_group.billing.name

  users = [
    aws_iam_user.a_churchill.name,
    aws_iam_user.wendy.name,
  ]
}

data aws_iam_policy_document billing_admin {
  for_each = local.accounts

  statement {
    actions = ["sts:AssumeRole"]

    resources = [
      "arn:aws:iam::${each.value}:role/job-function/billing/billing-admin"
    ]
  }
}

resource aws_iam_policy billing_admin {
  for_each = local.accounts
  name     = "${each.value}_${each.key}_assume_billing_admin"
  path     = "/job-function/billing/"
  policy   = data.aws_iam_policy_document.billing_admin[each.key].json
}

resource aws_iam_group_policy_attachment billing_admin {
  for_each   = local.accounts
  group      = aws_iam_group.billing.name
  policy_arn = aws_iam_policy.billing_admin[each.key].arn
}

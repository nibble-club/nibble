data aws_iam_policy_document require_mfa {
  statement {
    sid       = "AllowViewAccountInfo"
    effect    = "Allow"
    resources = ["*"]
    actions = [
      "iam:ListVirtualMFADevices",
      "iam:ListUsers",
      "iam:ListMFADevices",
      "iam:GetAccountSummary",
      "iam:GetAccountPasswordPolicy",
    ]
  }

  statement {
    sid    = "AllowManageOwnPasswords"
    effect = "Allow"
    resources = [
      "arn:aws:iam::*:user/billing/$${aws:username}",
      "arn:aws:iam::*:user/admin/$${aws:username}",
      "arn:aws:iam::*:user/$${aws:username}",
    ]
    actions = [
      "iam:UpdateLoginProfile",
      "iam:GetUser",
      "iam:GetLoginProfile",
      "iam:DeleteLoginProfile",
      "iam:CreateLoginProfile",
      "iam:ChangePassword",
    ]
  }

  statement {
    sid    = "AllowManageOwnAccessKeys"
    effect = "Allow"
    resources = [
      "arn:aws:iam::*:user/billing/$${aws:username}",
      "arn:aws:iam::*:user/admin/$${aws:username}",
      "arn:aws:iam::*:user/$${aws:username}",
    ]
    actions = [
      "iam:UpdateAccessKey",
      "iam:ListAccessKeys",
      "iam:DeleteAccessKey",
      "iam:CreateAccessKey",
    ]
  }

  statement {
    sid    = "AllowManageOwnSSHPublicKeys"
    effect = "Allow"
    resources = [
      "arn:aws:iam::*:user/billing/$${aws:username}",
      "arn:aws:iam::*:user/admin/$${aws:username}",
      "arn:aws:iam::*:user/$${aws:username}",
    ]
    actions = [
      "iam:UploadSSHPublicKey",
      "iam:UpdateSSHPublicKey",
      "iam:ListSSHPublicKeys",
      "iam:GetSSHPublicKey",
      "iam:DeleteSSHPublicKey"
    ]
  }

  statement {
    sid       = "AllowManageOwnVirtualMFADevice"
    effect    = "Allow"
    resources = ["arn:aws:iam::*:mfa/$${aws:username}"]
    actions = [
      "iam:DeleteVirtualMFADevice",
      "iam:CreateVirtualMFADevice",
    ]
  }

  statement {
    sid    = "AllowManageOwnUserMFA"
    effect = "Allow"
    resources = [
      "arn:aws:iam::*:user/billing/$${aws:username}",
      "arn:aws:iam::*:user/admin/$${aws:username}",
      "arn:aws:iam::*:user/$${aws:username}",
    ]
    actions = [
      "iam:ResyncMFADevice",
      "iam:ListMFADevices",
      "iam:EnableMFADevice",
      "iam:DeactivateMFADevice",
    ]
  }

  statement {
    sid       = "DenyWithoutMFA"
    effect    = "Deny"
    resources = ["*"]

    not_actions = [
      "sts:GetSessionToken",
      "iam:ResyncMFADevice",
      "iam:ListVirtualMFADevices",
      "iam:ListMFADevices",
      "iam:GetUser",
      "iam:EnableMFADevice",
      "iam:CreateVirtualMFADevice",
    ]

    condition {
      test     = "BoolIfExists"
      values   = ["false"]
      variable = "aws:MultiFactorAuthPresent"
    }
  }
}

data aws_iam_policy_document enable_access_key {
  statement {
    effect = "Allow"
    actions = [
      "iam:CreateAccessKey",
      "iam:DeleteAccessKey",
      "iam:GetAccessKeyLastUsed",
      "iam:GetUser",
      "iam:ListAccessKeys",
      "iam:UpdateAccessKey",
    ]

    resources = [
      "arn:aws:iam::*:user/$${aws:username}",
    ]
  }
}


resource aws_iam_policy enable_access_key {
  name        = "enable_access_key"
  path        = "/users/"
  description = "Allows users to create and update their own access keys"
  policy      = data.aws_iam_policy_document.enable_access_key.json
}

resource aws_iam_policy require_mfa {
  name        = "require_mfa"
  path        = "/users/"
  description = "Forces users to enable MFA"
  policy      = data.aws_iam_policy_document.require_mfa.json
}
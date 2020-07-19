resource aws_kms_key state {
  description = "Encrypts Terraform remote state bucket objects"
  deletion_window_in_days = 10
  enable_key_rotation = true
  tags = {
    Name = "${local.name_prefix}-state_kms_key"
    Purpose = "Terraform remote state"
    Terraformed = "ops/modules/bootstrap"
  }
}

resource aws_kms_alias state {
  name = "alias/terraform-state"
  target_key_id = aws_kms_key.state.key_id
}

resource aws_s3_bucket state {
  bucket = "${local.name_prefix}-terraform-state"

  # prevent accidental deletion from Terraform
  lifecycle {
    prevent_destroy = true
  }

  # versioning allows recovery of old states
  versioning {
    enabled = true
  }

  # encrypt on server side
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "aws:kms"
        kms_master_key_id = aws_kms_key.state.arn
      }
    }
  }

  tags = {
    Name = "${local.name_prefix}-terraform-state"
    Purpose = "Terraform remote state"
    Terraformed = "ops/modules/bootstrap"
  }
}

resource aws_dynamodb_table state_lock {
  hash_key = "LockID"
  name = "${local.name_prefix}-terraform-state-lock"
  billing_mode = "PAY_PER_REQUEST"

  server_side_encryption {
    enabled = true
  }

  attribute {
    name = "LockID"
    type = "S"
  }
}

data aws_iam_policy_document state_secret {
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
      aws_kms_key.state.arn,
      aws_kms_alias.state.arn
    ]
  }
}

resource aws_iam_policy state_secret {
  name = "${local.name_prefix}-remote_state_security"
  path = "/state/secret/"
  policy = data.aws_iam_policy_document.state_secret.json
}

data aws_iam_policy_document state_data {
  statement {
    effect = "Allow"
    actions = [
      "s3:DescribeJob",
      "s3:GetAccelerateConfiguration",
      "s3:GetAccountPublicAccessBlock",
      "s3:GetAnalyticsConfiguration",
      "s3:GetBucketAcl",
      "s3:GetBucketCORS",
      "s3:GetBucketLocation",
      "s3:GetBucketLogging",
      "s3:GetBucketNotification",
      "s3:GetBucketPolicy",
      "s3:GetBucketPolicyStatus",
      "s3:GetBucketPublicAccessBlock",
      "s3:GetBucketRequestPayment",
      "s3:GetBucketTagging",
      "s3:GetBucketVersioning",
      "s3:GetBucketWebsite",
      "s3:GetEncryptionConfiguration",
      "s3:GetInventoryConfiguration",
      "s3:GetLifecycleConfiguration",
      "s3:GetMetricsConfiguration",
      "s3:GetObject",
      "s3:GetObjectAcl",
      "s3:GetObjectTagging",
      "s3:GetObjectTorrent",
      "s3:GetObjectVersion",
      "s3:GetObjectVersionAcl",
      "s3:GetObjectVersionForReplication",
      "s3:GetObjectVersionTagging",
      "s3:GetObjectVersionTorrent",
      "s3:GetReplicationConfiguration",
      "s3:HeadBucket",
      "s3:ListAllMyBuckets",
      "s3:ListBucket",
      "s3:ListBucketByTags",
      "s3:ListBucketMultipartUploads",
      "s3:ListBucketVersions",
      "s3:ListJobs",
      "s3:ListMultipartUploadParts",
      "s3:PutObject",
    ]
    resources = [
      aws_s3_bucket.state.arn,
      "${aws_s3_bucket.state.arn}/*"
    ]
  }
}

resource aws_iam_policy state_data {
  name = "${local.name_prefix}-remote_state_data"
  path = "/state/data/"
  policy = data.aws_iam_policy_document.state_data.json
}
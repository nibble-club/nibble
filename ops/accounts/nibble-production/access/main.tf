module access {
  source = "../../../modules/access"

  boundary_json = data.aws_iam_policy_document.boundary.json
}
resource aws_iam_user a_churchill {
  name = "achurchill@nibble.club"
  path = "/admin/"

  tags = {
    Terraformed = "ops/accounts/nibble-security/iam"
    Resource    = "aws_iam_user.a_churchill"
  }
}
# unfortunate monkeying needed to import common module
import sys, os

test_dir = os.path.dirname(__file__)
common_dir = "../../db_utilities/python"
sys.path.insert(0, os.path.abspath(os.path.join(test_dir, common_dir)))

import unittest
import main

email = "abc@xyz.com"
name = "Maggie Baggie"
postal_code = "12345"
user_id = "cb39fc1a-4716-4490-bd39-9abf5531cca0"


sample_user_event = {
    "version": "1",
    "region": "us-west-2",
    "userPoolId": "us-west-2_CC5MIGvvP",
    "userName": user_id,
    "callerContext": {
        "awsSdkVersion": "aws-sdk-unknown-unknown",
        "clientId": "2dr9vpjnl4onvnbpi6fpaiaodi",
    },
    "triggerSource": "PostConfirmation_ConfirmSignUp",
    "request": {
        "userAttributes": {
            "sub": user_id,
            "cognito:email_alias": email,
            "cognito:user_status": "CONFIRMED",
            "email_verified": "true",
            "name": name,
            "custom:postal_code": postal_code,
            "email": email,
        }
    },
    "response": {},
}

sample_admin_event = {
    "version": "1",
    "region": "us-west-2",
    "userPoolId": "us-west-2_7fZN9yuSk",
    "userName": user_id,
    "callerContext": {
        "awsSdkVersion": "aws-sdk-unknown-unknown",
        "clientId": "CLIENT_ID_NOT_APPLICABLE",
    },
    "triggerSource": "PreSignUp_AdminCreateUser",
    "request": {
        "userAttributes": {"email_verified": "true", "email": email,},
        "validationData": None,
    },
    "response": {
        "autoConfirmUser": False,
        "autoVerifyEmail": False,
        "autoVerifyPhone": False,
    },
}


class TestAddUser(unittest.TestCase):
    def test_user_mapping(self):
        result = main.user_event_db_mapper(sample_user_event)
        self.assertEqual(result["full_name"], name)
        self.assertEqual(result["email"], email)
        self.assertEqual(result["profile_url"]["bucket"], "PLACEHOLDER")
        self.assertEqual(result["profile_url"]["key"], "profile")
        self.assertEqual(result["postal_code"], postal_code)
        self.assertEqual(result["id"], user_id)

    def test_admin_mapping(self):
        result = main.admin_event_db_mapper(sample_admin_event)
        self.assertEqual(result["id"], user_id)
        self.assertEqual(result["email"], email)


if __name__ == "__main__":
    unittest.main()

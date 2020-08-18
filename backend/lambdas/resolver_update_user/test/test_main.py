import unittest
from unittest.mock import patch

with patch("common.utils.get_engine"):
    with patch("boto3.client"):
        import main

sample_event = {
    "identity": {"username": "3"},
    "field": "updateUser",
    "arguments": {
        "userInfo": {
            "fullName": "Abc Xyz",
            "profilePicUrl": {"bucket": "PLACEHOLDER", "region": "", "key": "profile"},
            "phoneNumber": "617-955-0053",
            "postalCode": "02145",
        }
    },
}


@patch("os.environ", {"COGNITO_USER_POOL_ID": "us_west_2_abcdef"})
@patch("main.engine")
class TestAdminRestaurantMutation(unittest.TestCase):
    def test_accesses_db(self, engine_mock):
        result = main.lambda_handler(sample_event, None)
        self.assertGreater(engine_mock.begin.call_count, 0)
        self.assertTrue("id" in result)
        self.assertTrue("fullName" in result)
        self.assertTrue("email" in result)
        self.assertTrue("phoneNumber" in result)
        self.assertTrue("postalCode" in result)


if __name__ == "__main__":
    unittest.main()

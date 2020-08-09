import unittest
from unittest.mock import patch

with patch("common.utils.get_engine"):
    import main


@patch("main.engine")
class TestAdminRestaurantMutation(unittest.TestCase):
    def test_accesses_db(self, engine_mock):
        result = main.lambda_handler({"identity": {"username": "3"}}, None)
        self.assertGreater(engine_mock.connect.call_count, 0)
        self.assertTrue("id" in result)
        self.assertTrue("fullName" in result)
        self.assertTrue("email" in result)
        self.assertTrue("phoneNumber" in result)
        self.assertTrue("postalCode" in result)


if __name__ == "__main__":
    unittest.main()

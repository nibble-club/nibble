# unfortunate monkeying needed to import common module
import sys, os

test_dir = os.path.dirname(__file__)
common_dir = "../../db_utilities/python"
sys.path.insert(0, os.path.abspath(os.path.join(test_dir, common_dir)))

import unittest
import common.validation as validation
import common.redis_keys as redis_keys
from unittest.mock import MagicMock, patch
from common.errors import NibbleError

with patch("common.utils.get_engine"):
    import main
from datetime import datetime, timedelta


@patch("main.engine")
class TestAdminRestaurantMutation(unittest.TestCase):
    def test_accesses_db(self, engine_mock):
        result = main.lambda_handler({"identity": {"username": "3",}}, None)
        self.assertGreater(engine_mock.connect.call_count, 0)
        self.assertTrue("id" in result)
        self.assertTrue("fullName" in result)
        self.assertTrue("email" in result)
        self.assertTrue("phoneNumber" in result)
        self.assertTrue("postalCode" in result)


if __name__ == "__main__":
    unittest.main()

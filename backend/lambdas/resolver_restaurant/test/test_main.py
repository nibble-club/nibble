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
    def test_source_validation(self, engine_mock):
        with self.assertRaises(NibbleError):
            main.lambda_handler({"field": "Nibble.availableCount"}, None)
        with self.assertRaises(NibbleError):
            main.lambda_handler({"field": "Restaurant.restaurantInfo"}, None)

    def test_accesses_db(self, engine_mock):
        result = main.lambda_handler(
            {"field": "Nibble.restaurantInfo", "source": {"id": "1"}}, None
        )
        self.assertGreater(engine_mock.connect.call_count, 0)
        self.assertTrue("id" in result)
        self.assertTrue("name" in result)
        self.assertTrue("market" in result)
        self.assertTrue("description" in result)
        self.assertTrue("logoUrl" in result)
        self.assertTrue("heroUrl" in result)
        self.assertTrue("disclaimer" in result)
        self.assertTrue("active" in result)
        self.assertTrue("streetAddress" in result["address"])
        self.assertTrue("dependentLocality" in result["address"])
        self.assertTrue("locality" in result["address"])
        self.assertTrue("administrativeArea" in result["address"])
        self.assertTrue("country" in result["address"])
        self.assertTrue("postalCode" in result["address"])
        self.assertTrue("longitude" in result["address"]["location"])
        self.assertTrue("latitude" in result["address"]["location"])


if __name__ == "__main__":
    unittest.main()

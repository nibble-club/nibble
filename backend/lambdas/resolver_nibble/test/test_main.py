# unfortunate monkeying needed to import common module
import sys, os

test_dir = os.path.dirname(__file__)
common_dir = "../../db_utilities/python"
sys.path.insert(0, os.path.abspath(os.path.join(test_dir, common_dir)))

import unittest
import common.validation as validation
import common.redis_keys as redis_keys
from unittest.mock import MagicMock, patch

with patch("common.utils.get_engine"):
    import main
from datetime import datetime, timedelta


sample_from_restaurant = {
    "field": "Restaurant.nibblesAvailable",
    "source": {"id": "1"},
}

sample_from_query = {"field": "Query.nibbleInfo"}


@patch("main.redis.Redis")
@patch("main.engine")
class TestAdminRestaurantMutation(unittest.TestCase):
    def test_from_restaurant(self, engine_mock, redis_mock):
        result = main.handle_restaurant_nibbles(sample_from_restaurant, redis_mock)
        self.assertEqual(result, [])

    def test_from_query(self, engine_mock, redis_mock):
        main.handle_nibble_query("1", redis_mock)
        redis_mock.hget.assert_called_with(redis_keys.NIBBLES_REMAINING, "1")


if __name__ == "__main__":
    unittest.main()

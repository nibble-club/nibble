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
from hypothesis import given
from hypothesis.strategies import tuples, floats

with patch("common.utils.get_engine"):
    import main
from datetime import datetime, timedelta


def create_input(loc_1, loc_2):
    """Creates input dictionary for lambda handler, given two (lon, lat) pairs"""
    return {
        "field": "Restaurant.distance",
        "arguments": {"currentPos": {"latitude": loc_1[1], "longitude": loc_1[0],}},
        "source": {
            "address": {"location": {"latitude": loc_2[1], "longitude": loc_2[0],}}
        },
    }


class TestAdminRestaurantMutation(unittest.TestCase):
    @given(
        tuples(
            floats(min_value=-180, max_value=180), floats(min_value=-85, max_value=85)
        ),
        tuples(
            floats(min_value=-180, max_value=180), floats(min_value=-85, max_value=85)
        ),
    )
    def test_order_invariant(self, locs_1, locs_2):
        self.assertAlmostEqual(
            main.lambda_handler(create_input(locs_1, locs_2), None),
            main.lambda_handler(create_input(locs_2, locs_1), None),
            places=7,
        )


if __name__ == "__main__":
    unittest.main()

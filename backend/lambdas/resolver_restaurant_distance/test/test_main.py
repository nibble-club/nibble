import unittest
from unittest.mock import patch

from hypothesis import given
from hypothesis.strategies import floats, tuples

with patch("common.utils.get_engine"):
    import main


def create_input(loc_1, loc_2):
    """Creates input dictionary for lambda handler, given two (lon, lat) pairs"""
    return {
        "field": "Restaurant.distance",
        "arguments": {"currentPos": {"latitude": loc_1[1], "longitude": loc_1[0]}},
        "source": {
            "address": {"location": {"latitude": loc_2[1], "longitude": loc_2[0]}}
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

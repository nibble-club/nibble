import unittest
from unittest.mock import patch

with patch("common.es_indices.get_es_client"):
    import main

sample_event = {
    "field": "closestRestaurants",
    "arguments": {
        "location": {"latitude": 42.3854646, "longitude": -71.094187},
        "paginationInput": {"offset": 0, "limit": 10},
        "maxDistance": 2.5,
    },
}


class TestAdminRestaurantMutation(unittest.TestCase):
    def test_alive(self):
        main.lambda_handler(sample_event, None)


if __name__ == "__main__":
    unittest.main()

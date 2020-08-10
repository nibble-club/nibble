import unittest
from unittest.mock import MagicMock, patch

redis_mock = MagicMock(name="RedisMock")


with patch("common.es_indices.get_es_client"):
    with patch(
        "os.environ", {"REDIS_HOST": "host", "REDIS_PORT": "6379"},
    ):
        with patch("redis.Redis", redis_mock):
            import main

username = "abc-123"

sample_event = {
    "field": "nibblesWithProperty",
    "identity": {"username": username},
    "arguments": {
        "userLocation": {"latitude": 42, "longitude": -71},
        "property": "AvailableNow",
    },
}


class TestAdminRestaurantMutation(unittest.TestCase):
    def test_runs(self):
        main.lambda_handler(sample_event, None)


if __name__ == "__main__":
    unittest.main()

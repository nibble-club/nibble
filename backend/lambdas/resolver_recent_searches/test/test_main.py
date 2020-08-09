import unittest
from unittest.mock import MagicMock, patch

from common import redis_keys

redis_mock = MagicMock(name="RedisMock")


with patch("common.es_indices.get_es_client"):
    with patch(
        "os.environ", {"REDIS_HOST": "host", "REDIS_PORT": "6379"},
    ):
        with patch("redis.Redis", redis_mock):
            import main

sample_event = {"field": "recentSearches", "identity": {"username": "user"}}


class TestAdminRestaurantMutation(unittest.TestCase):
    def test_runs(self):
        main.lambda_handler(sample_event, None)

    def test_checks_redis(self):
        main.lambda_handler(sample_event, None)
        redis_mock.return_value.lrange.assert_called_with(
            redis_keys.user_search_history("user"), 0, -1
        )


if __name__ == "__main__":
    unittest.main()

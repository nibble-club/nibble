import unittest
from unittest.mock import patch

with patch("common.utils.get_engine"):
    with patch("common.es_indices.get_es_client"):
        with patch(
            "os.environ", {"REDIS_HOST": "host", "REDIS_PORT": "6379"},
        ):
            with patch("redis.Redis"):
                import main


class TestAdminRestaurantMutation(unittest.TestCase):
    def test_runs(self):
        main.lambda_handler(
            {"field": "adminDeactivateRestaurant", "identity": {"username": "abc"}},
            None,
        )


if __name__ == "__main__":
    unittest.main()

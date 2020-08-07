# unfortunate monkeying needed to import common module
import sys, os

test_dir = os.path.dirname(__file__)
common_dir = "../../db_utilities/python"
sys.path.insert(0, os.path.abspath(os.path.join(test_dir, common_dir)))

import unittest
from unittest.mock import patch, MagicMock
import datetime
from common import redis_keys
from common.errors import NibbleError
import json
from copy import deepcopy

redis_mock = MagicMock(name="RedisMock")


with patch("common.es_indices.get_es_client"):
    with patch(
        "os.environ", {"REDIS_HOST": "host", "REDIS_PORT": "6379",},
    ):
        with patch("redis.Redis", redis_mock):
            import main

username = "abc-123"

search_parameters = {
    "text": "Pasta",
    "latestPickup": (datetime.datetime.now() + datetime.timedelta(hours=2)).timestamp(),
    "maxDistance": 2.5,
}
sample_event = {
    "field": "search",
    "identity": {"username": username,},
    "arguments": {
        "userLocation": {"latitude": 42, "longitude": -71,},
        "searchParameters": search_parameters,
    },
}

bad_text_sample_event = deepcopy(sample_event)
bad_text_sample_event["arguments"]["searchParameters"]["text"] = "a"

bad_time_sample_event = deepcopy(sample_event)
bad_time_sample_event["arguments"]["searchParameters"]["latestPickup"] = int(
    (datetime.datetime.now() - datetime.timedelta(minutes=1)).timestamp()
)


class TestAdminRestaurantMutation(unittest.TestCase):
    def test_runs(self):
        main.lambda_handler(sample_event, None)

    def test_redis_updated(self):
        main.lambda_handler(sample_event, None)
        redis_mock.return_value.lpush.assert_called_with(
            redis_keys.user_search_history(username), json.dumps(search_parameters)
        )

    def test_error_on_invalid_text(self):
        with self.assertRaises(NibbleError):
            main.lambda_handler(bad_text_sample_event, None)

    def test_error_on_invalid_time(self):
        with self.assertRaises(NibbleError):
            main.lambda_handler(bad_time_sample_event, None)


if __name__ == "__main__":
    unittest.main()

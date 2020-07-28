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

with patch("boto3.client"):
    import main


class TestAdminRestaurantMutation(unittest.TestCase):
    def test_returns(self):
        main.lambda_handler(
            {
                "field": "imageUploadURL",
                "arguments": {"bucket": "BUCKET", "directory": "dir"},
            },
            None,
        )


if __name__ == "__main__":
    unittest.main()

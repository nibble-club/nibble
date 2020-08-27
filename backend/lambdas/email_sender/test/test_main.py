import json
import unittest
from unittest.mock import patch

with patch("common.utils.get_engine"):
    with patch("boto3.client"):
        import main


@patch("os.environ", {"SENDER_EMAIL": "hello@nibble.club"})
class TestEmailSender(unittest.TestCase):
    def test_runs(self):
        main.lambda_handler(
            {
                "Records": [
                    {
                        "body": json.dumps(
                            {
                                "type": "reservation",
                                "payload": {
                                    "id": "123",
                                    "name": "Half sushi roll",
                                    "count": 20,
                                    "price": 300,
                                    "imageUrl": {
                                        "bucket": "abc123",
                                        "region": "us-west-2",
                                        "key": "image_key",
                                    },
                                    "availableFrom": 1598591884,
                                    "availableTo": 1598594884,
                                },
                                "user_id": "abc123",
                            }
                        )
                    }
                ]
            },
            None,
        )


if __name__ == "__main__":
    unittest.main()

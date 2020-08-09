import unittest
from unittest.mock import patch

with patch("boto3.client"):
    import main


@patch(
    "os.environ",
    {
        "AWS_REGION": "us-west-2",
        "USER_PROFILE_PICTURES_BUCKET": "profile-pics",
        "RESTAURANT_LOGOS_BUCKET": "logos",
        "RESTAURANT_HEROS_BUCKET": "heros",
    },
)
class TestAdminRestaurantMutation(unittest.TestCase):
    def test_returns(self):
        main.lambda_handler(
            {
                "field": "imageUploadURL",
                "arguments": {"destination": "UserProfilePictures"},
            },
            None,
        )


if __name__ == "__main__":
    unittest.main()

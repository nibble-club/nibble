import unittest

import main

sample_event = {"field": "locationForPostalCode", "arguments": {"postalCode": "02145"}}


class TestAdminRestaurantMutation(unittest.TestCase):
    def test_sample_zip_code(self):
        self.assertDictEqual(
            {"latitude": 42.390846, "longitude": -71.09225},
            main.lambda_handler(sample_event, None),
        )


if __name__ == "__main__":
    unittest.main()

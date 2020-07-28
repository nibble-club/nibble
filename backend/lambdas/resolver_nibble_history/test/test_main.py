# unfortunate monkeying needed to import common module
import sys, os

test_dir = os.path.dirname(__file__)
common_dir = "../../db_utilities/python"
sys.path.insert(0, os.path.abspath(os.path.join(test_dir, common_dir)))

import unittest
import common.validation as validation
from unittest.mock import Mock, patch

with patch("common.utils.get_engine"):
    import main

from datetime import datetime, timedelta
from common.errors import NibbleError


restaurant_image_url = {"bucket": "PLACEHOLDER", "region": "us-west-2", "key": "hero"}

restaurant_name = "Symphony Sushi"
restaurant_description = "Good sushi."
restaurant_disclaimer = "Not all items available always"
restaurant_market = "Boston"
restaurant_street_address = "430 Grant Street"
restaurant_locality = "Boston"
restaurant_admin_area = "Massachusetts"
restaurant_country = "USA"
restaurant_postal_code = "02144"
restaurant_latitude = 42.293847
restaurant_longitude = -71.203947
restaurant_active = True

sample_restaurant = {
    "name": restaurant_name,
    "description": restaurant_description,
    "disclaimer": restaurant_disclaimer,
    "logoUrl": restaurant_image_url,
    "heroUrl": restaurant_image_url,
    "market": restaurant_market,
    "address": {
        "streetAddress": restaurant_street_address,
        "locality": restaurant_locality,
        "administrativeArea": restaurant_admin_area,
        "country": restaurant_country,
        "postalCode": restaurant_postal_code,
        "location": {
            "latitude": restaurant_latitude,
            "longitude": restaurant_longitude,
        },
    },
    "active": restaurant_active,
}


class TestResolverNibbleHistory(unittest.TestCase):
    def test_field_validation(self):
        # invalid type name
        with self.assertRaises(NibbleError):
            main.lambda_handler({"field": "Admin.nibblesReserved"}, None)
        with self.assertRaises(NibbleError):
            main.lambda_handler({"field": "User.id"}, None)


if __name__ == "__main__":
    unittest.main()

# unfortunate monkeying needed to import common module
import sys, os

test_dir = os.path.dirname(__file__)
common_dir = "../../db_utilities/python"
sys.path.insert(0, os.path.abspath(os.path.join(test_dir, common_dir)))

import unittest
import common.validation as validation
from unittest.mock import Mock, patch
import main
from datetime import datetime, timedelta


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


class TestAdminRestaurantMutation(unittest.TestCase):
    def test_restaurant_db_mapping(self):
        result = main.get_restaurant_db_mapping(sample_restaurant)
        self.assertEqual(result["name"], restaurant_name)
        self.assertEqual(result["description"], restaurant_description)
        self.assertEqual(result["disclaimer"], restaurant_disclaimer)
        self.assertEqual(result["logo_url"], restaurant_image_url)
        self.assertEqual(result["hero_url"], restaurant_image_url)
        self.assertEqual(result["market"], restaurant_market)
        self.assertEqual(result["street_address"], restaurant_street_address)
        self.assertEqual(result["locality"], restaurant_locality)
        self.assertEqual(result["dependent_locality"], None)
        self.assertEqual(result["administrative_area"], restaurant_admin_area)
        self.assertEqual(result["country"], restaurant_country)
        self.assertEqual(result["postal_code"], restaurant_postal_code)
        self.assertEqual(result["latitude"], restaurant_latitude)
        self.assertEqual(result["longitude"], restaurant_longitude)
        self.assertEqual(result["active"], restaurant_active)


if __name__ == "__main__":
    unittest.main()

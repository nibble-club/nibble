import unittest
from unittest.mock import patch

from common.errors import NibbleError

with patch("common.utils.get_engine"):
    import main


class TestResolverNibbleHistory(unittest.TestCase):
    def test_field_validation(self):
        # invalid type name
        with self.assertRaises(NibbleError):
            main.lambda_handler({"field": "Admin.nibblesReserved"}, None)
        with self.assertRaises(NibbleError):
            main.lambda_handler({"field": "User.id"}, None)


if __name__ == "__main__":
    unittest.main()

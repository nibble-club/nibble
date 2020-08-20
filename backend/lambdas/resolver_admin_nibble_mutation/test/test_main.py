import unittest
from datetime import datetime, timedelta
from unittest.mock import Mock, patch

import common.validation as validation
from common.errors import NibbleError

with patch("common.utils.get_engine"):
    with patch("common.es_indices.get_es_client"):
        with patch(
            "os.environ", {"REDIS_HOST": "host", "REDIS_PORT": "6379"},
        ):
            with patch("redis.Redis"):
                import main


nibble_id = "1234"
nibble_name = "Half sushi"
nibble_count = 3
nibble_type = validation.VALID_NIBBLE_TYPES[0]
nibble_description = "delicious"
nibble_price = 450
nibble_available_from = int((datetime.now() - timedelta(hours=3)).timestamp())
nibble_available_to = int((datetime.now() + timedelta(hours=2)).timestamp())
nibble_image_url = {
    "bucket": "my-bucket",
    "region": "us-west-2",
    "key": "nibble_pic_10928",
}

sample_nibble = {
    "name": nibble_name,
    "type": nibble_type,
    "count": nibble_count,
    "description": nibble_description,
    "price": nibble_price,
    "availableFrom": nibble_available_from,
    "availableTo": nibble_available_to,
    "imageUrl": nibble_image_url,
}


class TestAdminNibbleMutation(unittest.TestCase):
    def setUp(self):
        self.conn_mock = Mock()

    def test_db_mapper_valid(self):
        result = main.nibble_event_db_mapper(sample_nibble)
        self.assertEqual(result["name"], nibble_name)
        self.assertEqual(result["type"], nibble_type)
        self.assertEqual(result["available_count"], nibble_count)
        self.assertEqual(result["description"], nibble_description)
        self.assertEqual(result["price"], nibble_price)
        self.assertEqual(result["available_from"], nibble_available_from)
        self.assertEqual(result["available_to"], nibble_available_to)
        self.assertEqual(result["image_url"], nibble_image_url)

    def test_db_mapper_invalid_type(self):
        invalid_type_nibble = sample_nibble.copy()
        invalid_type_nibble["type"] = "not valid"
        with self.assertRaises(NibbleError):
            main.nibble_event_db_mapper(invalid_type_nibble)

    def test_db_mapper_invalid_count(self):
        invalid_count_nibble = sample_nibble.copy()
        invalid_count_nibble["count"] = 0
        with self.assertRaises(NibbleError):
            main.nibble_event_db_mapper(invalid_count_nibble)

    def test_db_mapper_invalid_price(self):
        invalid_price_nibble = sample_nibble.copy()
        invalid_price_nibble["price"] = -1
        with self.assertRaises(NibbleError):
            main.nibble_event_db_mapper(invalid_price_nibble)

    def test_db_mapper_invalid_available_to(self):
        invalid_time_nibble = sample_nibble.copy()
        invalid_time_nibble["availableTo"] = int(
            (datetime.now() - timedelta(hours=1)).timestamp()
        )
        with self.assertRaises(NibbleError):
            main.nibble_event_db_mapper(invalid_time_nibble)

    def test_db_mapper_invalid_timespan(self):
        invalid_timespan_nibble = sample_nibble.copy()
        invalid_timespan_nibble["availableFrom"] = int(
            (datetime.now() - timedelta(seconds=1)).timestamp()
        )
        invalid_timespan_nibble["availableTo"] = int(
            (datetime.now() - timedelta(seconds=2)).timestamp()
        )
        with self.assertRaises(NibbleError):
            main.nibble_event_db_mapper(invalid_timespan_nibble)

    def test_update_validation_valid(self):
        with patch("main.select") as select_mock:
            # patch selecting of row
            self.conn_mock.execute.return_value.fetchone.return_value = {
                "available_to": (datetime.now() + timedelta(hours=1)).timestamp(),
                "price": nibble_price,
                "active": True,
            }
            main.check_valid_nibble_update(
                sample_nibble, nibble_id, self.conn_mock, 10, 9
            )
            select_mock.assert_called_once()
        self.assertTrue(True, "Succeeded without error")

    def test_update_validation_invalid_amount(self):
        with self.assertRaises(NibbleError):
            main.check_valid_nibble_update(
                sample_nibble, nibble_id, self.conn_mock, 10, 5,
            )

    def test_update_validation_invalid_price(self):
        with patch("main.select") as select_mock:
            # patch selecting of row
            self.conn_mock.execute.return_value.fetchone.return_value = {
                "available_to": int((datetime.now() + timedelta(hours=1)).timestamp()),
                "price": nibble_price - 10,
                "active": True,
            }
            with self.assertRaises(NibbleError):
                main.check_valid_nibble_update(
                    sample_nibble, nibble_id, self.conn_mock, 10, 9,
                )
            select_mock.assert_called_once()

    def test_update_validation_invalid_time(self):
        with patch("main.select") as select_mock:
            # patch selecting of row
            self.conn_mock.execute.return_value.fetchone.return_value = {
                "available_to": int((datetime.now() - timedelta(hours=1)).timestamp()),
                "price": nibble_price,
                "active": True,
            }
            with self.assertRaises(NibbleError):
                main.check_valid_nibble_update(
                    sample_nibble, nibble_id, self.conn_mock, 10, 9,
                )
            select_mock.assert_called_once()  # we had to check the db

    def test_update_validation_invalid_deleted(self):
        with patch("main.select") as select_mock:
            # patch selecting of row
            self.conn_mock.execute.return_value.fetchone.return_value = {
                "available_to": int((datetime.now() + timedelta(hours=1)).timestamp()),
                "price": nibble_price,
                "active": False,
            }
            with self.assertRaises(NibbleError):
                main.check_valid_nibble_update(
                    sample_nibble, nibble_id, self.conn_mock, 10, 9,
                )
            select_mock.assert_called_once()  # we had to check the db

    def test_deletion_validation_invalid_time(self):
        with patch("main.select") as select_mock:
            # patch selecting of row
            self.conn_mock.execute.return_value.fetchone.return_value = {
                "available_to": int((datetime.now() - timedelta(hours=1)).timestamp())
            }
            with self.assertRaises(NibbleError):
                main.check_valid_nibble_deletion(
                    nibble_id, self.conn_mock, 10, 10,
                )
            select_mock.assert_called_once()

    def test_deletion_validation_invalid_amount(self):
        with self.assertRaises(NibbleError):
            main.check_valid_nibble_deletion(nibble_id, self.conn_mock, 10, 9)


if __name__ == "__main__":
    unittest.main()

import unittest
from unittest.mock import patch

with patch("common.utils.get_engine"):
    import main


class TestAdminNibbleMutation(unittest.TestCase):
    def test_runs(self):
        main.lambda_handler(
            {
                "identity": {"username": "abc123"},
                "arguments": {"nibbleId": "234"},
                "field": "adminNibbleReservations",
            },
            None,
        )

    def test_result_mapper(self):
        result = main.admin_reservations_result_mapper(
            [
                {
                    "full_name": "Abc Xyz",
                    "nibble_id": "234",
                    "reserved_count": 3,
                    "price": 900,
                    "reserved_at": 123456789,
                    "status": "Reserved",
                    "cancelled_at": None,
                    "cancellation_reason": None,
                    "user_id": "def456",
                    "email": "abc@xyz.com",
                }
            ]
        )
        result = result[0]
        self.assertEqual(result["nibbleId"], "234")
        self.assertEqual(result["count"], 3)
        self.assertEqual(result["price"], 900)
        self.assertEqual(result["reservedAt"], 123456789)
        self.assertEqual(result["status"], "Reserved")
        self.assertEqual(result["cancelledAt"], None)
        self.assertEqual(result["cancellationReason"], None)
        self.assertEqual(result["user"]["userId"], "def456")
        self.assertEqual(result["user"]["name"], "Abc X.")
        self.assertEqual(result["user"]["email"], "abc@xyz.com")


if __name__ == "__main__":
    unittest.main()

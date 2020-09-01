import unittest
from unittest.mock import patch

from hypothesis import given
from hypothesis.strategies import fixed_dictionaries, integers, just, lists, one_of

with patch("common.utils.get_engine"):
    with patch(
        "os.environ", {"REDIS_HOST": "host", "REDIS_PORT": "6379"},
    ):
        with patch("redis.Redis"):
            import main


class TestAdminNibbleReservations(unittest.TestCase):
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
                    "profile_url": {"a": "b"},
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

    @given(
        lists(
            fixed_dictionaries(
                {
                    "reservedAt": integers(1500000000, 2000000000),
                    "status": one_of(
                        just("Reserved"),
                        just("Completed"),
                        just("CancelledByRestaurant"),
                        just("CancelledByUser"),
                    ),
                }
            )
        )
    )
    def test_sorting(self, reservations_unsorted):
        reservations = sorted(reservations_unsorted, key=main.reservation_sort_key)
        for i in range(len(reservations)):
            for j in range(i + 1, len(reservations)):
                if reservations[i]["status"] == reservations[j]["status"]:
                    self.assertLessEqual(
                        reservations[i]["reservedAt"], reservations[j]["reservedAt"]
                    )
                else:
                    self.assertIn(
                        (reservations[i]["status"], reservations[j]["status"]),
                        [
                            ("Reserved", "Completed"),
                            ("Reserved", "CancelledByRestaurant"),
                            ("Reserved", "CancelledByUser"),
                            ("Completed", "CancelledByRestaurant"),
                            ("Completed", "CancelledByUser"),
                            ("CancelledByRestaurant", "CancelledByUser"),
                        ],
                    )


if __name__ == "__main__":
    unittest.main()

# unfortunate monkeying needed to import common module
import sys, os

test_dir = os.path.dirname(__file__)
common_dir = "../../db_utilities/python"
sys.path.insert(0, os.path.abspath(os.path.join(test_dir, common_dir)))

import unittest
import common.validation as validation
from unittest.mock import Mock, MagicMock, patch, call

with patch("common.utils.get_engine"):
    import main

from datetime import datetime, timedelta
from common.errors import NibbleError


def function_returns(conn, pipe, counts):
    return counts[0]


def function_errors(conn, pipe, counts):
    raise NibbleError("I fail")


class TestResolverNibbleReservation(unittest.TestCase):
    def setUp(self):
        self.redis_mock = Mock()
        self.redis_mock.lock.return_value = MagicMock(name="Lock")
        self.redis_mock.hget.return_value = 10
        self.pipe_mock = MagicMock(name="Pipe")
        self.redis_mock.pipeline.return_value = self.pipe_mock
        self.engine_mock = Mock()
        self.begin_mock = MagicMock(name="Transaction")
        self.engine_mock.begin.return_value = self.begin_mock

    def test_run_in_transaction(self):
        main.run_in_transaction(
            self.redis_mock, self.engine_mock, "3", function_returns
        )
        self.assertEqual(self.pipe_mock.__enter__.call_count, 1)
        self.assertEqual(self.begin_mock.__enter__.call_count, 1)
        self.assertEqual(self.pipe_mock.__exit__.call_count, 1)
        self.assertEqual(self.begin_mock.__exit__.call_count, 1)
        # exited without error
        self.assertEqual(self.pipe_mock.__exit__.call_args, call(None, None, None))
        self.assertEqual(self.begin_mock.__exit__.call_args, call(None, None, None))

    def test_run_in_transaction_fails(self):
        with self.assertRaises(NibbleError):
            main.run_in_transaction(
                self.redis_mock, self.engine_mock, "4", function_errors
            )
        self.assertEqual(self.pipe_mock.__enter__.call_count, 1)
        self.assertEqual(self.begin_mock.__enter__.call_count, 1)
        self.assertEqual(self.pipe_mock.__exit__.call_count, 1)
        self.assertEqual(self.begin_mock.__exit__.call_count, 1)
        # exited with error
        self.assertNotEqual(self.pipe_mock.__exit__.call_args, call(None, None, None))
        self.assertNotEqual(self.begin_mock.__exit__.call_args, call(None, None, None))


if __name__ == "__main__":
    unittest.main()

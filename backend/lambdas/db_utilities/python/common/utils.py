import os
from enum import Enum

from sqlalchemy import create_engine


class NibbleReservationStatus(Enum):
    Reserved = "Reserved"
    CancelledByUser = "CancelledByUser"
    CancelledByRestaurant = "CancelledByRestaurant"
    Completed = "Completed"


class EmailType(Enum):
    Reservation = "reservation"


def get_engine():
    """Creates a SQLAlchemy Postgres connection engine, based on the OS environment
    variables.
    """
    return create_engine(
        "postgresql://{username}:{password}@{host}:{port}/{db_name}".format(
            username=os.environ["DB_USERNAME"],
            password=os.environ["DB_PASSWORD"],
            host=os.environ["DB_HOST"],
            port=os.environ["DB_PORT"],
            db_name=os.environ["DB_NAME"],
        ),
        isolation_level="SERIALIZABLE",
    )

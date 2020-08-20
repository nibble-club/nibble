from enum import Enum

from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    MetaData,
    PrimaryKeyConstraint,
    Table,
)
from sqlalchemy.dialects.postgresql import (
    BIGINT,
    BOOLEAN,
    DOUBLE_PRECISION,
    JSON,
    TEXT,
    TIMESTAMP,
)
from sqlalchemy.schema import FetchedValue


class NibbleTable(Enum):
    RESTAURANT = 1
    NIBBLE = 2
    NIBBLE_USER = 3
    NIBBLE_RESERVATION = 4
    RESTAURANT_ADMIN = 5
    RESTAURANT_RESTAURANT_ADMIN = 6


def get_table_metadata(table_name=None):
    """Gets a SQLAlchemy MetaData object describing the tables in the PostgreSQL
    database.

    Args:
        table_name (NibbleTable): the table object to fetch. If this is invalid or
        empty, returns the MetaData object for the entire schema.

    Returns:
        Union[sqlalchemy.MetaData, sqlalchemy.Table]: requested object
    """
    metadata = MetaData()

    restaurant_admin = Table(
        "restaurant_admin",
        metadata,
        Column("id", TEXT, primary_key=True),
        Column("email", TEXT, nullable=False),
        Column("created_at", TIMESTAMP, server_default=FetchedValue()),
    )

    restaurant = Table(
        "restaurant",
        metadata,
        Column("id", Integer, primary_key=True),
        Column("name", TEXT, nullable=False),
        Column("description", TEXT, nullable=False),
        Column("disclaimer", TEXT, nullable=False),
        Column("logo_url", JSON, nullable=False),
        Column("hero_url", JSON, nullable=False),
        Column("market", TEXT, nullable=False),
        Column("street_address", TEXT, nullable=False),
        Column("dependent_locality", TEXT),
        Column("locality", TEXT, nullable=False),
        Column("administrative_area", TEXT, nullable=False),
        Column("country", TEXT, nullable=False),
        Column("postal_code", TEXT, nullable=False),
        Column("latitude", DOUBLE_PRECISION, nullable=False),
        Column("longitude", DOUBLE_PRECISION, nullable=False),
        Column("active", BOOLEAN, nullable=False),
        Column("phone_number", TEXT, nullable=True),
        Column("website_url", TEXT, nullable=True),
        Column("created_at", TIMESTAMP, server_default=FetchedValue()),
    )

    restaurant_restaurant_admin = Table(
        "restaurant_restaurant_admin",
        metadata,
        Column("restaurant_id", TEXT, ForeignKey(restaurant.c.id), nullable=False),
        Column("admin_id", TEXT, ForeignKey(restaurant_admin.c.id), nullable=False),
        PrimaryKeyConstraint(
            "admin_id", "restaurant_id", name="restaurant_restaurant_admin_pk"
        ),
    )

    nibble = Table(
        "nibble",
        metadata,
        Column("id", Integer, primary_key=True),
        Column("restaurant_id", BIGINT, ForeignKey(restaurant.c.id), nullable=False),
        Column("name", TEXT, nullable=False),
        Column("type", TEXT, nullable=False),
        Column("available_count", Integer, nullable=False),
        Column("description", TEXT),
        Column("price", Integer, nullable=False),
        Column("available_from", BIGINT, nullable=False),
        Column("available_to", BIGINT, nullable=False),
        Column("image_url", JSON, nullable=False),
        Column("active", BOOLEAN, nullable=False),
        Column("created_at", TIMESTAMP, server_default=FetchedValue()),
    )

    nibble_user = Table(
        "nibble_user",
        metadata,
        Column("id", TEXT, primary_key=True),
        Column("full_name", TEXT, nullable=False),
        Column("email", TEXT, nullable=False),
        Column("phone_number", TEXT),
        Column("postal_code", TEXT),
        Column("profile_url", JSON, nullable=False),
        Column("created_at", TIMESTAMP, server_default=FetchedValue()),
    )

    nibble_reservation = Table(
        "nibble_reservation",
        metadata,
        Column("nibble_id", BIGINT, ForeignKey(nibble.c.id), nullable=False),
        Column("user_id", TEXT, ForeignKey(nibble_user.c.id), nullable=False),
        Column("nibble_name", TEXT, nullable=False),
        Column("reserved_count", Integer, nullable=False),
        Column("reserved_at", BIGINT, nullable=False),
        Column("price", Integer, nullable=False),
        Column("status", TEXT, nullable=False),
        Column("cancelled_at", BIGINT),
        Column("cancellation_reason", TEXT),
        PrimaryKeyConstraint("nibble_id", "user_id", name="nibble_reservation_pk"),
    )

    tables = {
        NibbleTable.RESTAURANT: restaurant,
        NibbleTable.NIBBLE: nibble,
        NibbleTable.NIBBLE_USER: nibble_user,
        NibbleTable.NIBBLE_RESERVATION: nibble_reservation,
        NibbleTable.RESTAURANT_ADMIN: restaurant_admin,
        NibbleTable.RESTAURANT_RESTAURANT_ADMIN: restaurant_restaurant_admin,
    }

    if table_name in tables:
        return tables[table_name]

    return metadata

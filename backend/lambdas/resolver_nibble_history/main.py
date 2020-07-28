import logging
import json
import os
from common import tables, utils, validation, redis_keys
from sqlalchemy.sql import select, and_, not_
from datetime import datetime
from common.errors import NibbleError


logger = logging.getLogger()
logger.setLevel(logging.INFO)

# get tables and build query
engine = utils.get_engine()


def lambda_handler(event, context):
    """Resolves requests for user's reserved/history nibble information
    """
    logger.info(event)
    source_info = event["field"]
    source, field = source_info.split(".")

    if source != "User":
        raise NibbleError("Invalid type, expecting to resolve on User type")
    if field not in ("nibblesReserved", "nibblesHistory"):
        raise NibbleError("Resolving unexpected field {0} on User type".format(field))

    # get user id from source
    user_id = event["source"]["id"]

    nibble_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE)
    reservation_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_RESERVATION)
    current_time = int(datetime.now().timestamp())

    nibble_info_cols = [
        nibble_table.c.id,
        nibble_table.c.type,
        nibble_table.c.image_url,
        nibble_table.c.description,
        nibble_table.c.available_from,
        nibble_table.c.available_to,
    ]
    nibble_reservation_info_cols = [
        reservation_table.c.nibble_name,
        reservation_table.c.reserved_count,
        reservation_table.c.reserved_at,
        reservation_table.c.price,
        reservation_table.c.status,
        reservation_table.c.cancelled_at,
        reservation_table.c.cancellation_reason,
    ]

    nibbles_reserved_conditions = and_(
        (
            nibble_table.c.available_to > current_time
        ),  # we only want nibbles still in availability window...
        (reservation_table.c.status == utils.NibbleReservationStatus.Reserved.value),
    )  # ... that are reserved, but not cancelled or completed

    nibbles_history_conditions = not_(nibbles_reserved_conditions)

    if field == "nibblesReserved":
        nibbles_condition = nibbles_reserved_conditions
        order_field = nibble_table.c.available_to
    else:  # field = nibblesHistory
        nibbles_condition = nibbles_history_conditions
        order_field = reservation_table.c.reserved_at

    # get nibbles reserved by user, with given time condition
    s = (
        select(nibble_info_cols + nibble_reservation_info_cols)
        .select_from(
            nibble_table.join(
                reservation_table, nibble_table.c.id == reservation_table.c.nibble_id
            )
        )
        .where(and_(reservation_table.c.user_id == user_id, nibbles_condition))
        .order_by(order_field)
    )

    with engine.connect() as conn:
        nibbles = []
        for row in conn.execute(s):
            nibbles.append(
                {
                    "id": row["id"],
                    "name": row["nibble_name"],  # from reservation, not nibble
                    "type": row["type"],
                    "count": row["reserved_count"],
                    "imageUrl": row["image_url"],
                    "description": row["description"],
                    "price": row["price"],
                    "availableFrom": row["available_from"],
                    "availableTo": row["available_to"],
                    "status": row["status"],
                    "cancelledAt": row["cancelled_at"],
                    "cancellationReason": row["cancellation_reason"],
                    "reservedAt": row["reserved_at"],
                }
            )

    logger.info(nibbles)
    return nibbles

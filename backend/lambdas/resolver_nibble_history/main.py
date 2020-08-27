import logging
from datetime import datetime

from common import tables, utils
from common.errors import NibbleError
from sqlalchemy import asc, desc
from sqlalchemy.sql import and_, not_, select

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# get tables
engine = utils.get_engine()
nibble_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE)
reservation_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_RESERVATION)


def lambda_handler(event, context):
    """Resolves requests for user's reserved/history nibble information
    """
    logger.info(event)
    field = event["field"]

    if field not in (
        "User.nibblesReserved",
        "User.nibblesHistory",
        "nibbleReservation",
    ):
        raise NibbleError("Resolving unexpected field {0} on User type".format(field))

    # set up info we want
    nibble_info_cols = [
        nibble_table.c.id,
        nibble_table.c.type,
        nibble_table.c.image_url,
        nibble_table.c.description,
        nibble_table.c.available_from,
        nibble_table.c.available_to,
    ]
    nibble_reservation_info_cols = [
        reservation_table.c.nibble_id,
        reservation_table.c.nibble_name,
        reservation_table.c.reserved_count,
        reservation_table.c.reserved_at,
        reservation_table.c.price,
        reservation_table.c.status,
        reservation_table.c.cancelled_at,
        reservation_table.c.cancellation_reason,
    ]

    # handle single nibbleReservation query
    if field == "nibbleReservation":
        user_id = event["identity"]["username"]
        nibble_id = event["arguments"]["nibbleId"]

        s = select(nibble_info_cols + nibble_reservation_info_cols).where(
            and_(
                reservation_table.c.user_id == user_id,
                reservation_table.c.nibble_id == nibble_id,
                nibble_table.c.id == nibble_id,
            )
        )

        with engine.connect() as conn:
            result = conn.execute(s)
            reservation_row = result.fetchone()
            if reservation_row is None:
                logger.info("No reservation found")
                return None
            result = {
                "id": reservation_row["nibble_id"],
                "name": reservation_row["nibble_name"],  # from reservation, not nibble
                "type": reservation_row["type"],
                "count": reservation_row["reserved_count"],
                "imageUrl": reservation_row["image_url"],
                "description": reservation_row["description"],
                "price": reservation_row["price"],
                "availableFrom": reservation_row["available_from"],
                "availableTo": reservation_row["available_to"],
                "status": reservation_row["status"],
                "cancelledAt": reservation_row["cancelled_at"],
                "cancellationReason": reservation_row["cancellation_reason"],
                "reservedAt": reservation_row["reserved_at"],
            }
            logger.info(result)
            return result

    # query is either nibblesReserved or nibblesHistory

    # get user id from source
    user_id = event["source"]["id"]

    current_time = int(datetime.now().timestamp())

    nibbles_reserved_conditions = and_(
        (
            nibble_table.c.available_to > current_time
        ),  # we only want nibbles still in availability window...
        (reservation_table.c.status == utils.NibbleReservationStatus.Reserved.value),
    )  # ... that are reserved, but not cancelled or completed

    nibbles_history_conditions = not_(nibbles_reserved_conditions)

    if field == "User.nibblesReserved":
        nibbles_condition = nibbles_reserved_conditions
        order_field = asc(nibble_table.c.available_to)
    elif field == "User.nibblesHistory":
        nibbles_condition = nibbles_history_conditions
        order_field = desc(reservation_table.c.reserved_at)
    else:
        raise NibbleError("Unrecognized field " + field)

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

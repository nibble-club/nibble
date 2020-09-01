import logging
import os

import redis
from common import redis_keys, tables, utils
from common.errors import NibbleError
from sqlalchemy.sql import and_, select

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# connect to database
engine = utils.get_engine()
nibble_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE)
user_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_USER)
restaurant_restaurant_admin_table = tables.get_table_metadata(
    tables.NibbleTable.RESTAURANT_RESTAURANT_ADMIN
)
reservation_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_RESERVATION)

# connect to Redis
r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])


def lambda_handler(event, context):
    """Resolves adminNibbleReservations GraphQL requests
    """
    logger.info(event)
    event_field = event["field"]
    if event_field not in ("adminNibbleReservations",):
        raise NibbleError(
            "Incorrect request type {0} for adminNibbleReservations handler".format(
                event_field
            )
        )

    admin_id = event["identity"]["username"]
    admin_id_restaurant_id_mapping = (
        select([restaurant_restaurant_admin_table.c.restaurant_id])
        .where(restaurant_restaurant_admin_table.c.admin_id == admin_id)
        .alias()
    )

    nibble_id = event["arguments"]["nibbleId"]

    # set up SQL statement
    user_info_cols = [
        user_table.c.full_name,
        user_table.c.email,
        user_table.c.profile_url,
    ]
    nibble_reservation_info_cols = [
        reservation_table.c.nibble_id,
        reservation_table.c.user_id,
        reservation_table.c.reserved_count,
        reservation_table.c.reserved_at,
        reservation_table.c.price,
        reservation_table.c.status,
        reservation_table.c.cancelled_at,
        reservation_table.c.cancellation_reason,
    ]

    # get all reservations for given nibble
    s = (
        select(user_info_cols + nibble_reservation_info_cols)
        .select_from(
            user_table.join(
                reservation_table, user_table.c.id == reservation_table.c.user_id
            )
        )
        .where(reservation_table.c.nibble_id == nibble_id)
        .order_by(reservation_table.c.reserved_at)
    )
    with engine.connect() as conn:  # transactionizes SQL updates
        # check that this restaurant admin owns this nibble
        result = conn.execute(
            select([nibble_table.c.restaurant_id]).where(
                and_(
                    nibble_table.c.id == nibble_id,
                    nibble_table.c.restaurant_id
                    == admin_id_restaurant_id_mapping.c.restaurant_id,
                )
            )
        )
        nibble_row = result.fetchone()
        if nibble_row is None:
            raise NibbleError("Cannot retrieve reservations for given Nibble")

        db_rows = conn.execute(s)
        result = sorted(
            admin_reservations_result_mapper(db_rows), key=reservation_sort_key
        )
    # end of SQL connection
    logger.info(result)
    try:
        total_available = int(r.hget(redis_keys.NIBBLES_AVAILABLE, nibble_id))
    except Exception as e:
        logger.error(e)
        raise NibbleError("Could not get total Nibble count")
    # get total available count
    return {
        "reservations": result,
        "totalAvailable": total_available,
    }


def admin_reservations_result_mapper(db_rows):
    """Creates GraphQL event result to return, based on rows returned from database.
    Truncates name to preserve some user privacy."""
    result = []
    for row in db_rows:
        full_name = row["full_name"].split()
        truncated_name = f"{full_name[0]} {full_name[1][0:1]}."
        result.append(
            {
                "nibbleId": row["nibble_id"],
                "count": row["reserved_count"],
                "price": row["price"],
                "reservedAt": row["reserved_at"],
                "status": row["status"],
                "cancelledAt": row["cancelled_at"],
                "cancellationReason": row["cancellation_reason"],
                "user": {
                    "userId": row["user_id"],
                    "name": truncated_name,
                    "email": row["email"],
                    "profilePicUrl": row["profile_url"],
                },
            }
        )
    return result


def reservation_sort_key(reservation):
    """Creates sorting key from a reservation, as returned by
    `admin_reservations_result_mapper`. Sorts orders first by status (reserved, then
    completed, then cancelled by the user, then cancelled by the restaurant), and then
    by the time of reservation"""
    if reservation["status"] == "Reserved":
        status_code = 0
    elif reservation["status"] == "Completed":
        status_code = 1
    elif reservation["status"] == "CancelledByRestaurant":
        status_code = 2
    elif reservation["status"] == "CancelledByUser":
        status_code = 3
    else:
        status_code = 4
    return (status_code, reservation["reservedAt"])

import logging
import json
import os
from common import tables, utils, validation, redis_keys
from sqlalchemy.sql import select, and_
from sqlalchemy.exc import IntegrityError
import redis
from redis.lock import LockError
from datetime import datetime
import boto3
from common.errors import NibbleError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# get database info
engine = utils.get_engine()


def lambda_handler(event, context):
    """Resolves requests related to Nibble reservations
    """
    logger.info(event)
    field = event["field"]
    if field not in (
        "nibbleCreateReservation",
        "nibbleEditReservation",
        "nibbleCancelReservation",
        "adminCancelReservation",
    ):
        raise NibbleError(
            "Incorrect request type {0} for nibble reservation handler".format(
                event["field"]
            )
        )

    user_id = event["arguments"]["userId"]
    nibble_id = event["arguments"]["nibbleId"]

    # connect to Redis
    r = redis.Redis(host=os.environ["REDIS_HOST"], port=os.environ["REDIS_PORT"])
    r.ping()
    logger.info("Connected to Redis")

    nibble_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE)
    reservation_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE_RESERVATION)

    current_time = int(datetime.now().timestamp())

    # validate Nibble is still available, fetch details
    s = select(
        [
            nibble_table.c.available_to,
            nibble_table.c.name,
            nibble_table.c.price,
            nibble_table.c.type,
            nibble_table.c.image_url,
            nibble_table.c.available_from,
            nibble_table.c.available_to,
            nibble_table.c.description,
        ]
    ).where(nibble_table.c.id == nibble_id)
    with engine.connect() as conn:
        result = conn.execute(s)
        nibble_row = result.fetchone()
    if nibble_row is None:
        raise NibbleError("Invalid nibble ID {0}".format(nibble_id))
    nibble_name = nibble_row["name"]
    nibble_price = nibble_row["price"]
    nibble_available_from = nibble_row["available_from"]
    nibble_available_to = nibble_row["available_to"]
    nibble_type = nibble_row["type"]
    nibble_image_url = nibble_row["image_url"]
    nibble_description = nibble_row["description"]

    if validation.in_past(nibble_available_to):
        raise NibbleError("Cannot change reservation on nibble, already expired")

    if field == "nibbleCancelReservation" or field == "adminCancelReservation":

        def cancel_reservation(conn, pipe, counts):
            select_old_reservation = select(
                [
                    reservation_table.c.reserved_count,
                    reservation_table.c.price,
                    reservation_table.c.status,
                ]
            ).where(
                and_(
                    reservation_table.c.user_id == user_id,
                    reservation_table.c.nibble_id == nibble_id,
                )
            )
            # TODO: do nothing if status is already cancelled
            rows = conn.execute(select_old_reservation)
            old_reservation = rows.fetchone()
            if old_reservation is None:
                raise NibbleError("No such reservation to cancel")

            old_status = old_reservation["status"]
            if old_status in (
                utils.NibbleReservationStatus.CancelledByRestaurant.value,
                utils.NibbleReservationStatus.CancelledByUser.value,
            ):
                raise NibbleError("Reservation already cancelled")
            old_count = old_reservation["reserved_count"]
            old_price = old_reservation["price"]
            new_status = (
                utils.NibbleReservationStatus.CancelledByUser.value
                if field == "nibbleCancelReservation"
                else utils.NibbleReservationStatus.CancelledByRestaurant.value
            )
            reason = event["arguments"].get("reason", None)  # could be null
            update_reservation = (
                reservation_table.update()
                .where(
                    and_(
                        reservation_table.c.user_id == user_id,
                        reservation_table.c.nibble_id == nibble_id,
                    )
                )
                .values(
                    status=new_status,
                    cancelled_at=current_time,
                    cancellation_reason=reason,
                )
            )
            conn.execute(update_reservation)
            pipe.hincrby(redis_keys.NIBBLES_REMAINING, nibble_id, old_count)
            pipe.execute()
            return {"oldPrice": old_price}

        result = run_in_transaction(r, engine, nibble_id, cancel_reservation)
        logger.info(result)
        sqs = boto3.client(
            service_name="sqs", endpoint_url="https://" + os.environ["ENDPOINT"]
        )
        sqs.send_message(
            QueueUrl=os.environ["CANCELLED_QUEUE"], MessageBody=json.dumps(event),
        )
        logger.info("Sent event to cancelled queue")
        return result
    # end if cancellation
    if field == "nibbleCreateReservation":
        count = event["arguments"]["count"]

        if count < 1:
            raise NibbleError("Invalid new count, should be greater than 0")

        price = nibble_price * count
        status = utils.NibbleReservationStatus.Reserved.value

        def create_reservation(conn, pipe, counts):
            _, remaining_count = counts
            if count > remaining_count:
                raise NibbleError(
                    "Cannot reserve {0} nibbles, only {1} remaining".format(
                        count, remaining_count
                    )
                )

            # check if existing reservation
            select_existing_reservation = select([reservation_table.c.status]).where(
                and_(
                    reservation_table.c.user_id == user_id,
                    reservation_table.c.nibble_id == nibble_id,
                )
            )
            existing_reservation = conn.execute(select_existing_reservation).fetchone()
            if existing_reservation is not None:
                existing_status = existing_reservation["status"]
                if existing_status == utils.NibbleReservationStatus.Reserved.value:
                    raise NibbleError(
                        "A reservation already exists, try updating that one instead"
                    )
                elif (
                    existing_status
                    == utils.NibbleReservationStatus.CancelledByRestaurant.value
                ):
                    raise NibbleError(
                        "Restaurant cancelled your reservation; try a different Nibble"
                    )
                elif existing_status == utils.NibbleReservationStatus.Completed.value:
                    raise NibbleError(
                        "You already reserved this Nibble; try again with a different one"
                    )
                else:
                    logger.info("Allowing user to resurrect reservation")
                    conn.execute(
                        reservation_table.delete().where(
                            and_(
                                reservation_table.c.user_id == user_id,
                                reservation_table.c.nibble_id == nibble_id,
                            )
                        )
                    )

            insert_reservation = reservation_table.insert().values(
                nibble_id=nibble_id,
                user_id=user_id,
                nibble_name=nibble_name,
                reserved_count=count,
                reserved_at=current_time,
                price=price,
                status=status,
            )

            conn.execute(insert_reservation)
            pipe.hincrby(redis_keys.NIBBLES_REMAINING, nibble_id, -count)
            pipe.execute()
            return {
                "id": nibble_id,
                "name": nibble_name,
                "type": nibble_type,
                "count": count,
                "price": price,
                "imageUrl": nibble_image_url,
                "description": nibble_description,
                "status": status,
                "reservedAt": current_time,
                "availableFrom": nibble_available_from,
                "availableTo": nibble_available_to,
            }

        result = run_in_transaction(r, engine, nibble_id, create_reservation)
        logger.info(result)
        return result
    # end if creation
    elif field == "nibbleEditReservation":
        new_count = event["arguments"]["newCount"]
        if new_count < 1:
            raise NibbleError("Invalid new count, should be greater than 0")

        def edit_reservation(conn, pipe, counts):
            _, remaining_count = counts
            select_old_reservation = select(
                [
                    reservation_table.c.reserved_count,
                    reservation_table.c.status,
                    reservation_table.c.nibble_name,
                ]
            ).where(
                and_(
                    reservation_table.c.user_id == user_id,
                    reservation_table.c.nibble_id == nibble_id,
                )
            )
            rows = conn.execute(select_old_reservation)
            old_reservation = rows.fetchone()
            if old_reservation is None:
                raise NibbleError("No such reservation to update")

            old_count = old_reservation["reserved_count"]
            nibble_name = old_reservation["nibble_name"]
            status = old_reservation["status"]
            if status != utils.NibbleReservationStatus.Reserved.value:
                raise NibbleError(
                    "Cannot reserve nibble with status {0}".format(status)
                )

            new_price = nibble_price * new_count
            update_reservation = (
                reservation_table.update()
                .where(
                    and_(
                        reservation_table.c.user_id == user_id,
                        reservation_table.c.nibble_id == nibble_id,
                    )
                )
                .values(reserved_count=new_count, price=new_price)
            )
            count_increased_by = new_count - old_count
            if count_increased_by > remaining_count:
                raise NibbleError(
                    "Cannot change reservation from {0} to {1}, there are only {2} available".format(
                        old_count, new_count, remaining_count
                    )
                )
            conn.execute(update_reservation)
            pipe.hincrby(redis_keys.NIBBLES_REMAINING, nibble_id, -count_increased_by)
            pipe.execute()
            return {
                "id": nibble_id,
                "name": nibble_name,
                "type": nibble_type,
                "count": new_count,
                "price": new_price,
                "imageUrl": nibble_image_url,
                "description": nibble_description,
                "status": status,
                "reservedAt": current_time,
                "availableFrom": nibble_available_from,
                "availableTo": nibble_available_to,
            }
            # construct result

        # end definition of edit function
        result = run_in_transaction(r, engine, nibble_id, edit_reservation)
        logger.info(result)
        return result
    # end if update reservation


def run_in_transaction(r, engine, nibble_id, func):
    """Given a function `func` which takes three arguments, `conn` (a SQLAlchemy 
    connection), `pipe` (a redis-py pipeline), and a tuple of (available_count, 
    remaining_count) for the given nibble ID, runs it in a transaction such that
    either every operation in the function succeeds or they all fail. Runs this all
    with a lock on the given nibble_id acquired. Returns the value returned by `func`.
    Uses the given Redis client and SQLAlchemy engine.
    """
    try:  # meant to catch LockErrors
        with r.lock(
            redis_keys.nibble_lock(nibble_id), blocking_timeout=3
        ):  # acquire Redis lock on nibble
            # get current counts
            available_count = int(r.hget(redis_keys.NIBBLES_AVAILABLE, nibble_id))
            remaining_count = int(r.hget(redis_keys.NIBBLES_REMAINING, nibble_id))
            with engine.begin() as conn:  # transactionizes SQL calls
                with r.pipeline() as pipe:  # transactionizes Redis calls
                    result = func(conn, pipe, (available_count, remaining_count))
    except LockError:
        raise NibbleError(
            "Someone is currently making a reservation, try again in a moment"
        )

    return result

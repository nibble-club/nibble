import logging
import json
import os
from common import tables, utils, validation
from sqlalchemy.sql import select

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    """Resolves requests for restaurant info, across various contexts
    """
    logger.info(event)
    source_info = event["field"]
    # field should be something like [source].restaurant; this is entirely defined by
    # resolver implementation
    source, field = source_info.split(".")
    if "restaurant" not in field:
        raise RuntimeError(
            "Invalid field {0} for restaurant info resolver".format(source_info)
        )

    # connect to database
    engine = utils.get_engine()

    nibble_table = tables.get_table_metadata(tables.NibbleTable.NIBBLE)
    restaurant_table = tables.get_table_metadata(tables.NibbleTable.RESTAURANT)

    restaurant_info_cols = [
        restaurant_table.c.id,
        restaurant_table.c.name,
        restaurant_table.c.market,
        restaurant_table.c.description,
        restaurant_table.c.disclaimer,
        restaurant_table.c.logo_url,
        restaurant_table.c.hero_url,
        restaurant_table.c.street_address,
        restaurant_table.c.dependent_locality,
        restaurant_table.c.locality,
        restaurant_table.c.administrative_area,
        restaurant_table.c.country,
        restaurant_table.c.postal_code,
        restaurant_table.c.latitude,
        restaurant_table.c.longitude,
        restaurant_table.c.active,
    ]

    if source == "Nibble":
        # get restaurant ID from Nibble, then restaurant info
        nibble_id = event["source"]["id"]
        s = (
            select(restaurant_info_cols)
            .select_from(
                restaurant_table.join(
                    nibble_table, restaurant_table.c.id == nibble_table.c.restaurant_id
                )
            )
            .where(nibble_table.c.id == nibble_id)
        )
    # end if source is nibble
    elif source == "Query":
        # get restaurant ID from query arguments
        restaurant_id = event["arguments"]["restaurantId"]
        s = select(restaurant_info_cols).where(restaurant_table.c.id == restaurant_id)

    else:
        raise RuntimeError("Invalid source {0}".format(source))

    with engine.connect() as conn:
        result = conn.execute(s)
        restaurant_row = result.fetchone()
        result.close()

    if restaurant_row is None:
        raise RuntimeError("No such restaurant")

    restaurant = {
        "id": restaurant_row["id"],
        "name": restaurant_row["name"],
        "market": restaurant_row["market"],
        "description": restaurant_row["description"],
        "logoUrl": restaurant_row["logo_url"],
        "heroUrl": restaurant_row["hero_url"],
        "disclaimer": restaurant_row["disclaimer"],
        "active": restaurant_row["active"],
        "address": {
            "streetAddress": restaurant_row["street_address"],
            "dependentLocality": restaurant_row["dependent_locality"],
            "locality": restaurant_row["locality"],
            "administrativeArea": restaurant_row["administrative_area"],
            "country": restaurant_row["country"],
            "postalCode": restaurant_row["postal_code"],
            "location": {
                "longitude": restaurant_row["longitude"],
                "latitude": restaurant_row["latitude"],
            },
        },
    }

    print(restaurant)
    return restaurant

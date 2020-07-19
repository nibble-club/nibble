import logging
import json

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("I'm alive!")
    logger.info(event)
    logger.info(context)
    return {"statusCode": 200, "body": json.dumps("I'm alive!")}

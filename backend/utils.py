import logging
import os
from datetime import datetime, timedelta
from enum import Enum

import requests
from sqlmodel import select

from backend.db import FreeUser

logger = logging.getLogger("WifiAllocation")
logger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler("WifiAllocation.log")
console_handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)
logger.addHandler(file_handler)
logger.addHandler(console_handler)

no_dog_url = os.getenv("NO_DOG_URL")


class UserType(str, Enum):
    FREE = "free"
    PREMIUM = "premium"


def authenticate_user(token: str):
    """
    Receives a token and authenticate that user
    :param token: The token receives
    :return: JsonResponse holding the result of the auth
    """
    return requests.get(f"{no_dog_url}/auth/{token}")


async def get_no_dog_status():
    """
    Try to get the status of the no dog
    :return: The content form the no dog if exists
    """
    try:
        resp = requests.get(f"{no_dog_url}/status")
        return resp
    except Exception:
        return {"status": "Can not connect to the no dog, check the no dog service"}


async def delete_expired_users(session):
    """
    Gets all free users who were connected for more than 3 minutes and disconnect them, delete them from db as well
    :param session: The engine session object
    """
    expiration_time = datetime.now() - timedelta(minutes=5)
    expired_users = session.exec(select(FreeUser).where(FreeUser.time_of_registration < expiration_time)).all()
    for user in expired_users:
        logger.debug(f"Found free user to delete: {user.token}")
        await remove_and_deauth_user(user=user, session=session)
        # TODO: think of recover option you can do in case of failure
    session.commit()


async def assert_avg_speed(session):
    """
    Receives the current download speed, in case it is lower than MINIMUM_SPEED_ALLOWED we remove all free users
    :param session: The engine session object
    """
    res = requests.get(f"{no_dog_url}/getTotalUsageAndAvgSpeed")
    avg_speed = dict(res.content)["message"]["avg_download_speed"]
    if avg_speed < os.getenv("MINIMUM_SPEED_ALLOWED"):
        await remove_all_free_users(session=session)


async def remove_all_free_users(session):
    """
    Remove all free users and de authenticate them
    :param session: The engine session object
    """
    free_users = session.exec(select(FreeUser)).all()
    logger.debug("About to de auth all free user due to low avg speed")
    for user in free_users:
        await remove_and_deauth_user(user=user, session=session)
    session.commit()


async def remove_and_deauth_user(user, session):
    """
    Remove and de authenticate a user by its token
    :param user: The user to remove
    :param session: The engine session object
    """
    res = requests.get(f"{no_dog_url}/deauth/{user.token}")
    if res.status_code == 200:
        session.delete(user)
        logger.debug(f"delete user with token: {user.token}")

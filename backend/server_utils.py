import json
import os
import uuid
from datetime import datetime, timedelta
from functools import wraps
from typing import Type, List, Tuple

import qrcode
import requests
from fastapi import HTTPException
from sqlmodel import select

from db import FreeUser, IFreeUserRead, IPremiumUserRead, IPremiumUserCreate, PremiumUser
from db_utils import validate_user, add_new_free_user_to_db, remove_user, add_new_premium_user_to_db, \
    activate_premium_user_in_db, get_expired_premium_users, get_premium_user, get_free_user, validate_qr_user
from utils import logger, no_dog_url, UserType, user_status, serialize_td

minimum_allowed_speed = os.getenv("MINIMUM_SPEED_ALLOWED")
free_user_allowed_session = os.getenv("FREE_USER_SESSION_ALLOWED")


def authenticate_user(token: str):
    """
    Receives a token and authenticate that user
    :param token: The token receives
    :return: JsonResponse holding the result of the auth
    """
    logger.debug(f"Sending authenticate request to no dog server with token: {token}")
    try:
        res = requests.get(f"{no_dog_url}/auth/{token}")
        logger.debug("Got authentication response from server, response {res}")
        return res
    except Exception as e:
        logger.error(f"Unable to authenticate another user, with error: {e}")
        raise HTTPException(status_code=400, detail=f"Unable to authenticate another user, error: {e}")


def assert_server_speed(func):
    """
    Asserts that the speed server is valid, in case it is not raises an exception
    """

    @wraps(func)
    async def wrapper(*args, **kwargs):
        current_speed = await get_current_speed()
        if float(current_speed) < float(minimum_allowed_speed):
            await handle_too_slow_speed(*args, **kwargs, current_speed=current_speed)
        return await func(*args, **kwargs)

    return wrapper


async def handle_too_slow_speed(args, kwargs):
    """
    A handler function for too slow speed case
    """
    premium_user = kwargs.pop('premium_user', None)
    if premium_user:
        # A premium user trying to log in but failed, remove all free users
        await remove_all_free_users(session=kwargs.pop("session"))
        if not int(kwargs.pop("current_speed")) < int(minimum_allowed_speed):
            # Now there is a valid average speed
            return
    raise HTTPException(status_code=404, detail="There are too many users connected, try again later")


# @assert_server_speed
async def add_new_premium_user(new_user, session, premium_user: bool = True) -> IPremiumUserRead:
    """
    Add a new premium user object
    :param new_user: A new user to add
    :param session: The engine session object
    :param premium_user: holding the type of the user we are adding for the wrapper
    :return: The created user
    """
    user: IPremiumUserRead = add_new_premium_user_to_db(new_user=new_user, session=session)
    res = authenticate_user(token=user.token)
    await handle_auth_request(response=res, session=session, user_type=UserType.PREMIUM, email=user.email)
    if res.status_code == 200:
        return user
    raise HTTPException(status_code=res.status_code,
                        detail=f"Unable to create a new premium user with error: {res.content}")


async def assert_valid_premium_user(user: IPremiumUserCreate, session):
    """
    compare the user data received with the data stored in the db
    :param user: The user data received
    :param session: The engine session object
    :return: IPremiumUserRead holding the data of the user
    """
    if validate_user(pwd=user.password, email=user.email, session=session):
        logger.debug(f"A valid user logged in, auth user with no dog, email: {user.email}")
        response = authenticate_user(token=user.token)
        return activate_premium_user_in_db(session=session, new_user=user)
    raise HTTPException(status_code=400, detail="invalid password or user name")


async def get_no_dog_status():
    """
    Try to get the status of the no dog
    :return: The content form the no dog if exists
    """
    try:
        resp = requests.get(f"{no_dog_url}/status")
        return resp.status_code
    except Exception:
        return {"status": "Can not connect to the no dog, check the no dog service"}


async def delete_expired_free_users(session):
    """
    Gets all free users who were connected for more than 3 minutes and disconnect them, delete them from db as well
    :param session: The engine session object
    """
    expiration_time = datetime.now() - timedelta(minutes=int(os.getenv("FREE_USER_SESSION_ALLOWED")))
    expired_users = session.exec(select(FreeUser).where(FreeUser.login_time < expiration_time)).all()
    for user in expired_users:
        logger.debug(f"Found free user to delete: {user.token}")
        await remove_and_deauth_user(user=user, session=session, user_type=UserType.FREE)
    session.commit()


async def delete_expired_premium_users(session):
    """
    Delete and de authenticate all premium users who passed their session time
    :param session: The engine session object
    :return: A list of IPremiumUserRead object holding the users who have been removed
    """
    expired_premium_users: List[PremiumUser] = get_expired_premium_users(session=session)
    for premium_user in expired_premium_users:
        logger.debug(f"The session of user: {premium_user.email} expired, about to un auth it")
        await remove_and_deauth_user(session=session, user_type=Type[PremiumUser], user=premium_user)


async def get_current_speed():
    """
    :return: The last 5 min speed from the server
    """
    res = requests.get(f"{no_dog_url}/lastFiveMinAvgSpeed")
    avg_speed = json.loads(res.content.decode())["message"]
    logger.debug(f"Got current speed from server: {avg_speed}")
    return avg_speed


async def get_avg_speed():
    """
    Returns the avg speed of the server
    """
    res = requests.get(f"{no_dog_url}/getTotalUsageAndAvgSpeed")
    avg_speed = json.loads(res.content.decode())["message"]["avg_download_speed"]
    logger.debug(f"Got average speed from server: {avg_speed}")
    return avg_speed


async def force_high_avg_speed(session, average_download_speed):
    """
    Receives the current download speed, in case it is lower than MINIMUM_SPEED_ALLOWED we remove all free users
    :param session: The engine session object
    :param average_download_speed: The average download speed from the server
    """
    # ClientForceTimeout 3600  # Force logout after 1 hour
    # ClientIdleTimeout 300    # Logout after 5 minutes of inactivity
    if average_download_speed < minimum_allowed_speed:
        logger.debug("The average speed is low, starting to remove free users from the server")
        await remove_all_free_users(session=session)


async def remove_all_free_users(session):
    """
    Remove all free users and de authenticate them
    :param session: The engine session object
    """
    free_users = session.exec(select(FreeUser)).all()
    logger.debug("About to de auth all free user due to low avg speed")
    for user in free_users:
        await remove_and_deauth_user(user=user, session=session, user_type=UserType.FREE)


async def deauth_premium_user(token: str):
    """
    Gets an email of an existing premium user and only disconnect him
    :param token: The email of the user to disconnect
    """
    return requests.get(f"{no_dog_url}/deauth/{token}")


async def remove_and_deauth_user(user, session, user_type: UserType):
    """
    Remove and de authenticate a user by its token
    :param user: The user to remove
    :param user_type: The type of the user to be deleted
    :param session: The engine session object
    """
    res = requests.get(f"localhost:8083/deauth/{user.token}")
    if res.status_code == 200:
        remove_user(user_token=user.token, session=session, user_type=user_type)


@assert_server_speed
async def add_free_user(token: str, session):
    """
    Receives a token of a new free user and adds it to the db
    :param token:
    :param session: The engine session object
    :return: The FreeUserRead object
    """
    try:
        user: IFreeUserRead = add_new_free_user_to_db(token=token, session=session)
        response = authenticate_user(token=user.token)
        logger.debug(f"Added a new free user with token {token}")
        await handle_auth_request(response=response, session=session, user_type=UserType.FREE, token=user.token)
        return user, response
    except Exception as e:
        logger.error(f"An error occurred while trying to add new free user, error: {e}")
        session.rollback()
        raise e


def network_speed_check(average_download_speed: float):
    """
    A decorator that only lets add a user if the average download speed is above a certain level
    :param average_download_speed: The latest average download speed
    """

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if average_download_speed < float(os.getenv("MINIMUM_SPEED_ALLOWED")):
                logger.info(
                    f"There are too many users in the network, unable to add another user,"
                    f" avg_speed: {average_download_speed}")
                raise HTTPException(status_code=403, detail="Could not another user, the network is full")
            return await func(*args, **kwargs)

        return wrapper

    return decorator


async def handle_auth_request(response, session, user_type: UserType, email: str = None, token: str = None):
    """
    Receives the response from the server and handles it accordingly
    :param response: The response from the server
    :param session: The engine session object
    :param token: The token of the handled user, default none
    :param email: The email of the user to be removed
    :param user_type: The type of the user to be removed
    """
    if response.status_code != 200:
        content: str = response.content.decode()
        logger.error(f"NoDog failed to auth a user, now removing from db, error: {content}")
        remove_user(user_email=email, session=session, user_type=user_type, user_token=token)
        raise HTTPException(status_code=400, detail=f"Unable to auth a user, with error: {content}")


# The server could not authenticate the new user, remove the free user from the db

async def get_current_status(token: str, session):
    """
    Gets a token and return the current status of the user
    """
    premium_user = get_premium_user(token=token, session=session)
    if premium_user:
        return await premium_user_status(premium_user=premium_user)
    free_user = get_free_user(token=token, session=session)
    if free_user:
        return await free_user_status(free_user=free_user, session=session)
    else:
        raise HTTPException(status_code=405, detail="Unable to get current status for user, no such user found in db")


async def premium_user_status(premium_user: PremiumUser) -> user_status:
    """
    Return a premium user status response containing the status of the current premium user
    """
    current_speed = await get_current_speed()
    current_time = datetime.now()
    expiration_time = premium_user.login_time + timedelta(hours=premium_user.premium_duration)
    time_remaining = expiration_time - current_time
    time_remaining: dict = serialize_td(td=time_remaining)
    return user_status(time_remaimning=time_remaining,
                       login_time=premium_user.login_time.isoformat(), current_speed=current_speed)


async def free_user_status(free_user: FreeUser, session):
    """
    Return a premium user status response containing the status of the current premium user
    """
    current_speed = await get_current_speed()
    current_time = datetime.now()
    expiration_time = free_user.login_time + timedelta(minutes=int(os.getenv("SESSION_DURATION_TIME")))
    time_remaining = expiration_time - current_time
    time_remaining: dict = serialize_td(td=time_remaining)
    return user_status(time_remaimning=time_remaining,
                       login_time=free_user.login_time.isoformat(), current_speed=current_speed)


def generate_qr() -> Tuple[qrcode.QRCode, str]:
    """
    Generates a new qr code and token to add to the QRUser table
    :return:
    """
    logger.debug("About to generate a new qr")
    qr: qrcode.QRCode = qrcode.QRCode(
        version=1,  # controls the size of the QR Code
        error_correction=qrcode.constants.ERROR_CORRECT_L,  # error correction level
        box_size=10,  # size of each box in pixels
        border=4,  # thickness of the border (in boxes)
    )
    qr_token_to_add = str(uuid.uuid4()).replace('-', '')[:12]
    base_qr_url = os.getenv("QR_URL")
    qr.add_data(f"{base_qr_url}/{qr_token_to_add}")
    qr.make(fit=True)
    logger.debug(f"Created a new qr with details: {base_qr_url}/{qr_token_to_add}")
    return qr, qr_token_to_add


async def activate_qr_user(session, qr_token: str):
    """
    :param session: The engine session object
    :param qr_token: The token of the user to be activated
    :return:
    """
    new_qr_user = validate_qr_user(session=session, qr_token=qr_token)
    #TODO: check how to get the real token instead of the one generated in the db
    #authenticate_user(token=qr_token)
    return new_qr_user

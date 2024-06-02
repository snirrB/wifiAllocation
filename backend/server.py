import asyncio
import os
from typing import Union, Tuple

from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session
from starlette.responses import JSONResponse

from backend.db import IFreeUserRead
from backend.db_utils import create_db_healthcheck, IPremiumUserCreate, IPremiumUserRead, \
    remove_user, deactivate_premium_user_in_db
from backend.server_utils import assert_valid_premium_user, get_no_dog_status, delete_expired_free_users, get_avg_speed, \
    force_high_avg_speed, add_free_user, add_new_premium_user, network_speed_check, deauth_premium_user, \
    delete_expired_premium_users
from backend.utils import logger, UserType

no_dog_url = os.getenv("NO_DOG_URL")
sqlite_url = os.getenv("SQLITE_URL_PREFIX") + os.getenv("SQLITE_FILE_NAME")
engine = create_engine(sqlite_url, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
app_route = APIRouter()
db_route = APIRouter(prefix="/db")

# Run the delete_expired_users function periodically (every minute)

average_download_speed = 0.0


def get_db():
    with Session(engine) as session:
        yield session


@app_route.on_event("startup")
async def startup_event():
    """
    Adding the background tasks to run while the server is running
    :return:
    """
    loop = asyncio.get_running_loop()
    loop.create_task(remain_valid_speed())
    loop.create_task(delete_expired_users_background())
    loop.create_task(delete_expired_premium_users_task())


async def delete_expired_premium_users_task():
    """
    Deleting user who passed their session time
    """
    session_duration = int(os.getenv("SESSION_DURATION_TIME"))
    while True:
        session = next(get_db())
        logger.info("Starting delete expired premium user routine")
        await delete_expired_premium_users(session=session, session_duration=session_duration)
        await asyncio.sleep(300)  # Wait for 5 minutes


async def remain_valid_speed():
    """
    Ensures that the average speed in the server is valid.
    """
    while True:
        await asyncio.sleep(600)  # Run every 10 minute
        session = next(get_db())
        await force_high_avg_speed(session, average_download_speed=get_avg_speed())


async def delete_expired_users_background():
    """
    Attach delete_expired_users function to the event loop
    """
    while True:
        await asyncio.sleep(60)  # Run every minute
        session = next(get_db())
        await delete_expired_free_users(session)


@app_route.get("/status")
async def get_status(session=Depends(get_db)):
    """
    Receive the status of the db
    """
    no_dog_resp = await get_no_dog_status()
    sql_resp = await create_db_healthcheck(session=session)
    return JSONResponse(content={"no dog status": no_dog_resp, "db_status": sql_resp})

    # async def get_nodog_status(session=Depends(get_db)):


@app_route.post("/logout/premium_user/{email}")
async def logout_user(email: str, session=Depends(get_db)):
    """
    Gets an email of an existing premium user and deactivate it in the db
    :param email: The email of the user to disconnect
    :param session: The engine session object
    :return:
    """
    user = deactivate_premium_user_in_db(email=email, session=session)
    return deauth_premium_user(token=user.token)


@app_route.get("/login/premium/")
async def login_premium_user(user_to_login: dict, session=Depends(get_db)):
    """
    Receive a dict holding the data of a premium user trying to log in, assert that it is a valid user, and behave
    accordingly
    :param user_to_login: The data of the user trying to log in
    :param session: The engine session object
    :return:
    """
    user = IPremiumUserCreate(**user_to_login["user_to_add"])
    return await assert_valid_premium_user(user=user, session=session)


@db_route.post("/add_premium_user", response_model=Union[IPremiumUserRead, str])
@network_speed_check(average_download_speed=average_download_speed)
async def add_premium_user(user_to_add: dict, session=Depends(get_db)):
    """
    Receive the details of a new user and add it to the db
    :param user_to_add: IUserCreate schema holding a user to add
    :param session: The session engine object
    :return: IUserRead object holding the details of the new created user
    """
    logger.debug(f"About to add a new user to db {user_to_add}")
    new_user = IPremiumUserCreate(**user_to_add["user_to_add"])
    resp = await add_new_premium_user(new_user=new_user, session=session)
    return JSONResponse(status_code=200, content=resp)


@db_route.delete("/delete_premium_user")
async def delete_premium_user(user: dict, session=Depends(get_db)):
    res = remove_user(user_email=user["user_to_add"]["email"], session=session, user_type=UserType.PREMIUM)
    return JSONResponse(status_code=200, content=res)


@db_route.post("/login/free")
@network_speed_check(average_download_speed=average_download_speed)
async def create_new_free_user(token: str, session=Depends(get_db)):
    """
    Creates a new free user and stores it in the db
    :param token: The token received from the no dog
    :param session: The engine session
    """
    res: Tuple[IFreeUserRead, JSONResponse] = await add_free_user(token=token, session=session)
    return JSONResponse(status_code=res[1].status_code, content=res[0].dict())

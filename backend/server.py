import asyncio
import os
from typing import Union

from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session
from starlette.responses import JSONResponse

from backend.db_utils import create_db_healthcheck, IPremiumUserCreate, add_new_premium_user, IPremiumUserRead, \
    remove_premium_user, add_free_user
from backend.utils import get_no_dog_status, logger, delete_expired_users

no_dog_url = os.getenv("NO_DOG_URL")
sqlite_url = os.getenv("SQLITE_URL_PREFIX") + os.getenv("SQLITE_FILE_NAME")
engine = create_engine(sqlite_url, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
app_route = APIRouter()
db_route = APIRouter(prefix="/db")


# Run the delete_expired_users function periodically (every minute)


def get_db():
    with Session(engine) as session:
        yield session


@app_route.on_event("startup")
async def startup_event():
    loop = asyncio.get_running_loop()
    loop.create_task(run_periodically())
    loop.create_task(remain_speed())


async def remain_speed():
    """
    Attach the remain_high_speed function to the event loop
    """
    while True:
        await asyncio.sleep(600)  # Run every 10 minute
        session = next(get_db())
        await assert_avg_speed(session)


async def run_periodically():
    """
    Attach delete_expired_users function to the event loop
    """
    while True:
        await asyncio.sleep(60)  # Run every minute
        session = next(get_db())
        await delete_expired_users(session)


@app_route.get("/status")
async def get_status(session=Depends(get_db)):
    """
    Receive the status of the db
    """
    no_dog_resp = await get_no_dog_status()
    sql_resp = await create_db_healthcheck(session=session)
    return JSONResponse(content={"no dog status": no_dog_resp, "db_status": sql_resp})

    # async def get_nodog_status(session=Depends(get_db)):


@db_route.post("/add_premium_user", response_model=Union[IPremiumUserRead, str])
async def add_premium_user(user_to_add: dict, session=Depends(get_db)):
    """
    Receive the details of a new user and add it to the db
    :param user_to_add: IUserCreate schema holding a user to add
    :param session: The session engine object
    :return: IUserRead object holding the details of the new created user
    """
    logger.debug(f"About to add a new user to db {user_to_add}")
    new_user = IPremiumUserCreate(**user_to_add["user_to_add"])
    resp = add_new_premium_user(new_user=new_user, session=session)
    return JSONResponse(status_code=200, content=resp.dict())


@db_route.delete("/delete")
async def test_delete(user: dict, session=Depends(get_db)):
    res = remove_premium_user(username_to_delete=user["user_to_add"]["username"], session=session)
    return JSONResponse(status_code=200, content=res)


@db_route.post("/add_free_user")
async def create_new_free_user(token: str, session=Depends(get_db)):
    """
    Creates a new free user and stores it in the db
    :param token: The token received from the no dog
    :param session: The engine session
    """
    res = await add_free_user(token=token, session=session)
    return JSONResponse(status_code=200, content=res.dict())

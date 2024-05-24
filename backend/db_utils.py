import os

from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from backend.db import PremiumUser, IPremiumUserCreate, IPremiumUserRead, IFreeUserCreate, FreeUser, IFreeUserRead
from backend.utils import logger, authenticate_user

no_dog_url = os.getenv("NO_DOG_URL")

# Password hashing utilities
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

secret_key = os.getenv("SECRET_KEY")


def get_password_hash(password: str) -> str:
    """
    Gets a password and hashes it using the bcrypt hashing
    :param password: The raw password received from the user
    :return: Hashed password
    """
    logger.debug("Hashing a new password")
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Gets a password and compares it to the hashed password stored in the db
    :param plain_password: The password received from the user
    :param hashed_password: The hashed password stored in the db
    :return: Boolean containing the result of the comparison between the hashed and the rae passwords
    """
    return pwd_context.verify(plain_password, hashed_password)


async def create_db_healthcheck(session):
    """
    Create a healthcheck with the db,  assert that it is up and ready
    :param session: The session engine
    :return: Up if db is valid, else the exception that occurred
    """
    try:
        session.exec(select(PremiumUser)).first()
        return "DB is up and ready"
    except Exception as e:
        return f"DB is not up, got an error: {e}"


def add_new_premium_user(new_user: IPremiumUserCreate, session):
    """
    Add a new premium user to the db
    :param new_user: The new user to add
    :param session: The engine session object
    :return: IUserRead object holding the details of the new user
    """
    try:
        premium_user = PremiumUser(**new_user.dict())
        session.add(premium_user)
        session.commit()
        authenticate_user(premium_user.token)
        logger.debug(f"Added a new user to db: {new_user}")
        return IPremiumUserRead.from_orm(premium_user)

    except IntegrityError as e:
        logger.error(f"could not add a new user because of uniqueness problem, {e.args}")
        session.rollback()
        handle_integrity_error(error=str(e.orig).lower(), user=new_user)
    except Exception as e:
        logger.error(f"Unable to add a new user to db, error: {e}")
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Unable to add a new user to db, error: {e}")


def remove_premium_user(username_to_delete: str, session):
    """
    Gets a username of an existing user to be deleted and delete it from the db
    :param username_to_delete: A string holds the username to be deleted
    :param session: The engine session object
    :return: IUserRead object holding the data of the deleted user
    """
    logger.debug(f"About to delete {username_to_delete} from db")
    result = session.exec(select(PremiumUser).where(PremiumUser.username == username_to_delete))
    user = result.first()
    if user:
        session.delete(user)
        session.commit()
        # TODO remove free user
        return IPremiumUserRead(**user.dict())
    else:
        logger.error(f"Could not find a username {username_to_delete} in db")
        raise HTTPException(status_code=404, detail=f"Could not find a user with username {username_to_delete} in db")


def handle_integrity_error(error, user: IPremiumUserCreate):
    """
    In case of integrity error we want to tell the client explicitly what is the problem
    :param error: The error received from the db
    :param user: The user with the conflict
    :raises: HTTPException with the error
    """
    if "username" in error:
        raise HTTPException(status_code=400, detail=f"Username {user.username} already exists")
    elif "email" in error:
        raise HTTPException(status_code=400, detail=f"Email {user.email} already exists")


async def add_free_user(token: str, session):
    """
    Receives a token of a new free user and adds it to the db
    :param token:
    :param session: The engine session object
    :return: The FreeUserRead object
    """
    try:
        new_free_user = IFreeUserCreate(token=token)
        new_free_user = FreeUser(**new_free_user.dict())
        session.add(new_free_user)
        session.commit()
        response = await authenticate_user(token=token)
        logger.debug(f"Added a new free user with token {token}")
        return IFreeUserRead.from_orm(new_free_user), response
    except Exception as e:
        logger.error(f"An error occurred while trying to add new free user, error: {e}")
        session.rollback()
        raise HTTPException(status_code=400, detail=e.args)

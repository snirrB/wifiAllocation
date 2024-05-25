import os
from typing import Type

from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from backend.db import PremiumUser, IPremiumUserCreate, IPremiumUserRead, IFreeUserCreate, FreeUser, IFreeUserRead
from backend.utils import logger, UserType

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
    # Create the hash using the secret key
    pwd = pwd_context.hash(password + secret_key)
    return pwd


user_model_mapping = {
    UserType.FREE: FreeUser,
    UserType.PREMIUM: PremiumUser
}

user_model_read_mapping = {
    UserType.FREE: IFreeUserRead,
    UserType.PREMIUM: IPremiumUserRead
}


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


def add_new_premium_user_to_db(new_user: IPremiumUserCreate, session):
    """
    Add a new premium user to the db
    :param new_user: The new user to add
    :param session: The engine session object
    :return: IUserRead object holding the details of the new user
    """
    try:
        premium_user = PremiumUser(**new_user.dict())
        premium_user.password = get_password_hash(premium_user.password)
        session.add(premium_user)
        session.commit()
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


def remove_user(session, user_type: UserType, user_email: str = None, user_token: str = None):
    """
    Gets an email or token of an existing user to be deleted and delete it from the db
    :param user_email: A string holds the email to be deleted, default is none
    :param session: The engine session object
    :param user_token: The token of the user to be deleted, default is None
    :param user_type: Holding the type of the user to be removed
    :return: IUserRead object holding the data of the deleted user
    """
    user_type_mapping: Type[FreeUser] | Type[PremiumUser] = user_model_mapping.get(user_type)
    logger.debug(f"About to delete {user_email} from db")
    if user_email:
        result = session.exec(select(user_type_mapping).where(user_type_mapping.email == user_email))
    else:
        result = session.exec(select(user_type_mapping).where(user_type_mapping.token == user_token))
    user = result.first()
    if user:
        session.delete(user)
        session.commit()
        return user_model_read_mapping.get(user_type)(**user.dict())
    else:
        logger.error(f"Could not find a email {user_email} in db")
        raise HTTPException(status_code=404, detail=f"Could not find a user with email {user_email} in db")


def handle_integrity_error(error, user: IPremiumUserCreate | FreeUser):
    """
    In case of integrity error we want to tell the client explicitly what is the problem
    :param error: The error received from the db
    :param user: The user with the conflict
    :raises: HTTPException with the error
    """
    if "email" in error:
        logger.error(f"Got an integrity error, an email already exists in db, error: {error}")
        raise HTTPException(status_code=400, detail=f"Email {user.email} already exists")
    elif "token" in error:
        logger.error(f"Got an integrity error, a token already exists in db, error: {error}")
        raise HTTPException(status_code=400, detail=f"token {user.token} already exists")
    logger.error(f"Got an integrity error, error: {error}")
    raise HTTPException(status_code=400, detail=f"Integrity error in db, error: {error}")


def validate_user(pwd: str, email: str, session) -> bool:
    """
    Receive a password and email and assert that the email in the db holds the same password as pwd
    :param pwd: The password received from the user
    :param email: The email trying to log to
    :param session: The engine session object
    :return: True if the pwd is identical else false
    """
    user = session.exec(select(PremiumUser).where(PremiumUser.email == email))
    if not user:
        raise HTTPException(status_code=400, detail=f"Non existing email: {email}")
    return verify_password(plain_password=pwd, hashed_password=user.password)


def add_new_free_user_to_db(token: str, session):
    """
    Gets a token and a session engine and adds it to the db
    :param token: The token of the free user to add
    :param session: The engine session object
    :return: IFreeUserRead object holding the creation of the new user
    """
    try:
        new_free_user = IFreeUserCreate(token=token)
        new_free_user = FreeUser(**new_free_user.dict())
        session.add(new_free_user)
        session.commit()
        logger.debug(f"Added a new free user to the db, token:{token}")
        return IFreeUserRead.from_orm(new_free_user)
    except IntegrityError as e:
        logger.error(f"could not add a new user because of uniqueness problem, {e.args}")
        session.rollback()
        handle_integrity_error(error=str(e.orig).lower(), user=new_free_user)
    except Exception as e:
        logger.error(f"Unable to add a new user to db, error: {e}")
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Unable to add a new user to db, error: {e}")


def activate_premium_user_in_db(session, new_user: IPremiumUserCreate):
    """
    Set the active field in the db of the user into True
    :param session: The engine session object
    :param new_user: IPremiumUserCreate object holding the details of the user
    """
    user: PremiumUser | None = session.exec(select(PremiumUser).where(PremiumUser.email == new_user.email))
    if user:
        user.active = True
        user.token = new_user.token
        session.add(user)
        logger.info(f"User with email: {user.email} logged in, changed active to True")
        session.commit()
        return IPremiumUserRead.from_orm(user)
    raise HTTPException(status_code=404, detail=f"User with email {user.email} could not be found")


def deactivate_premium_user_in_db(session, email: str):
    """
    Set the active field in the db of the user into True
    :param session: The engine session object
    :param email: The email of the user to disconnect
    """
    user: PremiumUser | None = session.exec(select(PremiumUser).where(PremiumUser.email == email))
    if user:
        user.active = False
        session.add(user)
        logger.info(f"User with email: {user.email} logged out, changed active to False")
        session.commit()
        return IPremiumUserRead.from_orm(user)
    raise HTTPException(status_code=404, detail=f"User with email {user.email} could not be found")


def get_users_count(session):
    """
    Return the count of users are currently connected to the db
    :param session: The engine session object
    :return: The count of users who are logged in at the moment
    """
    premium_users_count: int = session.exec(select(PremiumUser).where(PremiumUser.active is True)).count()
    active_free_users_count: int = session.exec(select(FreeUser)).count()
    return premium_users_count + active_free_users_count

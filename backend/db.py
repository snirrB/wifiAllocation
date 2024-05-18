from datetime import datetime
from typing import Optional

from email_validator import validate_email
from pydantic import field_validator
from sqlmodel import Field, SQLModel


class PremiumUser(SQLModel, table=True):
    id: int | None = Field(primary_key=True, default=None)
    token: str | None = Field(default=None)
    username: str = Field(unique=True)
    password: str
    email: str = Field(unique=True)


class FreeUser(SQLModel, table=True):
    token: str = Field(primary_key=True)
    time_of_registration: datetime = Field(description="When the user has been registered")


class IBasePremiumUser(SQLModel):
    id: Optional[int] = None
    token: Optional[str]
    username: str
    email: str


class IBaseFreeUser(SQLModel):
    token: str


class IFreeUserCreate(IBaseFreeUser, table=False):
    time_of_registration: datetime = Field(default_factory=datetime.now)


class IFreeUserRead(IBaseFreeUser, table=False):
    pass


class FreeUserUpdate(IBaseFreeUser):
    pass


class IPremiumUserCreate(IBasePremiumUser, table=False):
    """
    This class represents a creation user object in the db
    """
    password: str

    @field_validator('username')
    @classmethod
    def valid_username(cls, v: str):
        """
        Asserts that the id is valid
        :param v: The given id
        """
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str):
        """
        validate the email address is a valid address
        :param v: The given email address
        """
        email = validate_email(v, check_deliverability=False)
        return email.normalized


class IPremiumUserRead(IBasePremiumUser, table=False):
    """
    The read object of Premium user
    """
    token: str
    username: str
    email: str

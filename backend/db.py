from datetime import datetime
from typing import Optional

from email_validator import validate_email
from pydantic import field_validator
from sqlmodel import Field, SQLModel


class PremiumUser(SQLModel, table=True):
    id: int | None = Field(primary_key=True, default=None)
    token: str | None = Field(default=None)
    password: str
    active: bool = Field(default=False)
    login_time: datetime = Field(default=None)
    email: str = Field(unique=True)


class FreeUser(SQLModel, table=True):
    token: str = Field(primary_key=True)
    login_time: datetime = Field(description="When the user has been registered")


class IBasePremiumUser(SQLModel):
    id: Optional[int] = None
    token: Optional[str]
    email: str


class IBaseFreeUser(SQLModel):
    token: str


class IFreeUserCreate(IBaseFreeUser, table=False):
    login_time: datetime = Field(default_factory=datetime.now)


class IFreeUserRead(IBaseFreeUser, table=False):
    pass


class FreeUserUpdate(IBaseFreeUser):
    pass


class IPremiumUserCreate(IBasePremiumUser, table=False):
    """
    This class represents a creation user object in the db
    """
    password: str

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
    email: str

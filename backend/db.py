from datetime import datetime
from typing import Optional

from email_validator import validate_email
from pydantic import validator
from sqlmodel import Field, SQLModel


class PremiumUser(SQLModel, table=True):
    """
    PremiumUser table
    """
    id: int | None = Field(primary_key=True, default=None)
    token: str | None = Field(default=None)
    password: str
    active: bool = Field(default=False)
    login_time: datetime = Field(default=datetime.now())
    email: str = Field(unique=True)
    # The duration of the access in hours, default set to 3
    premium_duration: int = Field(default=1)


class FreeUser(SQLModel, table=True):
    """
    FreeUser table
    """
    token: str = Field(primary_key=True)
    login_time: datetime = Field(description="When the user has been registered")


class IBasePremiumUser(SQLModel):
    id: Optional[int] = None
    token: Optional[str]
    email: str
    # This is the pricing value for the access duration of the user to the wifi
    premium_duration: int = 1


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
    qr_token: str = Field(default=None)

    @validator('email')
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


class QRUser(SQLModel, table=True):
    """
    QR users table
    """
    id: str = Field(primary_key=True)
    generation_time: datetime = Field(default_factory=datetime.now)
    active: bool = Field(default=False)


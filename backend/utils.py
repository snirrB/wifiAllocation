import logging
import os
from enum import Enum
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
from typing import Any


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
    FREE = "FreeUser"
    PREMIUM = "PremiumUser"


class user_status(BaseModel):
    """
    Class representing current user status
    """
    time_remaimning: Any = Field(default=1)
    login_time: Any = Field()
    current_speed: float = Field(default=0.0)

def serialize_td(td: timedelta):
    """
    convert a td into dict
    """
    total_seconds = int(td.total_seconds())
    days, remainder = divmod(total_seconds, 86400)  # 86400 seconds in a day
    hours, remainder = divmod(remainder, 3600)  # 3600 seconds in an hour
    minutes, seconds = divmod(remainder, 60)  # 60 seconds in a minute

    return {
        "days": days,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds,
    }
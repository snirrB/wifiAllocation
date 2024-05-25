import logging
import os
from enum import Enum

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



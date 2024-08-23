from pydantic import BaseModel, Field


class UserToAddSchema(BaseModel):
    """
    A class representing the schema off adding a new user to the system
    """
    token: str
    email: str
    password: str
    # This is the pricing field, an integer representing the duration of session available for that user
    premium_duration: int = Field(default=1)

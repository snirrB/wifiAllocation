from email_validator import validate_email
from pydantic import BaseModel, field_validator


class IUserCreate(BaseModel):
    """
    This class represents a creation user object in the db
    """
    id: int
    email: str

    @field_validator('id')
    @classmethod
    def valid_id(cls, v: int):
        """
        Asserts that the id is valid
        :param v: The given id
        """
        assert 99999999 < int(v) < 1000000000, f'the id {id} is not valid id number'
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str):
        """
        validate the email address as a valid address
        :param v: The given email address
        """
        email = validate_email(v, check_deliverability=False)
        return email.normalized

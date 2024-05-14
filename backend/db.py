from sqlalchemy import Boolean, Column, Integer, String, Float
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class User(Base):
    """
    The "users" table will hold the data we need for users in our application
    """
    __tablename__ = "users"
    # The id of each user will be the primary key
    id = Column(Integer, primary_key=True)
    # The email are unique so we can have correlation between a user and his account
    email = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=False)
    # We are holding for each user the usage of data
    data_usage = Column(Float, default=0)


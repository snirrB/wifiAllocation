import os

import uvicorn
from fastapi import FastAPI
from sqlmodel import SQLModel, Session

from backend.server import app_route, engine, db_route
from backend.utils import logger

app = FastAPI()
app.include_router(app_route)
app.include_router(db_route)

if __name__ == "__main__":
    SQLModel.metadata.create_all(engine)
    logger.debug("Started running server")
    uvicorn.run(app, host="localhost", port=8001)

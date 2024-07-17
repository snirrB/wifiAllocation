import os
from pathlib import Path
from dotenv import load_dotenv


import uvicorn
from fastapi import FastAPI
import sqlmodel 
from server import app_route, engine, db_route
from utils import logger
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

dotenv_path = Path('/home/pi/wifiAllocation/backend/.env')
load_dotenv(dotenv_path=dotenv_path)

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://your-frontend-domain.com",  # Add your frontend domain
    # Add other origins you want to allow
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of origins that should be allowed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(app_route)
app.include_router(db_route)

if __name__ == "__main__":
    sqlmodel.SQLModel.metadata.create_all(engine)
    logger.debug("Started running server")
    uvicorn.run(app, host="localhost", port=8001)

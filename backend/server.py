from fastapi import FastAPI

from backend.db_actions import db_route

app = FastAPI()
app.include_router(db_route)


@app.get("/")
async def root():
    return {"message": "Hello World"}



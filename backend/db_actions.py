from fastapi import APIRouter

db_route = APIRouter(prefix="/db")


@db_route.get("/")
async def get_db_status():
    """
    Receive the status of the db
    """
    return {"state": "up"}



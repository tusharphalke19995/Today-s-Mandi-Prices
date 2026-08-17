from fastapi import APIRouter

from app.api.v1.markets import router as markets_router
from app.api.v1.ping import router as ping_router
from app.api.v1.sync import router as sync_router

api_router = APIRouter()
api_router.include_router(ping_router)
api_router.include_router(markets_router)
api_router.include_router(sync_router)

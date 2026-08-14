from fastapi import APIRouter, Header, HTTPException

from app.core.config import get_settings
from app.services.sync_scheduler import get_sync_status, run_price_sync

router = APIRouter(prefix="/sync", tags=["Sync"])
settings = get_settings()


@router.get("/status")
async def sync_status():
    """When prices were last synced from Agmarknet."""
    return get_sync_status()


@router.post("/run")
async def trigger_sync(x_sync_key: str | None = Header(default=None)):
    """
    Manually trigger price sync (also used by free cron services like cron-job.org).
    Set SYNC_API_KEY in env and pass header: X-Sync-Key: your-key
    """
    if settings.sync_api_key and x_sync_key != settings.sync_api_key:
        raise HTTPException(status_code=401, detail="Invalid or missing X-Sync-Key header")

    count = await run_price_sync()
    status = get_sync_status()
    return {"message": "Sync completed", "records_synced": count, **status}

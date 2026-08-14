"""Background job — sync mandi prices from government API every hour."""

import asyncio
import logging
from datetime import datetime

from app.core.config import get_settings
from app.database.session import SessionLocal
from app.repositories.cache_repository import CacheRepository
from app.services.market_service import MarketService

logger = logging.getLogger(__name__)
settings = get_settings()

_last_sync_at: datetime | None = None
_last_sync_count: int = 0
_sync_running: bool = False


def get_sync_status() -> dict:
    return {
        "last_sync_at": _last_sync_at.isoformat() if _last_sync_at else None,
        "records_synced": _last_sync_count,
        "sync_running": _sync_running,
        "interval_seconds": settings.sync_interval_seconds,
        "interval_label": "1 hour",
    }


async def run_price_sync() -> int:
    """Fetch latest prices from Agmarknet, update DB, clear API cache."""
    global _last_sync_at, _last_sync_count, _sync_running

    if _sync_running:
        logger.info("Sync already in progress — skipping")
        return 0

    _sync_running = True
    db = SessionLocal()
    try:
        service = MarketService(db)
        count = await service.run_full_sync()
        purged = CacheRepository(db).purge_all()
        _last_sync_at = datetime.utcnow()
        _last_sync_count = count
        logger.info("Hourly sync done: %s records updated, %s cache entries cleared", count, purged)
        return count
    except Exception:
        logger.exception("Price sync failed")
        return 0
    finally:
        _sync_running = False
        db.close()


async def hourly_sync_loop() -> None:
    """Run sync on start, then every hour."""
    interval = settings.sync_interval_seconds
    logger.info("Price sync scheduler started (every %s seconds)", interval)

    # Let the server accept requests before the first heavy sync
    await asyncio.sleep(5)

    while True:
        await run_price_sync()
        await asyncio.sleep(interval)


def start_sync_scheduler() -> asyncio.Task | None:
    if not settings.sync_enabled:
        logger.info("Price sync scheduler disabled")
        return None
    return asyncio.create_task(hourly_sync_loop())

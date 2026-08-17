import asyncio
import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.api.v1 import api_router
from app.core.config import get_settings
from app.database.base import Base
from app.database.session import engine, SessionLocal
from app.repositories.cache_repository import CacheRepository
from app.services.seed_service import seed_sample_data
from app.services.sync_scheduler import get_sync_status, start_sync_scheduler

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    sync_task = None
    try:
        CacheRepository(db).purge_expired()
        seeded = seed_sample_data(db)
        logger.info("Mandi prices ready (%s records, incl. Mumbai/Pune/Manchar/Junnar)", seeded)
    finally:
        db.close()

    sync_task = start_sync_scheduler()

    yield

    if sync_task:
        sync_task.cancel()
        try:
            await sync_task
        except asyncio.CancelledError:
            pass


app = FastAPI(
    title=settings.app_name,
    description="REST API for Today's Mandi Prices - Indian agricultural market prices",
    version="1.0.0",
    lifespan=lifespan,
)

# In debug mode allow any dev origin (localhost, LAN IP like 172.x.x.x:5173, etc.)
cors_kwargs: dict = {
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}
if settings.debug:
    cors_kwargs["allow_origin_regex"] = r"https?://.*"
else:
    cors_kwargs["allow_origin_regex"] = (
        r"https://([a-z0-9-]+\.)*(vercel\.app|onrender\.com)$"
    )

app.add_middleware(CORSMiddleware, **cors_kwargs)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health")
async def health_check():
    db_status = "unknown"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "status": "healthy",
        "app": settings.app_name,
        "database": db_status,
        "sync": get_sync_status(),
    }


def _mount_frontend(app: FastAPI) -> None:
    """Serve Vite production build from backend/static (Render single-service deploy)."""
    static_dir = Path(__file__).resolve().parent.parent / "static"
    index_file = static_dir / "index.html"
    if not index_file.is_file():
        logger.warning("Frontend static files not found at %s — website will not load at /", static_dir)

        @app.get("/")
        async def api_root():
            return {
                "app": settings.app_name,
                "status": "api_only",
                "message": "Website build missing. Redeploy with Docker.",
                "health": "/health",
                "docs": "/docs",
                "api": settings.api_v1_prefix,
            }

        return

    logger.info("Serving website from %s", static_dir)

    assets_dir = static_dir / "assets"
    if assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="frontend-assets")

    @app.get("/")
    async def serve_root():
        return FileResponse(index_file)

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith(("api/", "docs", "redoc", "openapi.json", "health")):
            raise HTTPException(status_code=404)
        candidate = static_dir / full_path
        if candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(index_file)


_mount_frontend(app)

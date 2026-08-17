from fastapi import APIRouter

router = APIRouter(tags=["Ping"])


@router.get("/ping")
async def ping():
    """Lightweight wake-up endpoint (ad blockers often block /health)."""
    return {"ok": True, "service": "mandi-prices-api"}

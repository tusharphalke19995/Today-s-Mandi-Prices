import hashlib
import json
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models import PriceCache

settings = get_settings()


class CacheRepository:
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def build_key(prefix: str, **params: str | int | bool | None) -> str:
        filtered = {k: v for k, v in sorted(params.items()) if v is not None}
        payload = json.dumps(filtered, sort_keys=True)
        digest = hashlib.sha256(payload.encode()).hexdigest()[:16]
        return f"{prefix}:{digest}"

    def get(self, cache_key: str) -> list | dict | None:
        now = datetime.utcnow()
        entry = (
            self.db.query(PriceCache)
            .filter(PriceCache.cache_key == cache_key, PriceCache.expires_at > now)
            .first()
        )
        if not entry:
            return None
        return json.loads(entry.response_data)

    def set(self, cache_key: str, data: list | dict, ttl_seconds: int | None = None) -> None:
        ttl = ttl_seconds or settings.cache_ttl_seconds
        expires_at = datetime.utcnow() + timedelta(seconds=ttl)
        existing = self.db.query(PriceCache).filter(PriceCache.cache_key == cache_key).first()
        serialized = json.dumps(data, default=str)
        if existing:
            existing.response_data = serialized
            existing.expires_at = expires_at
        else:
            self.db.add(
                PriceCache(
                    cache_key=cache_key,
                    response_data=serialized,
                    expires_at=expires_at,
                )
            )
        self.db.commit()

    def purge_expired(self) -> int:
        now = datetime.utcnow()
        deleted = (
            self.db.query(PriceCache)
            .filter(PriceCache.expires_at <= now)
            .delete(synchronize_session=False)
        )
        self.db.commit()
        return deleted

    def purge_all(self) -> int:
        deleted = self.db.query(PriceCache).delete(synchronize_session=False)
        self.db.commit()
        return deleted

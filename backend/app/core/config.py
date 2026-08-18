from functools import lru_cache
from typing import List
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def normalize_database_url(url: str) -> str:
    """Remove unsupported query params and fix scheme for SQLAlchemy."""
    url = url.strip().strip('"').strip("'")
    # Render/Neon sometimes use postgres:// — SQLAlchemy needs postgresql://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    parsed = urlparse(url)
    if not parsed.scheme.startswith("postgres"):
        return url

    # psycopg2 only accepts libpq connection options — not Prisma-style "schema"
    unsupported = {"schema"}
    query = [(k, v) for k, v in parse_qsl(parsed.query, keep_blank_values=True) if k not in unsupported]
    return urlunparse(parsed._replace(query=urlencode(query)))


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Today's Mandi Prices API"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    database_url: str = "postgresql://mandi_user:mandi_pass@localhost:5432/mandi_prices"

    redis_url: str = "redis://localhost:6379/0"
    use_redis: bool = False

    data_gov_api_key: str = "579b464db66ec23bdd000001cdd3946e44ce57746370fffc958d3611"
    data_gov_resource_id: str = "9ef84268-d588-465a-a308-a864a43d0070"
    data_gov_resource_id_v2: str = "35985678-0d79-46b4-9ed6-6f13308a1d24"
    data_gov_base_url: str = "https://api.data.gov.in/resource"

    cache_ttl_seconds: int = 3600

    # Price sync from government API (every 1 hour = 3600 seconds)
    sync_interval_seconds: int = 3600
    sync_enabled: bool = True
    sync_api_key: str = ""  # Optional — set for external cron security

    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    @field_validator("database_url", mode="before")
    @classmethod
    def sanitize_database_url(cls, value: str) -> str:
        if isinstance(value, str):
            return normalize_database_url(value)
        return value

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def data_gov_api_url(self) -> str:
        return f"{self.data_gov_base_url}/{self.data_gov_resource_id}"


@lru_cache
def get_settings() -> Settings:
    return Settings()

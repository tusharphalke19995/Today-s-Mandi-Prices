"""Test database connection and print setup help."""

import sys
from pathlib import Path

# Allow running as: python scripts/test_db_connection.py
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import create_engine, text

from app.core.config import get_settings


def main() -> int:
    settings = get_settings()
    url = settings.database_url

    # Hide password in display
    display_url = url
    if "@" in url:
        parts = url.split("@")
        creds = parts[0].rsplit(":", 1)[0] + ":***"
        display_url = creds + "@" + parts[1]

    print(f"Testing connection: {display_url}")

    try:
        engine = create_engine(url, pool_pre_ping=True)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("SUCCESS: Database connection works!")
        return 0
    except Exception as exc:
        print(f"FAILED: {exc}")
        print()
        print("Fix steps:")
        print("  1. Open pgAdmin and ensure PostgreSQL is running")
        print("  2. Run backend/scripts/setup_pgadmin.sql in Query Tool")
        print("  3. Edit backend/.env and set DATABASE_URL, e.g.:")
        print("     DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/mandi_prices")
        print("     or")
        print("     DATABASE_URL=postgresql://mandi_user:mandi_pass@localhost:5432/mandi_prices")
        print("  4. For quick local dev without PostgreSQL, use SQLite:")
        print("     DATABASE_URL=sqlite:///./mandi_prices.db")
        return 1


if __name__ == "__main__":
    sys.exit(main())

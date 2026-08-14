"""Clear price cache and re-upsert sample mandi data."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database.session import SessionLocal
from app.models import PriceCache
from app.services.seed_service import seed_sample_data


def main() -> None:
    db = SessionLocal()
    try:
        deleted = db.query(PriceCache).delete()
        db.commit()
        count = seed_sample_data(db)
        print(f"Cleared {deleted} cache entries and upserted {count} price records.")
    finally:
        db.close()


if __name__ == "__main__":
    main()

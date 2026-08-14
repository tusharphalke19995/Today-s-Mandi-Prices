"""Seed sample mandi price data for development and demo."""

from datetime import datetime

from sqlalchemy.orm import Session

from app.repositories.market_repository import MarketRepository
from app.utils.helpers import get_commodity_icon

# Mumbai, Pune, Manchar, Junnar — local mandi rates (Maharashtra)
MUMBAI_PUNE_REGION = [
    # Mumbai
    {"state": "Maharashtra", "district": "Mumbai", "market": "Vashi APMC", "commodity": "Onion", "min_price": 2600, "max_price": 2900, "modal_price": 2750, "arrival_quantity": 1800},
    {"state": "Maharashtra", "district": "Mumbai", "market": "Vashi APMC", "commodity": "Potato", "min_price": 1900, "max_price": 2300, "modal_price": 2100, "arrival_quantity": 1200},
    {"state": "Maharashtra", "district": "Mumbai", "market": "Vashi APMC", "commodity": "Tomato", "min_price": 1700, "max_price": 2200, "modal_price": 1950, "arrival_quantity": 950},
    {"state": "Maharashtra", "district": "Mumbai", "market": "Vashi APMC", "commodity": "Wheat", "min_price": 2300, "max_price": 2500, "modal_price": 2400, "arrival_quantity": 800},
    {"state": "Maharashtra", "district": "Mumbai", "market": "Mulund APMC", "commodity": "Onion", "min_price": 2550, "max_price": 2850, "modal_price": 2700, "arrival_quantity": 650},
    {"state": "Maharashtra", "district": "Mumbai", "market": "Mulund APMC", "commodity": "Tomato", "min_price": 1650, "max_price": 2100, "modal_price": 1875, "arrival_quantity": 420},
    # Pune APMC
    {"state": "Maharashtra", "district": "Pune", "market": "Pune APMC", "commodity": "Onion", "min_price": 2400, "max_price": 2700, "modal_price": 2550, "arrival_quantity": 720},
    {"state": "Maharashtra", "district": "Pune", "market": "Pune APMC", "commodity": "Potato", "min_price": 1800, "max_price": 2200, "modal_price": 2000, "arrival_quantity": 890},
    {"state": "Maharashtra", "district": "Pune", "market": "Pune APMC", "commodity": "Tomato", "min_price": 1600, "max_price": 2000, "modal_price": 1800, "arrival_quantity": 540},
    {"state": "Maharashtra", "district": "Pune", "market": "Pune APMC", "commodity": "Wheat", "min_price": 2250, "max_price": 2480, "modal_price": 2365, "arrival_quantity": 1100},
    {"state": "Maharashtra", "district": "Pune", "market": "Pune APMC", "commodity": "Maize", "min_price": 1950, "max_price": 2180, "modal_price": 2065, "arrival_quantity": 680},
    {"state": "Maharashtra", "district": "Pune", "market": "Pune APMC", "commodity": "Soybean", "min_price": 4100, "max_price": 4500, "modal_price": 4300, "arrival_quantity": 350},
    # Manchar — famous tomato mandi
    {"state": "Maharashtra", "district": "Pune", "market": "Manchar APMC", "commodity": "Tomato", "min_price": 1400, "max_price": 1900, "modal_price": 1650, "arrival_quantity": 2200},
    {"state": "Maharashtra", "district": "Pune", "market": "Manchar APMC", "commodity": "Onion", "min_price": 2350, "max_price": 2650, "modal_price": 2500, "arrival_quantity": 480},
    {"state": "Maharashtra", "district": "Pune", "market": "Manchar APMC", "commodity": "Potato", "min_price": 1750, "max_price": 2150, "modal_price": 1950, "arrival_quantity": 620},
    {"state": "Maharashtra", "district": "Pune", "market": "Manchar APMC", "commodity": "Cabbage", "min_price": 800, "max_price": 1200, "modal_price": 1000, "arrival_quantity": 380},
    {"state": "Maharashtra", "district": "Pune", "market": "Manchar APMC", "commodity": "Cauliflower", "min_price": 1200, "max_price": 1600, "modal_price": 1400, "arrival_quantity": 290},
    # Junnar
    {"state": "Maharashtra", "district": "Pune", "market": "Junnar APMC", "commodity": "Onion", "min_price": 2300, "max_price": 2600, "modal_price": 2450, "arrival_quantity": 520},
    {"state": "Maharashtra", "district": "Pune", "market": "Junnar APMC", "commodity": "Tomato", "min_price": 1500, "max_price": 1950, "modal_price": 1725, "arrival_quantity": 780},
    {"state": "Maharashtra", "district": "Pune", "market": "Junnar APMC", "commodity": "Grapes", "min_price": 4500, "max_price": 6500, "modal_price": 5500, "arrival_quantity": 410},
    {"state": "Maharashtra", "district": "Pune", "market": "Junnar APMC", "commodity": "Maize", "min_price": 1880, "max_price": 2120, "modal_price": 2000, "arrival_quantity": 560},
    {"state": "Maharashtra", "district": "Pune", "market": "Junnar APMC", "commodity": "Potato", "min_price": 1700, "max_price": 2100, "modal_price": 1900, "arrival_quantity": 340},
]

SAMPLE_DATA = MUMBAI_PUNE_REGION + [
    {
        "state": "Maharashtra",
        "district": "Nashik",
        "market": "Lasalgaon APMC",
        "commodity": "Onion",
        "min_price": 2700,
        "max_price": 3000,
        "modal_price": 2850,
        "arrival_quantity": 1250,
    },
    {
        "state": "Karnataka",
        "district": "Kolar",
        "market": "Kolar APMC",
        "commodity": "Tomato",
        "min_price": 1500,
        "max_price": 2100,
        "modal_price": 1800,
        "arrival_quantity": 650,
    },
    {
        "state": "Punjab",
        "district": "Ludhiana",
        "market": "Ludhiana APMC",
        "commodity": "Wheat",
        "min_price": 2200,
        "max_price": 2450,
        "modal_price": 2325,
        "arrival_quantity": 3200,
    },
    {
        "state": "Madhya Pradesh",
        "district": "Indore",
        "market": "Indore APMC",
        "commodity": "Maize",
        "min_price": 1900,
        "max_price": 2150,
        "modal_price": 2025,
        "arrival_quantity": 1100,
    },
    {
        "state": "Gujarat",
        "district": "Rajkot",
        "market": "Rajkot APMC",
        "commodity": "Cotton",
        "min_price": 6500,
        "max_price": 7200,
        "modal_price": 6850,
        "arrival_quantity": 450,
    },
]


def seed_sample_data(db: Session) -> int:
    repo = MarketRepository(db)
    now = datetime.utcnow()
    arrival_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    seeded = 0

    for item in SAMPLE_DATA:
        market, commodity = repo.upsert_reference_data(
            item["state"],
            item["district"],
            item["market"],
            item["commodity"],
        )
        commodity.icon = get_commodity_icon(item["commodity"])
        repo.upsert_market_price(
            market=market,
            commodity=commodity,
            min_price=item["min_price"],
            max_price=item["max_price"],
            modal_price=item["modal_price"],
            arrival_quantity=item["arrival_quantity"],
            arrival_unit="Quintal",
            arrival_date=arrival_date,
        )
        seeded += 1

    db.commit()
    return seeded

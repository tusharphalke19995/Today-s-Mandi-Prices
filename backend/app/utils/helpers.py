"""Utility helpers for the backend application."""

COMMODITY_ICONS: dict[str, str] = {
    "onion": "🧅",
    "potato": "🥔",
    "tomato": "🍅",
    "wheat": "🌾",
    "maize": "🌽",
    "soybean": "🫘",
    "cotton": "🌱",
    "rice": "🍚",
    "paddy": "🌾",
    "mustard": "🌻",
    "groundnut": "🥜",
    "chilli": "🌶️",
    "garlic": "🧄",
    "ginger": "🫚",
    "banana": "🍌",
    "apple": "🍎",
    "mango": "🥭",
    "sugarcane": "🎋",
    "tur": "🫘",
    "moong": "🫘",
    "urad": "🫘",
    "masur": "🫘",
    "bajra": "🌾",
    "jowar": "🌾",
    "barley": "🌾",
    "coriander": "🌿",
    "cumin": "🌿",
    "turmeric": "🟡",
    "brinjal": "🍆",
    "cabbage": "🥬",
    "cauliflower": "🥦",
    "green chilli": "🌶️",
    "red chilli": "🌶️",
}


def get_commodity_icon(name: str) -> str:
    normalized = name.strip().lower()
    for key, icon in COMMODITY_ICONS.items():
        if key in normalized:
            return icon
    return "🌾"


def safe_float(value: str | float | int | None) -> float | None:
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None

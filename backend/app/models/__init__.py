from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class State(Base):
    __tablename__ = "states"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    districts: Mapped[list["District"]] = relationship(back_populates="state")


class District(Base):
    __tablename__ = "districts"
    __table_args__ = (UniqueConstraint("state_id", "name", name="uq_district_state_name"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    state_id: Mapped[int] = mapped_column(ForeignKey("states.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    state: Mapped["State"] = relationship(back_populates="districts")
    markets: Mapped[list["Market"]] = relationship(back_populates="district")


class Market(Base):
    __tablename__ = "markets"
    __table_args__ = (UniqueConstraint("district_id", "name", name="uq_market_district_name"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    district_id: Mapped[int] = mapped_column(ForeignKey("districts.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    district: Mapped["District"] = relationship(back_populates="markets")
    prices: Mapped[list["MarketPrice"]] = relationship(back_populates="market")


class Commodity(Base):
    __tablename__ = "commodities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False, index=True)
    icon: Mapped[str | None] = mapped_column(String(10), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    prices: Mapped[list["MarketPrice"]] = relationship(back_populates="commodity")


class MarketPrice(Base):
    __tablename__ = "market_prices"
    __table_args__ = (
        UniqueConstraint(
            "market_id",
            "commodity_id",
            "arrival_date",
            name="uq_market_commodity_date",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    market_id: Mapped[int] = mapped_column(ForeignKey("markets.id"), nullable=False, index=True)
    commodity_id: Mapped[int] = mapped_column(ForeignKey("commodities.id"), nullable=False, index=True)
    min_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    max_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    modal_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    arrival_quantity: Mapped[float | None] = mapped_column(Float, nullable=True)
    arrival_unit: Mapped[str | None] = mapped_column(String(50), nullable=True)
    price_unit: Mapped[str | None] = mapped_column(String(50), default="Quintal")
    arrival_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, index=True)
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    market: Mapped["Market"] = relationship(back_populates="prices")
    commodity: Mapped["Commodity"] = relationship(back_populates="prices")


class PriceCache(Base):
    __tablename__ = "price_cache"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    cache_key: Mapped[str] = mapped_column(String(500), unique=True, nullable=False, index=True)
    response_data: Mapped[str] = mapped_column(Text, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

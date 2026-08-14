from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class StateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class DistrictResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    state_id: int


class MarketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    district_id: int


class CommodityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    icon: str | None = None


class TodayPriceResponse(BaseModel):
    id: int | None = None
    commodity: str
    commodity_icon: str | None = None
    state: str
    district: str
    market: str
    min_price: float | None = None
    max_price: float | None = None
    modal_price: float | None = None
    arrival_quantity: float | None = None
    arrival_unit: str | None = None
    price_unit: str = "Quintal"
    arrival_date: date | None = None
    last_updated: datetime | None = None


class TodayPricesQuery(BaseModel):
    state: str | None = None
    district: str | None = None
    market: str | None = None
    commodity: str | None = None
    search: str | None = None
    areas: str | None = None  # comma-separated: Mumbai,Pune,Manchar,Junnar
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)


class PaginatedResponse(BaseModel):
    items: list[TodayPriceResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class MessageResponse(BaseModel):
    message: str

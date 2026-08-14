import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.market import (
    CommodityResponse,
    DistrictResponse,
    MarketResponse,
    PaginatedResponse,
    StateResponse,
    TodayPriceResponse,
    TodayPricesQuery,
)
from app.services.market_service import MarketService

router = APIRouter(tags=["Markets"])


def get_market_service(db: Session = Depends(get_db)) -> MarketService:
    return MarketService(db)


@router.get("/states", response_model=list[StateResponse])
async def get_states(service: MarketService = Depends(get_market_service)):
    return await service.get_states()


@router.get("/districts", response_model=list[DistrictResponse])
async def get_districts(
    state: str = Query(..., description="State name"),
    service: MarketService = Depends(get_market_service),
):
    return await service.get_districts(state)


@router.get("/markets", response_model=list[MarketResponse])
async def get_markets(
    district: str = Query(..., description="District name"),
    state: str | None = Query(None, description="Optional state name"),
    service: MarketService = Depends(get_market_service),
):
    return await service.get_markets(district, state)


@router.get("/commodities", response_model=list[CommodityResponse])
async def get_commodities(service: MarketService = Depends(get_market_service)):
    return await service.get_commodities()


@router.get("/today-prices", response_model=PaginatedResponse)
async def get_today_prices(
    state: str | None = Query(None),
    district: str | None = Query(None),
    market: str | None = Query(None),
    commodity: str | None = Query(None),
    search: str | None = Query(None),
    areas: str | None = Query(None, description="Comma-separated areas e.g. Mumbai,Pune,Manchar,Junnar"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    service: MarketService = Depends(get_market_service),
):
    query = TodayPricesQuery(
        state=state,
        district=district,
        market=market,
        commodity=commodity,
        search=search,
        areas=areas,
        page=page,
        page_size=page_size,
    )
    items, total = await service.get_today_prices(query)
    total_pages = math.ceil(total / page_size) if total else 0
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/today-prices/{price_id}", response_model=TodayPriceResponse)
async def get_price_detail(
    price_id: int,
    service: MarketService = Depends(get_market_service),
):
    price = service.get_price_by_id(price_id)
    if not price:
        raise HTTPException(status_code=404, detail="Price record not found")
    return price

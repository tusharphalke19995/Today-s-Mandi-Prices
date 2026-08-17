from datetime import date, datetime, timedelta

from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.models import Commodity, District, Market, MarketPrice, State
from app.schemas.market import PriceHistoryPoint, PriceHistoryResponse, TodayPriceResponse, TodayPricesQuery
from app.utils.helpers import get_commodity_icon


class MarketRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_states(self) -> list[State]:
        return self.db.query(State).order_by(State.name).all()

    def get_districts_by_state(self, state_name: str) -> list[District]:
        return (
            self.db.query(District)
            .join(State)
            .filter(func.lower(State.name) == state_name.lower())
            .order_by(District.name)
            .all()
        )

    def get_markets_by_district(self, district_name: str, state_name: str | None = None) -> list[Market]:
        query = (
            self.db.query(Market)
            .join(District)
            .join(State)
            .filter(func.lower(District.name) == district_name.lower())
        )
        if state_name:
            query = query.filter(func.lower(State.name) == state_name.lower())
        return query.order_by(Market.name).all()

    def get_commodities(self) -> list[Commodity]:
        return self.db.query(Commodity).order_by(Commodity.name).all()

    def _base_price_query(self):
        return (
            self.db.query(MarketPrice)
            .join(Market)
            .join(District)
            .join(State)
            .join(Commodity)
            .options(
                joinedload(MarketPrice.market).joinedload(Market.district).joinedload(District.state),
                joinedload(MarketPrice.commodity),
            )
        )

    def get_today_prices(self, query_params: TodayPricesQuery) -> tuple[list[TodayPriceResponse], int]:
        query = self._base_price_query()

        if query_params.state:
            query = query.filter(func.lower(State.name) == query_params.state.lower())
        if query_params.district:
            query = query.filter(func.lower(District.name) == query_params.district.lower())
        if query_params.market:
            query = query.filter(func.lower(Market.name).contains(query_params.market.lower()))
        if query_params.areas:
            tokens = [t.strip().lower() for t in query_params.areas.split(",") if t.strip()]
            if tokens:
                area_conditions = []
                for token in tokens:
                    pattern = f"%{token}%"
                    area_conditions.append(func.lower(Market.name).like(pattern))
                    area_conditions.append(func.lower(District.name).like(pattern))
                query = query.filter(or_(*area_conditions))
        if query_params.commodity:
            query = query.filter(func.lower(Commodity.name).contains(query_params.commodity.lower()))
        if query_params.search:
            search = f"%{query_params.search.lower()}%"
            query = query.filter(
                or_(
                    func.lower(Commodity.name).like(search),
                    func.lower(Market.name).like(search),
                    func.lower(District.name).like(search),
                )
            )

        total = query.count()
        offset = (query_params.page - 1) * query_params.page_size
        rows = (
            query.order_by(MarketPrice.last_updated.desc(), Commodity.name)
            .offset(offset)
            .limit(query_params.page_size)
            .all()
        )

        items = [self._to_price_response(row) for row in rows]
        return items, total

    def get_price_by_id(self, price_id: int) -> TodayPriceResponse | None:
        row = self._base_price_query().filter(MarketPrice.id == price_id).first()
        if not row:
            return None
        return self._to_price_response(row)

    def get_price_history(self, price_id: int, days: int) -> PriceHistoryResponse | None:
        row = self._base_price_query().filter(MarketPrice.id == price_id).first()
        if not row:
            return None

        cutoff = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=days - 1)
        history_rows = (
            self.db.query(MarketPrice)
            .filter(
                MarketPrice.market_id == row.market_id,
                MarketPrice.commodity_id == row.commodity_id,
                MarketPrice.arrival_date >= cutoff,
            )
            .order_by(MarketPrice.arrival_date.asc())
            .all()
        )

        by_date: dict[date, MarketPrice] = {}
        for hr in history_rows:
            if not hr.arrival_date:
                continue
            day = hr.arrival_date.date()
            existing = by_date.get(day)
            if not existing or hr.last_updated > existing.last_updated:
                by_date[day] = hr

        points = [
            PriceHistoryPoint(
                date=day,
                modal_price=by_date[day].modal_price,
                min_price=by_date[day].min_price,
                max_price=by_date[day].max_price,
            )
            for day in sorted(by_date.keys())
        ]

        avg_modal = None
        change_percent = None
        modal_values = [p.modal_price for p in points if p.modal_price is not None]
        if modal_values:
            avg_modal = round(sum(modal_values) / len(modal_values), 2)
        if len(modal_values) >= 2:
            first, last = modal_values[0], modal_values[-1]
            if first:
                change_percent = round(((last - first) / first) * 100, 2)

        return PriceHistoryResponse(
            market=row.market.name,
            commodity=row.commodity.name,
            price_unit=row.price_unit or "Quintal",
            days=days,
            points=points,
            average_modal_price=avg_modal,
            change_percent=change_percent,
        )

    @staticmethod
    def _to_price_response(row: MarketPrice) -> TodayPriceResponse:
        commodity_name = row.commodity.name
        return TodayPriceResponse(
            id=row.id,
            commodity=commodity_name,
            commodity_icon=row.commodity.icon or get_commodity_icon(commodity_name),
            state=row.market.district.state.name,
            district=row.market.district.name,
            market=row.market.name,
            min_price=row.min_price,
            max_price=row.max_price,
            modal_price=row.modal_price,
            arrival_quantity=row.arrival_quantity,
            arrival_unit=row.arrival_unit,
            price_unit=row.price_unit or "Quintal",
            arrival_date=row.arrival_date.date() if row.arrival_date else None,
            last_updated=row.last_updated,
        )

    def upsert_reference_data(
        self,
        state_name: str,
        district_name: str,
        market_name: str,
        commodity_name: str,
    ) -> tuple[Market, Commodity]:
        state = self.db.query(State).filter(func.lower(State.name) == state_name.lower()).first()
        if not state:
            state = State(name=state_name.strip())
            self.db.add(state)
            self.db.flush()

        district = (
            self.db.query(District)
            .filter(District.state_id == state.id, func.lower(District.name) == district_name.lower())
            .first()
        )
        if not district:
            district = District(state_id=state.id, name=district_name.strip())
            self.db.add(district)
            self.db.flush()

        market = (
            self.db.query(Market)
            .filter(Market.district_id == district.id, func.lower(Market.name) == market_name.lower())
            .first()
        )
        if not market:
            market = Market(district_id=district.id, name=market_name.strip())
            self.db.add(market)
            self.db.flush()

        commodity = (
            self.db.query(Commodity)
            .filter(func.lower(Commodity.name) == commodity_name.lower())
            .first()
        )
        if not commodity:
            commodity = Commodity(name=commodity_name.strip(), icon=get_commodity_icon(commodity_name))
            self.db.add(commodity)
            self.db.flush()

        return market, commodity

    def upsert_market_price(
        self,
        market: Market,
        commodity: Commodity,
        min_price: float | None,
        max_price: float | None,
        modal_price: float | None,
        arrival_quantity: float | None,
        arrival_unit: str | None,
        arrival_date: datetime | None,
    ) -> MarketPrice:
        existing = (
            self.db.query(MarketPrice)
            .filter(
                MarketPrice.market_id == market.id,
                MarketPrice.commodity_id == commodity.id,
                MarketPrice.arrival_date == arrival_date,
            )
            .first()
        )
        now = datetime.utcnow()
        if existing:
            existing.min_price = min_price
            existing.max_price = max_price
            existing.modal_price = modal_price
            existing.arrival_quantity = arrival_quantity
            existing.arrival_unit = arrival_unit
            existing.last_updated = now
            return existing

        price = MarketPrice(
            market_id=market.id,
            commodity_id=commodity.id,
            min_price=min_price,
            max_price=max_price,
            modal_price=modal_price,
            arrival_quantity=arrival_quantity,
            arrival_unit=arrival_unit,
            arrival_date=arrival_date,
            last_updated=now,
        )
        self.db.add(price)
        return price

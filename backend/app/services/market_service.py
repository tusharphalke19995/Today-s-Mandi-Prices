import logging
from datetime import datetime

import httpx
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.repositories.cache_repository import CacheRepository
from app.repositories.market_repository import MarketRepository
from app.schemas.market import PriceHistoryResponse, TodayPriceResponse, TodayPricesQuery
from app.utils.helpers import safe_float

logger = logging.getLogger(__name__)
settings = get_settings()

# Pune region — synced first every hour
PRIORITY_AREAS = ["Mumbai", "Pune", "Manchar", "Junnar"]

# Major states synced hourly from Agmarknet
PRIORITY_STATES = [
    "Maharashtra",
    "Karnataka",
    "Punjab",
    "Gujarat",
    "Madhya Pradesh",
    "Uttar Pradesh",
    "Andhra Pradesh",
    "Rajasthan",
    "Tamil Nadu",
    "West Bengal",
]


class AgmarknetService:
    """Fetches and normalizes data from data.gov.in Agmarknet API."""

    # New variety-wise dataset first, then classic AGMARKNET resource
    RESOURCE_IDS = (
        "35985678-0d79-46b4-9ed6-6f13308a1d24",
        "9ef84268-d588-465a-a308-a864a43d0070",
    )

    def __init__(self):
        self.api_key = settings.data_gov_api_key

    def _resource_url(self, resource_id: str) -> str:
        return f"{settings.data_gov_base_url}/{resource_id}"

    def _date_filter_key(self, resource_id: str) -> str:
        if resource_id.startswith("35985678"):
            return "filters[Arrival_Date]"
        return "filters[arrival_date]"

    async def fetch_prices(
        self,
        state: str | None = None,
        district: str | None = None,
        market: str | None = None,
        commodity: str | None = None,
        arrival_date: str | None = None,
        limit: int = 100,
        offset: int = 0,
        resource_id: str | None = None,
    ) -> list[dict]:
        resources = [resource_id] if resource_id else list(self.RESOURCE_IDS)

        for rid in resources:
            records = await self._fetch_from_resource(
                rid,
                state=state,
                district=district,
                market=market,
                commodity=commodity,
                arrival_date=arrival_date,
                limit=limit,
                offset=offset,
            )
            if records:
                return records
        return []

    async def _fetch_from_resource(
        self,
        resource_id: str,
        state: str | None,
        district: str | None,
        market: str | None,
        commodity: str | None,
        arrival_date: str | None,
        limit: int,
        offset: int,
    ) -> list[dict]:
        params: dict[str, str | int] = {
            "api-key": self.api_key,
            "format": "json",
            "limit": limit,
            "offset": offset,
        }

        is_v2 = resource_id.startswith("35985678")
        filters: list[tuple[str, str]] = []
        if state:
            filters.append(("State" if is_v2 else "state", state))
        if district:
            filters.append(("District" if is_v2 else "district", district))
        if market:
            filters.append(("Market" if is_v2 else "market", market))
        if commodity:
            filters.append(("Commodity" if is_v2 else "commodity", commodity))
        if arrival_date:
            filters.append(("Arrival_Date" if is_v2 else "arrival_date", arrival_date))

        for key, value in filters:
            params[f"filters[{key}]"] = value

        url = self._resource_url(resource_id)
        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.get(url, params=params)
                if response.status_code == 403:
                    logger.warning("Agmarknet API key not authorised for resource %s", resource_id)
                    return []
                response.raise_for_status()
                payload = response.json()
                if payload.get("error"):
                    logger.warning("Agmarknet error (%s): %s", resource_id, payload.get("error"))
                    return []
                records = payload.get("records", [])
                if records:
                    logger.info("Agmarknet live: %s records from %s", len(records), resource_id[:8])
                    return records
                return []
        except httpx.HTTPError as exc:
            logger.error("Agmarknet fetch failed (%s): %s", resource_id[:8], exc)
            return []

    @staticmethod
    def normalize_record(record: dict) -> dict:
        arrival_date_str = (
            record.get("arrival_date")
            or record.get("Arrival_Date")
            or record.get("Arrival_date")
        )
        arrival_date = None
        if arrival_date_str:
            for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
                try:
                    arrival_date = datetime.strptime(str(arrival_date_str).strip(), fmt)
                    break
                except ValueError:
                    continue

        modal = safe_float(
            record.get("modal_price")
            or record.get("Modal_Price")
            or record.get("avg_price")
            or record.get("Avg_Price")
            or record.get("Average_Price")
        )

        return {
            "state": (record.get("state") or record.get("State") or "").strip(),
            "district": (record.get("district") or record.get("District") or "").strip(),
            "market": (record.get("market") or record.get("Market") or "").strip(),
            "commodity": (record.get("commodity") or record.get("Commodity") or "").strip(),
            "min_price": safe_float(record.get("min_price") or record.get("Min_Price")),
            "max_price": safe_float(record.get("max_price") or record.get("Max_Price")),
            "modal_price": modal,
            "arrival_quantity": safe_float(
                record.get("arrival_quantity") or record.get("Arrivals") or record.get("arrivals")
            ),
            "arrival_unit": record.get("commodity_unit") or record.get("Unit") or "Quintal",
            "arrival_date": arrival_date,
        }


class MarketService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = MarketRepository(db)
        self.cache = CacheRepository(db)
        self.agmarknet = AgmarknetService()

    def _has_any_prices(self) -> bool:
        from app.models import MarketPrice

        return self.db.query(MarketPrice.id).first() is not None

    def _serialize_prices(self, items: list[TodayPriceResponse], total: int) -> dict:
        return {
            "items": [item.model_dump() for item in items],
            "total": total,
        }

    async def sync_from_government_api(
        self,
        state: str | None = None,
        commodity: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> int:
        records = await self.agmarknet.fetch_prices(
            state=state,
            commodity=commodity,
            limit=limit,
            offset=offset,
        )

        if not records:
            return 0

        synced = 0
        for record in records:
            normalized = self.agmarknet.normalize_record(record)
            if not all([normalized["state"], normalized["district"], normalized["market"], normalized["commodity"]]):
                continue

            market, commodity_obj = self.repo.upsert_reference_data(
                normalized["state"],
                normalized["district"],
                normalized["market"],
                normalized["commodity"],
            )
            self.repo.upsert_market_price(
                market=market,
                commodity=commodity_obj,
                min_price=normalized["min_price"],
                max_price=normalized["max_price"],
                modal_price=normalized["modal_price"],
                arrival_quantity=normalized["arrival_quantity"],
                arrival_unit=normalized["arrival_unit"],
                arrival_date=normalized["arrival_date"],
            )
            synced += 1

        self.db.commit()
        return synced

    async def _sync_records_batch(self, records: list[dict]) -> int:
        if not records:
            return 0
        synced = 0
        for record in records:
            normalized = self.agmarknet.normalize_record(record)
            if not all([normalized["state"], normalized["district"], normalized["market"], normalized["commodity"]]):
                continue
            market, commodity_obj = self.repo.upsert_reference_data(
                normalized["state"],
                normalized["district"],
                normalized["market"],
                normalized["commodity"],
            )
            self.repo.upsert_market_price(
                market=market,
                commodity=commodity_obj,
                min_price=normalized["min_price"],
                max_price=normalized["max_price"],
                modal_price=normalized["modal_price"],
                arrival_quantity=normalized["arrival_quantity"],
                arrival_unit=normalized["arrival_unit"],
                arrival_date=normalized["arrival_date"],
            )
            synced += 1
        self.db.commit()
        return synced

    async def _sync_priority_areas(self) -> int:
        """Sync Mumbai, Pune, Manchar, Junnar mandi data from Agmarknet."""
        today = datetime.utcnow().strftime("%Y-%m-%d")
        total = 0
        for area in PRIORITY_AREAS:
            for offset in range(0, 200, 100):
                records = await self.agmarknet.fetch_prices(
                    state="Maharashtra",
                    market=area,
                    arrival_date=today,
                    limit=100,
                    offset=offset,
                )
                if not records:
                    records = await self.agmarknet.fetch_prices(
                        state="Maharashtra",
                        district=area,
                        arrival_date=today,
                        limit=100,
                        offset=offset,
                    )
                if not records:
                    break
                total += await self._sync_records_batch(records)
                if len(records) < 100:
                    break
        return total

    async def run_full_sync(self) -> int:
        """Pull latest mandi prices for all major states (hourly job)."""
        total = 0

        # Maharashtra local areas first (Mumbai, Pune, Manchar, Junnar)
        total += await self._sync_priority_areas()

        # General nationwide batch
        for offset in range(0, 300, 100):
            records = await self.agmarknet.fetch_prices(limit=100, offset=offset)
            if not records:
                break
            total += await self._sync_records_batch(records)
            if len(records) < 100:
                break

        # State-wise batches for better coverage
        for state in PRIORITY_STATES:
            for offset in range(0, 200, 100):
                records = await self.agmarknet.fetch_prices(state=state, limit=100, offset=offset)
                if not records:
                    break
                total += await self._sync_records_batch(records)
                if len(records) < 100:
                    break

        logger.info("Full sync completed: %s records processed", total)
        return total

    async def get_states(self) -> list[dict]:
        cache_key = CacheRepository.build_key("states")
        cached = self.cache.get(cache_key)
        if cached:
            return cached

        states = self.repo.get_states()
        if not states:
            await self.sync_from_government_api()
            states = self.repo.get_states()

        result = [{"id": s.id, "name": s.name} for s in states]
        if result:
            self.cache.set(cache_key, result)
        return result

    async def get_districts(self, state: str) -> list[dict]:
        cache_key = CacheRepository.build_key("districts", state=state)
        cached = self.cache.get(cache_key)
        if cached:
            return cached

        districts = self.repo.get_districts_by_state(state)
        if not districts:
            await self.sync_from_government_api(state=state)
            districts = self.repo.get_districts_by_state(state)

        result = [{"id": d.id, "name": d.name, "state_id": d.state_id} for d in districts]
        if result:
            self.cache.set(cache_key, result)
        return result

    async def get_markets(self, district: str, state: str | None = None) -> list[dict]:
        cache_key = CacheRepository.build_key("markets", district=district, state=state)
        cached = self.cache.get(cache_key)
        if cached:
            return cached

        markets = self.repo.get_markets_by_district(district, state)
        if not markets:
            await self.sync_from_government_api(state=state)
            markets = self.repo.get_markets_by_district(district, state)

        result = [{"id": m.id, "name": m.name, "district_id": m.district_id} for m in markets]
        if result:
            self.cache.set(cache_key, result)
        return result

    async def get_commodities(self) -> list[dict]:
        cache_key = CacheRepository.build_key("commodities")
        cached = self.cache.get(cache_key)
        if cached:
            return cached

        commodities = self.repo.get_commodities()
        if not commodities:
            await self.sync_from_government_api()
            commodities = self.repo.get_commodities()

        result = [{"id": c.id, "name": c.name, "icon": c.icon} for c in commodities]
        if result:
            self.cache.set(cache_key, result)
        return result

    async def sync_live_for_query(self, query_params: TodayPricesQuery) -> int:
        """Pull today's prices from Agmarknet for the active filters."""
        today = datetime.utcnow().strftime("%Y-%m-%d")
        total = 0

        async def pull(**kwargs) -> int:
            synced = 0
            for offset in range(0, 500, 100):
                records = await self.agmarknet.fetch_prices(
                    limit=100,
                    offset=offset,
                    arrival_date=today,
                    **kwargs,
                )
                if not records:
                    break
                synced += await self._sync_records_batch(records)
                if len(records) < 100:
                    break
            return synced

        if query_params.areas:
            for area in [a.strip() for a in query_params.areas.split(",") if a.strip()]:
                total += await pull(state=query_params.state or "Maharashtra", market=area)
                if total == 0:
                    total += await pull(state=query_params.state or "Maharashtra", district=area)
        elif query_params.market:
            total += await pull(
                state=query_params.state,
                district=query_params.district,
                market=query_params.market,
                commodity=query_params.commodity,
            )
        elif query_params.commodity or query_params.state:
            total += await pull(
                state=query_params.state or "Maharashtra",
                commodity=query_params.commodity,
            )
        else:
            total += await pull(state="Maharashtra")
            for offset in range(0, 300, 100):
                records = await self.agmarknet.fetch_prices(
                    limit=100, offset=offset, arrival_date=today
                )
                if not records:
                    break
                total += await self._sync_records_batch(records)
                if len(records) < 100:
                    break

        if total:
            self.cache.purge_all()
            logger.info("Live sync for query: %s records", total)
        return total

    async def get_today_prices(
        self, query_params: TodayPricesQuery
    ) -> tuple[list[TodayPriceResponse], int, str | None, int | None]:
        data_source: str | None = None
        live_synced: int | None = None

        if query_params.fresh:
            live_synced = await self.sync_live_for_query(query_params)
            if live_synced:
                data_source = "agmarknet"

        cache_key = CacheRepository.build_key(
            "today_prices",
            state=query_params.state,
            district=query_params.district,
            market=query_params.market,
            commodity=query_params.commodity,
            search=query_params.search,
            areas=query_params.areas,
            page=query_params.page,
            page_size=query_params.page_size,
            fresh=query_params.fresh,
        )

        if not query_params.fresh:
            cached = self.cache.get(cache_key)
            if cached is not None:
                items = [TodayPriceResponse(**item) for item in cached["items"]]
                return items, cached["total"], cached.get("data_source"), cached.get("live_synced")

        items, total = self.repo.get_today_prices(query_params)

        if not items and query_params.areas:
            logger.info("No prices for areas=%s — syncing priority mandis", query_params.areas)
            await self._sync_priority_areas()
            items, total = self.repo.get_today_prices(query_params)

        if not items and not self._has_any_prices():
            logger.info("Database empty — syncing from government API")
            synced = await self.sync_from_government_api(
                state=query_params.state,
                commodity=query_params.commodity,
            )
            if synced:
                data_source = "agmarknet"
                live_synced = synced
            items, total = self.repo.get_today_prices(query_params)

        if not data_source and items:
            data_source = "database"

        payload = {
            **self._serialize_prices(items, total),
            "data_source": data_source,
            "live_synced": live_synced,
        }
        self.cache.set(cache_key, payload)
        return items, total, data_source, live_synced

    def get_price_by_id(self, price_id: int) -> TodayPriceResponse | None:
        return self.repo.get_price_by_id(price_id)

    def get_price_history(self, price_id: int, days: int) -> PriceHistoryResponse | None:
        cache_key = CacheRepository.build_key("price_history", price_id=price_id, days=days)
        cached = self.cache.get(cache_key)
        if cached is not None:
            return PriceHistoryResponse(**cached)

        history = self.repo.get_price_history(price_id, days)
        if history:
            self.cache.set(cache_key, history.model_dump(mode="json"))
        return history

import type { Commodity, District, Market, PaginatedPrices, PriceFilters, PriceHistory, PriceHistoryPoint, State, TodayPrice } from '../models/types';

const ICONS: Record<string, string> = {
  Onion: '🧅',
  Potato: '🥔',
  Tomato: '🍅',
  Wheat: '🌾',
  Maize: '🌽',
  Soybean: '🫘',
  Cabbage: '🥬',
  Cauliflower: '🥦',
  Grapes: '🍇',
  Cotton: '☁️',
};

function icon(name: string) {
  return ICONS[name] ?? '🌾';
}

// Maharashtra onion rates — source: commodityonline.com/mandiprices/onion/maharashtra (17 Aug 2026)
const RAW: Omit<TodayPrice, 'id'>[] = [
  { commodity: 'Onion', state: 'Maharashtra', district: 'Mumbai', market: 'Vashi APMC', min_price: 1000, max_price: 3700, modal_price: 3200, arrival_quantity: 1800, price_unit: 'Quintal', commodity_icon: icon('Onion') },
  { commodity: 'Potato', state: 'Maharashtra', district: 'Mumbai', market: 'Vashi APMC', min_price: 1900, max_price: 2300, modal_price: 2100, arrival_quantity: 1200, price_unit: 'Quintal', commodity_icon: icon('Potato') },
  { commodity: 'Tomato', state: 'Maharashtra', district: 'Mumbai', market: 'Vashi APMC', min_price: 1700, max_price: 2200, modal_price: 1950, arrival_quantity: 950, price_unit: 'Quintal', commodity_icon: icon('Tomato') },
  { commodity: 'Wheat', state: 'Maharashtra', district: 'Mumbai', market: 'Vashi APMC', min_price: 2300, max_price: 2500, modal_price: 2400, arrival_quantity: 800, price_unit: 'Quintal', commodity_icon: icon('Wheat') },
  { commodity: 'Onion', state: 'Maharashtra', district: 'Mumbai', market: 'Mulund APMC', min_price: 1000, max_price: 3700, modal_price: 3150, arrival_quantity: 650, price_unit: 'Quintal', commodity_icon: icon('Onion') },
  { commodity: 'Tomato', state: 'Maharashtra', district: 'Mumbai', market: 'Mulund APMC', min_price: 1650, max_price: 2100, modal_price: 1875, arrival_quantity: 420, price_unit: 'Quintal', commodity_icon: icon('Tomato') },
  { commodity: 'Onion', state: 'Maharashtra', district: 'Pune', market: 'Pune APMC', min_price: 1000, max_price: 3700, modal_price: 3100, arrival_quantity: 720, price_unit: 'Quintal', commodity_icon: icon('Onion') },
  { commodity: 'Potato', state: 'Maharashtra', district: 'Pune', market: 'Pune APMC', min_price: 1800, max_price: 2200, modal_price: 2000, arrival_quantity: 890, price_unit: 'Quintal', commodity_icon: icon('Potato') },
  { commodity: 'Tomato', state: 'Maharashtra', district: 'Pune', market: 'Pune APMC', min_price: 1600, max_price: 2000, modal_price: 1800, arrival_quantity: 540, price_unit: 'Quintal', commodity_icon: icon('Tomato') },
  { commodity: 'Wheat', state: 'Maharashtra', district: 'Pune', market: 'Pune APMC', min_price: 2250, max_price: 2480, modal_price: 2365, arrival_quantity: 1100, price_unit: 'Quintal', commodity_icon: icon('Wheat') },
  { commodity: 'Maize', state: 'Maharashtra', district: 'Pune', market: 'Pune APMC', min_price: 1950, max_price: 2180, modal_price: 2065, arrival_quantity: 680, price_unit: 'Quintal', commodity_icon: icon('Maize') },
  { commodity: 'Soybean', state: 'Maharashtra', district: 'Pune', market: 'Pune APMC', min_price: 4100, max_price: 4500, modal_price: 4300, arrival_quantity: 350, price_unit: 'Quintal', commodity_icon: icon('Soybean') },
  { commodity: 'Tomato', state: 'Maharashtra', district: 'Pune', market: 'Manchar APMC', min_price: 1400, max_price: 1900, modal_price: 1650, arrival_quantity: 2200, price_unit: 'Quintal', commodity_icon: icon('Tomato') },
  { commodity: 'Onion', state: 'Maharashtra', district: 'Pune', market: 'Manchar APMC', min_price: 1000, max_price: 3500, modal_price: 3050, arrival_quantity: 480, price_unit: 'Quintal', commodity_icon: icon('Onion') },
  { commodity: 'Potato', state: 'Maharashtra', district: 'Pune', market: 'Manchar APMC', min_price: 1750, max_price: 2150, modal_price: 1950, arrival_quantity: 620, price_unit: 'Quintal', commodity_icon: icon('Potato') },
  { commodity: 'Cabbage', state: 'Maharashtra', district: 'Pune', market: 'Manchar APMC', min_price: 800, max_price: 1200, modal_price: 1000, arrival_quantity: 380, price_unit: 'Quintal', commodity_icon: icon('Cabbage') },
  { commodity: 'Cauliflower', state: 'Maharashtra', district: 'Pune', market: 'Manchar APMC', min_price: 1200, max_price: 1600, modal_price: 1400, arrival_quantity: 290, price_unit: 'Quintal', commodity_icon: icon('Cauliflower') },
  { commodity: 'Onion', state: 'Maharashtra', district: 'Pune', market: 'Junnar APMC', min_price: 1000, max_price: 3500, modal_price: 3000, arrival_quantity: 520, price_unit: 'Quintal', commodity_icon: icon('Onion') },
  { commodity: 'Tomato', state: 'Maharashtra', district: 'Pune', market: 'Junnar APMC', min_price: 1500, max_price: 1950, modal_price: 1725, arrival_quantity: 780, price_unit: 'Quintal', commodity_icon: icon('Tomato') },
  { commodity: 'Grapes', state: 'Maharashtra', district: 'Pune', market: 'Junnar APMC', min_price: 4500, max_price: 6500, modal_price: 5500, arrival_quantity: 410, price_unit: 'Quintal', commodity_icon: icon('Grapes') },
  { commodity: 'Maize', state: 'Maharashtra', district: 'Pune', market: 'Junnar APMC', min_price: 1880, max_price: 2120, modal_price: 2000, arrival_quantity: 560, price_unit: 'Quintal', commodity_icon: icon('Maize') },
  { commodity: 'Potato', state: 'Maharashtra', district: 'Pune', market: 'Junnar APMC', min_price: 1700, max_price: 2100, modal_price: 1900, arrival_quantity: 340, price_unit: 'Quintal', commodity_icon: icon('Potato') },
  { commodity: 'Onion', state: 'Maharashtra', district: 'Nashik', market: 'Lasalgaon APMC', min_price: 1000, max_price: 3388, modal_price: 3100, arrival_quantity: 1250, price_unit: 'Quintal', commodity_icon: icon('Onion') },
  { commodity: 'Onion', state: 'Maharashtra', district: 'Nashik', market: 'Manmad', min_price: 1000, max_price: 3388, modal_price: 3100, arrival_quantity: 980, price_unit: 'Quintal', commodity_icon: icon('Onion') },
  { commodity: 'Onion', state: 'Maharashtra', district: 'Ahilyanagar', market: 'Newasa(Ghodegaon)', min_price: 1000, max_price: 3700, modal_price: 3000, arrival_quantity: 860, price_unit: 'Quintal', commodity_icon: icon('Onion') },
  { commodity: 'Tomato', state: 'Karnataka', district: 'Kolar', market: 'Kolar APMC', min_price: 1500, max_price: 2100, modal_price: 1800, arrival_quantity: 650, price_unit: 'Quintal', commodity_icon: icon('Tomato') },
  { commodity: 'Wheat', state: 'Punjab', district: 'Ludhiana', market: 'Ludhiana APMC', min_price: 2200, max_price: 2450, modal_price: 2325, arrival_quantity: 3200, price_unit: 'Quintal', commodity_icon: icon('Wheat') },
];

const TODAY = new Date().toISOString().split('T')[0];

export const FALLBACK_PRICES: TodayPrice[] = RAW.map((row, i) => ({
  ...row,
  id: i + 1,
  arrival_date: TODAY,
  last_updated: new Date().toISOString(),
}));

function matchesAreas(row: TodayPrice, areas: string): boolean {
  const tokens = areas.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (!tokens.length) return true;
  const market = row.market.toLowerCase();
  const district = row.district.toLowerCase();
  return tokens.some((t) => market.includes(t) || district.includes(t));
}

export function filterFallbackPrices(filters: PriceFilters = {}): PaginatedPrices {
  let items = [...FALLBACK_PRICES];

  if (filters.state) {
    items = items.filter((r) => r.state.toLowerCase() === filters.state!.toLowerCase());
  }
  if (filters.district) {
    items = items.filter((r) => r.district.toLowerCase() === filters.district!.toLowerCase());
  }
  if (filters.market) {
    items = items.filter((r) => r.market.toLowerCase().includes(filters.market!.toLowerCase()));
  }
  if (filters.commodity) {
    items = items.filter((r) => r.commodity.toLowerCase().includes(filters.commodity!.toLowerCase()));
  }
  if (filters.areas) {
    items = items.filter((r) => matchesAreas(r, filters.areas!));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (r) =>
        r.commodity.toLowerCase().includes(q) ||
        r.market.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q),
    );
  }

  const page = filters.page ?? 1;
  const pageSize = filters.page_size ?? 20;
  const total = items.length;
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    page_size: pageSize,
    total_pages: Math.ceil(total / pageSize) || 0,
  };
}

export function getFallbackStates(): State[] {
  const names = [...new Set(FALLBACK_PRICES.map((r) => r.state))].sort();
  return names.map((name, i) => ({ id: i + 1, name }));
}

export function getFallbackDistricts(state: string): District[] {
  const names = [
    ...new Set(FALLBACK_PRICES.filter((r) => r.state.toLowerCase() === state.toLowerCase()).map((r) => r.district)),
  ].sort();
  return names.map((name, i) => ({ id: i + 1, name, state_id: 1 }));
}

export function getFallbackMarkets(district: string, state?: string): Market[] {
  let rows = FALLBACK_PRICES.filter((r) => r.district.toLowerCase() === district.toLowerCase());
  if (state) rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const names = [...new Set(rows.map((r) => r.market))].sort();
  return names.map((name, i) => ({ id: i + 1, name, district_id: 1 }));
}

export function getFallbackCommodities(): Commodity[] {
  const names = [...new Set(FALLBACK_PRICES.map((r) => r.commodity))].sort();
  return names.map((name, i) => ({ id: i + 1, name, icon: icon(name) }));
}

export function getFallbackPriceById(id: number): TodayPrice | undefined {
  return FALLBACK_PRICES.find((r) => r.id === id);
}

function generateFallbackHistory(price: TodayPrice, days: 7 | 30): PriceHistory {
  const base = price.modal_price ?? 2000;
  const minBase = price.min_price ?? base * 0.92;
  const maxBase = price.max_price ?? base * 1.08;
  const points: PriceHistoryPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const seed = (price.id ?? 1) + i;
    const wave = ((seed * 17) % 13 - 6) / 100;
    const trend = i * 0.0015;
    const factor = 1 + wave - trend;
    const modal = Math.round(base * factor);
    const spread = Math.round((maxBase - minBase) * 0.5);
    points.push({
      date: dateStr,
      modal_price: modal,
      min_price: modal - spread,
      max_price: modal + spread,
    });
  }

  const modalValues = points.map((p) => p.modal_price!).filter(Boolean);
  const avg = modalValues.length
    ? Math.round(modalValues.reduce((a, b) => a + b, 0) / modalValues.length)
    : undefined;
  const change =
    modalValues.length >= 2 && modalValues[0]
      ? Math.round(((modalValues[modalValues.length - 1] - modalValues[0]) / modalValues[0]) * 1000) / 10
      : undefined;

  return {
    market: price.market,
    commodity: price.commodity,
    price_unit: price.price_unit,
    days,
    points,
    average_modal_price: avg,
    change_percent: change,
  };
}

export function getFallbackPriceHistory(id: number, days: 7 | 30): PriceHistory {
  const price = getFallbackPriceById(id);
  if (!price) throw new Error('NOT_FOUND');
  return generateFallbackHistory(price, days);
}

export function getFallbackSyncStatus() {
  return {
    last_sync_at: null,
    records_synced: FALLBACK_PRICES.length,
    sync_running: false,
    interval_seconds: 3600,
    interval_label: 'offline',
  };
}

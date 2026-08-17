export interface State {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  state_id: number;
}

export interface Market {
  id: number;
  name: string;
  district_id: number;
}

export interface Commodity {
  id: number;
  name: string;
  icon?: string;
}

export interface TodayPrice {
  id?: number;
  commodity: string;
  commodity_icon?: string;
  state: string;
  district: string;
  market: string;
  min_price?: number;
  max_price?: number;
  modal_price?: number;
  arrival_quantity?: number;
  arrival_unit?: string;
  price_unit: string;
  arrival_date?: string;
  last_updated?: string;
}

export interface PaginatedPrices {
  items: TodayPrice[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PriceFilters {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  search?: string;
  areas?: string;
  page?: number;
  page_size?: number;
}

export interface PriceHistoryPoint {
  date: string;
  modal_price?: number;
  min_price?: number;
  max_price?: number;
}

export interface PriceHistory {
  market: string;
  commodity: string;
  price_unit: string;
  days: number;
  points: PriceHistoryPoint[];
  average_modal_price?: number;
  change_percent?: number;
}

export interface FilterState {
  state: string;
  district: string;
  market: string;
  commodity: string;
  search: string;
  areas: string;
  quickArea: string;
}

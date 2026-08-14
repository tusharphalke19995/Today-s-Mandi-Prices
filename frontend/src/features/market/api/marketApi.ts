import { apiClient } from './client';
import type {
  Commodity,
  District,
  Market,
  PaginatedPrices,
  PriceFilters,
  State,
  TodayPrice,
} from '../models/types';

export const marketApi = {
  getStates: async (): Promise<State[]> => {
    const { data } = await apiClient.get<State[]>('/states');
    return data;
  },

  getDistricts: async (state: string): Promise<District[]> => {
    const { data } = await apiClient.get<District[]>('/districts', {
      params: { state },
    });
    return data;
  },

  getMarkets: async (district: string, state?: string): Promise<Market[]> => {
    const { data } = await apiClient.get<Market[]>('/markets', {
      params: { district, state },
    });
    return data;
  },

  getCommodities: async (): Promise<Commodity[]> => {
    const { data } = await apiClient.get<Commodity[]>('/commodities');
    return data;
  },

  getTodayPrices: async (filters: PriceFilters = {}): Promise<PaginatedPrices> => {
    const { data } = await apiClient.get<PaginatedPrices>('/today-prices', {
      params: filters,
    });
    return data;
  },

  getPriceById: async (id: number): Promise<TodayPrice> => {
    const { data } = await apiClient.get<TodayPrice>(`/today-prices/${id}`);
    return data;
  },

  getSyncStatus: async (): Promise<SyncStatus> => {
    const { data } = await apiClient.get<SyncStatus>('/sync/status');
    return data;
  },
};

export interface SyncStatus {
  last_sync_at: string | null;
  records_synced: number;
  sync_running: boolean;
  interval_seconds: number;
  interval_label: string;
}

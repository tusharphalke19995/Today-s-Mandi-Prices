import { apiClient } from './client';
import { ensureApiAwake } from './apiConfig';
import {
  filterFallbackPrices,
  getFallbackCommodities,
  getFallbackDistricts,
  getFallbackMarkets,
  getFallbackPriceById,
  getFallbackPriceHistory,
  getFallbackStates,
  getFallbackSyncStatus,
} from '../data/fallbackData';
import { useApiModeStore } from '@/store/apiModeStore';
import type {
  Commodity,
  District,
  Market,
  PaginatedPrices,
  PriceFilters,
  PriceHistory,
  State,
  TodayPrice,
} from '../models/types';

async function tryLive<T>(call: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!import.meta.env.PROD) {
    try {
      const result = await call();
      useApiModeStore.getState().setMode('live');
      return result;
    } catch {
      useApiModeStore.getState().setMode('fallback');
      return fallback();
    }
  }

  try {
    const result = await call();
    useApiModeStore.getState().setMode('live');
    return result;
  } catch {
    const awake = await ensureApiAwake();
    if (awake) {
      try {
        const result = await call();
        useApiModeStore.getState().setMode('live');
        return result;
      } catch {
        // fall through
      }
    }
    useApiModeStore.getState().setMode('fallback');
    return fallback();
  }
}

export const marketApi = {
  getStates: async (): Promise<State[]> =>
    tryLive(
      async () => (await apiClient.get<State[]>('/states')).data,
      getFallbackStates,
    ),

  getDistricts: async (state: string): Promise<District[]> =>
    tryLive(
      async () => (await apiClient.get<District[]>('/districts', { params: { state } })).data,
      () => getFallbackDistricts(state),
    ),

  getMarkets: async (district: string, state?: string): Promise<Market[]> =>
    tryLive(
      async () => (await apiClient.get<Market[]>('/markets', { params: { district, state } })).data,
      () => getFallbackMarkets(district, state),
    ),

  getCommodities: async (): Promise<Commodity[]> =>
    tryLive(
      async () => (await apiClient.get<Commodity[]>('/commodities')).data,
      getFallbackCommodities,
    ),

  getTodayPrices: async (filters: PriceFilters = {}): Promise<PaginatedPrices> =>
    tryLive(
      async () =>
        (
          await apiClient.get<PaginatedPrices>('/live-prices', {
            params: { ...filters, fresh: undefined },
          })
        ).data,
      () => filterFallbackPrices(filters),
    ),

  getTodayPricesCached: async (filters: PriceFilters = {}): Promise<PaginatedPrices> =>
    tryLive(
      async () => (await apiClient.get<PaginatedPrices>('/today-prices', { params: filters })).data,
      () => filterFallbackPrices(filters),
    ),

  getPriceById: async (id: number): Promise<TodayPrice> =>
    tryLive(
      async () => (await apiClient.get<TodayPrice>(`/today-prices/${id}`)).data,
      () => {
        const price = getFallbackPriceById(id);
        if (!price) throw new Error('NOT_FOUND');
        return price;
      },
    ),

  getPriceHistory: async (id: number, days: 7 | 30): Promise<PriceHistory> =>
    tryLive(
      async () =>
        (await apiClient.get<PriceHistory>(`/today-prices/${id}/history`, { params: { days } })).data,
      () => getFallbackPriceHistory(id, days),
    ),

  getSyncStatus: async (): Promise<SyncStatus> =>
    tryLive(
      async () => (await apiClient.get<SyncStatus>('/sync/status')).data,
      getFallbackSyncStatus,
    ),
};

export interface SyncStatus {
  last_sync_at: string | null;
  records_synced: number;
  sync_running: boolean;
  interval_seconds: number;
  interval_label: string;
}

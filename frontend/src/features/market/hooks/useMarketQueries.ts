import { useQuery } from '@tanstack/react-query';
import { marketApi } from '../api/marketApi';
import { resetApiWake } from '../api/apiConfig';
import type { PriceFilters } from '../models/types';
import { PRICE_REFRESH_INTERVAL_MS } from '../constants';

export { resetApiWake };

export const marketKeys = {
  all: ['market'] as const,
  states: () => [...marketKeys.all, 'states'] as const,
  districts: (state: string) => [...marketKeys.all, 'districts', state] as const,
  markets: (district: string, state?: string) =>
    [...marketKeys.all, 'markets', district, state] as const,
  commodities: () => [...marketKeys.all, 'commodities'] as const,
  todayPrices: (filters: PriceFilters) => [...marketKeys.all, 'today-prices', filters] as const,
  priceDetail: (id: number) => [...marketKeys.all, 'price', id] as const,
  priceHistory: (id: number, days: number) => [...marketKeys.all, 'history', id, days] as const,
  syncStatus: () => [...marketKeys.all, 'sync-status'] as const,
};

const hourlyQuery = {
  staleTime: PRICE_REFRESH_INTERVAL_MS,
  refetchInterval: PRICE_REFRESH_INTERVAL_MS,
  refetchOnWindowFocus: true,
  retry: 1,
  retryDelay: 3000,
};

export function useStates() {
  return useQuery({
    queryKey: marketKeys.states(),
    queryFn: marketApi.getStates,
    ...hourlyQuery,
  });
}

export function useDistricts(state: string) {
  return useQuery({
    queryKey: marketKeys.districts(state),
    queryFn: () => marketApi.getDistricts(state),
    enabled: !!state,
    ...hourlyQuery,
  });
}

export function useMarkets(district: string, state?: string) {
  return useQuery({
    queryKey: marketKeys.markets(district, state),
    queryFn: () => marketApi.getMarkets(district, state),
    enabled: !!district,
    ...hourlyQuery,
  });
}

export function useCommodities() {
  return useQuery({
    queryKey: marketKeys.commodities(),
    queryFn: marketApi.getCommodities,
    ...hourlyQuery,
  });
}

export function useTodayPrices(filters: PriceFilters) {
  return useQuery({
    queryKey: marketKeys.todayPrices(filters),
    queryFn: () => marketApi.getTodayPrices(filters),
    ...hourlyQuery,
    placeholderData: (prev) => prev,
  });
}

export function usePriceDetail(id: number) {
  return useQuery({
    queryKey: marketKeys.priceDetail(id),
    queryFn: () => marketApi.getPriceById(id),
    enabled: id > 0,
    ...hourlyQuery,
  });
}

export function usePriceHistory(id: number, days: 7 | 30) {
  return useQuery({
    queryKey: marketKeys.priceHistory(id, days),
    queryFn: () => marketApi.getPriceHistory(id, days),
    enabled: id > 0,
    staleTime: PRICE_REFRESH_INTERVAL_MS,
    retry: 1,
  });
}

export function useSyncStatus() {
  return useQuery({
    queryKey: marketKeys.syncStatus(),
    queryFn: marketApi.getSyncStatus,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    retry: 1,
  });
}

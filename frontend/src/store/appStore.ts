import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterState } from '@/features/market/models/types';
import type { Language } from '@/i18n/types';

interface AppStore {
  selectedState: string;
  filters: FilterState;
  darkMode: boolean;
  language: Language;
  setSelectedState: (state: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  toggleDarkMode: () => void;
  setLanguage: (language: Language) => void;
}

const defaultFilters: FilterState = {
  state: 'Maharashtra',
  district: '',
  market: '',
  commodity: '',
  search: '',
  areas: 'Mumbai,Pune,Manchar,Junnar',
  quickArea: 'all',
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      selectedState: 'Maharashtra',
      filters: defaultFilters,
      darkMode: false,
      language: 'hi',
      setSelectedState: (state) =>
        set((s) => ({
          selectedState: state,
          filters: {
            ...s.filters,
            state,
            district: '',
            market: '',
            areas: state === 'Maharashtra' ? 'Mumbai,Pune,Manchar,Junnar' : '',
            quickArea: state === 'Maharashtra' ? 'all' : '',
          },
        })),
      setFilters: (filters) =>
        set((s) => ({
          filters: { ...s.filters, ...filters },
          selectedState: filters.state ?? s.selectedState,
        })),
      resetFilters: () =>
        set((s) => ({
          filters: {
            ...defaultFilters,
            state: s.selectedState,
            areas: s.selectedState === 'Maharashtra' ? 'Mumbai,Pune,Manchar,Junnar' : '',
            quickArea: s.selectedState === 'Maharashtra' ? 'all' : '',
          },
        })),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'mandi-app-store',
      partialize: (state) => ({
        selectedState: state.selectedState,
        darkMode: state.darkMode,
        language: state.language,
      }),
    },
  ),
);

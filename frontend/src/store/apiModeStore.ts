import { create } from 'zustand';

type ApiMode = 'live' | 'fallback' | 'checking';

interface ApiModeStore {
  mode: ApiMode;
  setMode: (mode: ApiMode) => void;
}

export const useApiModeStore = create<ApiModeStore>((set) => ({
  mode: 'checking',
  setMode: (mode) => set({ mode }),
}));

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && error.message === 'NETWORK_ERROR';
}

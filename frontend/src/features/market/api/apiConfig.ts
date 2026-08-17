/** Resolve API base URL for local dev, Render combined deploy, and split web+api deploy. */
export function getApiBaseUrl(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const envHost = import.meta.env.VITE_API_HOST as string | undefined;

  if (envBase) return envBase;
  if (envHost) return `https://${envHost}/api/v1`;

  if (import.meta.env.PROD && typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('mandi-prices-api')) {
      return '/api/v1';
    }
    if (host.includes('onrender.com') || host.includes('vercel.app')) {
      return 'https://mandi-prices-api.onrender.com/api/v1';
    }
  }

  return '/api/v1';
}

const WAKE_ATTEMPTS = 2;
const WAKE_TIMEOUT_MS = 25_000;

let apiWakePromise: Promise<boolean> | null = null;

/** Quick ping — fail fast and use embedded fallback data if API unreachable. */
export async function wakeApiServer(): Promise<boolean> {
  if (!import.meta.env.PROD) return true;

  const pingUrl = `${getApiBaseUrl()}/ping`;

  for (let attempt = 0; attempt < WAKE_ATTEMPTS; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), WAKE_TIMEOUT_MS);
      const res = await fetch(pingUrl, { signal: controller.signal, cache: 'no-store' });
      clearTimeout(timer);
      if (res.ok) return true;
    } catch {
      // API unreachable
    }
    if (attempt < WAKE_ATTEMPTS - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  return false;
}

export function ensureApiAwake(): Promise<boolean> {
  if (!import.meta.env.PROD) return Promise.resolve(true);
  if (!apiWakePromise) {
    apiWakePromise = wakeApiServer();
  }
  return apiWakePromise;
}

export function resetApiWake(): void {
  apiWakePromise = null;
}

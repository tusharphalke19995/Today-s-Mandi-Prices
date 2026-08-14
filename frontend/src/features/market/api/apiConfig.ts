/** Resolve API base URL for local dev, Render combined deploy, and split web+api deploy. */
export function getApiBaseUrl(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const envHost = import.meta.env.VITE_API_HOST as string | undefined;

  if (envBase) return envBase;
  if (envHost) return `https://${envHost}/api/v1`;

  if (import.meta.env.PROD && typeof window !== 'undefined') {
    const host = window.location.hostname;
    // API service serves both website + API on the same host
    if (host.includes('mandi-prices-api')) {
      return '/api/v1';
    }
    // Website on mandi-prices-web calls the API service
    if (host.includes('onrender.com') || host.includes('vercel.app')) {
      return 'https://mandi-prices-api.onrender.com/api/v1';
    }
  }

  return '/api/v1';
}

export function getApiOrigin(): string {
  const base = getApiBaseUrl();
  if (base.startsWith('http')) {
    return base.replace(/\/api\/v1\/?$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://mandi-prices-api.onrender.com';
}

/** Ping API to wake Render free tier before loading prices. */
export async function wakeApiServer(): Promise<void> {
  const origin = getApiOrigin();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  try {
    await fetch(`${origin}/health`, { signal: controller.signal });
  } catch {
    // Server may still be waking — price requests will retry
  } finally {
    clearTimeout(timer);
  }
}

import axios from 'axios';

const apiHost =
  (import.meta.env.VITE_API_HOST as string | undefined) ||
  (import.meta.env.PROD ? 'mandi-prices-api.onrender.com' : undefined);
const API_BASE_URL =
  apiHost != null && apiHost !== ''
    ? `https://${apiHost}/api/v1`
    : import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('NETWORK_ERROR'));
    }
    return Promise.reject(error);
  },
);

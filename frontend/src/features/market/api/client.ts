import axios from 'axios';
import { getApiBaseUrl } from './apiConfig';

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000,
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

export { API_BASE_URL };

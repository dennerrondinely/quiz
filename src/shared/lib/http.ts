import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { env } from '@/shared/lib/env';

export type { AxiosRequestConfig };

export function createHttpClient(baseURL: string = env.VITE_API_BASE_URL): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
  });

  axiosRetry(instance, {
    retries: 2,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) =>
      axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429,
  });

  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      // Single point to plug auth refresh, telemetry, etc.
      return Promise.reject(error);
    },
  );

  return instance;
}

export const httpClient = createHttpClient();

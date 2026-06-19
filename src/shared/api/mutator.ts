import { type AxiosRequestConfig, httpClient } from '@/shared/lib/http';

export const customAxios = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = new AbortController();
  const promise = httpClient({ ...config, ...options, signal: source.signal }).then(
    ({ data }) => data as T,
  );
  // Orval expects a `cancel` method on the returned promise for query cancellation.
  (promise as Promise<T> & { cancel: () => void }).cancel = () => {
    source.abort('Query was cancelled');
  };
  return promise;
};

export default customAxios;

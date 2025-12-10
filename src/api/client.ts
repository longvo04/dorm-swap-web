import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/utils/constants';

export const ROOT_API = API_BASE_URL;

export const apiClient: AxiosInstance = axios.create({
  baseURL: ROOT_API,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const message = typeof error.response?.data === 'object' && error.response?.data !== null
      ? (error.response.data as { message?: string }).message ?? error.message
      : error.message;
    return Promise.reject(new Error(message));
  }
);

export type ApiRequestConfig<TPayload = unknown> = AxiosRequestConfig<TPayload>;

export async function callApi<TResponse = unknown, TPayload = unknown>(
  config: ApiRequestConfig<TPayload>
): Promise<TResponse> {
  const response = await apiClient.request<TResponse>(config);
  return response.data;
}


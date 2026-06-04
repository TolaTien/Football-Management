import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const API_URL = process.env.NODE_ENV === 'production' 
  ? (window as any).UMI_APP_API_URL || 'https://football-management-ocd0.onrender.com' 
  : '/api';

export const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshTokenRequest: Promise<string> | null = null;

const refreshAccessToken = async () => {
  const res = await axios.post<{ accessToken: string }>(
    `${API_URL}/auth/refresh-token`,
    undefined,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data.accessToken;
};

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pitchhub_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

$api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;
    const requestUrl = originalRequest?.url || '';

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !requestUrl.includes('/auth/refresh-token') &&
      !requestUrl.includes('/auth/login')
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshTokenRequest) {
          refreshTokenRequest = refreshAccessToken().finally(() => {
            refreshTokenRequest = null;
          });
        }

        const accessToken = await refreshTokenRequest;
        localStorage.setItem('pitchhub_token', accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return $api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('pitchhub_token');
        localStorage.removeItem('pitchhub_user');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401 && requestUrl.includes('/auth/refresh-token')) {
      localStorage.removeItem('pitchhub_token');
      localStorage.removeItem('pitchhub_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const axiosInstance = $api;

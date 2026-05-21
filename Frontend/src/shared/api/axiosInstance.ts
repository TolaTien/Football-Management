import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const is401 = error.response?.status === 401;
    const isAuthPage = window.location.pathname.startsWith('/auth');
    if (is401 && !isAuthPage) {
      localStorage.removeItem('token');
      localStorage.removeItem('pitchhub_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

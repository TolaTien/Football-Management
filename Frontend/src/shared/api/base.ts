import axios from 'axios';

export const API_URL = process.env.API_URL || 'http://localhost:3000';

export const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/auth/login') {
      localStorage.removeItem('pitchhub_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  },
);

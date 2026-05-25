import axios from 'axios';

export const API_URL = '/api';

export const $api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

$api.interceptors.request.use((config) => {
    const token = localStorage.getItem('pitchhub_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

$api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('pitchhub_token');
            localStorage.removeItem('pitchhub_user');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

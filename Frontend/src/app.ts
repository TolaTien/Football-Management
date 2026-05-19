import '@ant-design/v5-patch-for-react-19';
import { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { AuthService } from './shared/api/auth/auth.service';
import { UserInfo } from './shared/api/auth/types';

export async function getInitialState(): Promise<{
  currentUser?: UserInfo;
  fetchUserInfo?: () => Promise<UserInfo | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const response = await AuthService.checkAuth();
      return response.data;
    } catch (error) {
      return undefined;
    }
  };

  const { location } = window;
  // Bỏ qua check auth nếu đang ở trang login/signup
  if (location.pathname !== '/auth/login' && location.pathname !== '/auth/signup') {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
    };
  }

  return {
    fetchUserInfo,
  };
}

export const request: RequestConfig = {
  timeout: 10000,
  
  errorConfig: {
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error.response) {
         message.error(error.response.data?.message || 'Lỗi hệ thống từ server');
      } else if (error.request) {
         message.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.');
      } else {
         message.error('Đã xảy ra lỗi không xác định.');
      }
      throw error;
    },
  },

  requestInterceptors: [
    (config: any) => {
      const token = localStorage.getItem('pitchhub_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.credentials = 'include';
      return config;
    },
  ],

  responseInterceptors: [
    [
      (response) => response,
      async (error: any) => {
        const { config, response } = error;
        
        if (response?.status === 401 && config && !config.url.includes('/auth/refresh-token') && !config.url.includes('/auth/login')) {
           try {
             const refreshRes = await AuthService.refreshToken();
             if (refreshRes.accessToken) {
               localStorage.setItem('pitchhub_token', refreshRes.accessToken);
               const { request: umiRequest } = require('@umijs/max');
               return umiRequest(config.url, { ...config, headers: { ...config.headers, Authorization: `Bearer ${refreshRes.accessToken}` } });
             }
           } catch (refreshError) {
             localStorage.removeItem('pitchhub_token');
             localStorage.removeItem('pitchhub_user');
             window.location.href = '/auth/login';
             return Promise.reject(refreshError);
           }
        }
        return Promise.reject(error);
      }
    ]
  ],
};

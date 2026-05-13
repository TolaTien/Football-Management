import { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { AuthService } from './shared/api/auth/auth.service';
import { UserInfo } from './shared/api/auth/types';

// ==========================================
// 1. Initial State (Quản lý trạng thái toàn cục)
// ==========================================
export async function getInitialState(): Promise<{
  currentUser?: UserInfo;
  fetchUserInfo?: () => Promise<UserInfo | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const response = await AuthService.checkAuth();
      return response.data;
    } catch (error) {
      // Nếu lỗi (chưa đăng nhập, token hết hạn), trả về undefined
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

// ==========================================
// 2. Request Configuration (Interceptor)
// ==========================================
export const request: RequestConfig = {
  timeout: 10000,
  
  // Xử lý lỗi tập trung
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

  // Interceptor gửi Request: Luôn đính kèm Cookie (credentials: include)
  requestInterceptors: [
    (url, options) => {
      return {
        url,
        options: { ...options, credentials: 'include' },
      };
    },
  ],

  // Interceptor nhận Response: Xử lý tự động Refresh Token
  responseInterceptors: [
    [
      // Success response handler
      (response) => {
        return response;
      },
      // Error response handler
      async (error: any) => {
        const { config, response } = error;
        
        // Nếu lỗi 401 Unauthorized và không phải request gọi login/refresh-token
        if (response?.status === 401 && config && !config.url.includes('/auth/refresh-token') && !config.url.includes('/auth/login')) {
           try {
             // Thử gọi refresh token ngầm
             await AuthService.refreshToken();
             
             // Nếu thành công, tự động gọi lại API gốc vừa bị fail
             const axios = require('axios');
             config.credentials = 'include'; // Đảm bảo gọi lại vẫn mang cookie mới
             return axios(config);
           } catch (refreshError) {
             // Nếu refresh token cũng thất bại (hết hạn 7 ngày), đá về trang đăng nhập
             window.location.href = '/auth/login';
             return Promise.reject(refreshError);
           }
        }
        return Promise.reject(error);
      }
    ]
  ],
};

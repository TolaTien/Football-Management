import request from 'umi-request';
import type { ApiResponse, AuthResponse, LoginPayload, RegisterPayload, UserInfo } from './types';

export const AuthService = {
  /**
   * Đăng nhập (Set HttpOnly Cookie)
   */
  login: async (data: LoginPayload) => {
    return request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      data,
    });
  },

  /**
   * Đăng ký tài khoản (Set HttpOnly Cookie)
   */
  register: async (data: RegisterPayload) => {
    return request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      data,
    });
  },

  /**
   * Đăng xuất (Clear HttpOnly Cookie)
   */
  logout: async () => {
    return request<ApiResponse>('/api/auth/logout', {
      method: 'POST',
    });
  },

  /**
   * Lấy thông tin user hiện tại (Dùng Cookie)
   */
  checkAuth: async () => {
    return request<{ message: string, data: { user: UserInfo } }>('/api/auth/checkAuth', {
      method: 'GET',
    });
  },

  /**
   * Xin cấp lại Access Token khi hết hạn (Dựa vào RefreshToken Cookie)
   */
  refreshToken: async () => {
    return request<{ accessToken: string }>('/api/auth/refresh-token', {
      method: 'POST',
    });
  }
};

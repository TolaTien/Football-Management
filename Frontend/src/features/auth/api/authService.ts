import { axiosInstance } from '@/shared/api';
import type { ApiResponse, AuthResponse, LoginPayload, RegisterPayload, UserInfo } from './types';

export const AuthService = {
  /**
   * Đăng nhập (Set HttpOnly Cookie)
   */
  login: async (data: LoginPayload) => {
    const res = await axiosInstance.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  /**
   * Đăng ký tài khoản (Set HttpOnly Cookie)
   */
  register: async (data: RegisterPayload) => {
    const res = await axiosInstance.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  /**
   * Đăng xuất (Clear HttpOnly Cookie)
   */
  logout: async () => {
    const res = await axiosInstance.post<ApiResponse>('/auth/logout');
    return res.data;
  },

  /**
   * Lấy thông tin user hiện tại (Dùng Cookie)
   */
  checkAuth: async () => {
    const res = await axiosInstance.get<{ message: string, data: { user: UserInfo } }>('/auth/checkAuth');
    return res.data;
  },

  /**
   * Xin cấp lại Access Token khi hết hạn (Dựa vào RefreshToken Cookie)
   */
  refreshToken: async () => {
    const res = await axiosInstance.post<{ accessToken: string }>('/auth/refresh-token');
    return res.data;
  }
};

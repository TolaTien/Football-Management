import { $api } from '@/shared/api/axiosInstance';
import type { ApiResponse, AuthResponse, LoginPayload, RegisterPayload } from './types';
import type { UserInfo } from '@/entities/user';

export const AuthService = {
  /**
   * Đăng nhập (Set HttpOnly Cookie)
   */
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await $api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  /**
   * Đăng ký tài khoản (Set HttpOnly Cookie)
   */
  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const res = await $api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  /**
   * Đăng xuất (Clear HttpOnly Cookie)
   */
  logout: async (): Promise<ApiResponse> => {
    const res = await $api.post<ApiResponse>('/auth/logout');
    return res.data;
  },

  /**
   * Lấy thông tin user hiện tại (Dùng Cookie)
   */
  checkAuth: async (): Promise<{ message: string, data: { user: UserInfo } }> => {
    const res = await $api.get<{ message: string, data: { user: UserInfo } }>('/auth/checkAuth');
    return res.data;
  },

  /**
   * Xin cấp lại Access Token khi hết hạn (Dựa vào RefreshToken Cookie)
   */
  refreshToken: async (): Promise<{ accessToken: string }> => {
    const res = await $api.post<{ accessToken: string }>('/auth/refresh-token');
    return res.data;
  }
};

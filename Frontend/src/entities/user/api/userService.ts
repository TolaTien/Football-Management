import { axiosInstance } from '@/shared/api';
import { $api } from '@/shared/api/axiosInstance';
import type { CreateUserDto, UpdateUserDto, UserInfo } from '../model/types';


export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface BookingHistoryResponse {
  history: any[];
  pagination: {
    numberPage: number;
    page: number;
    totalRequest: number;
    perpage: number;
  };
}

export const userService = {
  getAll: (params: { page?: number; limit?: number; search?: string }) =>
    axiosInstance.get('/admin/users', { params }),

  create: (dto: CreateUserDto) =>
    axiosInstance.post('/admin/users', dto),

  update: (userId: string, dto: UpdateUserDto) =>
    axiosInstance.put(`/admin/users/${userId}`, dto),

  remove: (userId: string) =>
    axiosInstance.delete(`/admin/users/${userId}`),

  ban: (userId: string, status: 'active' | 'banned') =>
    axiosInstance.patch(`/admin/ban-user/${userId}`, { status }),
};

export const UsersService = {
  /**
   * Cập nhật thông tin cá nhân của user.
   * Dùng multipart/form-data vì có thể có file ảnh (avt).
   */
  updateProfileUser: async (
    payload: UpdateProfilePayload,
    avatarFile?: File,
  ): Promise<UserInfo> => {
    const formData = new FormData();

    if (payload.fullName) formData.append('fullName', payload.fullName);
    if (payload.email) formData.append('email', payload.email);
    if (payload.phone) formData.append('phone', payload.phone);
    if (avatarFile) formData.append('avt', avatarFile);

    const { data } = await $api.put('/user/update-profile-user', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Backend trả về: { message: '...', data: updatedUser }
    return data.data;
  },

  /**
   * Lấy lịch sử đặt sân của user.
   */
  getHistoryBooking: async (page: number = 1): Promise<BookingHistoryResponse> => {
    const { data } = await $api.get('/user/get-all-history-booking', {
      params: { page, _t: Date.now() },
    });
    return data.data;
  },

  /**
   * Lấy danh sách 10 người dùng đặt sân hoạt động nhiều nhất.
   */
  getTopSpenders: async (): Promise<any[]> => {
    const { data } = await $api.get('/statistic/top-spenders');
    return data.data;
  },
};


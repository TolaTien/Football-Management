import { $api } from '@/shared/api/axiosInstance';
import type { UserInfo } from '@/features/auth/api/types';

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
};

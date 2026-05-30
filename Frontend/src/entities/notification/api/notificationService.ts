import { $api } from '@/shared/api/axiosInstance';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  isRead: boolean;
  type: string;
  createdAt: string;
  isLocal?: boolean;
}

export interface NotificationResponse {
  notification: NotificationItem[];
  pagination: {
    numberPage: number;
    page: number;
    totalRequest: number;
    perpage: number;
  };
}

export const NotificationsService = {
  /**
   * Lấy danh sách thông báo của user.
   */
  getAllNotifications: async (page: number = 1): Promise<NotificationResponse> => {
    const { data } = await $api.get('/notification/get-all-notification', {
      params: { page, _t: Date.now() },
    });
    // Backend trả về: { message, data: { notification, pagination } }
    return data.data;
  },

  /**
   * Đánh dấu 1 thông báo là đã đọc.
   */
  markRead: async (id: string): Promise<void> => {
    await $api.patch(`/notification/mark-read/${id}`);
  },

  /**
   * Đánh dấu tất cả thông báo là đã đọc.
   */
  markReadAll: async (): Promise<void> => {
    await $api.patch('/notification/mark-read-all');
  },
};

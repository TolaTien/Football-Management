import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NotificationsService, NotificationItem } from '../api/notificationService';

interface NotificationState {
  list: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: {
    numberPage: number;
    page: number;
    totalRequest: number;
    perpage: number;
  } | null;
}

const getLocalNotifications = (): NotificationItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('pitchhub_local_notifications');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalNotifications = (notifs: NotificationItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('pitchhub_local_notifications', JSON.stringify(notifs));
  } catch {}
};

const localNotifs = getLocalNotifications();

const initialState: NotificationState = {
  list: localNotifs,
  unreadCount: localNotifs.filter(n => !n.isRead).length,
  loading: false,
  error: null,
  pagination: null,
};

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const data = await NotificationsService.getAllNotifications(page);
      return data; // Trả về toàn bộ đối tượng { notification, pagination }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Không thể lấy danh sách thông báo');
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notification/markRead',
  async (id: string, { rejectWithValue }) => {
    try {
      await NotificationsService.markRead(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Không thể đánh dấu đã đọc');
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notification/markReadAll',
  async (_, { rejectWithValue }) => {
    try {
      await NotificationsService.markReadAll();
      return;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Không thể đánh dấu tất cả đã đọc');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'createdAt' | 'isRead' | 'userId'>>) => {
      const newNotif: NotificationItem = {
        id: action.payload.id || Math.random().toString(36).substr(2, 9),
        userId: '',
        title: action.payload.title || 'Thông báo mới',
        content: action.payload.content,
        isRead: false,
        type: action.payload.type || 'booking',
        createdAt: new Date().toISOString(),
        isLocal: true,
      };
      
      // Check if duplicate (avoid duplicates if socket events are triggered multiple times)
      const exists = state.list.some(n => n.id === newNotif.id);
      if (!exists) {
        state.list.unshift(newNotif);
        state.unreadCount += 1;
        
        // Save local notifications to localStorage
        const locals = state.list.filter(n => n.isLocal);
        saveLocalNotifications(locals);
      }
    },
    clearNotifications: (state) => {
      state.list = [];
      state.unreadCount = 0;
      saveLocalNotifications([]);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        
        // Lấy danh sách thông báo cục bộ hiện tại
        const locals = state.list.filter(n => n.isLocal);
        const incoming = action.payload.notification;
        
        // Loại bỏ các thông báo trùng lặp từ server
        const filteredLocals = locals.filter(
          l => !incoming.some((i: any) => i.id === l.id)
        );
        
        state.list = [...filteredLocals, ...incoming];
        state.pagination = action.payload.pagination;
        state.unreadCount = state.list.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark Single Read
      .addCase(markNotificationRead.fulfilled, (state, action: PayloadAction<string>) => {
        const notif = state.list.find(n => n.id === action.payload);
        if (notif && !notif.isRead) {
          notif.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
          
          // Lưu lại danh sách thông báo cục bộ đã cập nhật vào localStorage
          const locals = state.list.filter(n => n.isLocal);
          saveLocalNotifications(locals);
        }
      })
      // Mark All Read
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.list.forEach(n => {
          n.isRead = true;
        });
        state.unreadCount = 0;
        
        // Lưu lại danh sách thông báo cục bộ đã cập nhật vào localStorage
        const locals = state.list.filter(n => n.isLocal);
        saveLocalNotifications(locals);
      });
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NotificationsService, NotificationItem } from '../api/notificationService';

interface NotificationState {
  list: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  list: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const data = await NotificationsService.getAllNotifications(page);
      return data.notification;
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
      };
      
      // Check if duplicate (avoid duplicates if socket events are triggered multiple times)
      const exists = state.list.some(n => n.id === newNotif.id);
      if (!exists) {
        state.list.unshift(newNotif);
        state.unreadCount += 1;
      }
    },
    clearNotifications: (state) => {
      state.list = [];
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<NotificationItem[]>) => {
        state.loading = false;
        state.list = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
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
        }
      })
      // Mark All Read
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.list.forEach(n => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

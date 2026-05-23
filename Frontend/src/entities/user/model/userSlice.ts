import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { userService } from '../api/userService';
import { extractErrorMessage } from '@/shared/lib/errorUtils';
import type { UserItem, UserRole, UserStatus } from './types';
import { AuthService } from '@/features/auth/api/authService';
import type { UserInfo } from '@/features/auth/api/types';

const BANNED_STORAGE_KEY = 'banned_user_ids';

const getBannedUserIds = (): string[] => {
  try {
    const banned = localStorage.getItem(BANNED_STORAGE_KEY);
    return banned ? (JSON.parse(banned) as string[]) : [];
  } catch {
    return [];
  }
};

interface BackendUser {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
}

const mapBackendUser = (u: BackendUser, bannedIds: string[]): UserItem => ({
  id: u.userId,
  name: u.fullName,
  email: u.email,
  phone: u.phone ?? '—',
  role: (u.role === 'admin' ? 'Quản trị' : 'Khách hàng') as UserRole,
  status: (bannedIds.includes(u.userId) ? 'banned' : 'active') as UserStatus,
});

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (params: { page?: number; limit?: number; search?: string } | undefined, { rejectWithValue }) => {
    try {
      const response = await userService.getAll({
        page: params?.page ?? 1,
        limit: params?.limit ?? 100,
        search: params?.search ?? '',
      });
      const backendUsers: BackendUser[] = response.data?.data?.users ?? [];
      const bannedIds = getBannedUserIds();
      return backendUsers.map((u) => mapBackendUser(u, bannedIds));
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Lỗi tải danh sách người dùng'));
    }
  }
);

export const addUser = createAsyncThunk(
  'user/addUser',
  async (
    userData: {
      name: string;
      email: string;
      phone: string;
      role: UserRole;
      password?: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await userService.create({
        email: userData.email,
        fullName: userData.name,
        phone: userData.phone,
        role: userData.role === 'Quản trị' ? 'admin' : 'user',
        password: userData.password ?? '123456',
      });
      message.success('Thêm người dùng mới thành công!');
      dispatch(fetchUsers());
    } catch (error: unknown) {
      const errMsg = extractErrorMessage(error, 'Lỗi thêm người dùng');
      message.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    {
      userId,
      userData,
    }: {
      userId: string;
      userData: Partial<{
        name: string;
        email: string;
        phone: string;
        role: UserRole;
        password?: string;
      }>;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await userService.update(userId, {
        email: userData.email,
        fullName: userData.name,
        phone: userData.phone,
        role: userData.role
          ? userData.role === 'Quản trị' ? 'admin' : 'user'
          : undefined,
        password: userData.password,
      });
      dispatch(fetchUsers());
    } catch (error: unknown) {
      const errMsg = extractErrorMessage(error, 'Lỗi cập nhật người dùng');
      message.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId: string, { dispatch, rejectWithValue }) => {
    try {
      await userService.remove(userId);
      message.success('Xóa người dùng thành công!');
      dispatch(fetchUsers());
    } catch (error: unknown) {
      const errMsg = extractErrorMessage(error, 'Lỗi xóa người dùng');
      message.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

// Async thunk for fetching current user
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.checkAuth();
      return response.data.user as UserInfo;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to authenticate');
    }
  }
);

interface UserState {
  users: UserItem[];
  currentUser: UserInfo | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  isInitialized: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleBanStatus: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const bannedIds = getBannedUserIds();
      const newBannedIds = bannedIds.includes(userId)
        ? bannedIds.filter((id) => id !== userId)
        : [...bannedIds, userId];
      localStorage.setItem(BANNED_STORAGE_KEY, JSON.stringify(newBannedIds));
      state.users = state.users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'banned' : 'active' }
          : u
      );
    },
    setCurrentUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.currentUser = action.payload;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isInitialized = true;
      localStorage.removeItem('pitchhub_token');
      localStorage.removeItem('pitchhub_user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.isInitialized = true;
        state.error = action.payload as string;
      });
  },
});

export const { toggleBanStatus, setCurrentUser, logout } = userSlice.actions;
export default userSlice.reducer;

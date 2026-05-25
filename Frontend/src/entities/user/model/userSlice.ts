import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { userService } from '../api/userService';
import { extractErrorMessage } from '@/shared/lib/errorUtils';
import type { UserItem, UserRole, UserStatus } from './types';
import { AuthService } from '@/features/auth/api/authService';
import type { UserInfo } from '@/features/auth/api/types';

interface BackendUser {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
}

const mapBackendUser = (u: BackendUser): UserItem => ({
  id: u.userId,
  name: u.fullName,
  email: u.email,
  phone: u.phone ?? '—',
  role: (u.role === 'admin' ? 'Quản trị' : 'Khách hàng') as UserRole,
  status: (u.status === 'banned' ? 'banned' : 'active') as UserStatus,
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
      return backendUsers.map((u) => mapBackendUser(u));
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

export const toggleBanUser = createAsyncThunk(
  'user/toggleBanUser',
  async ({ userId, status }: { userId: string; status: UserStatus }, { rejectWithValue }) => {
    try {
      const nextStatus = status === 'active' ? 'banned' : 'active';
      await userService.ban(userId, nextStatus);
      return { userId, status: nextStatus };
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Lỗi cập nhật trạng thái hoạt động'));
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
      })
      .addCase(toggleBanUser.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        state.users = state.users.map((u) =>
          u.id === userId ? { ...u, status } : u
        );
        message.success(status === 'banned' ? 'Đã khóa tài khoản thành công!' : 'Đã mở khóa tài khoản thành công!');
      })
      .addCase(toggleBanUser.rejected, (state, action) => {
        message.error(action.payload as string || 'Lỗi thao tác trên người dùng');
      });
  },
});

export const { setCurrentUser, logout } = userSlice.actions;
export default userSlice.reducer;

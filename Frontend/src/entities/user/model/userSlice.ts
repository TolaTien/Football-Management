import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { $api } from '@/shared/api/axiosInstance';
import type { UserInfo } from './types';

interface UserState {
  currentUser: UserInfo | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean; // Flag to indicate if auth has been checked initially
}

const getInitialUser = (): UserInfo | null => {
  const saved = localStorage.getItem('pitchhub_user');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

const initialState: UserState = {
  currentUser: getInitialUser(),
  loading: false,
  error: null,
  isInitialized: !localStorage.getItem('pitchhub_token'),
};

// Async thunk for fetching current user
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await $api.get<{ message: string, data: { user: UserInfo } }>('/auth/checkAuth');
      return response.data.data.user as UserInfo;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to authenticate');
    }
  }
);

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
      state.isInitialized = false;
      localStorage.removeItem('pitchhub_token');
      localStorage.removeItem('pitchhub_user');
    }
  },
  extraReducers: (builder) => {
    builder
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

export const { setCurrentUser, logout } = userSlice.actions;
export default userSlice.reducer;

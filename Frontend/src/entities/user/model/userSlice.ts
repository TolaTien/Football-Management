import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '@/features/auth/api/authService';
import type { UserInfo } from '@/features/auth/api/types';

interface UserState {
  currentUser: UserInfo | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean; // Flag to indicate if auth has been checked initially
}

const initialState: UserState = {
  currentUser: {
    userId: '1',
    fullName: 'Tài Khoản Demo',
    email: 'demo@gmail.com',
    role: 'user',
    avt: 'https://ui-avatars.com/api/?name=Demo&background=10b981&color=fff',
  },
  loading: false,
  error: null,
  isInitialized: true,
};

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

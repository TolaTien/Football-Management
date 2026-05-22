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
  currentUser: null,
  loading: false,
  error: null,
  isInitialized: false,
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
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('pitchhub_token');
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

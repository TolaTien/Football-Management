import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { statisticService, SystemOverview, MonthlyRevenue, TopSpender } from '../api/statisticService';
import { extractErrorMessage } from '@/shared/lib/errorUtils';

export const fetchSystemOverview = createAsyncThunk(
  'statistic/fetchSystemOverview',
  async (address: string | undefined, { rejectWithValue }) => {
    try {
      const response = await statisticService.getSystemOverview(address);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Lỗi tải tổng quan hệ thống'));
    }
  }
);

export const fetchMonthlyRevenue = createAsyncThunk(
  'statistic/fetchMonthlyRevenue',
  async (params: { month?: number; year?: number; address?: string }, { rejectWithValue }) => {
    try {
      const response = await statisticService.getMonthlyRevenue(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Lỗi tải thống kê doanh thu'));
    }
  }
);

export const fetchTopSpenders = createAsyncThunk(
  'statistic/fetchTopSpenders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await statisticService.getTopSpenders();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Lỗi tải danh sách khách hàng chi nhiều nhất'));
    }
  }
);

interface StatisticState {
  overview: SystemOverview | null;
  revenue: MonthlyRevenue | null;
  topSpenders: TopSpender[];
  loading: boolean;
  error: string | null;
}

const initialState: StatisticState = {
  overview: null,
  revenue: null,
  topSpenders: [],
  loading: false,
  error: null,
};

const statisticSlice = createSlice({
  name: 'statistic',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchSystemOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
        state.revenue = action.payload;
      })
      .addCase(fetchTopSpenders.fulfilled, (state, action) => {
        state.topSpenders = action.payload;
      });
  },
});

export default statisticSlice.reducer;

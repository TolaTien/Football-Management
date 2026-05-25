import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import { pitchService } from '../api/pitchService';
import { extractErrorMessage } from '@/shared/lib/errorUtils';
import type { Pitch, PriceRule, PitchStatus, UpdatePriceConfigDto } from './types';

const DEFAULT_IMAGES: Record<number, string> = {
  5: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=600&auto=format&fit=crop',
  7: 'https://images.unsplash.com/photo-1551280857-2b9bbe5240f5?q=80&w=600&auto=format&fit=crop',
  11: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop',
};

const formatTime = (dateStr: string | Date | null | undefined): string => {
  if (!dateStr) return '00:00';
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const getCategoryFromType = (type: string): number => {
  if (type.includes('5')) return 5;
  if (type.includes('7')) return 7;
  return 11;
};

interface BackendPitch {
  pitchId: string;
  namePitch: string;
  status: string;
  pitchCategory: number;
  address?: string;
  pitchprice?: Array<{
    id: string;
    startTime: string;
    endTime: string;
    price: number;
  }>;
}

const mapBackendPitch = (p: BackendPitch): Pitch => ({
  id: p.pitchId,
  name: p.namePitch,
  desc: `Sân cỏ nhân tạo ${p.pitchCategory} người tại ${p.address ?? 'Hà Nội'}.`,
  type: `Sân ${p.pitchCategory} người`,
  status: p.status === 'maintenance' ? 'maintenance' : 'active',
  grassHealth: p.status === 'maintenance' ? 45 : 94,
  grassStatus: p.status === 'maintenance' ? 'Cần chăm sóc' : 'Tốt',
  nextMaintenance: p.status === 'maintenance' ? 'Đang thực hiện' : '15/10/2023',
  imageUrl: DEFAULT_IMAGES[p.pitchCategory] ?? DEFAULT_IMAGES[5],
  pitchCategory: p.pitchCategory,
  address: p.address,
});

const mapBackendPriceRules = (p: BackendPitch): PriceRule[] =>
  (p.pitchprice ?? []).map((pr) => ({
    id: pr.id,
    pitchId: p.pitchId,
    timeRange: `${formatTime(pr.startTime)} - ${formatTime(pr.endTime)}`,
    price: pr.price ?? 0,
    type: 'Giờ thường',
    status: 'active' as const,
    icon: 'sun',
  }));

const buildPriceConfig = (
  pitchId: string,
  allPrices: PriceRule[]
): UpdatePriceConfigDto => {
  const now = new Date();
  const config = allPrices
    .filter((pr) => pr.pitchId === pitchId)
    .map((pr) => {
      const [startStr, endStr] = pr.timeRange.split('-').map((s) => s.trim());
      const [sh, sm] = startStr.split(':').map(Number);
      const [eh, em] = endStr.split(':').map(Number);
      const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sh, sm);
      const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eh, em);
      return { startTime: startTime.toISOString(), endTime: endTime.toISOString(), price: pr.price };
    });
  return { pitchId, config };
};

export const fetchPitches = createAsyncThunk(
  'pitch/fetchPitches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await pitchService.getAll();
      const pitchesData: BackendPitch[] = response.data?.data ?? [];
      const pitchesList = pitchesData.map(mapBackendPitch);
      const pricesList = pitchesData.flatMap(mapBackendPriceRules);
      return { pitchesList, pricesList };
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Lỗi tải danh sách sân'));
    }
  }
);

export const addPitch = createAsyncThunk(
  'pitch/addPitch',
  async (pitch: Omit<Pitch, 'id'>, { dispatch, rejectWithValue }) => {
    try {
      const categoryNum = getCategoryFromType(pitch.type);
      const now = new Date();
      const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0);
      const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0);
      await pitchService.create({
        namePitch: pitch.name,
        status: pitch.status as PitchStatus,
        pitchCategory: categoryNum,
        address: pitch.address ?? 'Hà Nội',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        price: 500000,
      });
      message.success('Thêm sân thành công!');
      dispatch(fetchPitches());
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Lỗi thêm sân');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updatePitch = createAsyncThunk(
  'pitch/updatePitch',
  async (
    { id, updatedData }: { id: string; updatedData: Partial<Pitch> },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const categoryNum = updatedData.type
        ? getCategoryFromType(updatedData.type)
        : undefined;
      await pitchService.update({
        pitchId: id,
        namePitch: updatedData.name,
        status: updatedData.status,
        pitchCategory: categoryNum,
        address: updatedData.address,
      });
      message.success('Cập nhật thông tin sân thành công!');
      dispatch(fetchPitches());
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Lỗi cập nhật sân');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deletePitchThunk = createAsyncThunk(
  'pitch/deletePitch',
  async (pitchId: string, { dispatch, rejectWithValue }) => {
    try {
      await pitchService.remove(pitchId);
      message.success('Xóa sân thành công!');
      dispatch(fetchPitches());
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Không thể xóa sân này');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const syncPriceConfigThunk = createAsyncThunk(
  'pitch/syncPriceConfig',
  async (
    { pitchId, updatedPrices }: { pitchId: string; updatedPrices: PriceRule[] },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await pitchService.updatePriceConfig(buildPriceConfig(pitchId, updatedPrices));
      dispatch(fetchPitches());
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Không thể đồng bộ giá sân');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

interface PitchState {
  pitches: Pitch[];
  prices: PriceRule[];
  loading: boolean;
  error: string | null;
}

const initialState: PitchState = {
  pitches: [],
  prices: [],
  loading: false,
  error: null,
};

const pitchSlice = createSlice({
  name: 'pitch',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPitches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPitches.fulfilled, (state, action) => {
        state.loading = false;
        state.pitches = action.payload.pitchesList;
        state.prices = action.payload.pricesList;
      })
      .addCase(fetchPitches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default pitchSlice.reducer;

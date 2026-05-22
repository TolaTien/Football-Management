import { $api } from '@/shared/api/axiosInstance';

export interface PitchItem {
  pitchId: string;
  namePitch: string;
  status: 'active' | 'maintenance';
  pitchCategory: number;
  address: string;
  pitchprice: any[];
  booking: any[];
}

export interface PitchResponse {
  pitches: PitchItem[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    perPage: number;
  };
}

export const PitchService = {
  /**
   * Lấy danh sách tất cả các sân kèm thông tin đặt sân.
   */
  getAllPitches: async (query: any = {}): Promise<PitchResponse> => {
    const { data } = await $api.get('/pitch', { params: query });
    // Backend trả về: { message, data: pitches[], meta: pagination }
    return {
      pitches: data.data,
      pagination: data.meta
    };
  },
};

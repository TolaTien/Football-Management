import { axiosInstance } from '@/shared/api';
import { $api } from '@/shared/api/axiosInstance';
import type { CreatePitchDto, UpdatePitchDto, UpdatePriceConfigDto } from '../model/types';

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

// Admin-facing service (lowercase)
export const pitchService = {
  getAll: () =>
    axiosInstance.get('/pitch'),

  create: (dto: CreatePitchDto) =>
    axiosInstance.post('/pitch/create-pitch', dto),

  update: (dto: UpdatePitchDto) =>
    axiosInstance.put('/pitch/update-pitch', dto),

  updatePriceConfig: (dto: UpdatePriceConfigDto) =>
    axiosInstance.put('/pitch/update-pitch-price', dto),

  remove: (pitchId: string) =>
    axiosInstance.delete(`/pitch/${pitchId}`),
};


// Customer-facing service (PascalCase)
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

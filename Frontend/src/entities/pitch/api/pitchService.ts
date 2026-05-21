import { axiosInstance } from '@/shared/api';
import type { CreatePitchDto, UpdatePitchDto, UpdatePriceConfigDto } from '../model/types';

export const pitchService = {
  getAll: () =>
    axiosInstance.get('/pitch'),

  create: (dto: CreatePitchDto) =>
    axiosInstance.post('/pitch/create-pitch', dto),

  update: (dto: UpdatePitchDto) =>
    axiosInstance.put('/pitch/update-pitch', dto),

  updatePriceConfig: (dto: UpdatePriceConfigDto) =>
    axiosInstance.put('/pitch/update-pitch-price', dto),
};

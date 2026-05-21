import { axiosInstance } from '@/shared/api';
import type { CreateServiceDto, UpdateServiceDto } from '../model/types';

export const serviceItemService = {
  getAll: () =>
    axiosInstance.get('/services'),

  create: (dto: CreateServiceDto) =>
    axiosInstance.post('/services', dto),

  update: (id: string, dto: UpdateServiceDto) =>
    axiosInstance.put(`/services/${id}`, dto),

  remove: (id: string) =>
    axiosInstance.delete(`/services/${id}`),
};

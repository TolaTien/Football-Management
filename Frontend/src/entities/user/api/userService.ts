import { axiosInstance } from '@/shared/api';
import type { CreateUserDto, UpdateUserDto } from '../model/types';

export const userService = {
  getAll: (params: { page?: number; limit?: number; search?: string }) =>
    axiosInstance.get('/admin/users', { params }),

  create: (dto: CreateUserDto) =>
    axiosInstance.post('/admin/users', dto),

  update: (userId: string, dto: UpdateUserDto) =>
    axiosInstance.put(`/admin/users/${userId}`, dto),

  remove: (userId: string) =>
    axiosInstance.delete(`/admin/users/${userId}`),
};

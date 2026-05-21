import { axiosInstance } from '@/shared/api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export const authService = {
  login: (dto: LoginDto) =>
    axiosInstance.post('/auth/login', dto),

  register: (dto: RegisterDto) =>
    axiosInstance.post('/auth/register', dto),
};

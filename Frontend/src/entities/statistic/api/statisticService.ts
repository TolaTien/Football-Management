import { axiosInstance } from '@/shared/api';

export interface SystemOverview {
  filteredAddress: string;
  totalUsers: number;
  totalPitches: number;
  totalPendingRequests: number;
}

export interface MonthlyRevenue {
  month?: number;
  year?: number;
  filteredAddress: string;
  totalRevenue: number;
  totalBookings: number;
  rate: number;
  occupancyByAddress?: Array<{
    address: string;
    totalPitches: number;
    bookedPitches: number;
    rate: number;
  }>;
}

export interface TopSpender {
  rank: number;
  userId: string;
  fullName: string;
  avt: string | null;
  email: string | null;
  phone: string | null;
  bookingCount: number;
  totalSpent: number;
}

export const statisticService = {
  getSystemOverview: (address?: string) =>
    axiosInstance.get<{ message: string; data: SystemOverview }>('/statistic/system-overview', {
      params: { address },
    }),

  getMonthlyRevenue: (params: { month?: number; year?: number; address?: string }) =>
    axiosInstance.get<{ message: string; data: MonthlyRevenue }>('/statistic/pitch-revenue', {
      params,
    }),

  getTopSpenders: () =>
    axiosInstance.get<{ message: string; data: TopSpender[] }>('/statistic/top-spenders'),

  exportRevenueExcel: (params: { month?: number; year?: number; address?: string }) =>
    axiosInstance.get('/statistic/export-revenue', {
      params,
      responseType: 'blob',
    }),
};

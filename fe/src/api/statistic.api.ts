import axiosClient from './axiosClient';

export const statisticApi = {
  getMonthlyRevenue: (params: { month: number, year: number }) => axiosClient.get('/statistic/monthly-statistic', { params }),
};

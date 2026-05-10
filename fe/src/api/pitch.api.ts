import axiosClient from './axiosClient';

export const pitchApi = {
  getAll: (params: any) => axiosClient.get('/pitch', { params }),
  create: (data: any) => axiosClient.post('/pitch/create-pitch', data),
  update: (data: any) => axiosClient.put('/pitch/update-pitch', data),
  updatePrice: (data: any) => axiosClient.put('/pitch/update-pitch-price', data),
};

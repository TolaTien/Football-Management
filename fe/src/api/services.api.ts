import axiosClient from './axiosClient';

export const servicesApi = {
  getAll: (params: any) => axiosClient.get('/services', { params }),
  getDetail: (serviceId: string) => axiosClient.get(`/services/${serviceId}`),
  create: (data: any) => axiosClient.post('/services/create-service', data),
  update: (data: any) => axiosClient.put('/services/update-service', data),
  delete: (serviceId: string) => axiosClient.delete(`/services/delete-service/${serviceId}`),
};

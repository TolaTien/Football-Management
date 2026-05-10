import axiosClient from './axiosClient';

export const userApi = {
  updateProfile: (data: any) => axiosClient.put('/user/update-profile-user', data, {
    headers: {
      'Content-Type': 'multipart/form-data' // because it contains an image file upload
    }
  }),
  getHistoryBooking: () => axiosClient.get('/user/get-all-history-booking'),
};

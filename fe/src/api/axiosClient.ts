import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Quan trọng để gửi nhận cookies (accessToken, refreshToken)
});

// Thêm interceptor cho request nếu cần (ví dụ: đính kèm token nếu lưu ở localStorage, nhưng vì dùng HTTP-only cookies nên có thể bỏ qua)
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response để xử lý refresh token hoặc lỗi chung
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    // Nếu lỗi 401 và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Cố gắng refresh token
        await axios.post('http://localhost:3000/auth/refresh-token', {}, { withCredentials: true });
        // Gửi lại request ban đầu
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Nếu refresh thất bại, có thể logout user bằng cách clear store (cần cẩn thận circular dependency, có thể xử lý ở cấp UI)
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

import { $api } from '@/shared/api/axiosInstance';

export interface ServiceItem {
  serviceId: string;
  nameProduct: string;
  price: number;
  totalQuantity: number;
  borrowed: number;
  returned: number;
}

export const ServicesService = {
  /**
   * Lấy danh sách tất cả các dịch vụ (nước uống, thuê giày, v.v.)
   */
  getAllServices: async (): Promise<ServiceItem[]> => {
    const { data } = await $api.get('/services');
    const items = Array.isArray(data) ? data : [];
    return items.map(item => ({
      ...item,
      nameProduct: item.nameProduct ? item.nameProduct.replace(/^\[(?:drink|equipment|food|other)\]\s*/, '') : '',
    }));
  },
};

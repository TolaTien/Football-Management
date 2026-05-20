import { useState, useCallback, useEffect } from 'react';
import api from '@/services/api';
import { message } from 'antd';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  type: 'drink' | 'equipment' | 'food' | 'other';
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  // Thuộc tính BE lưu trữ
  totalQuantity: number;
  borrowed: number;
  returned: number;
}

export default function useAdminServicesModel() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Phỏng đoán phân loại sản phẩm dựa trên tên
  const detectType = (name: string): ServiceItem['type'] => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('nước') || lowerName.includes('revive') || lowerName.includes('aquafina') || lowerName.includes('redbull') || lowerName.includes('sting') || lowerName.includes('coca') || lowerName.includes('bò cụng')) {
      return 'drink';
    }
    if (lowerName.includes('áo') || lowerName.includes('bóng') || lowerName.includes('giày') || lowerName.includes('găng')) {
      return 'equipment';
    }
    if (lowerName.includes('bánh') || lowerName.includes('kẹo') || lowerName.includes('mì') || lowerName.includes('phở')) {
      return 'food';
    }
    return 'other';
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/services');
      const backendData = response.data || [];

      const mappedServices: ServiceItem[] = backendData.map((srv: any) => {
        // Tồn kho = Tổng nhập - Đã mượn + Đã trả
        const stock = (srv.totalQuantity || 0) - (srv.borrowed || 0) + (srv.returned || 0);
        const type = detectType(srv.nameProduct);

        let status: ServiceItem['status'] = 'in_stock';
        if (stock === 0) {
          status = 'out_of_stock';
        } else if (stock < 10) {
          status = 'low_stock';
        }

        return {
          id: srv.serviceId,
          name: srv.nameProduct,
          price: srv.price || 0,
          stock: stock >= 0 ? stock : 0,
          type,
          status,
          totalQuantity: srv.totalQuantity || 0,
          borrowed: srv.borrowed || 0,
          returned: srv.returned || 0
        };
      });

      setServices(mappedServices);
    } catch (error) {
      console.error("Lỗi tải dịch vụ:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const addService = useCallback(async (data: { name: string; type: string; price: number }) => {
    try {
      await api.post('/services', {
        nameProduct: data.name,
        price: data.price,
        totalQuantity: 50, // Mặc định nhập kho 50 khi tạo mới
        borrowed: 0,
        returned: 0
      });
      message.success('Đã thêm dịch vụ thành công!');
      fetchServices();
    } catch (error: any) {
      console.error("Lỗi thêm dịch vụ:", error);
      message.error(error.response?.data?.message || 'Lỗi thêm sản phẩm/dịch vụ');
    }
  }, [fetchServices]);

  const updateStock = useCallback(async (id: string, qty: number) => {
    try {
      // Tìm sản phẩm hiện tại để lấy thông tin lượng borrowed/returned
      const current = services.find(s => s.id === id);
      if (!current) return;

      // Tính lại tổng số lượng nhập kho mới để điều chỉnh tồn kho
      const newStock = Math.max(0, current.stock + qty);
      const newTotalQuantity = newStock + current.borrowed - current.returned;

      await api.put(`/services/${id}`, {
        nameProduct: current.name,
        price: current.price,
        totalQuantity: newTotalQuantity,
        borrowed: current.borrowed,
        returned: current.returned
      });

      message.success('Cập nhật số lượng tồn kho thành công!');
      fetchServices();
    } catch (error: any) {
      console.error("Lỗi cập nhật tồn kho:", error);
      message.error(error.response?.data?.message || 'Lỗi cập nhật số lượng tồn kho');
    }
  }, [services, fetchServices]);

  const deleteService = useCallback(async (id: string) => {
    try {
      await api.delete(`/services/${id}`);
      message.success('Đã xóa dịch vụ thành công!');
      fetchServices();
    } catch (error: any) {
      console.error("Lỗi xóa dịch vụ:", error);
      message.error(error.response?.data?.message || 'Không thể xóa dịch vụ này');
    }
  }, [fetchServices]);

  return {
    services,
    loading,
    fetchServices,
    addService,
    updateStock,
    deleteService
  };
}
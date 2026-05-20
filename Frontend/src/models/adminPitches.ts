import { useState, useCallback, useEffect } from 'react';
import api from '@/services/api';
import { message } from 'antd';

export interface Pitch {
  id: string;
  name: string;
  desc: string;
  type: string;
  status: 'active' | 'maintenance' | 'constructing';
  grassHealth: number;
  grassStatus: string;
  nextMaintenance: string;
  imageUrl: string;
  pitchCategory?: number;
  address?: string;
}

export interface PriceRule {
  id: string;
  pitchId: string;
  timeRange: string;
  price: number;
  type: string;
  status: 'active' | 'maintenance';
  icon: string;
}

export default function useAdminPitchesModel() {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [prices, setPrices] = useState<PriceRule[]>([]);
  const [loading, setLoading] = useState(false);

  const formatTime = (dateStr: string | Date | null | undefined) => {
    if (!dateStr) return '00:00';
    const d = new Date(dateStr);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  // Tải danh sách sân từ BE
  const fetchPitches = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/pitch');
      const pitchesData = response.data?.data || [];

      const mappedPitches: Pitch[] = pitchesData.map((p: any) => {
        // Ánh xạ các thông tin hiển thị lên giao diện
        let defaultImg = 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=600&auto=format&fit=crop';
        if (p.pitchCategory === 7) {
          defaultImg = 'https://images.unsplash.com/photo-1551280857-2b9bbe5240f5?q=80&w=600&auto=format&fit=crop';
        } else if (p.pitchCategory === 11) {
          defaultImg = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop';
        }

        return {
          id: p.pitchId,
          name: p.namePitch,
          desc: `Sân cỏ nhân tạo ${p.pitchCategory} người tại ${p.address || 'Hà Nội'}.`,
          type: `Sân ${p.pitchCategory} người`,
          status: p.status === 'maintenance' ? 'maintenance' : 'active',
          grassHealth: p.status === 'maintenance' ? 45 : 94,
          grassStatus: p.status === 'maintenance' ? 'Cần chăm sóc' : 'Tốt',
          nextMaintenance: p.status === 'maintenance' ? 'Đang thực hiện' : '15/10/2023',
          imageUrl: defaultImg,
          pitchCategory: p.pitchCategory,
          address: p.address
        };
      });

      setPitches(mappedPitches);

      // Trích xuất cấu hình giá của từng sân
      const allPrices: PriceRule[] = [];
      pitchesData.forEach((p: any) => {
        if (p.pitchprice && p.pitchprice.length > 0) {
          p.pitchprice.forEach((pr: any) => {
            allPrices.push({
              id: pr.id,
              pitchId: p.pitchId,
              timeRange: `${formatTime(pr.startTime)} - ${formatTime(pr.endTime)}`,
              price: pr.price || 0,
              type: 'Giờ thường',
              status: 'active',
              icon: 'sun'
            });
          });
        }
      });
      setPrices(allPrices);

    } catch (error) {
      console.error("Lỗi lấy danh sách sân:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tải danh sách sân khi khởi chạy
  useEffect(() => {
    fetchPitches();
  }, [fetchPitches]);

  // Thêm sân mới vào BE
  const addPitch = useCallback(async (pitch: Omit<Pitch, 'id'>) => {
    try {
      const categoryNum = pitch.type.includes('5') ? 5 : pitch.type.includes('7') ? 7 : 11;

      // Mặc định tạo kèm 1 khung giờ mặc định (ví dụ: 06:00 - 22:00)
      const now = new Date();
      const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0);
      const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0, 0);

      await api.post('/pitch/create-pitch', {
        namePitch: pitch.name,
        status: pitch.status === 'maintenance' ? 'maintenance' : 'active',
        pitchCategory: categoryNum,
        address: pitch.address || 'Hà Nội',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        price: 500000 // Đơn giá mặc định
      });

      message.success('Thêm sân thành công!');
      fetchPitches();
    } catch (error: any) {
      console.error("Lỗi thêm sân mới:", error);
      message.error(error.response?.data?.message || 'Lỗi thêm sân');
    }
  }, [fetchPitches]);

  // Cập nhật thông tin sân trên BE
  const updatePitch = useCallback(async (id: string, updatedData: Partial<Pitch>) => {
    try {
      const categoryNum = updatedData.type ? (updatedData.type.includes('5') ? 5 : updatedData.type.includes('7') ? 7 : 11) : undefined;
      await api.put('/pitch/update-pitch', {
        pitchId: id,
        namePitch: updatedData.name,
        status: updatedData.status,
        pitchCategory: categoryNum,
        address: updatedData.address
      });
      message.success('Cập nhật thông tin sân thành công!');
      fetchPitches();
    } catch (error: any) {
      console.error("Lỗi cập nhật sân:", error);
      message.error(error.response?.data?.message || 'Lỗi cập nhật sân');
    }
  }, [fetchPitches]);

  // Xóa sân bóng (Frontend Mock / State Filter)
  const deletePitch = useCallback((id: string) => {
    setPitches((prev) => prev.filter((p) => p.id !== id));
    setPrices((prev) => prev.filter((pr) => pr.pitchId !== id));
  }, []);

  // Gửi thay đổi cấu hình giá sân lên BE
  const syncPriceConfigWithBE = async (pitchId: string, updatedPrices: PriceRule[]) => {
    try {
      const now = new Date();
      const config = updatedPrices
        .filter(pr => pr.pitchId === pitchId)
        .map(pr => {
          const [startStr, endStr] = pr.timeRange.split('-').map(s => s.trim());
          const [sh, sm] = startStr.split(':').map(Number);
          const [eh, em] = endStr.split(':').map(Number);

          const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sh, sm, 0, 0);
          const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eh, em, 0, 0);

          return {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            price: pr.price
          };
        });

      await api.put('/pitch/update-pitch-price', {
        pitchId,
        config
      });
    } catch (error: any) {
      console.error("Lỗi đồng bộ giá sân:", error);
      message.error(error.response?.data?.message || 'Không thể đồng bộ giá sân lên server');
    }
  };

  // Cập nhật giá cho 1 khung giờ cụ thể
  const updatePrice = useCallback(async (id: string, newPrice: number) => {
    let targetPitchId = '';
    const updatedPrices = prices.map((p) => {
      if (p.id === id) {
        targetPitchId = p.pitchId;
        return { ...p, price: newPrice };
      }
      return p;
    });

    setPrices(updatedPrices);
    if (targetPitchId) {
      await syncPriceConfigWithBE(targetPitchId, updatedPrices);
      fetchPitches();
    }
  }, [prices, fetchPitches]);

  // Thêm khung giờ mới cho sân
  const addPriceRule = useCallback(async (rule: Omit<PriceRule, 'id'>) => {
    const tempId = `pr_${Date.now()}`;
    const newRule: PriceRule = {
      ...rule,
      id: tempId
    };

    const updatedPrices = [...prices, newRule];
    setPrices(updatedPrices);
    await syncPriceConfigWithBE(rule.pitchId, updatedPrices);
    fetchPitches();
  }, [prices, fetchPitches]);

  // Xóa khung giờ
  const deletePriceRule = useCallback(async (id: string) => {
    let targetPitchId = '';
    const updatedPrices = prices.filter((p) => {
      if (p.id === id) {
        targetPitchId = p.pitchId;
        return false;
      }
      return true;
    });

    setPrices(updatedPrices);
    if (targetPitchId) {
      await syncPriceConfigWithBE(targetPitchId, updatedPrices);
      fetchPitches();
    }
  }, [prices, fetchPitches]);

  return {
    pitches,
    prices,
    loading,
    fetchPitches,
    addPitch,
    updatePitch,
    deletePitch,
    updatePrice,
    addPriceRule,
    deletePriceRule
  };
}
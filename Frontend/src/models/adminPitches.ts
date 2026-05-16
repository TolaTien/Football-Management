import { useState, useCallback } from 'react';

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

const initialPitches: Pitch[] = [
  { id: 'p1', name: 'Sân 5 - A1', desc: 'Sân bóng 5 người', type: 'Sân 5 người', status: 'active', grassHealth: 94, grassStatus: 'Tốt', nextMaintenance: '15/10/2023', imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=600&auto=format&fit=crop' },
  { id: 'p2', name: 'Sân 7 - B2', desc: 'Sân bóng 7 người', type: 'Sân 7 người', status: 'active', grassHealth: 88, grassStatus: 'Tốt', nextMaintenance: '18/10/2023', imageUrl: 'https://images.unsplash.com/photo-1551280857-2b9bbe5240f5?q=80&w=600&auto=format&fit=crop' },
  { id: 'p3', name: 'Sân 5 - C1', desc: 'Sân bóng 5 người', type: 'Sân 5 người', status: 'maintenance', grassHealth: 45, grassStatus: 'Cần chăm sóc', nextMaintenance: 'Đang thực hiện', imageUrl: 'https://images.unsplash.com/photo-1518605368461-1ee7c5320c2d?q=80&w=600&auto=format&fit=crop' },
  { id: 'p4', name: 'Sân 11 - Premium', desc: 'Sân bóng 11 người', type: 'Sân 11 người', status: 'constructing', grassHealth: 0, grassStatus: 'N/A', nextMaintenance: '30/11/2023', imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop' },
];

const initialPrices: PriceRule[] = [
  { id: 'pr1', pitchId: 'p1', timeRange: '06:00 - 16:00', price: 300000, type: 'Giờ thấp điểm (Sáng/Chiều)', status: 'active', icon: 'sun' },
  { id: 'pr2', pitchId: 'p1', timeRange: '16:00 - 22:00', price: 500000, type: 'Giờ cao điểm (Tối)', status: 'active', icon: 'fire' },
  { id: 'pr3', pitchId: 'p1', timeRange: '22:00 - 01:00', price: 450000, type: 'Khuya (Premium)', status: 'maintenance', icon: 'moon' },
  { id: 'pr4', pitchId: 'p2', timeRange: '06:00 - 16:00', price: 250000, type: 'Giờ thấp điểm (Sáng/Chiều)', status: 'active', icon: 'sun' },
  { id: 'pr5', pitchId: 'p2', timeRange: '16:00 - 22:00', price: 400000, type: 'Giờ cao điểm (Tối)', status: 'active', icon: 'fire' },
  { id: 'pr6', pitchId: 'p3', timeRange: '16:00 - 22:00', price: 800000, type: 'Giờ cao điểm (Tối)', status: 'active', icon: 'fire' },
];

export default function useAdminPitchesModel() {
  const [pitches, setPitches] = useState<Pitch[]>(initialPitches);
  const [prices, setPrices] = useState<PriceRule[]>(initialPrices);

  // Pitch actions
  const addPitch = useCallback((pitch: Omit<Pitch, 'id'>) => {
    setPitches((prev) => [...prev, { ...pitch, id: `p${Date.now()}` }]);
  }, []);

  const updatePitch = useCallback((id: string, updatedData: Partial<Pitch>) => {
    setPitches((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
  }, []);

  const deletePitch = useCallback((id: string) => {
    setPitches((prev) => prev.filter((p) => p.id !== id));
    // Also delete associated prices
    setPrices((prev) => prev.filter((pr) => pr.pitchId !== id));
  }, []);

  // Price rule actions
  const updatePrice = useCallback((id: string, newPrice: number) => {
    setPrices((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
  }, []);

  const addPriceRule = useCallback((rule: Omit<PriceRule, 'id'>) => {
    setPrices((prev) => [...prev, { ...rule, id: `pr${Date.now()}` }]);
  }, []);

  const deletePriceRule = useCallback((id: string) => {
    setPrices((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    pitches,
    prices,
    addPitch,
    updatePitch,
    deletePitch,
    updatePrice,
    addPriceRule,
    deletePriceRule
  };
}

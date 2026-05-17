import { useState, useCallback } from 'react';

export default function useAdminServicesModel() {
  const [services, setServices] = useState([
    { id: 's1', name: 'Nước suối Aquafina', type: 'drink', price: 10000, stock: 150, status: 'in_stock' },
    { id: 's2', name: 'Nước khoáng Revive', type: 'drink', price: 15000, stock: 45, status: 'in_stock' },
    { id: 's3', name: 'Thuê áo Pitch (Bộ 10)', type: 'equipment', price: 50000, stock: 20, status: 'in_stock' },
    { id: 's4', name: 'Thuê Bóng Động Lực', type: 'equipment', price: 30000, stock: 5, status: 'low_stock' },
    { id: 's5', name: 'Nước tăng lực Redbull', type: 'drink', price: 15000, stock: 0, status: 'out_of_stock' },
  ]);

  const updateStock = useCallback((id: string, qty: number) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStock = Math.max(0, s.stock + qty);
          const status = newStock === 0 ? 'out_of_stock' : newStock < 10 ? 'low_stock' : 'in_stock';
          return { ...s, stock: newStock, status };
        }
        return s;
      })
    );
  }, []);

  const addService = useCallback((service: any) => {
    setServices((prev) => [...prev, { ...service, id: `s${Date.now()}`, stock: 0, status: 'out_of_stock' }]);
  }, []);

  const deleteService = useCallback((id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    services,
    updateStock,
    addService,
    deleteService,
  };
}

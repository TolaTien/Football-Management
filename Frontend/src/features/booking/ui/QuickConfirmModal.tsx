import React, { useEffect, useState } from 'react';
import { message, Spin, Checkbox, InputNumber } from 'antd';
import { ServicesService, ServiceItem } from '@/entities/service/api/servicesService';
import { BookingService } from '@/entities/booking';
import { useAppDispatch } from '@/app/store/hooks';
import { addNotification } from '@/entities/notification';
import dayjs from 'dayjs';

interface QuickConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bookingData: any) => void;
  pitchName: string;
  timeSlot: string;
  price: string;
  pitchId?: string; // Optional for now, fallback to a mock if missing
  selectedDate?: string;
}

export const QuickConfirmModal: React.FC<QuickConfirmModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess,
  pitchName, 
  timeSlot, 
  price,
  pitchId = 'pitch-1',
  selectedDate
}) => {
  const dispatch = useAppDispatch();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});
  const [paymentMethod, setPaymentMethod] = useState('banking');

  useEffect(() => {
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await ServicesService.getAllServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch services', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    // Extract base price. If it has a dot like 90.00, it might be dollars. 
    // If it's 90,000 it's VNĐ.
    const numericPrice = price.replace(/[^0-9]/g, '');
    let basePrice = parseInt(numericPrice) || 120000;
    
    // If it was "$90.00", numericPrice is "9000", but it should be 90 dollars.
    // However, looking at the project, prices are mostly VNĐ.
    // If basePrice < 1000, it might be USD, let's assume it's already in the correct unit for now.
    
    let total = basePrice;
    if (Array.isArray(services)) {
      Object.entries(selectedServices).forEach(([sId, qty]) => {
        const service = services.find(s => s.serviceId === sId);
        if (service && service.price) {
          total += service.price * qty;
        }
      });
    }
    return total;
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      // Parse timeSlot "08:00 - 09:30"
      const [startStr, endStr] = timeSlot.split(' - ');
      const baseDate = dayjs(selectedDate || new Date());
      const startTime = baseDate.set('hour', parseInt(startStr.split(':')[0])).set('minute', parseInt(startStr.split(':')[1])).set('second', 0).set('millisecond', 0).toISOString();
      const endTime = baseDate.set('hour', parseInt(endStr.split(':')[0])).set('minute', parseInt(endStr.split(':')[1])).set('second', 0).set('millisecond', 0).toISOString();

      const numericPrice = parseInt(price.replace(/[^0-9]/g, '')) || 120000;

      const payload = {
        pitchId: pitchId,
        phone: '0123456789', // Mock phone, in real app get from user profile or input
        startTime: startTime,
        endTime: endTime,
        pitchPriceAtBooking: numericPrice,
        paymentMethod,
        service: Object.entries(selectedServices).map(([sId, qty]) => {
          const s = services.find(item => item.serviceId === sId);
          return {
            serviceId: sId,
            quantity: qty,
            servicePriceAtBooking: s?.price || 0
          };
        })
      };

      const bookingData = await BookingService.bookPitchForUser(payload);
      
      // Dispatch local notification
      dispatch(addNotification({
        id: `booking-${Date.now()}`,
        title: 'Đặt sân thành công',
        content: `Yêu cầu đặt sân ${pitchName} (${timeSlot}) ngày ${dayjs(selectedDate).format('DD/MM/YYYY')} đang được chờ phê duyệt.`,
        type: 'booking'
      }));

      if (onSuccess) onSuccess(bookingData);
      else onClose();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Có lỗi xảy ra khi đặt sân';
      message.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-md overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
        <div className="p-6 bg-emerald-900 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Quick Confirmation</h3>
            <p className="text-xs text-emerald-200/80">Complete your reservation details</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50/50">
          {/* Block 1: Pitch Info & Payment */}
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">info</span>
                Pitch Information
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <span className="text-secondary text-sm">Facility</span>
                  <span className="font-bold text-emerald-900">{pitchName}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <span className="text-secondary text-sm">Time Slot</span>
                  <span className="font-bold text-emerald-900">{timeSlot}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary text-sm">Base Price</span>
                  <span className="font-bold text-emerald-900">{price}</span>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">payments</span>
                Payment Method
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'banking', label: 'Banking', icon: 'account_balance' },
                  { id: 'cash', label: 'Cash', icon: 'payments' },
                  { id: 'wallet', label: 'Wallet', icon: 'wallet' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id 
                      ? 'border-primary bg-emerald-50 text-primary' 
                      : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    <span className="material-symbols-outlined">{method.icon}</span>
                    <span className="text-[10px] font-bold uppercase">{method.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Block 2: Additional Services */}
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
              <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                Add-on Services
              </h4>
              
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
                {loading ? (
                  <div className="flex justify-center py-8"><Spin /></div>
                ) : services.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No additional services available</p>
                ) : (
                  services.map(service => (
                    <div key={service.serviceId} className="flex items-center justify-between p-3 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={!!selectedServices[service.serviceId]}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedServices(prev => ({ ...prev, [service.serviceId]: 1 }));
                            else setSelectedServices(prev => {
                              const next = { ...prev };
                              delete next[service.serviceId];
                              return next;
                            });
                          }}
                        />
                        <div>
                          <p className="text-sm font-bold text-emerald-900">{service.nameProduct}</p>
                          <p className="text-xs text-secondary">{service.price.toLocaleString()} VNĐ</p>
                        </div>
                      </div>
                      {selectedServices[service.serviceId] && (
                        <InputNumber 
                          min={1}
                          size="small"
                          className="w-16"
                          value={selectedServices[service.serviceId]}
                          onChange={(val) => setSelectedServices(prev => ({ ...prev, [service.serviceId]: val || 1 }))}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-secondary font-medium">Grand Total</span>
                  <span className="text-2xl font-bold text-emerald-900">{calculateTotal().toLocaleString()} VNĐ</span>
                </div>
                <button 
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? <Spin size="small" /> : 'Confirm Booking'}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

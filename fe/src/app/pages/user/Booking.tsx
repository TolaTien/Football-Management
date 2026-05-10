import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, Check, Clock, DollarSign, Users, Phone } from 'lucide-react';
import { pitchApi } from '../../../api/pitch.api';
import { bookingApi } from '../../../api/booking.api';
import { servicesApi } from '../../../api/services.api';
import { useAuthStore } from '../../../store/auth.store';
import { message, Spin } from 'antd';

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

type SlotStatus = 'available' | 'booked' | 'pending';

export default function Booking() {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<{ pitch: string; time: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [pitches, setPitches] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form states
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchPitchesAndServices();
  }, [selectedDate]);

  const fetchPitchesAndServices = async () => {
    setLoading(true);
    try {
      const [pitchRes, servicesRes] = await Promise.all([
        pitchApi.getAll({ perPage: 100 }),
        servicesApi.getAll({})
      ]);
      setPitches(pitchRes.data || []);
      setServices(servicesRes.data || []);
    } catch(err) {
      message.error("Lỗi khi tải dữ liệu sân hoặc dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const getSlotStatus = (pitchId: string, time: string): SlotStatus => {
    const pitch = pitches.find(p => p.pitchId === pitchId);
    if (!pitch || !pitch.booking) return 'available';

    const [hour, minute] = time.split(':').map(Number);
    const slotStart = new Date(selectedDate);
    slotStart.setHours(hour, minute, 0, 0);

    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

    const isBooked = pitch.booking.some((b: any) => {
      const bStart = new Date(b.startTime);
      const bEnd = new Date(b.endTime);
      return (b.status === 'approved' || b.status === 'pending') && slotStart < bEnd && slotEnd > bStart;
    });

    return isBooked ? 'booked' : 'available';
  };

  const getPitchPrice = (pitchId: string, time: string): number => {
    const pitch = pitches.find(p => p.pitchId === pitchId);
    if (!pitch || !pitch.pitchprice || pitch.pitchprice.length === 0) return 300000;
    return pitch.pitchprice[0].price || 300000;
  };

  const handleSlotClick = (pitchId: string, time: string) => {
    const status = getSlotStatus(pitchId, time);
    if (status === 'available') {
      setSelectedSlot({ pitch: pitchId, time });
      setSelectedServices({});
      setPhone(user?.phone || '');
      setShowBookingModal(true);
    }
  };

  const handleServiceChange = (serviceId: string, quantity: number) => {
    const current = { ...selectedServices };
    if (quantity > 0) {
      current[serviceId] = quantity;
    } else {
      delete current[serviceId];
    }
    setSelectedServices(current);
  };

  const getAvailableQuantity = (serviceId: string): number => {
    const service = services.find(s => s.serviceId === serviceId);
    if (!service) return 0;
    return (service.totalQuantity ?? 0) - (service.borrowed ?? 0) + (service.returned ?? 0);
  };

  const calculateTotalPrice = (): number => {
    const pitchPrice = getPitchPrice(selectedSlot?.pitch || '', selectedSlot?.time || '');
    const depositPrice = Math.floor(pitchPrice / 2);
    
    const servicesPrice = Object.entries(selectedServices).reduce((total, [serviceId, quantity]) => {
      const service = services.find(s => s.serviceId === serviceId);
      return total + ((service?.price || 0) * (quantity || 0));
    }, 0);
    
    return depositPrice + servicesPrice;
  };

  const confirmBooking = async () => {
    if (selectedSlot) {
      if (!phone) {
        message.error('Vui lòng nhập số điện thoại');
        return;
      }

      setBookingLoading(true);
      try {
        const [hour, minute] = selectedSlot.time.split(':').map(Number);
        const startTime = new Date(selectedDate);
        startTime.setHours(hour, minute, 0, 0);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        
        const servicePayload = Object.entries(selectedServices).map(([serviceId, quantity]) => {
          const s = services.find(x => x.serviceId === serviceId);
          return {
            serviceId,
            quantity,
            servicePriceAtBooking: s?.price || 0
          };
        });

        await bookingApi.bookPitchUser({
          pitchId: selectedSlot.pitch,
          phone: phone,
          startTime,
          endTime,
          pitchPriceAtBooking: getPitchPrice(selectedSlot.pitch, selectedSlot.time),
          service: servicePayload
        });

        message.success('Tạo đơn đặt sân thành công. Vui lòng thanh toán tại trang Lịch sử để xác nhận.');
        fetchPitchesAndServices();
        setShowBookingModal(false);
        setSelectedSlot(null);
      } catch(err: any) {
         message.error(err.response?.data?.message || 'Đặt sân thất bại');
      } finally {
        setBookingLoading(false);
      }
    }
  };

  const filteredPitches = pitches.filter(pitch =>
    pitch.namePitch?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Đặt sân bóng đá</h2>
          <p className="text-sm text-black/50">Chọn sân và khung giờ phù hợp</p>
        </div>

        <div className="flex gap-3">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-white/80 backdrop-blur-xl border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
        <input
          type="text"
          placeholder="Tìm kiếm sân..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-xl border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-white/50 backdrop-blur-xl rounded-xl border border-black/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-green-400"></div>
          <span className="text-sm">Có sẵn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-red-400"></div>
          <span className="text-sm">Đã đặt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-yellow-400"></div>
          <span className="text-sm">Chờ thanh toán</span>
        </div>
      </div>

      {/* Booking Grid */}
      {loading ? <div className="p-10 flex justify-center"><Spin size="large" /></div> : 
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5 overflow-x-auto"
      >
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="p-3 text-left sticky left-0 bg-white/90 backdrop-blur-xl">
                <div className="font-semibold">Khung giờ</div>
              </th>
              {filteredPitches.map((pitch) => (
                <th key={pitch.pitchId} className="p-3 text-center">
                  <div className="font-semibold text-sm mb-1">{pitch.namePitch}</div>
                  <div className="text-xs text-black/50">{(getPitchPrice(pitch.pitchId, '06:00') / 1000).toFixed(0)}K/giờ</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time} className="border-t border-black/5">
                <td className="p-3 sticky left-0 bg-white/90 backdrop-blur-xl">
                  <div className="flex items-center gap-2 font-medium text-sm">
                    <Clock className="w-4 h-4 text-black/30" />
                    {time}
                  </div>
                </td>
                {filteredPitches.map((pitch) => {
                  const status = getSlotStatus(pitch.pitchId, time);
                  const bgColor =
                    status === 'available'
                      ? 'bg-green-400/80 hover:bg-green-500'
                      : status === 'pending'
                      ? 'bg-yellow-400/80 hover:bg-yellow-500'
                      : 'bg-red-400/80';

                  return (
                    <td key={`${pitch.pitchId}-${time}`} className="p-2">
                      <motion.button
                        whileHover={status === 'available' ? { scale: 1.05 } : {}}
                        whileTap={status === 'available' ? { scale: 0.95 } : {}}
                        onClick={() => handleSlotClick(pitch.pitchId, time)}
                        disabled={status !== 'available'}
                        className={`w-full h-12 rounded-xl ${bgColor} transition-all ${
                          status !== 'available' ? 'cursor-not-allowed' : 'cursor-pointer shadow-md hover:shadow-lg'
                        }`}
                      >
                        <span className="text-white text-xs font-medium">
                          {status === 'available' ? '✓' : status === 'pending' ? '⏱' : '✕'}
                        </span>
                      </motion.button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      }

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedSlot && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Xác nhận đặt sân</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{pitches.find(p => p.pitchId === selectedSlot.pitch)?.namePitch}</p>
                      <p className="text-sm text-black/50">{selectedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-black/50" />
                      <span>{selectedSlot.time} - {parseInt(selectedSlot.time.split(':')[0]) + 1}:00</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{((getPitchPrice(selectedSlot.pitch, selectedSlot.time)) + Object.entries(selectedServices).reduce((sum, [id, qty]) => sum + ((services.find(s => s.serviceId === id)?.price || 0) * qty), 0)).toLocaleString()} VNĐ</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Số điện thoại liên hệ</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại" 
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dịch vụ bổ sung</label>
                  {services.length === 0 ? (
                    <p className="text-xs text-gray-500">Không có dịch vụ nào.</p>
                  ) : (
                    <div className="space-y-3">
                      {services.map((service) => {
                        const available = getAvailableQuantity(service.serviceId);
                        const quantity = selectedServices[service.serviceId] || 0;
                        return (
                          <motion.div
                            key={service.serviceId}
                            whileHover={{ x: 2 }}
                            className="p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm font-medium">{service.nameProduct}</p>
                                <p className="text-xs text-gray-500">Giá: {service.price?.toLocaleString()}đ</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded ${available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                Còn {available}
                              </span>
                            </div>
                            
                            {available > 0 ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleServiceChange(service.serviceId, Math.max(0, quantity - 1))}
                                  className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  max={available}
                                  value={quantity}
                                  onChange={(e) => {
                                    const val = Math.min(Math.max(0, parseInt(e.target.value) || 0), available);
                                    handleServiceChange(service.serviceId, val);
                                  }}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  onClick={() => handleServiceChange(service.serviceId, Math.min(available, quantity + 1))}
                                  className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                                >
                                  +
                                </button>
                                {quantity > 0 && (
                                  <span className="text-xs text-blue-600 font-medium ml-auto">
                                    {(service.price * quantity).toLocaleString()}đ
                                  </span>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-red-500">Hết hàng</p>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="p-3 bg-blue-50 rounded-xl space-y-2 border border-blue-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tiền cọc sân:</span>
                    <span className="font-medium">{(Math.floor(getPitchPrice(selectedSlot.pitch, selectedSlot.time) / 2)).toLocaleString()}đ</span>
                  </div>
                  {Object.entries(selectedServices).map(([serviceId, quantity]) => {
                    const service = services.find(s => s.serviceId === serviceId);
                    if (quantity === 0 || !service) return null;
                    return (
                      <div key={serviceId} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{service.nameProduct} (x{quantity}):</span>
                        <span className="font-medium">{((service.price || 0) * (quantity || 0)).toLocaleString()}đ</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-blue-200 pt-2 flex items-center justify-between">
                    <span className="font-semibold">Tổng cộng:</span>
                    <span className="text-lg font-bold text-blue-600">{calculateTotalPrice().toLocaleString()}đ</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmBooking}
                  disabled={bookingLoading}
                  className={`flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2 ${bookingLoading ? 'opacity-70' : ''}`}
                >
                  <Check className="w-5 h-5" />
                  {bookingLoading ? 'Đang xử lý...' : 'Xác nhận'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

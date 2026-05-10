import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, X, MapPin, DollarSign, Users, Settings as SettingsIcon } from 'lucide-react';
import { pitchApi } from '../../../api/pitch.api';
import { message, Spin } from 'antd';

export default function Pitches() {
  const [pitches, setPitches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    namePitch: '',
    type: 5,
    address: '',
    peakPrice: '300000',
    offPeakPrice: '200000',
    status: 'active'
  });

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    setLoading(true);
    try {
      const res = await pitchApi.getAll({});
      setPitches(res.data || []);
    } catch(err) {
      message.error("Lỗi khi lấy dữ liệu sân");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPitch = (pitch: any) => {
    setSelectedPitch(pitch);
    setFormData({
      namePitch: pitch.namePitch,
      type: pitch.pitchCategory,
      address: pitch.address || '',
      peakPrice: pitch.pitchprice?.[0]?.price?.toString() || '300000',
      offPeakPrice: pitch.pitchprice?.[0]?.price?.toString() || '200000',
      status: pitch.status,
    });
    setShowPitchModal(true);
  };

  const handleSavePitch = async () => {
    try {
      if (selectedPitch) {
        // Cập nhật sân
        await pitchApi.update({
          pitchId: selectedPitch.pitchId,
          namePitch: formData.namePitch,
          pitchCategory: Number(formData.type),
          address: formData.address,
          status: formData.status
        });
        message.success("Cập nhật sân thành công");
      } else {
        // Tạo sân mới
        const [hour1, minute1] = "06:00".split(':');
        const [hour2, minute2] = "22:00".split(':');
        const startTime = new Date(); startTime.setHours(Number(hour1), Number(minute1));
        const endTime = new Date(); endTime.setHours(Number(hour2), Number(minute2));
        
        await pitchApi.create({
          namePitch: formData.namePitch,
          pitchCategory: Number(formData.type),
          address: formData.address,
          status: formData.status,
          price: Number(formData.peakPrice), // Mock price
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        });
        message.success("Thêm sân mới thành công");
      }
      setShowPitchModal(false);
      fetchPitches();
    } catch(err) {
      message.error("Lưu thông tin sân thất bại");
    }
  };

  const handleToggleStatus = async (pitch: any) => {
    try {
      const newStatus = pitch.status === 'active' ? 'maintenance' : 'active';
      await pitchApi.update({
        pitchId: pitch.pitchId,
        status: newStatus
      });
      message.success("Cập nhật trạng thái thành công");
      fetchPitches();
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'maintenance': return 'Bảo trì';
      default: return 'Ngừng hoạt động';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Quản lý sân</h2>
          <p className="text-sm text-black/50">Xem và quản lý tất cả các sân bóng</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedPitch(null);
            setFormData({
              namePitch: '',
              type: 5,
              address: '',
              peakPrice: '300000',
              offPeakPrice: '200000',
              status: 'active'
            });
            setShowPitchModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm sân
        </motion.button>
      </div>

      {/* Pitches Grid */}
      {loading ? <div className="p-10 flex justify-center"><Spin size="large" /></div> : 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pitches.map((pitch, index) => (
          <motion.div
            key={pitch.pitchId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
          >
            {/* Pitch Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-bold text-lg mb-1">{pitch.namePitch}</h4>
                <p className="text-sm text-black/50">Sân {pitch.pitchCategory} người</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(pitch.status)}`}>
                {getStatusLabel(pitch.status)}
              </span>
            </div>

            {/* Pitch Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-black/30" />
                <span className="text-black/70">{pitch.address || 'Chưa cập nhật'}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-black/50 mb-1">Giá thuê</p>
                  <p className="font-bold text-orange-600">{pitch.pitchprice?.[0]?.price?.toLocaleString() || 300000} VNĐ</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditPitch(pitch)}
                className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Sửa
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggleStatus(pitch)}
                className="flex-1 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <SettingsIcon className="w-4 h-4" />
                Đổi TT
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>}

      {/* Pitch Modal */}
      <AnimatePresence>
        {showPitchModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPitchModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {selectedPitch ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPitchModal(false)}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tên sân</label>
                  <input
                    type="text"
                    value={formData.namePitch}
                    onChange={e => setFormData({...formData, namePitch: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Loại sân (Người)</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: Number(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      <option value={5}>Sân 5 người</option>
                      <option value={7}>Sân 7 người</option>
                      <option value={11}>Sân 11 người</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Khu vực</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Giá thuê</label>
                    <input
                      type="text"
                      value={formData.peakPrice}
                      onChange={e => setFormData({...formData, peakPrice: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="maintenance">Bảo trì</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPitchModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSavePitch}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {selectedPitch ? 'Cập nhật' : 'Thêm mới'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

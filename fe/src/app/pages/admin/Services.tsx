import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, X, Package, DollarSign } from 'lucide-react';
import { servicesApi } from '../../../api/services.api';
import { message, Spin, Modal } from 'antd';

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    nameProduct: '',
    price: '',
    totalQuantity: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await servicesApi.getAll({});
      setServices(res.data || []);
    } catch(err) {
      message.error("Lỗi khi tải danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: any) => {
    setSelectedService(service);
    setFormData({
      nameProduct: service.nameProduct,
      price: service.price?.toString() || '0',
      totalQuantity: service.totalQuantity?.toString() || '0'
    });
    setShowModal(true);
  };

  const handleDelete = (serviceId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa dịch vụ này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await servicesApi.delete(serviceId);
          message.success("Xóa thành công");
          fetchServices();
        } catch (error: any) {
          message.error(error.response?.data?.message || "Xóa thất bại");
        }
      }
    });
  };

  const handleSave = async () => {
    if (!formData.nameProduct || !formData.price || !formData.totalQuantity) {
      message.error("Vui lòng điền đủ thông tin");
      return;
    }

    try {
      if (selectedService) {
        // Cập nhật
        await servicesApi.update({
          serviceId: selectedService.serviceId,
          nameProduct: formData.nameProduct,
          price: Number(formData.price),
          totalQuantity: Number(formData.totalQuantity)
        });
        message.success("Cập nhật thành công");
      } else {
        // Thêm mới
        await servicesApi.create({
          nameProduct: formData.nameProduct,
          price: Number(formData.price),
          totalQuantity: Number(formData.totalQuantity)
        });
        message.success("Thêm mới thành công");
      }
      setShowModal(false);
      fetchServices();
    } catch(err: any) {
      message.error(err.response?.data?.message || "Lưu thất bại");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Quản lý dịch vụ</h2>
          <p className="text-sm text-black/50">Quản lý kho đồ thuê, nước uống tại sân</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedService(null);
            setFormData({ nameProduct: '', price: '', totalQuantity: '' });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm dịch vụ
        </motion.button>
      </div>

      {/* Services Grid */}
      {loading ? <div className="p-10 flex justify-center"><Spin size="large" /></div> : 
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.serviceId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                service.available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                Còn {service.available}
              </span>
            </div>

            <h4 className="font-bold text-lg mb-1">{service.nameProduct}</h4>
            <div className="flex items-center gap-1 text-orange-600 font-semibold mb-4">
              <DollarSign className="w-4 h-4" />
              <span>{service.price?.toLocaleString()} VNĐ</span>
            </div>

            <div className="flex justify-between items-center text-sm text-black/50 mb-4 border-t border-black/5 pt-4">
              <span>Tổng: {service.totalQuantity}</span>
              <span>Đang mượn: {service.borrowed - service.returned}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(service)}
                className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Sửa
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(service.serviceId)}
                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {selectedService ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tên dịch vụ/Sản phẩm</label>
                  <input
                    type="text"
                    value={formData.nameProduct}
                    onChange={e => setFormData({...formData, nameProduct: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Đơn giá (VNĐ)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tổng số lượng</label>
                    <input
                      type="number"
                      value={formData.totalQuantity}
                      onChange={e => setFormData({...formData, totalQuantity: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {selectedService ? 'Cập nhật' : 'Tạo mới'}
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
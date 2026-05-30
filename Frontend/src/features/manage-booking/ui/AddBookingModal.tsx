import React from 'react';
import { Modal, Form, Input, Row, Col, Select, DatePicker, TimePicker, Button } from 'antd';
import { UserOutlined, PhoneOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import type { Booking } from '@/entities/booking/model/types';
import type { Pitch } from '@/entities/pitch/model/types';

interface AddBookingModalProps {
  open: boolean;
  pitches: Pitch[];
  selectedDate: Dayjs;
  onConfirm: (values: Omit<Booking, 'id'>) => void;
  onClose: () => void;
}

const FEATURE_LIST = ['✅ Xác nhận ngay', '✅ Ghi chú linh hoạt', '✅ Quản lý tập trung'];

export const AddBookingModal: React.FC<AddBookingModalProps> = ({
  open, pitches, selectedDate, onConfirm, onClose,
}) => {
  const [form] = Form.useForm();

  const handleConfirm = () => {
    form.validateFields().then((values) => {
      const pitch = pitches.find((p) => p.id === values.pitchId);
      onConfirm({
        userName: values.userName,
        phone: values.phone,
        pitchId: values.pitchId,
        pitchName: pitch?.name ?? '',
        date: (values.date as Dayjs).format('YYYY-MM-DD'),
        startTime: (values.startTime as Dayjs).format('HH:mm'),
        endTime: (values.endTime as Dayjs).format('HH:mm'),
        status: 'approved',
        paymentStatus: 'unpaid',
        price: Number(values.price),
        source: 'admin',
        note: values.note,
      });
      form.resetFields();
    });
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal 
      open={open} 
      onCancel={handleClose}
      footer={null} 
      width={580}
      bodyStyle={{ padding: 0 }} 
      className="rounded-2xl overflow-hidden"
    >
      <div className="flex min-h-[420px]">
        {/* Left Banner */}
        <div className="w-[180px] bg-gradient-to-b from-emerald-600 to-emerald-800 p-7 flex flex-col justify-between select-none">
          <div>
            <div className="text-4xl mb-4">📋</div>
            <div className="text-white font-extrabold text-lg leading-snug">Đặt sân mới</div>
            <div className="text-white/80 text-xs mt-2 leading-relaxed">
              Điền thông tin để tạo lịch đặt sân cho khách hàng
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            {FEATURE_LIST.map((t) => (
              <div key={t} className="text-white/70 text-[10px] font-medium">{t}</div>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-white">
          <div className="font-bold text-base text-slate-800 mb-5">Thông tin đặt sân</div>
          <Form form={form} layout="vertical" className="flex-1">
            <Row gutter={12}>
              <Col span={13}>
                <Form.Item name="userName"
                  label={<span className="font-semibold text-slate-700 text-xs">Tên khách hàng</span>}
                  rules={[{ required: true, message: 'Nhập tên!' }]}>
                  <Input prefix={<UserOutlined className="text-slate-400" />}
                    placeholder="Nguyễn Văn A" className="rounded-xl h-10 border-slate-300 focus:border-emerald-500" />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="phone"
                  label={<span className="font-semibold text-slate-700 text-xs">Số điện thoại</span>}>
                  <Input prefix={<PhoneOutlined className="text-slate-400" />}
                    placeholder="09xxxxxxxx" className="rounded-xl h-10 border-slate-300 focus:border-emerald-500" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="pitchId"
              label={<span className="font-semibold text-slate-700 text-xs">Chọn sân</span>}
              rules={[{ required: true, message: 'Chọn sân!' }]}>
              <Select placeholder="Chọn sân bóng" className="h-10 w-full rounded-xl"
                options={pitches.map((p) => ({ value: p.id, label: `${p.name} — ${p.type}` }))} />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="date" initialValue={selectedDate}
                  label={<span className="font-semibold text-slate-700 text-xs">Ngày đặt</span>}
                  rules={[{ required: true, message: 'Chọn ngày!' }]}>
                  <DatePicker className="w-full h-10 rounded-xl" format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="startTime"
                  label={<span className="font-semibold text-slate-700 text-xs">Bắt đầu</span>}
                  rules={[{ required: true, message: 'Chọn giờ!' }]}>
                  <TimePicker className="w-full h-10 rounded-xl" format="HH:mm" minuteStep={30} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="endTime"
                  label={<span className="font-semibold text-slate-700 text-xs">Kết thúc</span>}
                  rules={[{ required: true, message: 'Chọn giờ!' }]}>
                  <TimePicker className="w-full h-10 rounded-xl" format="HH:mm" minuteStep={30} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="price"
              label={<span className="font-semibold text-slate-700 text-xs">Giá tiền (VNĐ)</span>}
              rules={[{ required: true, message: 'Nhập giá!' }]}>
              <Input prefix={<MoneyCollectOutlined className="text-slate-400" />}
                type="number" placeholder="300000" className="rounded-xl h-10 border-slate-300 focus:border-emerald-500" />
            </Form.Item>

            <Form.Item name="note"
              label={<span className="font-semibold text-slate-700 text-xs">Ghi chú</span>}
              className="mb-0">
              <Input.TextArea rows={2} placeholder="Ghi chú thêm..." className="rounded-xl border-slate-300 focus:border-emerald-500" />
            </Form.Item>
          </Form>

          <div className="flex gap-3 mt-5">
            <Button onClick={handleClose} className="flex-1 h-11 rounded-xl font-semibold border-slate-300 text-slate-600 hover:text-emerald-600 hover:border-emerald-500">
              Hủy
            </Button>
            <Button type="primary" onClick={handleConfirm}
              className="flex-[2] h-11 rounded-xl bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 font-bold text-sm shadow-md shadow-emerald-600/10">
              ✅ Xác nhận đặt sân
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

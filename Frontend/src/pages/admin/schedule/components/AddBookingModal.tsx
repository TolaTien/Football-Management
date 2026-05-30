import React from 'react';
import {
  Modal, Form, Input, Row, Col, Select, DatePicker, TimePicker, Button,
} from 'antd';
import {
  UserOutlined, PhoneOutlined, MoneyCollectOutlined,
} from '@ant-design/icons';
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

const AddBookingModal: React.FC<AddBookingModalProps> = ({
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
    <Modal open={open} onCancel={handleClose}
      footer={null} width={580}
      bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', minHeight: 420 }}>
        <div style={{ width: 180, background: 'linear-gradient(160deg,#00a67d,#007a5c)', padding: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 36 }}>📋</div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 17, lineHeight: 1.3 }}>Đặt sân mới</div>
          <div style={{ color: 'rgba(255,255,255,0.78)', fontSize: 12, marginTop: 4 }}>
            Điền thông tin để tạo lịch đặt sân cho khách hàng
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FEATURE_LIST.map((t) => (
              <div key={t} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{t}</div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1f2937', marginBottom: 20 }}>Thông tin đặt sân</div>
          <Form form={form} layout="vertical" style={{ flex: 1 }}>
            <Row gutter={12}>
              <Col span={13}>
                <Form.Item name="userName"
                  label={<span style={{ fontWeight: 600, fontSize: 12 }}>Tên khách hàng</span>}
                  rules={[{ required: true, message: 'Nhập tên!' }]}>
                  <Input prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                    placeholder="Nguyễn Văn A" style={{ borderRadius: 8, height: 38 }} />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="phone"
                  label={<span style={{ fontWeight: 600, fontSize: 12 }}>Số điện thoại</span>}>
                  <Input prefix={<PhoneOutlined style={{ color: '#9ca3af' }} />}
                    placeholder="09xxxxxxxx" style={{ borderRadius: 8, height: 38 }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="pitchId"
              label={<span style={{ fontWeight: 600, fontSize: 12 }}>Chọn sân</span>}
              rules={[{ required: true, message: 'Chọn sân!' }]}>
              <Select placeholder="Chọn sân bóng" style={{ height: 38 }}
                options={pitches.map((p) => ({ value: p.id, label: `${p.name} — ${p.type}` }))} />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="date" initialValue={selectedDate}
                  label={<span style={{ fontWeight: 600, fontSize: 12 }}>Ngày đặt</span>}
                  rules={[{ required: true, message: 'Chọn ngày!' }]}>
                  <DatePicker style={{ width: '100%', height: 38, borderRadius: 8 }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="startTime"
                  label={<span style={{ fontWeight: 600, fontSize: 12 }}>Bắt đầu</span>}
                  rules={[{ required: true, message: 'Chọn giờ!' }]}>
                  <TimePicker style={{ width: '100%', height: 38, borderRadius: 8 }} format="HH:mm" minuteStep={30} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="endTime"
                  label={<span style={{ fontWeight: 600, fontSize: 12 }}>Kết thúc</span>}
                  rules={[{ required: true, message: 'Chọn giờ!' }]}>
                  <TimePicker style={{ width: '100%', height: 38, borderRadius: 8 }} format="HH:mm" minuteStep={30} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="price"
              label={<span style={{ fontWeight: 600, fontSize: 12 }}>Giá tiền (VNĐ)</span>}
              rules={[{ required: true, message: 'Nhập giá!' }]}>
              <Input prefix={<MoneyCollectOutlined style={{ color: '#9ca3af' }} />}
                type="number" placeholder="300000" style={{ borderRadius: 8, height: 38 }} />
            </Form.Item>

            <Form.Item name="note"
              label={<span style={{ fontWeight: 600, fontSize: 12 }}>Ghi chú</span>}
              style={{ marginBottom: 0 }}>
              <Input.TextArea rows={2} placeholder="Ghi chú thêm..." style={{ borderRadius: 8 }} />
            </Form.Item>
          </Form>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button onClick={handleClose} style={{ flex: 1, height: 42, borderRadius: 8, fontWeight: 600 }}>
              Hủy
            </Button>
            <Button type="primary" onClick={handleConfirm}
              style={{ flex: 2, height: 42, borderRadius: 8, background: '#00a67d', fontWeight: 700, fontSize: 14 }}>
              ✅ Xác nhận đặt sân
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddBookingModal;

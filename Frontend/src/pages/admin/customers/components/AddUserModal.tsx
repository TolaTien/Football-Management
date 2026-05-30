import React, { useState } from 'react';
import { Modal, Form, Input, Select, Switch, Button, Row, Col, Typography } from 'antd';
import {
  UserAddOutlined, IdcardOutlined, PhoneOutlined, MailOutlined,
  UserOutlined, CheckCircleOutlined, LockOutlined,
} from '@ant-design/icons';
import type { UserRole } from '@/entities/user/model/types';

const { Text } = Typography;

interface AddUserModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: { name: string; email: string; phone: string; role: UserRole; password?: string }) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ open, onCancel, onConfirm }) => {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (values: { name: string; email: string; phone: string; role: UserRole; password?: string }) => {
    onConfirm(values);
    form.resetFields();
    setIsActive(true);
  };

  const handleClose = () => {
    form.resetFields();
    setIsActive(true);
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={700}
      style={{ top: 60 }}
      styles={{ body: { padding: 0 } }}
      closeIcon={<span style={{ fontSize: 18, color: '#9ca3af', lineHeight: 1 }}>✕</span>}
    >
      <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', minHeight: 500 }}>
        {/* Panel trái – xanh lá */}
        <div style={{
          width: 200, minWidth: 200,
          background: 'linear-gradient(160deg, #059669 0%, #047857 100%)',
          padding: '36px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}>
              <UserAddOutlined style={{ fontSize: 24, color: '#fff' }} />
            </div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, lineHeight: 1.3, marginBottom: 12 }}>
              Thông tin người dùng
            </div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.6 }}>
              Vui lòng điền đầy đủ các thông tin bên dưới để cập nhật hệ thống.
            </div>
          </div>
          <div style={{
            padding: '12px 14px',
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 4 }}>ℹ️ Lưu ý</div>
            <div style={{ color: '#fff', fontSize: 12, lineHeight: 1.5 }}>
              Quản trị viên mới yêu cầu xác minh hai bước.
            </div>
          </div>
        </div>

        {/* Panel phải – form */}
        <div style={{ flex: 1, backgroundColor: '#fff' }}>
          <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ padding: '32px 32px 8px' }}>
            {/* Hàng 1: Họ tên + SĐT */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label={
                    <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <IdcardOutlined style={{ color: '#059669' }} /> Họ và tên
                    </span>
                  }
                  rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                >
                  <Input
                    placeholder="Nguyễn Văn An"
                    size="large"
                    style={{ borderRadius: 10, borderColor: '#d1d5db' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label={
                    <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <PhoneOutlined style={{ color: '#059669' }} /> Số điện thoại
                    </span>
                  }
                  rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
                >
                  <Input
                    placeholder="0901 234 567"
                    size="large"
                    style={{ borderRadius: 10, borderColor: '#d1d5db' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Email */}
            <Form.Item
              name="email"
              label={
                <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MailOutlined style={{ color: '#059669' }} /> Địa chỉ Email
                </span>
              }
              rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
            >
              <Input
                placeholder="example@pitchhub.vn"
                size="large"
                style={{ borderRadius: 10, borderColor: '#d1d5db' }}
              />
            </Form.Item>

            {/* Vai trò + Trạng thái */}
            <Row gutter={16} align="bottom">
              <Col span={14}>
                <Form.Item
                  name="role"
                  initialValue="Khách hàng"
                  label={
                    <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <UserOutlined style={{ color: '#059669' }} /> Vai trò
                    </span>
                  }
                >
                  <Select size="large" style={{ borderRadius: 10 }}>
                    <Select.Option value="Khách hàng">Khách hàng</Select.Option>
                    <Select.Option value="Quản trị">Quản trị viên</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label={
                    <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircleOutlined style={{ color: '#059669' }} /> Trạng thái
                    </span>
                  }
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 2 }}>
                    <Switch
                      checked={isActive}
                      onChange={setIsActive}
                      style={{ backgroundColor: isActive ? '#059669' : '#d1d5db' }}
                    />
                    <Text style={{ fontWeight: 600, color: isActive ? '#059669' : '#6b7280', fontSize: 14 }}>
                      {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                    </Text>
                  </div>
                </Form.Item>
              </Col>
            </Row>

            {/* Mật khẩu */}
            <Form.Item
              name="password"
              label={
                <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LockOutlined style={{ color: '#059669' }} /> Mật khẩu mặc định
                </span>
              }
            >
              <Input.Password
                placeholder="Để trống để tự động tạo"
                size="large"
                style={{ borderRadius: 10, borderColor: '#d1d5db' }}
              />
            </Form.Item>

            {/* Footer */}
            <div style={{
              marginTop: 8, paddingTop: 20,
              borderTop: '1px solid #f3f4f6',
              display: 'flex', justifyContent: 'flex-end', gap: 12,
            }}>
              <Button
                size="large"
                onClick={handleClose}
                style={{ borderRadius: 10, height: 44, padding: '0 24px', fontWeight: 600, color: '#374151', borderColor: '#d1d5db' }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<UserAddOutlined />}
                style={{
                  backgroundColor: '#059669', borderColor: '#059669',
                  borderRadius: 10, height: 44, padding: '0 28px', fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                }}
              >
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;

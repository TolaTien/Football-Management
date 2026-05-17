import React, { useEffect } from 'react';
import { Button, Card, Form, Input, Typography, Upload, message } from 'antd';
import { useModel } from '@umijs/max';
import { userApi } from '@/shared/api/modules';

const UserProfilePage: React.FC = () => {
  const { user, reload } = useModel('auth');
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(user || {});
  }, [form, user]);

  const onFinish = async (values: any) => {
    const payload = new FormData();
    payload.append('email', values.email);
    payload.append('fullName', values.fullName);
    payload.append('phone', values.phone);
    if (values.avt?.file) payload.append('avt', values.avt.file);
    await userApi.updateProfile(payload);
    await reload();
    message.success('Đã cập nhật hồ sơ');
  };

  return (
    <Card>
      <Typography.Title level={2}>Hồ sơ cá nhân</Typography.Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="fullName" label="Họ tên"><Input /></Form.Item>
        <Form.Item name="email" label="Email"><Input /></Form.Item>
        <Form.Item name="phone" label="Số điện thoại"><Input /></Form.Item>
        <Form.Item name="avt" label="Ảnh đại diện"><Upload beforeUpload={() => false} maxCount={1}><Button>Chọn ảnh</Button></Upload></Form.Item>
        <Button type="primary" htmlType="submit">Lưu</Button>
      </Form>
    </Card>
  );
};

export default UserProfilePage;

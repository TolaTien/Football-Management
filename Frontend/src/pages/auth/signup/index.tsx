import React, { useState } from 'react';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { history, useModel } from '@umijs/max';
import { authApi } from '@/shared/api/modules';

const SignupPage: React.FC = () => {
  const { reload } = useModel('auth');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { fullName: string; email: string; phone: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      await authApi.register(values);
      await reload();
      history.push('/user/dashboard');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <Typography.Title level={3}>Đăng ký</Typography.Title>
        {error && <Alert className="mb-4" type="error" message={error} />}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo tài khoản
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default SignupPage;

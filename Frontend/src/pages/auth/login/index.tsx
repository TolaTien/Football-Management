import React, { useState } from 'react';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { history, useModel } from '@umijs/max';
import { authApi } from '@/shared/api/modules';

const LoginPage: React.FC = () => {
  const { reload } = useModel('auth');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      await authApi.login(values);
      await reload();
      const raw = localStorage.getItem('pitchhub_user');
      const user = raw ? JSON.parse(raw) : null;
      history.push(user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <Typography.Title level={3}>Đăng nhập</Typography.Title>
        {error && <Alert className="mb-4" type="error" message={error} />}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>
        </Form>
        <div className="mt-4 text-center">
          Chưa có tài khoản? <a href="/auth/signup">Đăng ký</a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;

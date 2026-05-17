import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Select, Space, Typography, message } from 'antd';
import { pitchApi } from '@/shared/api/modules';
import type { Pitch } from '@/shared/types/domain';

const AdminPricing: React.FC = () => {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    void pitchApi.list().then((res) => setPitches(res.data.data));
  }, []);

  const onFinish = async (values: any) => {
    await pitchApi.updatePrices({
      pitchId: values.pitchId,
      config: values.config,
    });
    message.success('Đã cập nhật giá');
  };

  return (
    <Card>
      <Typography.Title level={2}>Cấu hình giá sân</Typography.Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="pitchId" label="Sân" rules={[{ required: true }]}>
          <Select options={pitches.map((p) => ({ value: p.pitchId, label: p.namePitch }))} />
        </Form.Item>
        <Form.List name="config" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...rest }) => (
                <Space key={key} align="baseline">
                  <Form.Item {...rest} name={[name, 'startTime']} rules={[{ required: true }]}>
                    <Input placeholder="2026-05-17T06:00:00.000Z" />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'endTime']} rules={[{ required: true }]}>
                    <Input placeholder="2026-05-17T16:00:00.000Z" />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'price']} rules={[{ required: true }]}>
                    <InputNumber min={0} placeholder="Giá" />
                  </Form.Item>
                  <Button onClick={() => remove(name)}>Xóa</Button>
                </Space>
              ))}
              <Button onClick={() => add()}>Thêm khung giá</Button>
            </>
          )}
        </Form.List>
        <div className="mt-6"><Button type="primary" htmlType="submit">Lưu cấu hình</Button></div>
      </Form>
    </Card>
  );
};

export default AdminPricing;

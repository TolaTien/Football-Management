import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Form, Input, InputNumber, Select, Space, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { bookingApi, pitchApi, serviceApi } from '@/shared/api/modules';
import type { Pitch, ServiceItem } from '@/shared/types/domain';

const BookingAvailabilityPage: React.FC = () => {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [form] = Form.useForm();
  const selectedPitchId = Form.useWatch('pitchId', form);
  const selectedPitch = useMemo(() => pitches.find((p) => p.pitchId === selectedPitchId), [pitches, selectedPitchId]);

  useEffect(() => {
    void pitchApi.list({ status: 'active' }).then((res) => setPitches(res.data.data));
    void serviceApi.list().then((res) => setServices(res.data));
  }, []);

  const onFinish = async (values: any) => {
    const price = selectedPitch?.pitchprice?.[0]?.price || 0;
    await bookingApi.createForUser({
      pitchId: values.pitchId,
      phone: values.phone,
      startTime: values.startTime.toISOString(),
      endTime: values.endTime.toISOString(),
      pitchPriceAtBooking: price,
      service: values.service || [],
    });
    message.success('Đã gửi yêu cầu đặt sân');
    form.resetFields();
  };

  return (
    <Card>
      <Typography.Title level={2}>Đặt sân</Typography.Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="pitchId" label="Sân" rules={[{ required: true }]}>
          <Select options={pitches.map((p) => ({ value: p.pitchId, label: p.namePitch }))} />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Space className="w-full" size="large">
          <Form.Item name="startTime" label="Bắt đầu" rules={[{ required: true }]}>
            <DatePicker showTime />
          </Form.Item>
          <Form.Item name="endTime" label="Kết thúc" rules={[{ required: true }]}>
            <DatePicker showTime />
          </Form.Item>
        </Space>
        <Form.List name="service">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...rest }) => (
                <Space key={key} align="baseline">
                  <Form.Item {...rest} name={[name, 'serviceId']} rules={[{ required: true }]}>
                    <Select style={{ width: 220 }} options={services.map((s) => ({ value: s.serviceId, label: s.nameProduct }))} />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'quantity']} rules={[{ required: true }]}>
                    <InputNumber min={1} placeholder="SL" />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'servicePriceAtBooking']} rules={[{ required: true }]}>
                    <InputNumber min={0} placeholder="Giá" />
                  </Form.Item>
                  <Button onClick={() => remove(name)}>Xóa</Button>
                </Space>
              ))}
              <Button onClick={() => add()}>Thêm dịch vụ</Button>
            </>
          )}
        </Form.List>
        <div className="mt-6">
          <p>Giá sân tham chiếu: {selectedPitch?.pitchprice?.[0]?.price?.toLocaleString() || 0}đ</p>
          <Button type="primary" htmlType="submit">Gửi yêu cầu</Button>
        </div>
      </Form>
    </Card>
  );
};

export default BookingAvailabilityPage;

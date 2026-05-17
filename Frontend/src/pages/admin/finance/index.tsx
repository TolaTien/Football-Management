import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Statistic, Table, Typography } from 'antd';
import { statisticApi } from '@/shared/api/modules';

const AdminFinance: React.FC = () => {
  const [revenue, setRevenue] = useState<any>({});
  const [topSpenders, setTopSpenders] = useState<any[]>([]);

  useEffect(() => {
    void statisticApi.revenue().then((res) => setRevenue(res.data.data));
    void statisticApi.topSpenders().then((res) => setTopSpenders(res.data.data));
  }, []);

  const exportFile = async () => {
    const res = await statisticApi.exportRevenue();
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Bao_Cao_Doanh_Thu.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Typography.Title level={2}>Doanh thu</Typography.Title>
      <Row gutter={16} className="mb-6">
        <Col span={8}><Card><Statistic title="Tổng doanh thu" value={revenue.totalRevenue || 0} suffix="đ" /></Card></Col>
        <Col span={8}><Card><Statistic title="Tổng booking" value={revenue.totalBookings || 0} /></Card></Col>
        <Col span={8}><Card><Statistic title="Tỷ lệ lấp đầy" value={revenue.rate || 0} suffix="%" /></Card></Col>
      </Row>
      <Card extra={<Button onClick={exportFile}>Xuất Excel</Button>}>
        <Typography.Title level={4}>Top người chi tiêu</Typography.Title>
        <Table
          rowKey="userId"
          dataSource={topSpenders}
          columns={[
            { title: 'Hạng', dataIndex: 'rank' },
            { title: 'Tên', dataIndex: 'fullName' },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Số booking', dataIndex: 'bookingCount' },
            { title: 'Tổng chi', render: (_, r) => `${(r.totalSpent || 0).toLocaleString()}đ` },
          ]}
        />
      </Card>
    </>
  );
};

export default AdminFinance;

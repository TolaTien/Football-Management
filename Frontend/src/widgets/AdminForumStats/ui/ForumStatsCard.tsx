import React from 'react';
import { Card, Row, Col } from 'antd';
import { MessageFilled } from '@ant-design/icons';

export const ForumStatsCard: React.FC = () => {
  return (
    <Card bordered={false} className="bg-emerald-650 rounded-2xl p-6 text-white shadow-lg shadow-emerald-600/10">
      <div className="text-white text-base font-bold mb-6 flex items-center gap-2">
        <MessageFilled className="opacity-80 text-lg" /> Sức khỏe Diễn đàn
      </div>
      <Row gutter={16}>
        <Col span={12}>
          <div className="bg-white/10 p-4 rounded-xl border border-white/5">
            <div className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider mb-1">Chủ đề mới</div>
            <div className="flex items-baseline gap-1">
              <span className="text-white text-2xl font-extrabold">+12</span>
              <span className="text-emerald-200/80 text-[10px] font-medium">Hôm nay</span>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="bg-white/10 p-4 rounded-xl border border-white/5">
            <div className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider mb-1">Bình luận</div>
            <div className="flex items-baseline gap-1">
              <span className="text-white text-2xl font-extrabold">84</span>
              <span className="text-emerald-200/80 text-[10px] font-medium">Chờ duyệt</span>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

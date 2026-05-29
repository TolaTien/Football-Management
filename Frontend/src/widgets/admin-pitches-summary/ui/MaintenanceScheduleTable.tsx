import React from 'react';
import { Card, Tag } from 'antd';

export const MaintenanceScheduleTable: React.FC = () => {
  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ marginTop: 24, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
      <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Chi tiết bảo trì tiếp theo</div>
        <a style={{ color: '#00a67d', fontWeight: 600, fontSize: 14 }}>Xem tất cả lịch →</a>
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 1fr', paddingBottom: 16, borderBottom: '1px solid #f3f4f6', color: '#6b7280', fontWeight: 600, fontSize: 13 }}>
          <div>Tên sân</div>
          <div>Hoạt động</div>
          <div>Ngày thực hiện</div>
          <div>Nhân viên phụ trách</div>
          <div style={{ textAlign: 'right' }}>Trạng thái</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 1fr', padding: '16px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, color: '#1f2937' }}>Sân 5 - A1</div>
          <div style={{ color: '#4b5563', fontSize: 14 }}>Cắt tỉa & Bón phân định kỳ</div>
          <div style={{ color: '#4b5563', fontSize: 14 }}>15/10/2023 (Sáng)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#34d399' }} />
            <span style={{ fontSize: 13, color: '#1f2937' }}>Nguyễn Văn An</span>
          </div>
          <div style={{ textAlign: 'right' }}><Tag color="blue" style={{ borderRadius: 12, border: 'none', backgroundColor: '#e0e7ff', color: '#4f46e5', fontWeight: 600 }}>ĐÃ LÊN LỊCH</Tag></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 1fr', padding: '16px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, color: '#1f2937' }}>Sân 7 - B2</div>
          <div style={{ color: '#4b5563', fontSize: 14 }}>Kiểm tra hệ thống thoát nước</div>
          <div style={{ color: '#4b5563', fontSize: 14 }}>18/10/2023 (Chiều)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#94a3b8' }} />
            <span style={{ fontSize: 13, color: '#1f2937' }}>Trần Thị Bình</span>
          </div>
          <div style={{ textAlign: 'right' }}><Tag color="blue" style={{ borderRadius: 12, border: 'none', backgroundColor: '#e0e7ff', color: '#4f46e5', fontWeight: 600 }}>ĐÃ LÊN LỊCH</Tag></div>
        </div>
      </div>
    </Card>
  );
};

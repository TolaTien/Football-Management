import React, { useEffect, useState } from 'react';
import { Button, Card, List, Tag, Typography } from 'antd';
import { notificationApi } from '@/shared/api/modules';
import type { Notification } from '@/shared/types/domain';

const UserNotificationsPage: React.FC = () => {
  const [items, setItems] = useState<Notification[]>([]);

  const load = async () => {
    const res = await notificationApi.list();
    setItems(res.data.data.notification);
  };

  useEffect(() => { void load(); }, []);

  return (
    <Card
      title={<Typography.Title level={2}>Thông báo</Typography.Title>}
      extra={<Button onClick={async () => { await notificationApi.markAllRead(); await load(); }}>Đánh dấu tất cả đã đọc</Button>}
    >
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            actions={[!item.isRead && <Button onClick={async () => { await notificationApi.markRead(item.id); await load(); }}>Đã đọc</Button>]}
          >
            <List.Item.Meta title={item.content} description={item.createdAt || ''} />
            <Tag>{item.type}</Tag>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default UserNotificationsPage;

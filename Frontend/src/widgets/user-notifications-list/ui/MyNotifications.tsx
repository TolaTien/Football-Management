import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { Button, Spin, Empty, Segmented, List, Avatar, Pagination, message } from 'antd';
import { 
  fetchNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '@/entities/notification';
import dayjs from 'dayjs';

const MyNotifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.list);
  const notifLoading = useAppSelector((state) => state.notification.loading);
  const pagination = useAppSelector((state) => state.notification.pagination);

  const [notifPage, setNotifPage] = useState(1);
  const [notifStatus, setNotifStatus] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    dispatch(fetchNotifications(notifPage));
  }, [notifPage, dispatch]);

  const handleMarkReadAll = async () => {
    try {
      await dispatch(markAllNotificationsRead()).unwrap();
      message.success('Đã đánh dấu tất cả là đã đọc');
    } catch (err) {
      message.error('Thao tác thất bại');
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (notifStatus === 'unread') return !item.isRead;
    if (notifStatus === 'read') return item.isRead;
    return true;
  });

  return (
    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/20">
        <div>
          <h3 className="text-lg font-semibold text-primary flex items-center gap-2 m-0">
            My Notifications
          </h3>
          <p className="text-xs text-secondary mt-1 m-0 font-body-sm">
            You have <span className="font-bold text-primary">{notifications.filter(n => !n.isRead).length}</span> unread notifications on this page.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Segmented
            value={notifStatus}
            onChange={(val) => {
              setNotifStatus(val as any);
              setNotifPage(1);
            }}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Unread', value: 'unread' },
              { label: 'Read', value: 'read' },
            ]}
          />
          {notifications.length > 0 && notifStatus !== 'read' && (
            <Button size="small" onClick={handleMarkReadAll} className="font-semibold text-xs rounded-lg">Mark all read</Button>
          )}
        </div>
      </div>
      <div className="p-0">
        {notifLoading ? (
          <div className="flex justify-center py-10"><Spin tip="Đang nạp thông báo..." /></div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-10 text-center">
            <Empty description={notifStatus === 'unread' ? "No unread notifications" : notifStatus === 'read' ? "No read notifications" : "No notifications"} />
          </div>
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={filteredNotifications}
              renderItem={(item) => (
                <List.Item 
                  className={`pl-9 pr-6 cursor-pointer transition-colors ${!item.isRead ? 'bg-emerald-50/30' : 'hover:bg-gray-50/50'}`}
                  onClick={() => {
                    if (!item.isRead) {
                      dispatch(markNotificationRead(item.id));
                    }
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        className={item.isRead ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white'}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <span 
                          className="material-symbols-outlined flex items-center justify-center text-xs" 
                          style={{ lineHeight: 1 }}
                        >
                          notifications
                        </span>
                      </Avatar>
                    }
                    title={<span className={item.isRead ? 'font-medium text-secondary' : 'font-bold text-primary text-sm'}>{item.title || (item.type ? item.type.toUpperCase() : 'Notification')}</span>}
                    description={
                      <div>
                        <p className="text-sm text-on-surface mb-1 mt-0.5 leading-normal">{item.content}</p>
                        <span className="text-[10px] text-gray-400 font-medium uppercase">{dayjs(item.createdAt).fromNow()}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            {pagination && pagination.numberPage > 1 && (
              <div className="flex justify-center py-6 border-t border-gray-100">
                <Pagination
                  current={notifPage}
                  pageSize={pagination.perpage}
                  total={pagination.totalRequest}
                  onChange={(p) => setNotifPage(p)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MyNotifications;

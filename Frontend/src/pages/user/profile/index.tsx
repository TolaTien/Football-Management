import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { setCurrentUser } from '@/entities/user/model/userSlice';
import { message, Spin, Empty, Button, Tag, List, Avatar, Modal, Segmented, Pagination } from 'antd';
import { UsersService, BookingHistoryResponse } from '@/entities/user/api/userService';
import { NotificationItem } from '@/entities/notification/api/notificationService';
import { 
  fetchNotifications, 
  markNotificationRead, 
  markAllNotificationsRead,
  addNotification
} from '@/entities/notification/model/notificationSlice';
import { BookingService } from '@/entities/booking/api/bookingService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const UserProfilePage: React.FC = () => {
  const user = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user?.avt || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`,
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'bookings' | 'notifications' | 'security'>('personal');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Booking states
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Notification states
  const notifications = useAppSelector((state) => state.notification.list);
  const notifLoading = useAppSelector((state) => state.notification.loading);
  const pagination = useAppSelector((state) => state.notification.pagination);
  const [notifPage, setNotifPage] = useState(1);
  const [notifStatus, setNotifStatus] = useState<'all' | 'unread' | 'read'>('all');

  const [notifMatch, setNotifMatch] = useState(true);
  const [notifChat, setNotifChat] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      if (user.avt) setAvatarPreview(user.avt);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'notifications') {
      dispatch(fetchNotifications(notifPage));
    }
  }, [activeTab, notifPage, dispatch]);

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await UsersService.getHistoryBooking(1);
      setBookings(res.history);
    } catch (err) {
      message.error('Không thể tải lịch sử đặt sân');
    } finally {
      setBookingsLoading(false);
    }
  };



  const handleCancelBooking = (bookingId: string) => {
    if (!bookingId) {
      message.error('Mã đơn hàng không hợp lệ');
      return;
    }
    
    Modal.confirm({
      title: 'Xác nhận hủy đặt sân',
      content: 'Bạn có chắc chắn muốn hủy yêu cầu đặt sân này không? Hành động này không thể hoàn tác.',
      okText: 'Hủy sân',
      okType: 'danger',
      cancelText: 'Quay lại',
      onOk: async () => {
        try {
          console.log('Cancelling booking:', bookingId);
          const result = await BookingService.cancelBooking(bookingId);
          console.log('Cancel result:', result);
          
          dispatch(addNotification({
            id: `cancel-${Date.now()}`,
            title: 'Hủy đặt sân thành công',
            content: `Yêu cầu hủy đặt sân (Mã đơn: ${bookingId}) đã được xử lý thành công.`,
            type: 'booking'
          }));

          message.success('Đã hủy đặt sân thành công');
          await fetchBookings();
        } catch (err: any) {
          console.error('Cancel booking error:', err);
          const errMsg = err?.response?.data?.message || err?.message || 'Không thể hủy đặt sân';
          message.error(errMsg);
        }
      },
    });
  };

  const handleMarkReadAll = async () => {
    try {
      await dispatch(markAllNotificationsRead()).unwrap();
      message.success('Đã đánh dấu tất cả là đã đọc');
    } catch (err) {
      message.error('Thao tác thất bại');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(
      user?.avt || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`,
    );
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { fullName, email, phone };
      const updatedUser = await UsersService.updateProfileUser(payload, avatarFile || undefined);

      dispatch(setCurrentUser({
        ...user,
        ...updatedUser
      } as any));

      setAvatarFile(null);
      if (updatedUser.avt) setAvatarPreview(updatedUser.avt);
      message.success('Cập nhật thông tin thành công!');
      setIsEditingProfile(false);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { key: 'personal', icon: 'person', label: 'Personal Info' },
    { key: 'bookings', icon: 'calendar_month', label: 'My Bookings' },
    { key: 'notifications', icon: 'notifications', label: 'Notifications' },
    { key: 'security', icon: 'security', label: 'Privacy & Security' },
  ];

  const getStatusTag = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'approved': 
      case 'confirmed':
        return <Tag color="success">Approved</Tag>;
      case 'pending': 
        return <Tag color="warning">Pending</Tag>;
      case 'rejected': 
      case 'cancelled':
        return <Tag color="error">Cancelled</Tag>;
      default: return <Tag color="default">{status || 'Unknown'}</Tag>;
    }
  };

  return (
    <div className="animate-in fade-in duration-300 pb-xl">
      <div className="mb-6">
        <h2 className="font-h1 text-2xl font-bold text-primary">Player Settings</h2>
        <p className="text-secondary text-sm mt-1 font-body-md">
          Manage your personal information and system preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 pb-8">
        {/* Left Tab Navigation */}
        <nav className="md:w-56 flex flex-col gap-1 shrink-0">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                activeTab === item.key
                  ? 'bg-white border-l-4 border-primary text-primary font-bold shadow-sm'
                  : 'text-secondary hover:bg-gray-100'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Content Panel */}
        <div className="flex-1 space-y-6">

          {activeTab === 'personal' && (
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">badge</span>
                  Personal Information
                </h3>
                {!isEditingProfile ? (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full border border-primary hover:bg-emerald-700 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Change Information
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
                    Editing Mode
                  </span>
                )}
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      alt="Profile Avatar"
                      className={`w-24 h-24 rounded-2xl object-cover ring-4 ring-emerald-50 ${!isEditingProfile ? 'opacity-90' : ''}`}
                      src={avatarPreview}
                    />
                    {isEditingProfile && (
                      <>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-base text-on-surface">{user?.fullName || 'Player'}</h4>
                    <p className="text-secondary text-sm">
                      {isEditingProfile ? 'Update your photo and personal details.' : 'Your personal account details.'}
                    </p>
                    {isEditingProfile && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-secondary hover:bg-gray-50 transition-colors"
                          type="button"
                        >
                          Change Photo
                        </button>
                        <button
                          onClick={handleRemoveAvatar}
                          className="px-4 py-1.5 text-sm font-medium text-red-600 hover:text-red-700"
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary">Full Name</label>
                    <input
                      className={`px-4 py-2 rounded-lg border border-gray-200 transition-all text-sm outline-none ${
                        !isEditingProfile ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:border-primary focus:ring-2 focus:ring-primary/10'
                      }`}
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary">Email Address</label>
                    <div className="relative">
                      <input
                        className={`w-full px-4 py-2 rounded-lg border border-gray-200 transition-all text-sm outline-none pr-24 ${
                          !isEditingProfile ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:border-primary focus:ring-2 focus:ring-primary/10'
                        }`}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditingProfile}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary">Phone Number</label>
                    <input
                      className={`px-4 py-2 rounded-lg border border-gray-200 transition-all text-sm outline-none ${
                        !isEditingProfile ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:border-primary focus:ring-2 focus:ring-primary/10'
                      }`}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'bookings' && (
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">history</span>
                  Booking History
                </h3>
                <Button onClick={fetchBookings} size="small" ghost>Refresh</Button>
              </div>
              <div className="p-6">
                {bookingsLoading ? (
                  <div className="flex justify-center py-10"><Spin /></div>
                ) : bookings.length === 0 ? (
                  <Empty description="No bookings found" />
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.bookId} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                            <span className="material-symbols-outlined">sports_soccer</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-emerald-900">{booking.pitch?.namePitch || 'Sân bóng'}</h4>
                            <p className="text-xs text-secondary">
                              {dayjs(booking.startTime).format('DD/MM/YYYY')} • {dayjs(booking.startTime).format('HH:mm')} - {dayjs(booking.endTime).format('HH:mm')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 justify-between sm:justify-end">
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">{Number(booking.total || 0).toLocaleString()} VNĐ</p>
                            {getStatusTag(booking.status)}
                          </div>
                          {booking.status?.toLowerCase() === 'pending' && (
                            <Button 
                              danger 
                              size="small" 
                              onClick={() => handleCancelBooking(booking.bookId)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === 'notifications' && (
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined">notifications_active</span>
                    My Notifications
                  </h3>
                  <p className="text-xs text-secondary mt-1">
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
                    <Button size="small" onClick={handleMarkReadAll}>Mark all read</Button>
                  )}
                </div>
              </div>
              <div className="p-0">
                {notifLoading ? (
                  <div className="flex justify-center py-10"><Spin /></div>
                ) : notifications.filter((item) => {
                    if (notifStatus === 'unread') return !item.isRead;
                    if (notifStatus === 'read') return item.isRead;
                    return true;
                  }).length === 0 ? (
                  <div className="p-10 text-center">
                    <Empty description={notifStatus === 'unread' ? "No unread notifications" : notifStatus === 'read' ? "No read notifications" : "No notifications"} />
                  </div>
                ) : (
                  <>
                    <List
                      itemLayout="horizontal"
                      dataSource={notifications.filter((item) => {
                        if (notifStatus === 'unread') return !item.isRead;
                        if (notifStatus === 'read') return item.isRead;
                        return true;
                      })}
                      renderItem={(item) => (
                        <List.Item 
                          className={`pl-9 pr-6 cursor-pointer transition-colors ${!item.isRead ? 'bg-emerald-50/50' : 'hover:bg-gray-50'}`}
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
                                  className="material-symbols-outlined flex items-center justify-center" 
                                  style={{ fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', lineHeight: 1 }}
                                >
                                  notifications
                                </span>
                              </Avatar>
                            }
                            title={<span className={item.isRead ? 'font-medium text-secondary' : 'font-bold text-primary'}>{item.title || (item.type ? item.type.toUpperCase() : 'Notification')}</span>}
                            description={
                              <div>
                                <p className="text-sm text-on-surface mb-1">{item.content}</p>
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
          )}

          {activeTab === 'security' && (
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">security</span>
                  Privacy & Security
                </h3>
              </div>
              <div className="p-6 space-y-6">
                 <div>
                    <h4 className="text-sm font-bold text-on-surface mb-4">Notification Preferences</h4>
                    <div className="divide-y divide-gray-100">
                      {[
                        { key: 'match', title: 'Match Alerts', desc: 'Get notified about upcoming bookings and matchmaking invites.', value: notifMatch, setter: setNotifMatch },
                        { key: 'chat', title: 'Chat Notifications', desc: 'Receive push alerts for team messages and community chats.', value: notifChat, setter: setNotifChat },
                        { key: 'marketing', title: 'Marketing & News', desc: 'Occasional emails about pitch discounts and facility updates.', value: notifMarketing, setter: setNotifMarketing },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-4">
                          <div>
                            <h4 className="text-sm font-bold text-on-surface">{item.title}</h4>
                            <p className="text-xs text-secondary mt-0.5">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={item.value} onChange={(e) => item.setter(e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                          </label>
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="pt-6 border-t border-gray-100">
                    <p className="text-sm text-secondary">Advanced security settings — coming soon.</p>
                 </div>
              </div>
            </section>
          )}

          {activeTab === 'personal' && isEditingProfile && (
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setFullName(user?.fullName || '');
                  setEmail(user?.email || '');
                  setPhone(user?.phone || '');
                  handleRemoveAvatar();
                  setIsEditingProfile(false);
                }}
                className="px-8 py-2.5 bg-white border border-gray-200 text-primary text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-10 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-lg shadow-emerald-900/20 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                type="button"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

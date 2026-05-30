import React, { useState, useEffect } from 'react';
import { useLocation } from '@umijs/max';
import { PersonalInfo } from '@/features/user-update-profile-info';
import { PrivacySecurity } from '@/features/user-update-profile-security';
import { MyNotifications } from '@/widgets/user-notifications-list';
import { MyBookings } from '@/widgets/user-bookings-list';

const UserProfilePage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryTab = searchParams.get('tab');
  const initialTab = (queryTab && ['personal', 'bookings', 'notifications', 'security'].includes(queryTab))
    ? (queryTab as 'personal' | 'bookings' | 'notifications' | 'security')
    : 'personal';

  const [activeTab, setActiveTab] = useState<'personal' | 'bookings' | 'notifications' | 'security'>(initialTab);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['personal', 'bookings', 'notifications', 'security'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [location.search]);

  const navItems = [
    { key: 'personal', icon: 'person', label: 'Thông tin cá nhân' },
    { key: 'bookings', icon: 'calendar_month', label: 'Lịch đặt của tôi' },
    { key: 'notifications', icon: 'notifications', label: 'Thông báo' },
    { key: 'security', icon: 'security', label: 'Bảo mật & Quyền riêng tư' },
  ];

  return (
    <div className="animate-in fade-in duration-300 pb-xl">
      <div className="mb-6">
        <h2 className="font-h1 text-2xl font-bold text-primary">Thiết lập tài khoản</h2>
        <p className="text-secondary text-sm mt-1 font-body-md">
          Quản lý thông tin cá nhân và thiết lập hệ thống của bạn.
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
          {activeTab === 'personal' && <PersonalInfo />}
          {activeTab === 'bookings' && <MyBookings />}
          {activeTab === 'notifications' && <MyNotifications />}
          {activeTab === 'security' && <PrivacySecurity />}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

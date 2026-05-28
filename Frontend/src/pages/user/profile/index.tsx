import React, { useState } from 'react';
import { PersonalInfo } from '@/features/update-profile-info';
import { PrivacySecurity } from '@/features/update-profile-security';
import { MyNotifications } from '@/widgets/user-notifications-list';
import { MyBookings } from '@/widgets/user-bookings-list';

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'bookings' | 'notifications' | 'security'>('personal');

  const navItems = [
    { key: 'personal', icon: 'person', label: 'Personal Info' },
    { key: 'bookings', icon: 'calendar_month', label: 'My Bookings' },
    { key: 'notifications', icon: 'notifications', label: 'Notifications' },
    { key: 'security', icon: 'security', label: 'Privacy & Security' },
  ];

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

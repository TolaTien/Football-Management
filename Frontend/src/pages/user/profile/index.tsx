import React, { useState, useRef } from 'react';
import { useModel } from '@umijs/max';
import { message } from 'antd';

// Lazy import service để tránh crash nếu có lỗi import
let UsersService: any = null;
try {
  UsersService = require('@/shared/api/users/users.service').UsersService;
} catch (e) {
  console.error('Failed to load UsersService', e);
}

const UserProfilePage: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const user = initialState?.currentUser;

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user?.avt || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`,
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'notifications' | 'security'>('personal');
  const [notifMatch, setNotifMatch] = useState(true);
  const [notifChat, setNotifChat] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!UsersService) {
      message.error('Service chưa sẵn sàng');
      return;
    }
    setLoading(true);
    try {
      const payload = { fullName, email, phone };
      const updatedUser = await UsersService.updateProfileUser(payload, avatarFile || undefined);

      await setInitialState((s: any) => ({
        ...s,
        currentUser: { ...s?.currentUser, ...updatedUser },
      }));

      setAvatarFile(null);
      if (updatedUser.avt) setAvatarPreview(updatedUser.avt);
      message.success('Cập nhật thông tin thành công!');
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { key: 'personal', icon: 'person', label: 'Personal Info' },
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

          {activeTab === 'personal' && (
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">badge</span>
                  Personal Information
                </h3>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                  Profile Verified
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      alt="Profile Avatar"
                      className="w-24 h-24 rounded-2xl object-cover ring-4 ring-emerald-50"
                      src={avatarPreview}
                    />
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
                  </div>
                  <div>
                    <h4 className="font-semibold text-base text-on-surface">{user?.fullName || 'Player'}</h4>
                    <p className="text-secondary text-sm">Update your photo and personal details.</p>
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
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary">Full Name</label>
                    <input
                      className="px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm outline-none"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary">Email Address</label>
                    <div className="relative">
                      <input
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm outline-none pr-24"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                      className="px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm outline-none"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'notifications' && (
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">notifications_active</span>
                  Notification Settings
                </h3>
              </div>
              <div className="p-6 divide-y divide-gray-100">
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
              <div className="p-6">
                <p className="text-sm text-secondary">Privacy & Security settings — coming soon.</p>
              </div>
            </section>
          )}

          {activeTab === 'personal' && (
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setFullName(user?.fullName || '');
                  setEmail(user?.email || '');
                  setPhone(user?.phone || '');
                  handleRemoveAvatar();
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

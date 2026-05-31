import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { setCurrentUser, UsersService } from '@/entities/user';
import { message } from 'antd';

const PersonalInfo: React.FC = () => {
  const user = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();

  // Form local states
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user?.avt || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`,
  );
  
  const [loading, setLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when Redux user changes
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      if (user.avt) setAvatarPreview(user.avt);
    }
  }, [user]);

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

  const handleCancel = () => {
    setFullName(user?.fullName || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    handleRemoveAvatar();
    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
            Thông tin cá nhân
          </h3>
          {!isEditingProfile ? (
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full border border-primary hover:bg-emerald-700 transition-all shadow-sm font-button"
            >
              Thay đổi thông tin
            </button>
          ) : (
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
              Chế độ chỉnh sửa
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
                    className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center w-7 h-7"
                    type="button"
                  >
                    +
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
                    Thay ảnh đại diện
                  </button>
                  <button
                    onClick={handleRemoveAvatar}
                    className="px-4 py-1.5 text-sm font-medium text-red-600 hover:text-red-700"
                    type="button"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-widest text-secondary">Họ và tên</label>
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
              <label className="text-xs font-bold uppercase tracking-widest text-secondary">Địa chỉ Email</label>
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
                  Đã xác thực
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-widest text-secondary">Số điện thoại</label>
              <input
                className={`px-4 py-2 rounded-lg border border-gray-200 transition-all text-sm outline-none ${
                  !isEditingProfile ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:border-primary focus:ring-2 focus:ring-primary/10'
                }`}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Điền số điện thoại của bạn"
                disabled={!isEditingProfile}
              />
            </div>
          </div>
        </div>
      </section>

      {isEditingProfile && (
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-8 py-2.5 bg-white border border-gray-200 text-primary text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all font-button"
            type="button"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-10 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-lg shadow-emerald-900/20 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 font-button"
            type="button"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;

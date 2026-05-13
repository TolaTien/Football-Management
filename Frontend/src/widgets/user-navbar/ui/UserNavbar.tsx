import React from 'react';
import { useModel, useNavigate } from '@umijs/max';
import { AuthService } from '@/shared/api/auth/auth.service';

export const UserNavbar: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const navigate = useNavigate();
  const user = initialState?.currentUser;

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      await setInitialState((s: any) => ({ ...s, currentUser: undefined }));
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="h-16 px-8 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm ml-[260px]">
      <div className="flex items-center gap-md w-1/3">
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" data-icon="search">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-body-md focus:ring-2 focus:ring-primary/10 outline-none" 
            placeholder="Search matches, pitches..." 
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-lg">
        {/* Wallet Balance Mock */}
        <div className="flex items-center gap-sm px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition-colors" onClick={() => navigate('/user/wallet')}>
          <span className="material-symbols-outlined text-emerald-900" data-icon="payments">payments</span>
          <span className="font-button text-emerald-900">$150.00</span>
        </div>

        <div className="flex items-center gap-sm">
          <button className="hover:bg-gray-100 rounded-full p-2 transition-all relative">
            <span className="material-symbols-outlined text-gray-600" data-icon="notifications">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
          
          <button className="hover:bg-gray-100 rounded-full p-2 transition-all">
            <span className="material-symbols-outlined text-gray-600" data-icon="mail">mail</span>
          </button>
          
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          
          {/* User Profile Dropdown (Simplified for now) */}
          <div className="flex items-center gap-3 group relative cursor-pointer">
            <div className="text-right">
              <p className="font-button text-on-surface text-sm leading-none">{user?.fullName || 'Player'}</p>
              <p className="text-[10px] font-label-caps text-gray-500 uppercase">{user?.role || 'USER'}</p>
            </div>
            <img 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover bg-gray-200" 
              src={user?.avt || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user?.email || 'default')}
            />
            
            {/* Simple Hover Dropdown for Logout */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-2">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container rounded-md flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

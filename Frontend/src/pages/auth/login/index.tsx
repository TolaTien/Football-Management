import React, { useState } from 'react';
import { history } from '@umijs/max';
import { authService } from '@/entities/auth/api/authService';

// Test account
const TEST_ACCOUNTS = [
  { email: 'admin@turfmanager.com', password: 'admin123', role: 'admin' },
  { email: 'user@pitchhub.com', password: 'user123', role: 'user' },
  { email: 'test@pitchhub.com', password: '123456', role: 'user' },
];

const PlayerLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // goij api tuw be
      const response = await authService.login({ email, password });
      const loginResult = response.data?.data || response.data;
      const user = loginResult?.user || loginResult; // BE trả về { accessToken, refreshToken, user }

      // luu thong tin user vao localStorage
      localStorage.setItem('pitchhub_user', JSON.stringify({
        email: user.email,
        fullName: user.fullName || user.name,
        role: user.role,
        userId: user.userId || user.id
      }));
      // dieu huong vao vai tro
      if (user.role === 'admin') {
        history.push('/admin/dashboard');
      } else {
        history.push('/user/dashboard');
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      const errMsg = axiosError?.response?.data?.message ?? axiosError?.message ?? 'Đăng nhập thất bại';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="absolute inset-0 pitch-grid pointer-events-none opacity-40"></div>

      <main className="w-full max-w-[440px] px-md relative z-10">

        <div className="flex flex-col items-center mb-xl">
          <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mb-md shadow-lg">
            <span className="material-symbols-outlined text-on-primary-container text-[40px]" data-icon="sports_soccer">sports_soccer</span>
          </div>
          <h1 className="font-h1 text-h1 text-primary">PitchMaster</h1>
          <p className="font-body-md text-secondary mt-xs">Quản lý và đặt sân bóng dễ dàng</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-md">
          <div className="mb-lg">
            <h2 className="font-h2 text-h2 text-on-surface">Chào mừng quay lại</h2>
            <p className="font-body-md text-secondary">Nhập thông tin của bạn để truy cập hệ thống</p>
          </div>

          {/* Demo credentials hint */}
          <div className="mb-lg bg-emerald-50 border border-emerald-200 rounded-lg p-md">
            <p className="text-xs font-label-caps text-emerald-700 mb-xs">TÀI KHOẢN MẪU (TEST)</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-[11px] font-bold text-emerald-800 mb-1">ADMIN (DATABASE CỦA BẠN)</p>
                <p className="text-sm font-body-md text-emerald-900">
                  📧 admin@gmail.com<br />
                  🔑 admin123
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-lg" onSubmit={handleLogin}>
            <div className="space-y-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant block" htmlFor="email">ĐỊA CHỈ EMAIL</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline" data-icon="mail">mail</span>
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg pl-[44px] pr-md py-sm font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none"
                  id="email"
                  name="email"
                  placeholder="admin@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">MẬT KHẨU</label>
                <a className="font-button text-[12px] text-primary hover:underline" href="#">Quên mật khẩu?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline" data-icon="lock">lock</span>
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg pl-[44px] pr-md py-sm font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-error-container border border-error/20 rounded-lg px-md py-sm">
                <p className="text-sm font-body-md text-on-error-container">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-sm">
              <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" id="remember" name="remember" type="checkbox" />
              <label className="font-body-md text-on-surface-variant select-none" htmlFor="remember">Ghi nhớ tài khoản</label>
            </div>

            <button
              className="w-full bg-primary text-white font-button text-button py-md rounded-lg hover:bg-primary-container transition-all active:scale-[0.98] shadow-sm disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-xl">
            <div className="relative flex items-center justify-center mb-lg">
              <div className="border-t border-outline-variant w-full"></div>
              <span className="absolute bg-surface-container-lowest px-md font-label-caps text-label-caps text-outline">HOẶC ĐĂNG NHẬP VỚI</span>
            </div>
            <div className="grid grid-cols-2 gap-md">
              <button className="flex items-center justify-center gap-sm py-sm border border-outline-variant rounded-lg hover:bg-surface transition-colors active:scale-[0.98]">
                <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoJXV-O63DUxDWwnqd_anJsycaA_UCEGrA1ce-pmeLDaML_6u_8rV1wpUGy8hsHS4nQiwMYxDXHUvq3Ad-gw8ZEit2_i8_NA_BfrRKCyxAtn6sA74KG827zdUGnb1T_ZHe_EVbLN9a_8o2v2Or3noFIuYmYzY6EJCy11dws_T_W7djaN40pTSOJZCHT83vST1NEoz814xX75Bhfxj9fc34GD39V4CakM4acrWHO82gf0UtNFuYuSOgugKsTDHu_tnbOm9Jw2paL2k" />
                <span className="font-button text-button text-on-surface">Google</span>
              </button>
              <button className="flex items-center justify-center gap-sm py-sm border border-outline-variant rounded-lg hover:bg-surface transition-colors active:scale-[0.98]">
                <span className="material-symbols-outlined text-[20px]">ios</span>
                <span className="font-button text-button text-on-surface">Apple</span>
              </button>
            </div>
          </div>

          <div className="mt-xl pt-lg border-t border-outline-variant text-center">
            <p className="font-body-md text-secondary">
              Bạn là người chơi mới?{' '}
              <a
                className="text-primary font-bold hover:underline ml-xs cursor-pointer"
                onClick={() => history.push('/auth/signup')}
              >
                Đăng ký ngay
              </a>
            </p>
          </div>

        </div>

      </main>
    </div>
  );
};

export default PlayerLogin;
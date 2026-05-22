import React, { useState } from 'react';
import { useNavigate } from '@umijs/max';
import { AuthService } from '@/features/auth/api/authService';
import { message } from 'antd';
import { useAppDispatch } from '@/app/store/hooks';
import { setCurrentUser } from '@/entities/user/model/userSlice';

const PlayerLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Gọi API đăng nhập
      const res = await AuthService.login({ email, password });
      
      // 2. Lưu User vào Redux State
      dispatch(setCurrentUser(res.data as any));

      message.success('Đăng nhập thành công!');

      // 3. Chuyển hướng theo role
      if (res.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      // 4. Hiển thị lỗi
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
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
          <p className="font-body-md text-secondary mt-xs">Elevate Your Game</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-md">
          <div className="mb-lg">
            <h2 className="font-h2 text-h2 text-on-surface">Welcome Back</h2>
            <p className="font-body-md text-secondary">Enter your credentials to access the portal</p>
          </div>

          <form className="space-y-lg" onSubmit={handleLogin}>
            <div className="space-y-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant block" htmlFor="email">EMAIL ADDRESS</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline" data-icon="mail">mail</span>
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg pl-[44px] pr-md py-sm font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none"
                  id="email"
                  name="email"
                  placeholder="player@pitchmaster.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">PASSWORD</label>
                <a className="font-button text-[12px] text-primary hover:underline" href="#">Forgot password?</a>
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
              <label className="font-body-md text-on-surface-variant select-none" htmlFor="remember">Remember me</label>
            </div>

            <button
              className="w-full bg-primary text-white font-button text-button py-md rounded-lg hover:bg-primary-container transition-all active:scale-[0.98] shadow-sm flex justify-center items-center gap-2 disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Logging in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>

            <div className="text-center mt-md">
              <p className="text-secondary font-body-md">
                New player on the field?{' '}
                <a className="text-primary font-bold hover:underline cursor-pointer" onClick={(e) => { e.preventDefault(); navigate('/auth/signup'); }}>Sign Up Now</a>
              </p>
            </div>
          </form>

          <div className="mt-xl">
            <div className="relative flex items-center justify-center mb-lg">
              <div className="border-t border-outline-variant w-full"></div>
              <span className="absolute bg-surface-container-lowest px-md font-label-caps text-label-caps text-outline">OR CONTINUE WITH</span>
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
        </div>

      </main>
    </div>
  );
};

export default PlayerLogin;

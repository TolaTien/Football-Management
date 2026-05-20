import React, { useState } from 'react';
import { history } from '@umijs/max';
import api from '@/services/api';
import { message } from 'antd';

const PlayerSignUp: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!terms) {
      setError('Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        email,
        password,
        fullName,
        phone,
      });

      message.success('Đăng ký tài khoản thành công!');
      history.push('/auth/login');
    } catch (err: any) {
      console.error('Lỗi đăng ký:', err);
      const errMsg = err.response?.data?.message || 'Đăng ký thất bại, vui lòng kiểm tra lại thông tin.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-xl relative">
      <div className="fixed inset-0 pitch-grid-bg opacity-30 pointer-events-none z-0"></div>
      
      <main className="relative z-10 w-full max-w-[540px] px-md">
        <div className="text-center mb-xl">
          <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mx-auto mb-md shadow-lg">
            <span className="material-symbols-outlined text-on-primary-container text-[40px]">sports_soccer</span>
          </div>
          <h1 className="font-h1 text-h1 text-primary mb-xs">PitchMaster</h1>
          <p className="font-body-lg text-body-lg text-secondary">Đặt sân bóng nhanh chóng và chính xác.</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="h-1 bg-primary w-full"></div>
          <div className="p-lg md:p-xl">
            <div className="mb-lg">
              <h2 className="font-h2 text-h2 text-primary">Tạo hồ sơ người chơi của bạn</h2>
              <p className="text-secondary font-body-md mt-xs">Tham gia cùng hàng ngàn cầu thủ và bắt đầu đặt sân ngay hôm nay.</p>
            </div>

            <form className="space-y-lg" onSubmit={handleSignUp}>
              {error && (
                <div className="bg-error-container border border-error/20 rounded-lg px-md py-sm">
                  <p className="text-sm font-body-md text-on-error-container">{error}</p>
                </div>
              )}

              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="full_name">Họ và tên</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">person</span>
                  <input 
                    className="w-full pl-[48px] pr-md py-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all font-body-md" 
                    id="full_name" 
                    name="full_name" 
                    placeholder="Nguyễn Văn A" 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">Địa chỉ Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">mail</span>
                    <input 
                      className="w-full pl-[48px] pr-md py-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all font-body-md" 
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
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="phone">Số điện thoại</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">phone_android</span>
                    <input 
                      className="w-full pl-[48px] pr-md py-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all font-body-md" 
                      id="phone" 
                      name="phone" 
                      placeholder="0987654321" 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">Mật khẩu</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">lock</span>
                  <input 
                    className="w-full pl-[48px] pr-md py-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all font-body-md" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <p className="text-[11px] text-outline italic">Mật khẩu phải có ít nhất 6 ký tự.</p>
              </div>

              <div className="flex items-start gap-sm py-sm">
                <input 
                  className="mt-xs h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" 
                  id="terms" 
                  name="terms" 
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <label className="text-body-md text-secondary leading-tight cursor-pointer" htmlFor="terms">
                  Tôi đồng ý với <a className="text-primary font-semibold hover:underline" href="#">Điều khoản dịch vụ</a> và{' '}
                  <a className="text-primary font-semibold hover:underline" href="#">Chính sách bảo mật</a>. Tôi đồng ý dữ liệu của mình được sử dụng để quản lý đặt sân.
                </label>
              </div>

              <button 
                className="w-full bg-primary text-white font-button text-button py-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-sm disabled:opacity-60" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            <div className="mt-xl pt-lg border-t border-outline-variant text-center">
              <p className="text-secondary font-body-md">
                Đã có tài khoản PitchMaster?{' '}
                <a 
                  className="text-primary font-bold ml-xs hover:underline cursor-pointer" 
                  onClick={() => history.push('/auth/login')}
                >
                  Đăng nhập tại đây
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayerSignUp;

import React, { useState } from 'react';
import { useNavigate, useModel } from '@umijs/max';
import { AuthService } from '../../../shared/api/auth/auth.service';
import { message } from 'antd';

const PlayerSignUp: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setInitialState } = useModel('@@initialState');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!terms) {
      setError('Vui lòng đồng ý với Điều khoản và Chính sách bảo mật.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);

    try {
      // 1. Gọi API đăng ký
      const res = await AuthService.register({
        fullName,
        email,
        phone,
        password,
      });

      // 2. Backend của bạn tự set HttpOnly cookie sau khi đăng ký thành công.
      // Cập nhật thông tin vào Global state để chuyển sang trạng thái đã đăng nhập.
      await setInitialState((s: any) => ({ 
        ...s, 
        currentUser: res.data 
      }));

      message.success('Tạo tài khoản thành công!');
      
      // 3. Chuyển hướng người dùng vào Dashboard
      navigate('/user/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Email hoặc số điện thoại có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pitch-grid-bg opacity-30 pointer-events-none z-0"></div>
      <main className="relative z-10 w-full max-w-[540px] mx-auto py-xl">
        <div className="text-center mb-xl">
          <h1 className="font-h1 text-h1 text-primary mb-xs">PitchMaster</h1>
          <p className="font-body-lg text-body-lg text-secondary">Precision booking for the beautiful game.</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="h-1 bg-primary w-full"></div>
          <div className="p-lg md:p-xl">
            <div className="mb-lg">
              <h2 className="font-h2 text-h2 text-primary">Create Your Player Profile</h2>
              <p className="text-secondary font-body-md mt-xs">Step onto the field. Join thousands of local players.</p>
            </div>
            
            <form className="space-y-lg" onSubmit={handleRegister}>
              <div className="flex items-center gap-sm mb-lg">
                <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
                <div className="h-1.5 flex-1 bg-secondary-container rounded-full"></div>
                <div className="h-1.5 flex-1 bg-secondary-container rounded-full"></div>
              </div>

              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="full_name">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">person</span>
                  <input 
                    className="w-full pl-[48px] pr-md py-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all font-body-md" 
                    id="full_name" 
                    name="full_name" 
                    placeholder="Cristiano Ronaldo" 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">Email Address</label>
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
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="phone">Phone Number</label>
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
                <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">Password</label>
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
                <p className="text-[11px] text-outline italic">Must be at least 6 characters.</p>
              </div>

              {error && (
                <div className="bg-error-container border border-error/20 rounded-lg px-md py-sm">
                  <p className="text-sm font-body-md text-on-error-container">{error}</p>
                </div>
              )}

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
                  I agree to the <a className="text-primary font-semibold hover:underline" href="#">Terms of Service</a> and 
                  <a className="text-primary font-semibold hover:underline" href="#">Privacy Policy</a>. I understand my data will be used to manage bookings.
                </label>
              </div>

              <button 
                className="w-full bg-primary text-on-primary font-button text-button py-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-sm disabled:opacity-60" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>

              <div className="text-center mt-md">
                <p className="text-secondary font-body-md">
                  Already have a PitchMaster account?{' '}
                  <a className="text-primary font-bold hover:underline cursor-pointer" onClick={(e) => { e.preventDefault(); navigate('/auth/login'); }}>Login here</a>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-lg flex flex-col md:flex-row items-center justify-between gap-md px-md opacity-70">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span>
            <span className="font-label-caps text-label-caps">Secure Player Data</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>sports_soccer</span>
            <span className="font-label-caps text-label-caps">2,500+ Active Pitches</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>bolt</span>
            <span className="font-label-caps text-label-caps">Instant Booking</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-lg right-lg hidden xl:block z-0">
        <div className="bg-surface-container-high p-lg rounded-xl border border-outline-variant max-w-[280px] shadow-sm">
          <div className="flex items-center gap-md mb-md">
            <img alt="Recent Player" className="w-12 h-12 rounded-full object-cover border-2 border-primary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvWIylF8Uue7RHzcgh4OxSWrzF8TUFPdyZPaR_ZSbLtlU1ClqQQGcIq5Szo0szNVX61VuQ3FZChoWzNnnzEl7Sjit5T4tRRlkhhbJDIsbbHEpvEPqNZNwI3wodLgc_AnZFOrIIruJnqXvLjF1XOAKxn5LO4StWSvbzN6UK0XhtKEm9aZUDzuMKuikAIJ_9HPDi2_efSbHLd288h0abG8bFtynyCW65xW2y0OLHWsNndH-_cBVU0MnBsoD3TyI2HFtijg8uOh78ews"/>
            <div>
              <p className="font-button text-primary">Marcus J.</p>
              <p className="text-[12px] text-secondary">Joined 2 mins ago</p>
            </div>
          </div>
          <p className="text-body-md text-on-surface-variant italic">"Found a local 5-a-side match within minutes. The best pitch management platform I've used."</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerSignUp;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@umijs/max';
import { AuthService } from '@/features/auth/api/authService';
import { message } from 'antd';
import { useAppDispatch } from '@/app/store/hooks';
import { setCurrentUser } from '@/entities/user';

const testimonials = [
  {
    quote: "Đặt sân cực nhanh và tiện lợi. Hệ thống tìm đối và ghép kèo rất hay, giúp đội mình luôn có trận hàng tuần.",
    author: "Khổng Anh Duy",
    role: "Đội trưởng FC Phú Thọ"
  },
  {
    quote: "Giao diện hiện đại, đặt sân trực quan, thanh toán nhanh chóng và cực kỳ minh bạch. Rất đề xuất!",
    author: "Lê Văn Tiến",
    role: "Thành viên FC Nam Định"
  },
  {
    quote: "Quản lý lịch sân dễ dàng, dịch vụ tuyệt vời. Đây là ứng dụng đặt sân bóng tốt nhất tôi từng sử dụng.",
    author: "Tiến Đạt",
    role: "Thành viên FC Hải Phòng"
  },
  {
    quote: "Tôi yêu người tạo ra sản phẩm này",
    author: "Quốc Huy",
    role: "Thành viên dự bị cho FC D24"
  }
];

const PlayerAuth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Trạng thái hiển thị form đăng ký hay đăng nhập nội bộ (tránh unmount từ Router)
  const [activeMode, setActiveMode] = useState<'login' | 'signup'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === '/auth/signup' ? 'signup' : 'login';
    }
    return 'login';
  });

  // Theo dõi nút Back/Forward của trình duyệt để tự động trượt
  useEffect(() => {
    const handlePopState = () => {
      const mode = window.location.pathname === '/auth/signup' ? 'signup' : 'login';
      setActiveMode(mode);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Hàm chuyển đổi form bằng hiệu ứng trượt ngang và thay URL âm thầm (pushState)
  const handleModeChange = (targetMode: 'login' | 'signup') => {
    setActiveMode(targetMode);
    const path = targetMode === 'signup' ? '/auth/signup' : '/auth/login';
    window.history.pushState(null, '', path);
  };

  // --- TRẠNG THÁI FORM ĐĂNG NHẬP ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // --- TRẠNG THÁI FORM ĐĂNG KÝ ---
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpShowPassword, setSignUpShowPassword] = useState(false);
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpShowConfirmPassword, setSignUpShowPasswordConfirm] = useState(false);
  const [signUpTerms, setSignUpTerms] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);

  // --- AUTO SLIDER TESTIMONIAL ---
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // --- HÀNH ĐỘNG ĐĂNG NHẬP ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await AuthService.login({ email: loginEmail, password: loginPassword });
      const user = res.data?.user;
      const accessToken = res.data?.accessToken;

      if (!user) {
        throw new Error('Không lấy được thông tin người dùng.');
      }

      localStorage.setItem('pitchhub_user', JSON.stringify(user));
      if (accessToken) {
        localStorage.setItem('pitchhub_token', accessToken);
      }
      dispatch(setCurrentUser(user));
      message.success('Đăng nhập thành công!');

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      setLoginError(err.response?.data?.message || err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoginLoading(false);
    }
  };

  // --- HÀNH ĐỘNG ĐĂNG KÝ ---
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');

    if (!signUpTerms) {
      setSignUpError('Vui lòng đồng ý với Điều khoản và Chính sách bảo mật.');
      return;
    }
    if (signUpPassword.length < 6) {
      setSignUpError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setSignUpLoading(true);
    try {
      const res = await AuthService.register({
        fullName: signUpFullName,
        email: signUpEmail,
        phone: signUpPhone,
        password: signUpPassword,
      });

      const user = res.data?.user || res.data?.newUser;
      const accessToken = res.data?.accessToken;

      if (!user) {
        throw new Error('Không lấy được thông tin người dùng.');
      }

      localStorage.setItem('pitchhub_user', JSON.stringify(user));
      if (accessToken) {
        localStorage.setItem('pitchhub_token', accessToken);
      }
      dispatch(setCurrentUser(user));
      message.success('Tạo tài khoản thành công!');
      navigate('/user/dashboard');
    } catch (err: any) {
      setSignUpError(err.response?.data?.message || 'Đăng ký thất bại. Email hoặc số điện thoại có thể đã tồn tại.');
    } finally {
      setSignUpLoading(false);
    }
  };

  // LOGIC ĐO ĐỘ MẠNH MẬT KHẨU
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: 'Chưa nhập', color: 'bg-slate-200', width: 'w-0 text-slate-400' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1:
        return { score, text: 'Yếu', color: 'bg-red-500', width: 'w-1/4' };
      case 2:
        return { score, text: 'Trung bình', color: 'bg-orange-500', width: 'w-2/4' };
      case 3:
        return { score, text: 'Mạnh', color: 'bg-blue-500', width: 'w-3/4' };
      case 4:
        return { score, text: 'Rất mạnh', color: 'bg-emerald-500', width: 'w-full' };
      default:
        return { score: 0, text: 'Quá ngắn', color: 'bg-red-400', width: 'w-1/12' };
    }
  };

  const strength = getPasswordStrength(signUpPassword);

  return (
    <div className="min-h-screen bg-slate-50 flex font-body-md text-slate-800 overflow-x-hidden">
      {/* CỘT TRÁI: PANEL THƯƠNG HIỆU (Chạy liên tục, không bị render lại) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-950 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Stadium light aura / Glow effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-400/5 blur-[120px] pointer-events-none"></div>
        
        {/* Soft grid soccer pitch line overlay */}
        <div className="absolute inset-0 opacity-[0.04] pitch-grid pointer-events-none"></div>
        
        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-md">
            <span className="material-symbols-outlined text-emerald-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
          </div>
          <div>
            <h1 className="font-h1 text-2xl font-bold tracking-tight text-white m-0">PitchMaster</h1>
            <p className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase m-0">Hệ sinh thái đặt sân đỉnh cao</p>
          </div>
        </div>

        {/* Brand Core Value Info Card (Glassmorphic) */}
        <div className="relative z-10 my-auto max-w-md">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
            <h2 className="font-h2 text-xl font-semibold mb-6 text-white tracking-wide">
              Trải nghiệm đặt sân thông minh
            </h2>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-emerald-400 text-lg">verified</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-100">50+ Sân bóng hoạt động</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Đặt sân nhanh chóng trên địa bàn Hà Nội và TP. Hồ Chí Minh.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-emerald-400 text-lg">bolt</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-100">Đặt sân tức thì trong 30 giây</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Tra cứu lịch trống thời gian thực và đặt sân không cần qua trung gian.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-emerald-400 text-lg">groups</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-100">Tìm đối & Ghép kèo dễ dàng</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Kết nối với cộng đồng 15.000+ cầu thủ phủi chất lượng cao.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Auto Carousel */}
        <div className="relative z-10 h-24 flex flex-col justify-end">
          <div className="transition-all duration-500 ease-in-out">
            <p className="text-sm italic text-slate-200 font-light leading-relaxed">
              "{testimonials[testimonialIndex].quote}"
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <p className="text-xs text-emerald-400 font-semibold m-0">
                {testimonials[testimonialIndex].author}
              </p>
              <span className="text-[10px] text-slate-400">— {testimonials[testimonialIndex].role}</span>
            </div>
          </div>
          {/* Slide Indicator dots */}
          <div className="flex gap-1.5 mt-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === testimonialIndex ? 'w-4 bg-emerald-400' : 'w-1 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: FORM CONTAINER (Hỗ trợ trượt ngang) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative overflow-hidden">
        {/* Nút chuyển đổi nhanh góc trên bên phải */}
        <div className="absolute top-10 right-10 z-20">
          <p className="text-xs text-slate-500 m-0">
            {activeMode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            <button
              onClick={() => handleModeChange(activeMode === 'login' ? 'signup' : 'login')}
              className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors ml-1 focus:outline-none cursor-pointer"
            >
              {activeMode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
            </button>
          </p>
        </div>

        {/* Viewport Mask wrapper to prevent flex centering misalignment of 200% width track */}
        <div className="w-full overflow-hidden relative">
          {/* Sliding Track: w-[200%] chứa cả form Đăng nhập và Đăng ký side-by-side */}
          <div 
            className="w-[200%] flex shrink-0 transition-transform duration-500 ease-in-out transform"
            style={{ transform: activeMode === 'login' ? 'translateX(0%)' : 'translateX(-50%)' }}
          >
            {/* NỬA TRÁI (COLUMN 1): FORM ĐĂNG NHẬP (Sign In) */}
            <div className="w-1/2 shrink-0 flex flex-col items-center px-4 md:px-8">
            <div className="w-full max-w-[420px]">
              {/* Logo hiển thị trên Mobile */}
              <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
                </div>
                <h1 className="font-h1 text-xl font-bold tracking-tight text-slate-900 m-0">PitchMaster</h1>
              </div>

              <div className="mb-8 text-center lg:text-left">
                <h2 className="font-h2 text-2xl font-bold text-slate-900 tracking-tight">Chào mừng quay lại</h2>
                <p className="text-sm text-slate-500 mt-1">Đăng nhập tài khoản để đặt sân và kết nối với đối thủ.</p>
              </div>

              <form className="space-y-5" onSubmit={handleLoginSubmit}>
                {/* Email đăng nhập */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase block" htmlFor="login-email">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                    <input
                      className="w-full bg-slate-100/70 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-sm"
                      id="login-email"
                      placeholder="name@example.com"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Mật khẩu đăng nhập */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase" htmlFor="login-password">
                      Mật khẩu
                    </label>
                    <a className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors" href="#">
                      Quên mật khẩu?
                    </a>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                    <input
                      className="w-full bg-slate-100/70 border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-sm"
                      id="login-password"
                      placeholder="••••••••"
                      type={loginShowPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setLoginShowPassword(!loginShowPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {loginShowPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Báo lỗi đăng nhập */}
                {loginError && (
                  <div className="bg-red-50 border border-red-200/50 rounded-xl px-4 py-3 flex items-start gap-2.5 animate-fadeIn">
                    <span className="material-symbols-outlined text-red-500 text-lg shrink-0">error</span>
                    <p className="text-xs text-red-600 leading-normal m-0">{loginError}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    className="w-4.5 h-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer"
                    id="remember"
                    type="checkbox"
                  />
                  <label className="text-xs text-slate-500 select-none cursor-pointer" htmlFor="remember">
                    Ghi nhớ tài khoản trên thiết bị này
                  </label>
                </div>

                <button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-600/10 active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-60 disabled:pointer-events-none text-sm cursor-pointer"
                  type="submit"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Đăng nhập vào hệ thống
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Ngăn cách đăng nhập MXH */}
              <div className="mt-8">
                <div className="relative flex items-center justify-center mb-6">
                  <div className="border-t border-slate-200 w-full"></div>
                  <span className="absolute bg-white px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Hoặc kết nối qua
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 active:scale-[0.98] cursor-pointer focus:outline-none">
                    <img alt="Google" className="w-4 h-4 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoJXV-O63DUxDWwnqd_anJsycaA_UCEGrA1ce-pmeLDaML_6u_8rV1wpUGy8hsHS4nQiwMYxDXHUvq3Ad-gw8ZEit2_i8_NA_BfrRKCyxAtn6sA74KG827zdUGnb1T_ZHe_EVbLN9a_8o2v2Or3noFIuYmYzY6EJCy11dws_T_W7djaN40pTSOJZCHT83vST1NEoz814xX75Bhfxj9fc34GD39V4CakM4acrWHO82gf0UtNFuYuSOgugKsTDHu_tnbOm9Jw2paL2k" />
                    <span className="text-xs font-semibold text-slate-700">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 active:scale-[0.98] cursor-pointer focus:outline-none">
                    <span className="material-symbols-outlined text-[16px] text-slate-800">ios</span>
                    <span className="text-xs font-semibold text-slate-700">Apple ID</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* NỬA PHẢI (COLUMN 2): FORM ĐĂNG KÝ (Sign Up) */}
          <div className="w-1/2 shrink-0 flex flex-col items-center px-4 md:px-8">
            <div className="w-full max-w-[440px]">
              {/* Logo hiển thị trên Mobile */}
              <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
                </div>
                <h1 className="font-h1 text-xl font-bold tracking-tight text-slate-900 m-0">PitchMaster</h1>
              </div>

              <div className="mb-6 text-center lg:text-left">
                <h2 className="font-h2 text-2xl font-bold text-slate-900 tracking-tight">Đăng ký tài khoản mới</h2>
                <p className="text-sm text-slate-500 mt-1">Gia nhập cộng đồng phủi, kiến tạo những trận cầu đỉnh cao.</p>
              </div>

              <form className="space-y-3.5" onSubmit={handleRegisterSubmit}>
                {/* Họ và Tên */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase block" htmlFor="signup-name">
                    Họ và Tên
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                    <input
                      className="w-full bg-slate-100/70 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-sm"
                      id="signup-name"
                      placeholder="Nguyễn Văn A"
                      type="text"
                      value={signUpFullName}
                      onChange={(e) => setSignUpFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase block" htmlFor="signup-email">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                    <input
                      className="w-full bg-slate-100/70 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-sm"
                      id="signup-email"
                      placeholder="name@example.com"
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase block" htmlFor="signup-phone">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">phone_android</span>
                    <input
                      className="w-full bg-slate-100/70 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-sm"
                      id="signup-phone"
                      placeholder="0987654321"
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Mật khẩu đăng ký */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase block" htmlFor="signup-password">
                    Mật khẩu bảo mật
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                    <input
                      className="w-full bg-slate-100/70 border border-slate-200 rounded-xl pl-11 pr-11 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-sm"
                      id="signup-password"
                      placeholder="••••••••"
                      type={signUpShowPassword ? 'text' : 'password'}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSignUpShowPassword(!signUpShowPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {signUpShowPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {signUpPassword && (
                    <div className="space-y-1 mt-1.5 animate-fadeIn">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Độ mạnh mật khẩu:</span>
                        <span className={`font-bold transition-all duration-300 ${
                          strength.score <= 1 ? 'text-red-500' :
                          strength.score === 2 ? 'text-orange-500' :
                          strength.score === 3 ? 'text-blue-500' : 'text-emerald-600'
                        }`}>{strength.text}</span>
                      </div>
                      <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} ${strength.width} transition-all duration-500`}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase block" htmlFor="signup-confirm-password">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                    <input
                      className="w-full bg-slate-100/70 border border-slate-200 rounded-xl pl-11 pr-11 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-sm"
                      id="signup-confirm-password"
                      placeholder="••••••••"
                      type={signUpShowConfirmPassword ? 'text' : 'password'}
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSignUpShowPasswordConfirm(!signUpShowConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {signUpShowConfirmPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Báo lỗi đăng ký */}
                {signUpError && (
                  <div className="bg-red-50 border border-red-200/50 rounded-xl px-4 py-2.5 flex items-start gap-2.5 animate-fadeIn">
                    <span className="material-symbols-outlined text-red-500 text-lg shrink-0">error</span>
                    <p className="text-xs text-red-600 leading-normal m-0">{signUpError}</p>
                  </div>
                )}

                {/* Đồng ý điều khoản */}
                <div className="flex items-start gap-2 py-0.5">
                  <input
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer"
                    id="terms"
                    type="checkbox"
                    checked={signUpTerms}
                    onChange={(e) => setSignUpTerms(e.target.checked)}
                  />
                  <label className="text-[11px] text-slate-500 leading-tight select-none cursor-pointer" htmlFor="terms">
                    Tôi đồng ý với <a className="text-emerald-600 font-bold hover:underline" href="#">Điều khoản sử dụng</a> và{' '}
                    <a className="text-emerald-600 font-bold hover:underline" href="#">Chính sách bảo mật</a> của PitchMaster.
                  </label>
                </div>

                {/* Nút Tạo Tài Khoản */}
                <button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-600/10 active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-60 disabled:pointer-events-none text-sm cursor-pointer"
                  type="submit"
                  disabled={signUpLoading}
                >
                  {signUpLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                      Đang đăng ký...
                    </>
                  ) : (
                    <>
                      Tạo tài khoản cầu thủ
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PlayerAuth;

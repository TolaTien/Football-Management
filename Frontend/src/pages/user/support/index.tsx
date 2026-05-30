import React, { useState } from 'react';
import { Form, Input, Select, Button, message, Card } from 'antd';

interface FAQItem {
  id: string;
  category: 'booking' | 'account' | 'matchmaking' | 'other';
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'booking',
    question: 'Làm thế nào để hủy lịch đặt sân và nhận lại tiền cọc?',
    answer: 'Bạn có thể hủy lịch đặt sân trực tiếp trong phần "Lịch đặt của tôi" tại giao diện cá nhân. Nếu thao tác hủy được thực hiện trước giờ bắt đầu trận đấu tối thiểu 24 giờ, hệ thống sẽ tự động hoàn trả 100% số tiền cọc đã đóng vào Ví Số Dư của bạn. Các trường hợp hủy dưới 24 giờ sẽ không được hoàn cọc để bù đắp chi phí giữ sân.'
  },
  {
    id: 'faq-2',
    category: 'booking',
    question: 'Tôi có thể thanh toán tiền thuê sân qua những hình thức nào?',
    answer: 'Hệ thống PitchHub hỗ trợ đa dạng phương thức thanh toán trực tuyến bao gồm: chuyển khoản ngân hàng quét mã QR qua cổng VNPay/Momo, sử dụng Ví Số Dư tài khoản trực tiếp hoặc thanh toán số tiền còn lại bằng tiền mặt/thẻ POS tại quầy lễ tân trung tâm khi check-in.'
  },
  {
    id: 'faq-3',
    category: 'account',
    question: 'Làm thế nào để đổi mật khẩu và bảo mật thông tin tài khoản?',
    answer: 'Bạn truy cập mục "Thiết lập" ở góc dưới thanh điều hướng, chọn phần "Thông tin cá nhân" hoặc tab "Bảo mật & Quyền riêng tư". Tại đây, bạn có thể chỉnh sửa số điện thoại, cập nhật ảnh đại diện hoặc thay đổi mật khẩu đăng nhập để bảo mật tối đa cho tài khoản của mình.'
  },
  {
    id: 'faq-4',
    category: 'booking',
    question: 'Sân bóng quy định sử dụng loại giày thi đấu nào?',
    answer: 'Để bảo vệ mặt sân cỏ nhân tạo và tránh chấn thương, người chơi chỉ được sử dụng giày đế đinh dăm cao su (TF) hoặc đinh tròn nhựa ngắn (AG) chuyên nghiệp. Nghiêm cấm hoàn toàn các loại giày đinh sắt (SG), đinh dài (FG) chuyên dụng cho sân cỏ tự nhiên hoặc giày bata/giày chạy bộ đế phẳng dễ trơn trượt.'
  },
  {
    id: 'faq-5',
    category: 'matchmaking',
    question: 'Đội bóng đối thủ hoặc đồng đội cáp kèo trễ hẹn thì xử lý ra sao?',
    answer: 'Theo quy định cáp kèo, các đội tham gia cần có mặt trước giờ thi đấu tối thiểu 15 phút. Nếu trễ hẹn quá 15 phút mà không thông báo trước qua kênh trò chuyện hoặc hotline, hệ thống sẽ ghi nhận là tự ý hủy kèo. Đội trễ hẹn sẽ bị trừ điểm uy tín cá nhân và chịu trách nhiệm thanh toán phần chi phí bãi sân đã giao kèo.'
  },
  {
    id: 'faq-6',
    category: 'matchmaking',
    question: 'Làm thế nào để chia sẻ chi phí thuê sân công bằng khi cáp kèo?',
    answer: 'Khi tạo bài đăng cáp kèo trên bảng tin hoặc ghép đội nhanh, người tạo bài đăng cần điền chi tiết tỷ lệ chia sẻ chi phí (ví dụ: Chia đôi 50/50, đội thua trả toàn bộ, hoặc giao lưu miễn phí). Sau trận đấu, hai đội xác nhận thỏa thuận và thanh toán tại quầy lễ tân hoặc chuyển khoản trực tiếp dựa trên nội dung ban đầu.'
  },
  {
    id: 'faq-7',
    category: 'other',
    question: 'Tôi bị thất lạc tài sản hoặc đồ đạc cá nhân thì báo cho ai?',
    answer: 'Tổ hợp sân bóng PitchHub trang bị camera an ninh 24/7 tại toàn bộ các sân thi đấu và bãi đỗ xe. Nếu nghi ngờ bỏ quên hoặc mất đồ, vui lòng liên hệ ngay với Quầy lễ tân hoặc liên hệ Hotline hỗ trợ khẩn cấp 1900 8888 để được hỗ trợ trích xuất camera giám sát và định vị tư trang.'
  }
];

const CATEGORIES = [
  { key: 'all', label: 'Tất cả trợ giúp', icon: 'explore' },
  { key: 'booking', label: 'Đặt sân & Thanh toán', icon: 'payment' },
  { key: 'account', label: 'Tài khoản & Bảo mật', icon: 'lock' },
  { key: 'matchmaking', label: 'Cáp kèo & Ghép đội', icon: 'sports_soccer' },
  { key: 'other', label: 'Vấn đề khác', icon: 'report_problem' }
];

export const SupportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleToggleFaq = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setExpandedFaqId(null);
  };

  const handleFormSubmit = (values: any) => {
    console.log('Support Ticket Submitted:', values);
    message.success('Gửi yêu cầu hỗ trợ thành công. Ban quản lý sẽ phản hồi cho bạn qua điện thoại hoặc email sớm nhất.');
    form.resetFields();
  };

  // Lọc danh sách FAQ dựa trên từ khóa tìm kiếm và danh mục được chọn
  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-in fade-in duration-300 pb-xl space-y-xl max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 to-[#064e3b] text-white p-8 md:p-12 shadow-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-white/5 to-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/15">
            Trung tâm trợ giúp PitchHub
          </span>
          <h2 className="font-h1 text-3xl md:text-4xl text-white mt-4 mb-2 leading-tight">
            Chúng tôi có thể giúp gì cho bạn?
          </h2>
          <p className="text-emerald-100/90 text-sm font-body-md mb-8 leading-relaxed">
            Tìm kiếm câu trả lời nhanh chóng cho các câu hỏi thường gặp hoặc gửi trực tiếp yêu cầu hỗ trợ đến ban quản lý sân bóng.
          </p>

          {/* Search bar */}
          <div className="flex items-center bg-white rounded-xl shadow-lg p-1.5 w-full border border-emerald-100/20 max-w-lg">
            <span className="material-symbols-outlined text-gray-400 px-3 text-[20px]">search</span>
            <input
              type="text"
              placeholder="Nhập từ khóa cần tìm kiếm trợ giúp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-0 outline-none text-gray-800 text-sm py-2 placeholder-gray-400 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600 px-2 flex items-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Category Selection Cards */}
      <section className="space-y-md">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="font-h2 text-lg text-emerald-950 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">apps</span>
            Danh mục hỗ trợ
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-md">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className={`flex flex-col items-center justify-center p-5 rounded-xl border text-center transition-all group ${
                  isActive
                    ? 'bg-primary-container/20 border-primary text-primary font-bold shadow-sm'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-primary hover:text-primary'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-2xl mb-2 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
                  }`}
                >
                  {cat.icon}
                </span>
                <span className="text-xs leading-snug font-semibold">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Main Grid layout: FAQ & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel (FAQ Accordion) */}
        <section className="lg:col-span-7 space-y-md">
          <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
            <h3 className="font-h2 text-lg text-emerald-950 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">help</span>
              Câu hỏi thường gặp ({filteredFaqs.length})
            </h3>
            {searchTerm || selectedCategory !== 'all' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Xóa bộ lọc
              </button>
            ) : null}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200/80 p-12 text-center shadow-sm">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">search_off</span>
              <p className="text-gray-500 text-sm font-medium">
                Không tìm thấy câu trả lời trợ giúp phù hợp với từ khóa của bạn.
              </p>
              <p className="text-xs text-gray-400">Bạn có thể gửi phản hồi trực tiếp cho ban quản lý ở biểu mẫu bên cạnh.</p>
            </div>
          ) : (
            <div className="space-y-sm">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-sm hover:border-primary/40 transition-colors"
                  >
                    <button
                      onClick={() => handleToggleFaq(faq.id)}
                      className="w-full flex justify-between items-center p-5 text-left font-bold text-gray-800 text-sm hover:text-primary transition-colors cursor-pointer"
                    >
                      <span className="pr-4 leading-snug">{faq.question}</span>
                      <span
                        className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180 text-primary' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {/* Smooth expanding content using CSS grid transition */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out border-gray-100 ${
                        isExpanded ? 'grid-rows-[1fr] opacity-100 border-t' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="p-5 bg-gray-50/50 text-xs md:text-sm font-medium text-gray-600 leading-relaxed font-body-md">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Panel (Contact form & hotline details) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Support Form Card */}
          <Card className="rounded-xl border border-gray-200 shadow-sm" bodyStyle={{ padding: '24px' }}>
            <h3 className="font-h2 text-lg text-emerald-950 mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">mail</span>
              Gửi yêu cầu trực tuyến
            </h3>
            <p className="text-secondary text-xs font-body-md mb-6 leading-relaxed">
              Nếu không tìm thấy câu trả lời bên danh sách câu hỏi, vui lòng gửi phản hồi chi tiết tại đây. Chúng tôi sẽ trả lời trong vòng 2 giờ làm việc.
            </p>

            <Form form={form} layout="vertical" onFinish={handleFormSubmit} requiredMark={false}>
              <Form.Item
                label={<span className="text-xs font-bold text-gray-700">Họ và tên của bạn</span>}
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn' }]}
              >
                <Input placeholder="Nguyễn Văn A" className="rounded-lg py-2 text-sm border-gray-200" />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-bold text-gray-700">Số điện thoại liên hệ</span>}
                name="phone"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ (10-11 số)' }
                ]}
              >
                <Input placeholder="0987654321" className="rounded-lg py-2 text-sm border-gray-200" />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-bold text-gray-700">Chủ đề hỗ trợ</span>}
                name="topic"
                rules={[{ required: true, message: 'Vui lòng lựa chọn chủ đề hỗ trợ' }]}
                initialValue="booking"
              >
                <Select className="rounded-lg text-sm h-10">
                  <Select.Option value="booking">Đặt sân và Thanh toán</Select.Option>
                  <Select.Option value="account">Tài khoản và Bảo mật</Select.Option>
                  <Select.Option value="matchmaking">Cáp kèo và Ghép đội</Select.Option>
                  <Select.Option value="facility">Phản ánh sự cố sân bóng</Select.Option>
                  <Select.Option value="feedback">Ý kiến đóng góp khác</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-bold text-gray-700">Nội dung yêu cầu</span>}
                name="message"
                rules={[
                  { required: true, message: 'Vui lòng điền nội dung cần hỗ trợ' },
                  { min: 10, message: 'Nội dung hỗ trợ tối thiểu phải từ 10 ký tự' }
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Mô tả cụ thể vấn đề hoặc sự cố bạn gặp phải trên hệ thống..."
                  className="rounded-lg text-sm border-gray-200"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-lg border-0 text-sm mt-2 transition-all active:scale-95"
              >
                Gửi yêu cầu hỗ trợ
              </Button>
            </Form>
          </Card>

          {/* Hotline & Working hours info card */}
          <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/60 border border-emerald-100 rounded-xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-emerald-950 text-sm uppercase tracking-wider flex items-center gap-2 m-0">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">support_agent</span>
              Hỗ trợ khẩn cấp 24/7
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5">call</span>
                <div>
                  <p className="text-xs font-bold text-gray-800 m-0">Đường dây nóng Hotline</p>
                  <p className="text-sm font-extrabold text-emerald-700 m-0">1900 8888</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5">schedule</span>
                <div>
                  <p className="text-xs font-bold text-gray-800 m-0">Thời gian làm việc</p>
                  <p className="text-xs font-medium text-gray-600 m-0 leading-normal">
                    Lễ tân trực sân: 06:00 - 23:00 hàng ngày
                  </p>
                  <p className="text-xs font-medium text-gray-600 m-0 leading-normal">
                    Hỗ trợ kỹ thuật & app: 24 giờ kể cả ngày lễ
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5">mail</span>
                <div>
                  <p className="text-xs font-bold text-gray-800 m-0">Địa chỉ Hỗ trợ Email</p>
                  <a href="mailto:support@pitchhub.com" className="text-xs text-primary font-bold hover:underline m-0">
                    support@pitchhub.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

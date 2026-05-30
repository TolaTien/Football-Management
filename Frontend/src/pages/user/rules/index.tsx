import React, { useState } from 'react';
import { Input, Form, message } from 'antd';

interface RuleItem {
  id: string;
  title: string;
  content: string;
}

interface RuleCategory {
  key: string;
  label: string;
  description: string;
  rules: RuleItem[];
}

const RULE_CATEGORIES: RuleCategory[] = [
  {
    key: 'general',
    label: 'Quy định chung',
    description: 'Quy tắc hoạt động cơ bản, thời gian mở cửa và văn hóa ứng xử tại tổ hợp sân bóng.',
    rules: [
      {
        id: 'rule-general-hours',
        title: 'Giờ hoạt động và Check-in',
        content: 'Tổ hợp sân bóng PitchHub hoạt động liên tục từ 06:00 đến 23:00 hàng ngày, kể cả ngày lễ. Khách hàng đã đặt sân vui lòng có mặt tại quầy đón tiếp trước giờ thi đấu ít nhất 10 phút để làm thủ tục check-in, nhận bóng và áo tập.'
      },
      {
        id: 'rule-general-hygiene',
        title: 'Giữ gìn vệ sinh và Mỹ quan',
        content: 'Để bảo vệ mặt sân cỏ nhân tạo, nghiêm cấm tuyệt đối việc mang đồ ăn, nước ngọt có ga, kẹo cao su, thuốc lá hoặc các chất dễ gây cháy nổ vào khu vực thi đấu. Khách hàng vui lòng bỏ rác đúng nơi quy định tại các thùng rác bố trí quanh sân.'
      },
      {
        id: 'rule-general-behavior',
        title: 'Văn hóa ứng xử và Tinh thần thể thao',
        content: 'PitchHub hướng tới xây dựng cộng đồng bóng đá văn minh. Nghiêm cấm mọi hành vi gây gổ, cãi vã, sử dụng ngôn từ kích động, xúc phạm hoặc các hành vi bạo lực trên sân. Ban quản lý có quyền mời các cá nhân vi phạm ra khỏi khuôn viên sân bóng ngay lập tức.'
      }
    ]
  },
  {
    key: 'booking',
    label: 'Đặt cọc & Hủy sân',
    description: 'Quy chế giao dịch đặt giữ chỗ, thời hạn thanh toán cọc và chính sách hoàn trả phí.',
    rules: [
      {
        id: 'rule-booking-deposit',
        title: 'Quy định đặt cọc giữ chỗ',
        content: 'Để bảo đảm quyền giữ sân, khách hàng cần thực hiện đặt cọc tối thiểu 50% tiền thuê sân cộng với 100% chi phí các dịch vụ đi kèm trong vòng 15 phút kể từ thời điểm tạo đơn đặt chỗ trực tuyến. Sau thời gian này, hệ thống sẽ tự động hủy đơn giữ chỗ để nhường cho khách hàng khác.'
      },
      {
        id: 'rule-booking-refund',
        title: 'Chính sách hủy sân và hoàn cọc',
        content: 'Khách hàng có quyền hủy đơn đặt sân thông qua tài khoản cá nhân. Nếu yêu cầu hủy được thực hiện trước 24 giờ so với giờ bóng lăn, hệ thống sẽ tự động hoàn trả 100% số tiền cọc đã đóng vào Ví Số Dư cá nhân của bạn trên hệ thống. Yêu cầu hủy dưới 24 giờ sẽ không được hỗ trợ hoàn cọc.'
      },
      {
        id: 'rule-booking-overtime',
        title: 'Xử lý quá giờ đá',
        content: 'Khách hàng thi đấu quá giờ quy định từ 10 phút trở lên sẽ được tính thêm phụ phí nửa tiếng theo khung giá hiện hành. Trường hợp muốn gia hạn thêm giờ chơi, vui lòng liên hệ ngay với nhân viên quản lý tại quầy để được kiểm tra lịch trống và hỗ trợ.'
      }
    ]
  },
  {
    key: 'safety',
    label: 'An toàn & Giày thi đấu',
    description: 'Yêu cầu trang phục thi đấu an toàn và quy chế bảo vệ cơ sở vật chất.',
    rules: [
      {
        id: 'rule-safety-shoes',
        title: 'Quy định loại giày thi đấu',
        content: 'Người chơi chỉ được sử dụng giày đế đinh dăm cao su (TF) hoặc đinh tròn nhựa ngắn (AG) chuyên dụng cho mặt sân cỏ nhân tạo. Nghiêm cấm tuyệt đối các loại giày đinh sắt (SG), đinh dài chuyên cho sân cỏ tự nhiên (FG) hoặc giày bata/giày thể thao đế bằng trơn trượt để tránh chấn thương và hư hỏng mặt cỏ.'
      },
      {
        id: 'rule-safety-guards',
        title: 'Trang bị bảo hộ cá nhân',
        content: 'Để giảm thiểu rủi ro chấn thương trong các pha va chạm, ban tổ chức khuyến khích tất cả cầu thủ trang bị đầy đủ tất dài bóng đá và bọc bảo vệ ống đồng (shin guards) trong suốt thời gian thi đấu trên sân.'
      },
      {
        id: 'rule-safety-assets',
        title: 'Bảo quản tài sản cá nhân',
        content: 'Khách hàng tự chịu trách nhiệm bảo quản tư trang và tài sản cá nhân (điện thoại, ví tiền, xe cộ). PitchHub có trang bị hệ thống tủ khóa gửi đồ an toàn tại quầy lễ tân và camera an ninh giám sát 24/7 để hỗ trợ truy xuất khi cần thiết.'
      }
    ]
  },
  {
    key: 'matchmaking',
    label: 'Ghép đội & Cáp kèo',
    description: 'Nguyên tắc công bằng, uy tín khi tham gia các hoạt động ghép đội và cáp kèo.',
    rules: [
      {
        id: 'rule-matchmaking-punctual',
        title: 'Quy định đúng giờ giao kèo',
        content: 'Các đội bóng đăng tin tìm đối thủ hoặc tham gia ghép đội phải có mặt tại sân thi đấu trước giờ bóng lăn tối thiểu 15 phút. Việc trễ hẹn quá 15 phút mà không thông báo trước sẽ bị coi là hủy kèo đơn phương và bị áp dụng chế tài xử phạt.'
      },
      {
        id: 'rule-matchmaking-fairshare',
        title: 'Chia sẻ chi phí sân bãi',
        content: 'Chi phí thuê sân phải được chia sẻ công bằng giữa các đội tham gia theo đúng cam kết ban đầu được công khai trên tin đăng cáp kèo. Mọi tranh chấp liên quan đến chi phí bãi sân cần được giải quyết trên tinh thần thiện chí hoặc báo cáo ban quản lý hỗ trợ.'
      },
      {
        id: 'rule-matchmaking-penalties',
        title: 'Chế tài vi phạm uy tín cáp kèo',
        content: 'Các hành vi tự ý bùng kèo sát giờ chơi, trốn tránh trách nhiệm thanh toán tiền sân, hoặc có thái độ không đúng mực sẽ bị ghi nhận lỗi uy tín. Tài khoản vi phạm sẽ bị khóa vĩnh viễn quyền tham gia các hoạt động cáp kèo và ghép đội trên nền tảng PitchHub.'
      }
    ]
  },
  {
    key: 'pricing',
    label: 'Bảng giá & Hỗ trợ',
    description: 'Thông tin tham khảo về biểu phí sân và liên hệ dịch vụ khẩn cấp.',
    rules: [
      {
        id: 'rule-pricing-slots',
        title: 'Biểu phí thuê sân bóng',
        content: 'Biểu phí thuê sân tiêu chuẩn (đã bao gồm VAT): Khung giờ thường (06:00 - 16:00): 200.000 VNĐ/giờ. Khung giờ vàng (16:00 - 23:00): 400.000 VNĐ/giờ. Biểu phí có thể thay đổi vào các dịp lễ tết hoặc các chương trình ưu đãi đặc biệt được công bố trên trang chủ.'
      },
      {
        id: 'rule-pricing-rentals',
        title: 'Dịch vụ cho thuê trang thiết bị',
        content: 'Khách hàng có thể thuê thêm các trang bị tập luyện tại quầy đón tiếp: Áo lưới tập (bib): 20.000 VNĐ/bộ. Bóng thi đấu tiêu chuẩn: 30.000 VNĐ/quả. Thuê máy quay góc cao ghi hình trận đấu trực tiếp: 150.000 VNĐ/trận. Nước uống và đá lạnh phục vụ theo menu có sẵn tại quầy.'
      },
      {
        id: 'rule-pricing-hotline',
        title: 'Thông tin liên hệ hỗ trợ khẩn cấp',
        content: 'Trong các trường hợp cần phản ánh chất lượng phục vụ, báo cáo sự cố hư hỏng vật tư hoặc yêu cầu hỗ trợ y tế sơ cứu chấn thương khẩn cấp, vui lòng liên hệ trực tiếp số Hotline Ban quản lý: 1900 8888 hoặc gặp trực tiếp nhân viên tại Quầy lễ tân trung tâm.'
      }
    ]
  }
];

const PitchRules: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRules, setExpandedRules] = useState<{ [key: string]: boolean }>({});
  const [form] = Form.useForm();

  const toggleRule = (ruleId: string) => {
    setExpandedRules(prev => ({
      ...prev,
      [ruleId]: !prev[ruleId]
    }));
  };

  const handleContactSubmit = () => {
    message.success('Đã gửi góp ý thành công. Ban quản lý chân thành cảm ơn phản hồi của bạn.');
    form.resetFields();
  };

  const isSearching = searchQuery.trim() !== '';

  // Get matching rules for the flat search view
  const matchingRulesList = RULE_CATEGORIES.flatMap(cat => 
    cat.rules.map(rule => ({ ...rule, categoryLabel: cat.label }))
  ).filter(rule => 
    rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Panel */}
      <header className="flex flex-col border-b border-primary/20 pb-6">
        <h1 className="font-h1 text-h1 text-primary flex items-center gap-2 m-0" id="rules-page-title">
          Điều Khoản và Quy Định Sân Bóng PitchHub
        </h1>
        <p className="text-gray-500 font-body-lg mt-1 m-0">
          Vui lòng đọc kỹ các điều khoản, quy định an toàn và chính sách đặt trả sân để bảo đảm trải nghiệm thi đấu thể thao văn minh, an toàn tốt nhất.
        </p>
      </header>

      {/* Main Grid Content */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Rules Explorer Section */}
        <section className="lg:col-span-2 space-y-6" id="rules-explorer-section">
          
          {/* Quick Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-400">search</span>
            <Input
              placeholder="Tìm nhanh quy chế (Ví dụ: đinh giày, hủy sân, đặt cọc...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none shadow-none py-1.5 focus:ring-0 text-sm w-full"
              allowClear
            />
          </div>

          {!isSearching ? (
            <>
              {/* Tab Navigation Menu (No icons or emojis) */}
              <div className="flex border-b border-gray-200 overflow-x-auto gap-2 scrollbar-none">
                {RULE_CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveTab(cat.key)}
                    className={`py-3 px-4 font-bold text-sm border-b-2 whitespace-nowrap transition-all cursor-pointer border-none bg-transparent ${
                      activeTab === cat.key
                        ? 'border-primary text-primary font-extrabold'
                        : 'border-transparent text-gray-400 hover:text-primary'
                    }`}
                    id={`tab-btn-${cat.key}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Category Description */}
              <div className="text-xs text-gray-400 bg-primary-container/20 p-3 rounded-lg border border-primary-container/10">
                {RULE_CATEGORIES.find(cat => cat.key === activeTab)?.description}
              </div>

              {/* Active Tab Rules List */}
              <div className="space-y-4">
                {RULE_CATEGORIES.find(cat => cat.key === activeTab)?.rules.map(rule => {
                  const isExpanded = !!expandedRules[rule.id];
                  return (
                    <article 
                      key={rule.id}
                      id={rule.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200"
                    >
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`w-full flex items-center justify-between p-5 text-left font-bold text-base hover:bg-gray-50/50 transition-colors border-none bg-transparent cursor-pointer ${isExpanded ? 'text-primary' : 'text-gray-900'}`}
                        id={`accordion-btn-${rule.id}`}
                      >
                        <span>{rule.title}</span>
                        <span className={`material-symbols-outlined transform transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : 'text-gray-400'}`}>
                          keyboard_arrow_down
                        </span>
                      </button>
                      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <div className="px-5 pb-5 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/10">
                            {rule.content}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            /* Search Results Flat View */
            <div className="space-y-4">
              <div className="text-sm font-semibold text-gray-500 mb-2">
                Tìm thấy {matchingRulesList.length} quy định phù hợp với từ khóa "{searchQuery}"
              </div>
              {matchingRulesList.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                  Không tìm thấy quy định nào phù hợp. Vui lòng nhập từ khóa khác.
                </div>
              ) : (
                matchingRulesList.map(rule => {
                  const isExpanded = !!expandedRules[rule.id];
                  return (
                    <article 
                      key={rule.id}
                      id={rule.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200"
                    >
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`w-full flex items-center justify-between p-5 text-left font-bold text-base hover:bg-gray-50/50 transition-colors border-none bg-transparent cursor-pointer ${isExpanded ? 'text-primary' : 'text-gray-900'}`}
                        id={`accordion-search-btn-${rule.id}`}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-primary uppercase tracking-widest font-black font-mono">
                            {rule.categoryLabel}
                          </span>
                          <span>{rule.title}</span>
                        </div>
                        <span className={`material-symbols-outlined transform transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : 'text-gray-400'}`}>
                          keyboard_arrow_down
                        </span>
                      </button>
                      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <div className="px-5 pb-5 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/10">
                            {rule.content}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}

        </section>

        {/* Sidebar Info & Contact Section */}
        <section className="space-y-6">
          
          {/* Quick Stats Panel */}
          <div className="bg-gradient-to-br from-primary to-[#064e3b] text-white p-6 rounded-2xl shadow-md space-y-4">
            <h2 className="text-base font-extrabold m-0 text-amber-300">Tóm tắt Thông số Kỹ thuật</h2>
            <div className="divide-y divide-white/10 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-emerald-100">Tổng số sân thi đấu</span>
                <span className="font-bold text-white">4 sân 7 người | 2 sân 5 người | 1 sân 11 người</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-emerald-100">Chất lượng mặt cỏ</span>
                <span className="font-bold text-white">Cỏ nhân tạo chất lượng cao (FIFA Standard)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-emerald-100">Hệ thống chiếu sáng</span>
                <span className="font-bold text-white">Đèn LED công suất lớn chống chói, đạt chuẩn thi đấu</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-emerald-100">Dịch vụ đỗ xe</span>
                <span className="font-bold text-white">Đỗ xe máy & ô tô miễn phí, có chỗ đỗ xe riêng cho từng sân</span>
              </div>
            </div>
          </div>

          {/* Feedback Form Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4" id="rules-contact-section">
            <div className="border-b border-gray-50 pb-3">
              <h2 className="text-sm font-extrabold text-emerald-950 m-0">Ý kiến đóng góp quy chế</h2>
              <p className="text-[11px] text-gray-400 mt-1 m-0">
                Hãy gửi ý kiến của bạn để giúp chúng tôi hoàn thiện dịch vụ tốt hơn.
              </p>
            </div>
            
            <Form form={form} layout="vertical" onFinish={handleContactSubmit} className="space-y-3">
              <Form.Item
                name="email"
                label="Địa chỉ Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email của bạn' },
                  { type: 'email', message: 'Email không đúng định dạng' }
                ]}
                className="mb-2"
              >
                <Input placeholder="name@example.com" className="rounded-lg py-1.5 text-xs" />
              </Form.Item>
              <Form.Item
                name="subject"
                label="Chủ đề góp ý"
                rules={[{ required: true, message: 'Vui lòng nhập chủ đề' }]}
                className="mb-2"
              >
                <Input placeholder="Ví dụ: Giày TF, hủy sân, giá sân..." className="rounded-lg py-1.5 text-xs" />
              </Form.Item>
              
              <Form.Item
                name="message"
                label="Nội dung"
                rules={[{ required: true, message: 'Vui lòng nhập ý kiến đóng góp' }]}
                className="mb-3"
              >
                <Input.TextArea placeholder="Nhập câu hỏi hoặc góp ý quy định của bạn..." rows={3} className="rounded-lg text-xs" />
              </Form.Item>
              
              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-md active:scale-95 border-none cursor-pointer text-xs"
              >
                Gửi phản hồi của bạn
              </button>
            </Form>
          </div>

        </section>

      </main>
    </div>
  );
};

export default PitchRules;

import React, { useState } from 'react';

const PrivacySecurity: React.FC = () => {
  const [notifMatch, setNotifMatch] = useState(true);
  const [notifChat, setNotifChat] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  const preferences = [
    { key: 'match', title: 'Thông báo trận đấu', desc: 'Nhận thông báo về lịch đặt sân sắp tới và lời mời ghép đối.', value: notifMatch, setter: setNotifMatch },
    { key: 'chat', title: 'Thông báo tin nhắn', desc: 'Nhận thông báo đẩy cho các tin nhắn nhóm và trò chuyện cộng đồng.', value: notifChat, setter: setNotifChat },
    { key: 'marketing', title: 'Khuyến mãi & Tin tức', desc: 'Nhận email định kỳ về mã giảm giá thuê sân và các tin tức cập nhật.', value: notifMarketing, setter: setNotifMarketing },
  ];

  return (
    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 bg-gray-50/20">
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2 m-0">
          Quyền riêng tư & Bảo mật
        </h3>
      </div>
      <div className="p-6 space-y-6">
         <div>
            <h4 className="text-sm font-bold text-on-surface mb-4">Tùy chọn nhận thông báo</h4>
            <div className="divide-y divide-gray-100">
              {preferences.map((item) => (
                <div key={item.key} className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="text-sm font-bold text-on-surface m-0 leading-snug">{item.title}</h4>
                    <p className="text-xs text-secondary mt-0.5 m-0 font-body-sm leading-normal">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={item.value} 
                      onChange={(e) => item.setter(e.target.checked)} 
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              ))}
            </div>
         </div>
         <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-secondary m-0 font-body-sm">Cài đặt bảo mật nâng cao — tính năng sắp ra mắt.</p>
         </div>
      </div>
    </section>
  );
};

export default PrivacySecurity;

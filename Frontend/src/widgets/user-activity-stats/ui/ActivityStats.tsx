import React, { useMemo } from 'react';
import { Spin, List, Empty } from 'antd';
import dayjs from 'dayjs';

interface ActivityStatsProps {
  bookings: any[];
  statsLoading: boolean;
}

const ActivityStats: React.FC<ActivityStatsProps> = ({ bookings, statsLoading }) => {
  // Pure derived state calculations using useMemo
  const stats = useMemo(() => {
    const approvedBookings = bookings.filter(
      (b: any) => b.status === 'approved' || b.status === 'confirmed'
    );
    const totalMatches = approvedBookings.length;

    let hours = 0;
    let spent = 0;
    const pitchCounts: { [key: string]: number } = {};

    approvedBookings.forEach((b: any) => {
      if (b.startTime && b.endTime) {
        const diff = dayjs(b.endTime).diff(dayjs(b.startTime), 'hour', true);
        hours += diff;
      }
      spent += b.total || 0;
      
      const pitchName = b.pitch?.namePitch || 'Unknown Pitch';
      pitchCounts[pitchName] = (pitchCounts[pitchName] || 0) + 1;
    });

    // Find favorite pitch
    let favorite = 'N/A';
    let maxCount = 0;
    Object.keys(pitchCounts).forEach((key) => {
      if (pitchCounts[key] > maxCount) {
        maxCount = pitchCounts[key];
        favorite = key;
      }
    });

    return {
      totalMatches,
      totalHours: Math.round(hours * 10) / 10,
      totalSpent: spent,
      favPitch: favorite
    };
  }, [bookings]);

  const getStatusLabel = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'approved':
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Thành công
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Chờ duyệt
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-red-700 font-bold text-xs bg-red-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-gray-700 font-bold text-xs bg-gray-50 px-2.5 py-1 rounded-full">
            {status || 'Không rõ'}
          </span>
        );
    }
  };

  if (statsLoading) {
    return (
      <div className="bg-white p-8 border border-gray-100 rounded-xl flex justify-center items-center shadow-sm min-h-[400px]">
        <Spin tip="Đang tính toán thống kê..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total matches card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px] transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trận đã đá</span>
            <span className="material-symbols-outlined text-emerald-600 text-lg bg-emerald-50 p-1.5 rounded-lg">sports_soccer</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-950 mt-2">{stats.totalMatches} Trận</h3>
            <p className="text-[10px] text-gray-400 mt-1">Đơn thành công</p>
          </div>
        </div>

        {/* Total hours card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px] transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thời lượng</span>
            <span className="material-symbols-outlined text-emerald-600 text-lg bg-emerald-50 p-1.5 rounded-lg">schedule</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-950 mt-2">{stats.totalHours} Giờ</h3>
            <p className="text-[10px] text-gray-400 mt-1">Tổng giờ chơi</p>
          </div>
        </div>

        {/* Favourite Pitch card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px] transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sân ưa thích</span>
            <span className="material-symbols-outlined text-emerald-600 text-lg bg-emerald-50 p-1.5 rounded-lg">location_on</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950 mt-2 truncate" title={stats.favPitch}>{stats.favPitch}</h3>
            <p className="text-[10px] text-gray-400 mt-1">Sân đặt nhiều nhất</p>
          </div>
        </div>
      </div>

      {/* Spent Metrics Summary */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-xl p-6 shadow-md flex justify-between items-center transition-all duration-300 hover:shadow-lg">
        <div>
          <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider">Tổng ngân sách chi tiêu</p>
          <h4 className="text-2xl font-bold mt-1">{stats.totalSpent.toLocaleString('vi-VN')} VNĐ</h4>
        </div>
        <div className="text-right">
          <p className="text-xs text-emerald-200 font-body-sm">Trung bình mỗi trận</p>
          <p className="font-semibold mt-1">
            {stats.totalMatches > 0 ? Math.round(stats.totalSpent / stats.totalMatches).toLocaleString('vi-VN') : 0} đ
          </p>
        </div>
      </div>

      {/* Real Booking Table list */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h4 className="text-sm font-bold text-emerald-900 m-0 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">history</span>
            Lịch sử đặt sân gần đây
          </h4>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            {bookings.length} giao dịch
          </span>
        </div>

        <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto custom-scrollbar">
          {bookings.length === 0 ? (
            <div className="py-12 flex flex-col justify-center items-center">
              <Empty description="Chưa có dữ liệu giao dịch" />
            </div>
          ) : (
            <List
              dataSource={bookings}
              renderItem={(item: any) => (
                <div key={item.id} className="p-4 flex flex-col gap-2 hover:bg-gray-50/60 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-sm text-gray-800 m-0">
                        {item.pitch?.namePitch || 'Sân bóng không tên'}
                      </h5>
                      <span className="text-[10px] text-gray-400 mt-0.5 block font-body-sm">
                        {item.pitch?.address || 'Chi nhánh PitchHub'}
                      </span>
                    </div>
                    {getStatusLabel(item.status)}
                  </div>
                  
                  <div className="flex justify-between items-end mt-1 text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-gray-400">calendar_today</span>
                      {dayjs(item.startTime).format('HH:mm DD/MM/YYYY')}
                    </span>
                    <span className="font-bold text-emerald-800 text-xs">
                      {(item.total || 0).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityStats;

import React, { useState } from 'react';
import { Card, Table, Tag, Typography, Button, Space, Popconfirm, Tooltip, message } from 'antd';
import {
    EyeOutlined,
    CreditCardOutlined,
    DollarOutlined
} from '@ant-design/icons';
import type { Booking, PaymentStatus, BookingStatus } from '@/entities/booking/model/types';
import { useAppDispatch } from '@/app/store/hooks';
import {
    updateBookingStatus,
    updatePaymentStatus,
    deleteBookingThunk,
    refundBookingThunk,
    fetchAllBookings
} from '@/entities/booking/model/bookingSlice';
import { BookingDetailModal } from '@/features/manage-booking';

const { Text } = Typography;

interface RecentBookingsTableProps {
    bookings: Booking[];
    pendingCount: number;
}

export const RecentBookingsTable: React.FC<RecentBookingsTableProps> = ({ bookings, pendingCount }) => {
    const dispatch = useAppDispatch();
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const handleUpdateStatus = async (id: string, status: BookingStatus) => {
        await dispatch(updateBookingStatus({ id, status }));
        // Update local state if the modal is currently open
        if (selectedBooking && selectedBooking.id === id) {
            setSelectedBooking(prev => prev ? { ...prev, status } : null);
        }
    };

    const handleUpdatePayment = async (id: string, paymentStatus: PaymentStatus) => {
        await dispatch(updatePaymentStatus({ id, paymentStatus }));
        // Update local state if the modal is currently open
        if (selectedBooking && selectedBooking.id === id) {
            setSelectedBooking(prev => prev ? { ...prev, paymentStatus } : null);
        }
    };

    const handleRefund = async (id: string) => {
        await dispatch(refundBookingThunk(id));
        if (selectedBooking && selectedBooking.id === id) {
            setSelectedBooking(prev => prev ? { ...prev, paymentStatus: 'unpaid' } : null);
        }
    };

    const handleDelete = async (id: string) => {
        await dispatch(deleteBookingThunk(id));
        setSelectedBooking(null);
    };

    const columns = [
        {
            title: 'Khách hàng',
            dataIndex: 'userName',
            key: 'userName',
            render: (text: string, record: Booking) => (
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setSelectedBooking(record)}
                >
                    {/* Luôn dùng thẻ img, nếu không có avt thì dùng link Dicebear tạo avatar từ email */}
                    <img
                        src={record.avt || `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.email || text || 'default'}`}
                        alt={text}
                        className="w-[34px] h-[34px] rounded-full object-cover shadow-sm transition-transform group-hover:scale-105 border border-slate-100 bg-slate-50"
                    />

                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 text-xs group-hover:text-emerald-700 transition-colors">{text}</span>
                        {record.phone && <span className="text-[10px] text-slate-400 font-mono mt-0.5">{record.phone}</span>}
                    </div>
                </div>
            )

        },

        {
            title: 'Sân bóng',
            dataIndex: 'pitchName',
            key: 'pitchName',
            render: (text: string) => (
                <div className="flex items-center gap-1.5">
                    <span className="text-sm">⚽</span>
                    <span className="text-slate-600 font-medium text-xs">{text}</span>
                </div>
            ),
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (_: unknown, record: Booking) => (
                <div className="flex flex-col text-xs">
                    <span className="font-bold text-slate-700">{record.date}</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">{record.startTime} - {record.endTime}</span>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                if (status === 'approved') return <Tag className="m-0 bg-emerald-50 text-emerald-700 border-none rounded-lg font-bold px-2 py-0.5 text-[11px]">✓ Đã duyệt</Tag>;
                if (status === 'pending') return <Tag className="m-0 bg-amber-50 text-amber-700 border-none rounded-lg font-bold px-2 py-0.5 text-[11px]">⏳ Chờ duyệt</Tag>;
                return <Tag className="m-0 bg-rose-50 text-rose-700 border-none rounded-lg font-bold px-2 py-0.5 text-[11px]">✕ Từ từ chối</Tag>;
            },
        },
        {
            title: 'Thanh toán',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (paymentStatus: string) => {
                if (paymentStatus === 'paid') return <Tag className="m-0 bg-emerald-100 text-emerald-800 border-none rounded-lg font-bold px-2 py-0.5 text-[11px]">🟢 Đủ 100%</Tag>;
                if (paymentStatus === 'deposited') return <Tag className="m-0 bg-blue-100 text-blue-800 border-none rounded-lg font-bold px-2 py-0.5 text-[11px]">🔵 Cọc sân + DV</Tag>;
                return <Tag className="m-0 bg-rose-100 text-rose-850 border-none rounded-lg font-bold px-2 py-0.5 text-[11px]">🔴 Chưa TT</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_: unknown, record: Booking) => (
                <Space size="middle">
                    {/* Quick Payment update buttons when booking is approved */}
                    {record.status === 'approved' && (
                        <>
                            {record.paymentStatus === 'unpaid' && (
                                <Tooltip title="Xác nhận đóng cọc 50% tiền sân + toàn bộ dịch vụ">
                                    <Button
                                        size="small"
                                        type="primary"
                                        className="bg-blue-600 border-blue-600 hover:bg-blue-700 text-white flex items-center justify-center rounded-lg text-[10px] font-bold h-7"
                                        icon={<CreditCardOutlined />}
                                        onClick={() => handleUpdatePayment(record.id, 'deposited')}
                                    >
                                        Cọc sân + DV
                                    </Button>
                                </Tooltip>
                            )}
                            {record.paymentStatus === 'deposited' && (
                                <Tooltip title="Xác nhận đóng nốt 50% tiền sân còn lại">
                                    <Button
                                        size="small"
                                        type="primary"
                                        className="bg-emerald-600 border-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center rounded-lg text-[10px] font-bold h-7"
                                        icon={<DollarOutlined />}
                                        onClick={() => handleUpdatePayment(record.id, 'paid')}
                                    >
                                        Thu đủ
                                    </Button>
                                </Tooltip>
                            )}
                        </>
                    )}

                    {/* Always show Details view button */}
                    <Tooltip title="Xem chi tiết">
                        <Button
                            size="small"
                            type="text"
                            shape="circle"
                            icon={<EyeOutlined />}
                            className="text-slate-500 hover:text-emerald-700 hover:bg-slate-100"
                            onClick={() => setSelectedBooking(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card
                bordered={false}
                className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                bodyStyle={{ padding: 0 }}
            >
                <div className="flex justify-between items-center py-5 px-6 border-b border-slate-100">
                    <div>
                        <div className="text-base font-bold text-slate-900">Danh sách lịch đặt</div>
                        <Text className="text-slate-400 text-xs">Toàn bộ hệ thống · {bookings.length} lượt</Text>
                    </div>
                    {pendingCount > 0 && (
                        <div className="bg-yellow-50 text-yellow-750 py-1.5 px-3.5 rounded-full font-bold text-xs border border-yellow-200">
                            ⏳ {pendingCount} đơn chờ duyệt
                        </div>
                    )}
                </div>
                <Table
                    columns={columns}
                    dataSource={bookings}
                    scroll={{ x: 950 }}
                    pagination={{ pageSize: 5, size: 'small' }}
                    rowKey="id"
                    className="admin-table rounded-none"
                />
            </Card>

            <BookingDetailModal
                detail={selectedBooking}
                onClose={() => setSelectedBooking(null)}
                onUpdatePayment={handleUpdatePayment}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
                onDetailChange={setSelectedBooking}
                onRefund={handleRefund}
            />
        </>
    );
};

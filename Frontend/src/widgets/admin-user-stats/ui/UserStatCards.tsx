import React from 'react';
import { Row, Col } from 'antd';
import { TeamOutlined, SafetyCertificateOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';

interface UserStatCardsProps {
    totalUsers: number;
    adminCount: number;
    activeCount: number;
    bannedCount: number;
}

export const UserStatCards: React.FC<UserStatCardsProps> = ({
    totalUsers, adminCount, activeCount, bannedCount,
}) => {
    return (
        <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl py-5 px-[22px] text-white shadow-lg shadow-emerald-600/25 relative overflow-hidden">
                    <div className="absolute -right-3 -bottom-3 w-20 h-20 rounded-full bg-white/10" />
                    <div className="flex justify-between items-start mb-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <TeamOutlined className="text-xl text-white" />
                        </div>
                        <div className="bg-white/15 py-0.5 px-2 rounded-lg font-bold text-[11px] text-emerald-250">+12% ↗</div>
                    </div>
                    <div className="text-white/75 text-[11px] font-semibold uppercase tracking-wider mb-1">Tổng người dùng</div>
                    <div className="text-3xl font-extrabold text-white">{totalUsers.toLocaleString()}</div>
                </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <div className="bg-white rounded-2xl py-5 px-[22px] border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-3 -bottom-3 w-20 h-20 rounded-full bg-indigo-500/5" />
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3.5">
                        <SafetyCertificateOutlined className="text-xl" />
                    </div>
                    <div className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">Quản trị viên</div>
                    <div className="text-3xl font-extrabold text-slate-900">{adminCount}</div>
                </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <div className="bg-white rounded-2xl py-5 px-[22px] border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-3 -bottom-3 w-20 h-20 rounded-full bg-emerald-500/5" />
                    <div className="flex justify-between items-start mb-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <UserOutlined className="text-xl" />
                        </div>
                        <div className="bg-emerald-100 py-0.5 px-2 rounded-lg font-bold text-[11px] text-emerald-700">98% ↗</div>
                    </div>
                    <div className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">Đang hoạt động</div>
                    <div className="text-3xl font-extrabold text-slate-900">{activeCount.toLocaleString()}</div>
                </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <div className="bg-white rounded-2xl py-5 px-[22px] border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-3 -bottom-3 w-20 h-20 rounded-full bg-red-500/5" />
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-650 flex items-center justify-center mb-3.5">
                        <WarningOutlined className="text-xl" />
                    </div>
                    <div className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">Bị chặn</div>
                    <div className="text-3xl font-extrabold text-red-600">{bannedCount}</div>
                </div>
            </Col>
        </Row>
    );
};

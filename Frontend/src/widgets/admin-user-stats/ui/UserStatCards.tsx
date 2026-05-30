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
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
                <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: 16, padding: '20px 22px', color: 'white', boxShadow: '0 4px 20px rgba(5,150,105,0.25)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: -12, bottom: -12, width: 80, height: 80, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TeamOutlined style={{ fontSize: 20, color: '#fff' }} />
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: 8, fontWeight: 700, fontSize: 11, color: '#a7f3d0' }}>+12% ↗</div>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Tổng người dùng</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{totalUsers.toLocaleString()}</div>
                </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <div style={{ background: 'white', borderRadius: 16, padding: '20px 22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: -12, bottom: -12, width: 80, height: 80, borderRadius: '50%', backgroundColor: '#e0e7ff18' }} />
                    <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                        <SafetyCertificateOutlined style={{ fontSize: 20 }} />
                    </div>
                    <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Quản trị viên</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{adminCount}</div>
                </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <div style={{ background: 'white', borderRadius: 16, padding: '20px 22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: -12, bottom: -12, width: 80, height: 80, borderRadius: '50%', backgroundColor: '#dcfce718' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#dcfce7', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserOutlined style={{ fontSize: 20 }} />
                        </div>
                        <div style={{ background: '#dcfce7', padding: '3px 8px', borderRadius: 8, fontWeight: 700, fontSize: 11, color: '#15803d' }}>98% ↗</div>
                    </div>
                    <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Đang hoạt động</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{activeCount.toLocaleString()}</div>
                </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <div style={{ background: 'white', borderRadius: 16, padding: '20px 22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: -12, bottom: -12, width: 80, height: 80, borderRadius: '50%', backgroundColor: '#fee2e218' }} />
                    <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                        <WarningOutlined style={{ fontSize: 20 }} />
                    </div>
                    <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Bị chặn</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626' }}>{bannedCount}</div>
                </div>
            </Col>
        </Row>
    );
};

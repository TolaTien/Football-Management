import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Row, Col } from 'antd';
import {
    EditOutlined, IdcardOutlined, PhoneOutlined, MailOutlined,
    UserOutlined, LockOutlined,
} from '@ant-design/icons';
import type { UserItem, UserRole } from '@/entities/user/model/types';

interface EditUserModalProps {
    open: boolean;
    user: UserItem | null;
    onCancel: () => void;
    onConfirm: (values: { name: string; email: string; phone: string; role: UserRole }) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ open, user, onCancel, onConfirm }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                phone: user.phone === '—' ? '' : user.phone,
                role: user.role,
            });
        }
    }, [open, user, form]);

    const handleSubmit = (values: { name: string; email: string; phone: string; role: UserRole }) => {
        onConfirm(values);
    };

    const handleClose = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            width={700}
            style={{ top: 60 }}
            styles={{ body: { padding: 0 } }}
            closeIcon={<span className="text-lg text-slate-400 hover:text-slate-600 transition-colors">✕</span>}
        >
            <div className="flex rounded-2xl overflow-hidden min-h-[500px]">
                {/* Panel trái */}
                <div className="w-[200px] min-w-[200px] bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 flex flex-col justify-between text-white">
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-5">
                            <EditOutlined className="text-2xl text-white" />
                        </div>
                        <div className="text-white text-lg font-extrabold leading-snug mb-3">
                            Cập nhật thành viên
                        </div>
                        <div className="text-white/75 text-xs leading-relaxed">
                            Thay đổi các thông tin cần thiết của thành viên. Nhấn Cập nhật để đồng bộ hệ thống.
                        </div>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg border border-white/15">
                        <div className="text-white/70 text-[11px] mb-1">ℹ️ Lưu ý</div>
                        <div className="text-white text-xs leading-normal">
                            Email thay đổi phải chưa từng tồn tại trên hệ thống.
                        </div>
                    </div>
                </div>

                {/* Panel phải */}
                <div className="flex-1 bg-white">
                    <Form form={form} layout="vertical" onFinish={handleSubmit} className="p-8 pb-2">
                        {/* Họ tên + SĐT */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label={
                                        <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                                            <IdcardOutlined className="text-emerald-600" /> Họ và tên
                                        </span>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                                >
                                    <Input
                                        placeholder="Nguyễn Văn An"
                                        size="large"
                                        className="rounded-xl border-slate-300"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="phone"
                                    label={
                                        <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                                            <PhoneOutlined className="text-emerald-600" /> Số điện thoại
                                        </span>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
                                >
                                    <Input
                                        placeholder="0901 234 567"
                                        size="large"
                                        className="rounded-xl border-slate-300"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Email */}
                        <Form.Item
                            name="email"
                            label={
                                <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                                    <MailOutlined className="text-emerald-600" /> Địa chỉ Email
                                </span>
                            }
                            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
                        >
                            <Input
                                placeholder="example@pitchhub.vn"
                                size="large"
                                className="rounded-xl border-slate-300"
                            />
                        </Form.Item>

                        {/* Vai trò */}
                        <Form.Item
                            name="role"
                            label={
                                <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                                    <UserOutlined className="text-emerald-600" /> Vai trò
                                </span>
                            }
                        >
                            <Select size="large" className="rounded-xl w-full">
                                <Select.Option value="Khách hàng">Khách hàng</Select.Option>
                                <Select.Option value="Quản trị">Quản trị viên</Select.Option>
                            </Select>
                        </Form.Item>

                        {/* Footer Buttons */}
                        <div className="mt-4 pt-5 border-t border-slate-100 flex justify-end gap-3">
                            <Button
                                size="large"
                                onClick={handleClose}
                                className="rounded-xl h-11 px-6 font-semibold text-slate-600 border-slate-300 hover:text-slate-800 transition-colors"
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                icon={<EditOutlined />}
                                className="bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 text-white rounded-xl h-11 px-7 font-bold shadow-md shadow-emerald-600/10 flex items-center"
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};

export default EditUserModal;

import React from 'react';
import { Card, Form, Input, Select, Button } from 'antd';
import { EditOutlined, FileTextOutlined, TagsOutlined, SaveOutlined } from '@ant-design/icons';
import type { CreateForumPostDto } from '@/entities/forum/model/types';

interface QuickDraftCardProps {
  form: any;
  onFinish: (values: Omit<CreateForumPostDto, 'status'>) => void;
}

export const QuickDraftCard: React.FC<QuickDraftCardProps> = ({ form, onFinish }) => {
  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }} className="rounded-2xl border border-slate-205 shadow-sm overflow-hidden bg-white">
      {/* Header gradient */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
          <EditOutlined className="text-white text-lg" />
        </div>
        <div>
          <div className="text-white text-base font-bold">Bản thảo nhanh</div>
          <div className="text-white/75 text-[11px]">Tạo bài đăng mới cho cộng đồng</div>
        </div>
      </div>

      {/* Form body */}
      <div className="p-6">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="title"
            label={<span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5"><FileTextOutlined className="text-emerald-600" /> Tiêu đề</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Tiêu đề bài viết..." size="large" className="rounded-xl border-slate-300 focus:border-emerald-500" />
          </Form.Item>

          <Form.Item
            name="category"
            label={<span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5"><TagsOutlined className="text-emerald-600" /> Danh mục</span>}
            rules={[{ required: true, message: 'Chọn danh mục' }]}
          >
            <Select
              size="large"
              placeholder="Chọn danh mục"
              className="w-full rounded-xl"
              options={[
                { value: 'Thông báo', label: '📢 Thông báo' },
                { value: 'Bảo trì', label: '🔧 Bảo trì' },
                { value: 'Giải đấu', label: '🏆 Giải đấu' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label={<span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5"><EditOutlined className="text-emerald-600" /> Nội dung</span>}
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Viết nội dung bài đăng tại đây..."
              className="rounded-xl border-slate-300 focus:border-emerald-500 resize-none"
            />
          </Form.Item>

          <div className="flex gap-2.5 justify-end pt-4 border-t border-slate-100 mt-2">
            <Button size="large"
              icon={<SaveOutlined />}
              className="rounded-xl h-11 px-5 font-semibold text-slate-650 border-slate-350 hover:text-emerald-650 hover:border-emerald-650"
            >
              Lưu nháp
            </Button>
            <Button type="primary" htmlType="submit" size="large"
              icon={<EditOutlined />}
              className="bg-emerald-650 border-emerald-650 hover:bg-emerald-750 hover:border-emerald-750 rounded-xl h-11 px-6 font-bold shadow-md shadow-emerald-600/10"
            >
              Đăng bài
            </Button>
          </div>
        </Form>
      </div>
    </Card>
  );
};

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Radio, message } from 'antd';
import { postService, type PostItem } from '@/entities/matchmaking-post';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (post: PostItem, isEdit: boolean) => void;
  postToEdit?: PostItem | null;
}

const TEAM_REGEX = /ghép đội|tuyển thêm|tìm thủ môn|thiếu người|tìm đồng đội|tìm cầu|tìm chân|ghép kèo|tuyển mem|tuyển quân/i;

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  postToEdit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!postToEdit;

  useEffect(() => {
    if (isOpen) {
      if (postToEdit) {
        let rawDescription = postToEdit.description || '';
        let initialType: 'opponent' | 'team' = 'opponent';

        if (rawDescription.startsWith('[TÌM ĐỐI] ')) {
          initialType = 'opponent';
          rawDescription = rawDescription.replace('[TÌM ĐỐI] ', '');
        } else if (rawDescription.startsWith('[GHÉP ĐỘI] ')) {
          initialType = 'team';
          rawDescription = rawDescription.replace('[GHÉP ĐỘI] ', '');
        } else {
          // Guess based on description keywords
          initialType = TEAM_REGEX.test(rawDescription) ? 'team' : 'opponent';
        }

        form.setFieldsValue({
          postType: initialType,
          description: rawDescription,
          status: postToEdit.status,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          postType: 'opponent', // default type
        });
      }
    }
  }, [isOpen, postToEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const prefix = values.postType === 'opponent' ? '[TÌM ĐỐI] ' : '[GHÉP ĐỘI] ';
      const finalDescription = `${prefix}${values.description.trim()}`;

      let savedPost: PostItem;
      if (isEdit && postToEdit) {
        savedPost = await postService.updatePost(
          postToEdit.postId,
          finalDescription,
          values.status
        );
        message.success('Cập nhật bài viết ghép cặp thành công');
      } else {
        savedPost = await postService.createPost(finalDescription);
        message.success('Đăng bài viết ghép cặp thành công');
      }

      onSuccess(savedPost, isEdit);
      onClose();
    } catch (error: any) {
      console.error('Failed to save matchmaking post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Glassmorphism */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="font-h2 text-lg font-bold text-emerald-900">
              {isEdit ? 'Chỉnh sửa bài đăng ghép cặp' : 'Tạo kèo ghép cặp mới'}
            </h3>
            <p className="text-xs text-gray-500 font-label">
              {isEdit ? 'Cập nhật lại thông tin tìm đối thủ hoặc đồng đội' : 'Tìm kiếm đối thủ giao hữu hoặc bổ sung đồng đội cho trận đấu'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto">
          <Form form={form} layout="vertical">
            {/* Lựa chọn loại kèo */}
            <Form.Item
              name="postType"
              label={<span className="font-bold text-sm text-gray-700">Loại kèo ghép cặp</span>}
              rules={[{ required: true, message: 'Vui lòng chọn loại kèo ghép cặp' }]}
            >
              <Radio.Group className="w-full grid grid-cols-2 gap-4" buttonStyle="outline">
                <Radio.Button
                  value="opponent"
                  className="h-auto py-3.5 px-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:text-emerald-700 focus-within:ring-2 focus-within:ring-emerald-100 flex items-center justify-center gap-2 font-bold text-sm text-gray-700 transition-all [&.ant-radio-button-wrapper-checked]:border-emerald-600 [&.ant-radio-button-wrapper-checked]:bg-emerald-50 [&.ant-radio-button-wrapper-checked]:text-emerald-950 [&.ant-radio-button-wrapper-checked::before]:hidden"
                >
                  <span className="material-symbols-outlined text-[20px] text-emerald-600">sports_martial_arts</span>
                  Tìm đối thủ
                </Radio.Button>
                <Radio.Button
                  value="team"
                  className="h-auto py-3.5 px-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:text-emerald-700 focus-within:ring-2 focus-within:ring-emerald-100 flex items-center justify-center gap-2 font-bold text-sm text-gray-700 transition-all [&.ant-radio-button-wrapper-checked]:border-emerald-600 [&.ant-radio-button-wrapper-checked]:bg-emerald-50 [&.ant-radio-button-wrapper-checked]:text-emerald-950 [&.ant-radio-button-wrapper-checked::before]:hidden"
                >
                  <span className="material-symbols-outlined text-[20px] text-emerald-600">diversity_3</span>
                  Ghép đồng đội
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {/* Chi tiết mô tả */}
            <Form.Item
              name="description"
              label={
                <span className="font-bold text-sm text-gray-700">
                  Mô tả chi tiết (Khung giờ, sân bóng, trình độ...)
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập nội dung mô tả cho bài đăng ghép cặp này' },
                { min: 10, message: 'Mô tả chi tiết tối thiểu phải có 10 ký tự' },
              ]}
            >
              <Input.TextArea
                placeholder="Ví dụ: Cần tìm đối thủ ngang cơ đá sân 7, thời gian 19h-20h30 ngày mai tại Sân bóng Hà..."
                rows={5}
                maxLength={500}
                showCount
                disabled={loading}
                className="rounded-lg border-gray-300 focus:border-emerald-700 focus:ring-emerald-700 text-sm font-medium"
              />
            </Form.Item>

            {isEdit && (
              <Form.Item
                name="status"
                label={<span className="font-bold text-sm text-gray-700">Trạng thái bài đăng</span>}
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái bài đăng' }]}
              >
                <Select disabled={loading} className="rounded-lg w-full h-10 text-sm font-semibold">
                  <Select.Option value="open">Đang mở (Open)</Select.Option>
                  <Select.Option value="closed">Đã ghép xong (Closed)</Select.Option>
                  <Select.Option value="canceled">Đã hủy (Canceled)</Select.Option>
                </Select>
              </Form.Item>
            )}
          </Form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-emerald-900 text-white rounded-lg text-sm font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading && <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>}
            {isEdit ? 'Lưu thay đổi' : 'Đăng kèo'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, message } from 'antd';
import { postService, PostItem } from '@/entities/matchmaking-post/api/postService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (post: PostItem, isEdit: boolean) => void;
  postToEdit?: PostItem | null;
}

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
        form.setFieldsValue({
          description: postToEdit.description,
          status: postToEdit.status,
        });
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, postToEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let savedPost: PostItem;
      if (isEdit && postToEdit) {
        savedPost = await postService.updatePost(
          postToEdit.postId,
          values.description.trim(),
          values.status
        );
        message.success('Matchmaking post updated successfully');
      } else {
        savedPost = await postService.createPost(values.description.trim());
        message.success('Matchmaking post hosted successfully');
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
              {isEdit ? 'Edit Matchmaking Post' : 'Host a Matchmaking'}
            </h3>
            <p className="text-xs text-gray-500 font-label">
              {isEdit ? 'Update your matchmaking details' : 'Find an opponent for your next football match'}
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
            <Form.Item
              name="description"
              label={
                <span className="font-bold text-sm text-gray-700">
                  What are you looking for? (e.g. Opponent level, time, pitch)
                </span>
              }
              rules={[
                { required: true, message: 'Please enter a description for the matchmaking opportunity' },
                { min: 10, message: 'Description must be at least 10 characters long' },
              ]}
            >
              <Input.TextArea
                placeholder="E.g., Cần tìm đối thủ ngang cơ đá sân 7, thời gian 19h-20h30 ngày mai..."
                rows={5}
                maxLength={500}
                showCount
                disabled={loading}
                className="rounded-lg border-gray-300 focus:border-emerald-700 focus:ring-emerald-700"
              />
            </Form.Item>

            {isEdit && (
              <Form.Item
                name="status"
                label={<span className="font-bold text-sm text-gray-700">Status</span>}
                rules={[{ required: true, message: 'Please select post status' }]}
              >
                <Select disabled={loading} className="rounded-lg w-full">
                  <Select.Option value="open">Open</Select.Option>
                  <Select.Option value="closed">Closed</Select.Option>
                  <Select.Option value="canceled">Canceled</Select.Option>
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
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-emerald-900 text-white rounded-lg text-sm font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading && <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>}
            {isEdit ? 'Save Changes' : 'Post Match'}
          </button>
        </div>
      </div>
    </div>
  );
};

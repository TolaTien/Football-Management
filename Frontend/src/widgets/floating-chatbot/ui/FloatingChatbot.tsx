import React, { useEffect, useRef, useState } from 'react';
import { FloatButton, Drawer, Input, Button, Spin, Select, Alert } from 'antd';
import { MessageOutlined, SendOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  toggleChat,
  fetchConversations,
  fetchMessages,
  createNewConversation,
  sendMessage,
  optimisticUserMessage,
  setCurrentConversation,
} from '@/entities/ai-chat/model/aiSlice';
import { ChatMessage } from '@/entities/ai-chat/ui/ChatMessage';

const { TextArea } = Input;

export const FloatingChatbot: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    isOpen,
    conversations,
    currentConversationId,
    messages,
    isLoading,
    isSending,
    error,
  } = useAppSelector((state) => state.aiChat);
  const { currentUser } = useAppSelector((state) => state.user);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize bot when drawer opens for the first time
  useEffect(() => {
    if (isOpen && conversations.length === 0 && currentUser) {
      dispatch(fetchConversations());
    }
  }, [isOpen, conversations.length, currentUser, dispatch]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (isOpen && currentConversationId) {
      dispatch(fetchMessages(currentConversationId));
    }
  }, [currentConversationId, isOpen, dispatch]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending, error]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    let targetConversationId = currentConversationId;

    // If no conversation exists, create one first
    if (!targetConversationId) {
      try {
        const result = await dispatch(createNewConversation()).unwrap();
        targetConversationId = result.conversationId;
      } catch (err) {
        return; // Error is handled by Redux state
      }
    }

    const content = inputValue.trim();
    setInputValue('');

    // Optimistically show user message
    dispatch(optimisticUserMessage({ content }));

    // Send to backend
    if (targetConversationId) {
      dispatch(sendMessage({ conversationId: targetConversationId, content }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Only render the FloatButton if user is logged in
  if (!currentUser) return null;

  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24, width: 56, height: 56 }}
        onClick={() => dispatch(toggleChat())}
        tooltip="Trợ lý AI"
      />

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span className="font-semibold flex items-center gap-2">
              🤖 <span className="hidden sm:inline">Football Assistant</span>
            </span>
            <div className="flex gap-2 flex-1 justify-end ml-4">
              <Select
                value={currentConversationId}
                onChange={(val) => dispatch(setCurrentConversation(val))}
                style={{ width: 140 }}
                placeholder="Chọn lịch sử..."
                size="small"
                disabled={conversations.length === 0}
                options={conversations.map((conv) => ({
                  value: conv.conversationId,
                  label: conv.title || 'Cuộc trò chuyện',
                }))}
              />
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => dispatch(createNewConversation())}
                title="Đoạn chat mới"
              />
            </div>
          </div>
        }
        placement="right"
        onClose={() => dispatch(toggleChat())}
        open={isOpen}
        width={380}
        styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
      >
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col">
          {isLoading && messages.length === 0 ? (
            <div className="flex-1 flex justify-center items-center">
              <Spin tip="Đang tải..." />
            </div>
          ) : messages.length === 0 && !error ? (
            <div className="flex-1 flex flex-col justify-center items-center text-gray-400 text-center">
              <MessageOutlined className="text-4xl mb-2" />
              <p>Chưa có tin nhắn nào.<br/>Hãy đặt câu hỏi để bắt đầu!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={msg.messageId || index} message={msg} />
            ))
          )}
          
          {isSending && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-tl-sm px-4 py-2 text-sm">
                <span className="animate-pulse">Đang nhập...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4">
              <Alert message="Lỗi" description={error} type="error" showIcon />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-end">
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Hỏi về sân bóng, doanh thu..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="rounded-xl"
            disabled={isSending || isLoading}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending || isLoading}
            className="mb-0.5 shrink-0"
          />
        </div>
      </Drawer>
    </>
  );
};

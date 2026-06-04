import React, { useEffect, useRef, useState } from 'react';
import { FloatButton, Drawer, Input, Button, Spin, Select, Alert } from 'antd';
import { SendOutlined, PlusOutlined } from '@ant-design/icons';
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

const QUICK_PROMPTS = [
  { label: '⚽ Tư vấn chiến thuật sân 7 người', value: 'Hãy tư vấn cho tôi sơ đồ chiến thuật phổ biến và hiệu quả cho sân 7 người.' },
  { label: '📈 Xem doanh thu các cơ sở', value: 'Hãy phân tích cho tôi tình hình doanh thu và công suất hoạt động của các cơ sở.' },
  { label: '💳 Hướng dẫn thanh toán cọc', value: 'Chính sách và luồng thanh toán đặt cọc 50% tiền sân hoạt động như thế nào?' }
];

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

  const handleSendPrompt = async (promptText: string) => {
    let targetConversationId = currentConversationId;
    if (!targetConversationId) {
      try {
        const result = await dispatch(createNewConversation()).unwrap();
        targetConversationId = result.conversationId;
      } catch (err) {
        return;
      }
    }

    dispatch(optimisticUserMessage({ content: promptText }));
    if (targetConversationId) {
      dispatch(sendMessage({ conversationId: targetConversationId, content: promptText }));
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
        icon={<span className="material-symbols-outlined text-white text-lg font-bold flex items-center justify-center select-none">smart_toy</span>}
        type="primary"
        style={{ right: 24, bottom: 24, width: 56, height: 56 }}
        onClick={() => dispatch(toggleChat())}
        tooltip="Trợ lý AI"
        className="bg-gradient-to-br from-emerald-600 to-emerald-950 border-none shadow-[0_4px_20px_rgba(5,150,105,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
      />

      <Drawer
        title={
          <div className="flex items-center justify-between w-full pr-4">
            <span className="font-extrabold text-slate-800 flex items-center gap-2 text-sm sm:text-base font-montserrat">
              <span className="relative flex h-2 w-2 select-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Football AI Assistant</span>
            </span>
            
            <div className="flex gap-2 flex-1 justify-end ml-4 items-center">
              <Select
                value={currentConversationId}
                onChange={(val) => dispatch(setCurrentConversation(val))}
                style={{ width: 140 }}
                placeholder="Lịch sử chat..."
                size="small"
                disabled={conversations.length === 0}
                options={conversations.map((conv) => ({
                  value: conv.conversationId,
                  label: conv.title || 'Cuộc trò chuyện',
                }))}
                className="text-xs"
              />
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => dispatch(createNewConversation())}
                title="Đoạn chat mới"
                className="hover:border-emerald-600 hover:text-emerald-600 flex items-center justify-center h-6 w-6 rounded-md"
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
        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 flex flex-col custom-scrollbar">
          {isLoading && messages.length === 0 ? (
            <div className="flex-1 flex justify-center items-center">
              <Spin tip="Đang tải tin nhắn..." size="small" />
            </div>
          ) : messages.length === 0 && !error ? (
            <div className="flex-1 flex flex-col justify-center items-center p-6 text-center animate-in fade-in duration-300 my-auto">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-800 shadow-sm mb-4 animate-bounce">
                <span className="material-symbols-outlined text-[28px] select-none">smart_toy</span>
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm font-montserrat">Xin chào, tôi là Football AI!</h4>
              <p className="text-[10px] text-gray-400 max-w-[240px] mt-1 leading-relaxed">
                Tôi có thể giúp bạn giải đáp các thông tin về lịch sân, tư vấn chiến thuật hoặc tính toán doanh thu. Hãy đặt câu hỏi hoặc chọn gợi ý bên dưới:
              </p>
              
              <div className="w-full mt-6 space-y-2.5">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendPrompt(prompt.value)}
                    className="w-full text-left p-3 bg-white border border-slate-100 hover:border-emerald-300 rounded-xl hover:bg-emerald-50/20 text-[10px] font-bold text-slate-700 hover:text-emerald-900 shadow-sm active:scale-[0.98] transition-all flex items-center gap-2 group"
                  >
                    <span className="material-symbols-outlined text-emerald-600 group-hover:animate-pulse text-sm">chat_bubble</span>
                    <span className="flex-1">{prompt.label}</span>
                    <span className="material-symbols-outlined text-[10px] text-slate-300 group-hover:text-emerald-600 transition-colors">arrow_forward</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={msg.messageId || index} message={msg} />
            ))
          )}
          
          {/* Typing Indicator */}
          {isSending && (
            <div className="flex justify-start mb-4 animate-in fade-in duration-200">
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-emerald-800 border border-slate-200 shrink-0 flex items-center justify-center text-[10px] font-bold shadow-sm">
                  <span className="material-symbols-outlined text-sm font-semibold select-none">smart_toy</span>
                </div>
                <div className="p-3 bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 py-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4">
              <Alert message="Có lỗi xảy ra" description={error} type="error" showIcon />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-end">
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Hỏi về chiến thuật, lịch sân, doanh thu..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="rounded-xl border-slate-200 hover:border-emerald-600 focus:border-emerald-600 text-xs py-2 px-3"
            disabled={isSending || isLoading}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending || isLoading}
            className="mb-0.5 shrink-0 bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center"
          />
        </div>
      </Drawer>
    </>
  );
};

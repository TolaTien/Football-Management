import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { Spin, Button, Select, Input, message, Modal } from 'antd';
import { 
  fetchConversations, 
  fetchMessages, 
  createNewConversation, 
  sendMessage, 
  optimisticUserMessage,
  setCurrentConversation 
} from '@/entities/ai-chat/model/aiSlice';
import dayjs from 'dayjs';

const AiCoachChat: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.currentUser);
  
  // Redux AI Chat State
  const { conversations, messages, currentConversationId, isLoading, isSending } = useAppSelector(
    (state) => state.aiChat
  );

  // Deleted conversation IDs local state
  const [deletedConvIds, setDeletedConvIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pitchhub_deleted_conversations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter conversations
  const activeConversations = conversations.filter(
    (c) => !deletedConvIds.includes(c.conversationId)
  );

  // Input message state
  const [inputMessage, setInputMessage] = useState('');
  
  // Message scroll ref
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // Scroll to bottom of chat when messages change or while sending
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending]);

  // Fetch messages when selected conversation changes
  useEffect(() => {
    if (currentConversationId && !deletedConvIds.includes(currentConversationId)) {
      dispatch(fetchMessages(currentConversationId));
    }
  }, [currentConversationId, deletedConvIds, dispatch]);

  // Auto select first active conversation if current is deleted or unset
  useEffect(() => {
    if (activeConversations.length > 0) {
      if (!currentConversationId || deletedConvIds.includes(currentConversationId)) {
        dispatch(setCurrentConversation(activeConversations[0].conversationId));
      }
    }
  }, [activeConversations, currentConversationId, deletedConvIds, dispatch]);

  const handleCreateSession = async () => {
    try {
      await dispatch(createNewConversation()).unwrap();
      message.success('Đã tạo phiên tư vấn chiến thuật mới');
    } catch (e: any) {
      message.error(e || 'Không thể tạo phiên hội thoại');
    }
  };

  const handleDeleteSession = () => {
    if (!currentConversationId) return;

    Modal.confirm({
      title: 'Xác nhận xóa cuộc hội thoại',
      content: 'Bạn có chắc chắn muốn xóa cuộc hội thoại này khỏi danh sách không? Lịch sử tin nhắn của cuộc hội thoại này sẽ được ẩn đi.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const newDeletedList = [...deletedConvIds, currentConversationId];
        setDeletedConvIds(newDeletedList);
        localStorage.setItem('pitchhub_deleted_conversations', JSON.stringify(newDeletedList));
        
        // Find next active conversation
        const remaining = activeConversations.filter(c => c.conversationId !== currentConversationId);
        if (remaining.length > 0) {
          dispatch(setCurrentConversation(remaining[0].conversationId));
        } else {
          dispatch(setCurrentConversation(''));
        }
        message.success('Đã xóa cuộc hội thoại thành công');
      }
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentConversationId) return;

    const content = inputMessage.trim();
    setInputMessage('');

    // Optimistically add user message
    dispatch(optimisticUserMessage({ content }));

    try {
      await dispatch(sendMessage({ conversationId: currentConversationId, content })).unwrap();
    } catch (e: any) {
      message.error(e || 'Không thể gửi tin nhắn');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-[640px] overflow-hidden">
      
      {/* AI Header / Session Selector */}
      <div className="p-4 border-b border-gray-100 bg-emerald-50/30 flex flex-col gap-3 shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 bg-emerald-100 p-1.5 rounded-lg text-lg">smart_toy</span>
            <div>
              <h3 className="font-bold text-sm text-emerald-950">Huấn luyện viên Chiến thuật AI</h3>
              <p className="text-[10px] text-emerald-600 font-medium">Hỗ trợ tư vấn đội hình, thể lực & chiến lượng sân đấu</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="small" 
              type="primary" 
              onClick={handleCreateSession}
              className="bg-emerald-800 hover:bg-emerald-700 text-xs font-semibold rounded-lg h-7 flex items-center justify-center gap-1"
              icon={<span className="material-symbols-outlined text-sm">add</span>}
            >
              Mới
            </Button>
          </div>
        </div>

        {/* Sessions Selector dropdown */}
        <div className="flex gap-2 items-center">
          <Select
            value={currentConversationId && !deletedConvIds.includes(currentConversationId) ? currentConversationId : undefined}
            onChange={(val) => dispatch(setCurrentConversation(val))}
            placeholder="Chọn phiên hội thoại"
            className="flex-1 text-xs"
            size="small"
            options={activeConversations.map((c) => ({
              label: c.title || 'Phiên tư vấn chiến thuật',
              value: c.conversationId,
            }))}
          />
          <Button 
            danger
            type="text"
            size="small" 
            onClick={handleDeleteSession}
            disabled={!currentConversationId || deletedConvIds.includes(currentConversationId)}
            className="hover:bg-red-50 text-red-600 hover:text-red-700 flex items-center justify-center p-1 rounded-lg h-7 w-7"
            icon={<span className="material-symbols-outlined text-base flex items-center justify-center">delete</span>}
            title="Xóa cuộc hội thoại này"
          />
        </div>
      </div>

      {/* AI Messages Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/30 min-h-[300px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spin tip="Đang tải lịch sử trò chuyện..." size="small" />
          </div>
        ) : activeConversations.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">chat_bubble_outline</span>
            <p className="text-xs text-gray-400 font-medium">Chưa có phiên trò chuyện nào.</p>
            <Button 
              size="small" 
              onClick={handleCreateSession} 
              className="mt-3 text-xs bg-emerald-800 text-white hover:bg-emerald-700"
            >
              Tạo phiên hội thoại đầu tiên
            </Button>
          </div>
        ) : messages.length === 0 || !currentConversationId || deletedConvIds.includes(currentConversationId) ? (
          <div className="h-full flex flex-col justify-center items-center p-6 text-center text-gray-400">
            <span className="material-symbols-outlined text-4xl text-emerald-100 mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            <p className="text-xs font-bold text-emerald-950">Xin chào! Tôi là Trợ lý AI Chiến thuật của bạn.</p>
            <p className="text-[10px] max-w-[280px] mt-1 leading-relaxed">Bạn có thể hỏi tôi về chiến thuật thi đấu sân 5/7/11, cách cải thiện thể lực, hoặc nhờ tôi phân tích các trận đặt sân vừa qua để tối ưu lối chơi.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.messageId || index} 
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                <div className={`flex gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar bubble */}
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                    isUser ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {isUser ? (user?.fullName ? user.fullName[0].toUpperCase() : 'U') : 'AI'}
                  </div>
                  
                  {/* Message content bubble */}
                  <div className={`p-3 rounded-2xl shadow-sm text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-emerald-900 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span className={`text-[8px] block mt-1 text-right ${isUser ? 'text-emerald-300' : 'text-gray-400'}`}>
                      {dayjs(msg.createdAt).format('HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Bot thinking bubble indicator */}
        {isSending && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-2 max-w-[85%]">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 shrink-0 flex items-center justify-center text-[10px] font-bold">
                AI
              </div>
              <div className="p-3 bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 py-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messageEndRef} />
      </div>

      {/* AI Send Input message form */}
      <form 
        onSubmit={handleSendMessage} 
        className="p-3 border-t border-gray-100 bg-white flex gap-2 items-center shrink-0"
      >
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={currentConversationId && !deletedConvIds.includes(currentConversationId) ? "Nhập câu hỏi chiến thuật..." : "Vui lòng chọn phiên hội thoại"}
          disabled={!currentConversationId || deletedConvIds.includes(currentConversationId) || isSending}
          className="flex-1 text-xs rounded-xl h-9"
          bordered={true}
        />
        <Button
          type="primary"
          htmlType="submit"
          disabled={!inputMessage.trim() || !currentConversationId || deletedConvIds.includes(currentConversationId) || isSending}
          className="bg-emerald-900 hover:bg-emerald-800 rounded-xl h-9 w-9 flex items-center justify-center shrink-0"
        >
          <span className="material-symbols-outlined text-sm flex items-center justify-center" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
        </Button>
      </form>
    </div>
  );
};

export default AiCoachChat;

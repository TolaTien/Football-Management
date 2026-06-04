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

const STRATEGY_PROMPTS = [
  { label: '📋 Sơ đồ 5 người (1-2-1) phòng ngự phản công', value: 'Hãy tư vấn cho tôi sơ đồ chiến thuật 1-2-1 trên sân 5 người, cách di chuyển khi phòng ngự và phản công nhanh.' },
  { label: '📋 Sơ đồ 7 người (3-2-1) kiểm soát bóng', value: 'Hãy phân tích sơ đồ 3-2-1 trên sân 7 người, nhiệm vụ của các tiền vệ cánh và tiền đạo cắm.' },
  { label: '👟 Các bài tập nâng cao thể lực & sức bền', value: 'Các bài tập nào phù hợp nhất để nâng cao sức bền và tốc độ bứt tốc cho cầu thủ chạy cánh?' }
];

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
    try {
      await dispatch(sendMessage({ conversationId: targetConversationId, content: promptText })).unwrap();
    } catch (e: any) {
      message.error(e || 'Không thể gửi tin nhắn');
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-[640px] overflow-hidden">
      
      {/* AI Header / Session Selector */}
      <div className="p-5 bg-gradient-to-r from-emerald-950 to-emerald-900 text-white flex flex-col gap-4 shrink-0 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white shadow-inner">
              <span className="material-symbols-outlined text-[24px] select-none animate-pulse">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm font-montserrat tracking-tight">Huấn luyện viên Chiến thuật AI</h3>
                <span className="relative flex h-2 w-2 select-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[10px] text-emerald-300 font-medium mt-0.5">Tư vấn sơ đồ chiến thuật, nâng cao thể lực & lối chơi</p>
            </div>
          </div>
          <Button 
            size="small" 
            type="primary" 
            onClick={handleCreateSession}
            className="bg-white/15 hover:bg-white/25 border-none text-white text-xs font-bold rounded-xl h-8 px-4 flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm font-black">add</span>
            Phiên mới
          </Button>
        </div>

        {/* Sessions Selector dropdown */}
        <div className="flex gap-2 items-center">
          <Select
            value={currentConversationId && !deletedConvIds.includes(currentConversationId) ? currentConversationId : undefined}
            onChange={(val) => dispatch(setCurrentConversation(val))}
            placeholder="Chọn phiên hội thoại chiến thuật..."
            className="flex-1 text-xs style-dark-select h-8"
            size="small"
            dropdownStyle={{ borderRadius: '12px' }}
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
            className="hover:bg-rose-500/10 text-white/75 hover:text-rose-400 flex items-center justify-center p-1 rounded-xl h-8 w-8 disabled:opacity-40 transition-colors"
            icon={<span className="material-symbols-outlined text-base flex items-center justify-center font-bold">delete</span>}
            title="Xóa cuộc hội thoại này"
          />
        </div>
      </div>

      {/* AI Messages Chat Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 min-h-[300px] custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spin tip="Đang tải lịch sử trò chuyện..." size="small" />
          </div>
        ) : activeConversations.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center p-6 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-slate-100 border border-slate-200/80 rounded-full flex items-center justify-center text-slate-400 shadow-sm mb-4">
              <span className="material-symbols-outlined text-4xl select-none">chat_bubble_outline</span>
            </div>
            <p className="text-xs text-slate-500 font-bold">Chưa có phiên tư vấn nào.</p>
            <Button 
              size="small" 
              onClick={handleCreateSession} 
              className="mt-4 text-xs bg-emerald-950 text-white hover:bg-emerald-900 border-none rounded-xl h-9 px-6 font-bold shadow-md shadow-emerald-950/10 transition-all"
            >
              Bắt đầu thảo luận chiến thuật
            </Button>
          </div>
        ) : messages.length === 0 || !currentConversationId || deletedConvIds.includes(currentConversationId) ? (
          <div className="h-full flex flex-col justify-center items-center p-6 text-center animate-in fade-in duration-300 max-w-md mx-auto my-auto">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-800 shadow-md mb-4 animate-bounce">
              <span className="material-symbols-outlined text-[32px] select-none">smart_toy</span>
            </div>
            <p className="text-sm font-extrabold text-emerald-950 font-montserrat">Chào bạn, tôi là HLV Chiến thuật AI!</p>
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed max-w-[320px]">
              Tôi sẽ hỗ trợ bạn xây dựng sơ đồ thi đấu hiệu quả, các bài tập thể lực và chiến thuật bóng đá. Chọn một câu hỏi nhanh bên dưới để bắt đầu:
            </p>
            
            <div className="w-full mt-6 space-y-3">
              {STRATEGY_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendPrompt(prompt.value)}
                  className="w-full text-left p-3.5 bg-white border border-slate-100 hover:border-emerald-300 rounded-2xl hover:bg-emerald-50/20 text-xs font-bold text-slate-700 hover:text-emerald-900 shadow-sm active:scale-[0.98] transition-all flex items-center gap-3 group"
                >
                  <span className="material-symbols-outlined text-emerald-600 group-hover:animate-pulse text-base">sports_soccer</span>
                  <span className="flex-1 leading-normal">{prompt.label}</span>
                  <span className="material-symbols-outlined text-xs text-slate-300 group-hover:text-emerald-600 transition-colors">arrow_forward</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.messageId || index} 
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar bubble */}
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black shadow-sm ${
                    isUser ? 'bg-emerald-800 text-white border border-emerald-700' : 'bg-white text-emerald-850 border border-slate-200'
                  }`}>
                    {isUser ? (
                      <span>{user?.fullName ? user.fullName[0].toUpperCase() : 'U'}</span>
                    ) : (
                      <span className="material-symbols-outlined text-base font-semibold select-none">smart_toy</span>
                    )}
                  </div>
                  
                  {/* Message content bubble */}
                  <div className={`p-4 rounded-2xl shadow-sm text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span className={`text-[8px] block mt-1 text-right font-medium ${isUser ? 'text-emerald-300' : 'text-slate-400'}`}>
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
          <div className="flex justify-start mb-4 animate-in fade-in duration-200">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-white text-emerald-850 border border-slate-200 shrink-0 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-base font-semibold select-none">smart_toy</span>
              </div>
              <div className="p-3 bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 py-4">
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
        className="p-4 border-t border-slate-100 bg-white flex gap-3 items-center shrink-0"
      >
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={currentConversationId && !deletedConvIds.includes(currentConversationId) ? "Hỏi HLV AI về chiến thuật, thể lực..." : "Vui lòng chọn hoặc tạo phiên hội thoại"}
          disabled={!currentConversationId || deletedConvIds.includes(currentConversationId) || isSending}
          className="flex-1 text-xs rounded-2xl h-10 px-4 border-slate-200 hover:border-emerald-700 focus:border-emerald-700"
          bordered={true}
        />
        <Button
          type="primary"
          htmlType="submit"
          disabled={!inputMessage.trim() || !currentConversationId || deletedConvIds.includes(currentConversationId) || isSending}
          className="bg-emerald-950 hover:bg-emerald-900 rounded-2xl h-10 w-10 flex items-center justify-center shrink-0 border-none transition-all"
        >
          <span className="material-symbols-outlined text-sm flex items-center justify-center text-white" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
        </Button>
      </form>
    </div>
  );
};

export default AiCoachChat;

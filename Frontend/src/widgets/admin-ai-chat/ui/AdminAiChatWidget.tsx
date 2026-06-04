import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/app/store/hooks';
import { selectActiveConversationId, setActiveConversation } from '@/entities/ai';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';


const AdminAiChatWidget: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const activeId = useSelector(selectActiveConversationId);

    const handleClose = () => {
        setIsOpen(false);
        dispatch(setActiveConversation(null));
    };

    const handleBack = () => {
        dispatch(setActiveConversation(null));
    };

    return (
        <>
            {/* CSS cho typing dots animation */}
            <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-[1000] bg-emerald-650 text-white border-none rounded-full w-14 h-14 cursor-pointer flex items-center justify-center text-2xl shadow-lg shadow-emerald-600/40 transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-emerald-605/50"
                    title="AI Trợ lý Admin"
                >
                    🤖
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-[1000] w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
                    {/* Header */}
                    <div className="py-3.5 px-4 bg-emerald-650 flex items-center gap-2.5">
                        {activeId && (
                            <button
                                onClick={handleBack}
                                className="bg-transparent border-none text-white cursor-pointer p-1 flex items-center justify-center"
                            >
                                <ArrowLeftOutlined />
                            </button>
                        )}
                        <div className="flex-1">
                            <p className="m-0 text-white font-semibold text-sm">
                                🤖 AI Admin Assistant
                            </p>
                            <p className="m-0 text-white/75 text-[11px]">
                                {activeId ? 'Đang trò chuyện' : 'Chọn hoặc tạo hội thoại'}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="bg-transparent border-none text-white cursor-pointer p-1 flex items-center justify-center"
                        >
                            <CloseOutlined />
                        </button>
                    </div>

                    {/* Body */}
                    {activeId
                        ? <ChatWindow conversationId={activeId} />
                        : <ConversationList />
                    }
                </div>
            )}
        </>
    );
};

export default AdminAiChatWidget;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/app/store/hooks';
import { selectActiveConversationId } from '@/entities/ai/model/selectors';
import { setActiveConversation } from '@/entities/ai/model/aiSlice';
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
                    style={{
                        position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
                        background: '#059669', color: 'white',
                        border: 'none', borderRadius: 50,
                        width: 56, height: 56, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, boxShadow: '0 4px 20px rgba(5,150,105,0.4)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 6px 24px rgba(5,150,105,0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(5,150,105,0.4)';
                    }}
                    title="AI Trợ lý Admin"
                >
                    🤖
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
                    width: 400, height: 600,
                    background: 'white', borderRadius: 16,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', border: '1px solid #e5e7eb',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '14px 16px',
                        background: '#059669',
                        display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                        {activeId && (
                            <button
                                onClick={handleBack}
                                style={{
                                    background: 'transparent', border: 'none',
                                    color: 'white', cursor: 'pointer', padding: 4,
                                }}
                            >
                                <ArrowLeftOutlined />
                            </button>
                        )}
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, color: 'white', fontWeight: 600, fontSize: 14 }}>
                                🤖 AI Admin Assistant
                            </p>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
                                {activeId ? 'Đang trò chuyện' : 'Chọn hoặc tạo hội thoại'}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            style={{
                                background: 'transparent', border: 'none',
                                color: 'white', cursor: 'pointer', padding: 4,
                            }}
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

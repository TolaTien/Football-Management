import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button, Spin } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/app/store/hooks';
import {
    selectMessages, selectLoadingSend, selectLoadingMessages,
} from '@/entities/ai/model/selectors';
import { sendMessage, appendOptimisticMessage } from '@/entities/ai/model/aiSlice';
import type { AiMessage } from '@/entities/ai/types';
import { v4 as uuidv4 } from 'uuid';
import MessageBubble from './MessageBubble';

interface Props {
    conversationId: string;
}

const TypingDots: React.FC = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px' }}>
        {[0, 1, 2].map((i) => (
            <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%', background: '#9ca3af',
                animation: `bounce 1.2s ${i * 0.2}s infinite`,
            }} />
        ))}
    </div>
);

const ChatWindow: React.FC<Props> = ({ conversationId }) => {
    const dispatch = useAppDispatch();
    const messages = useSelector(selectMessages);
    const loadingSend = useSelector(selectLoadingSend);
    const loadingMessages = useSelector(selectLoadingMessages);
    const [inputValue, setInputValue] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loadingSend]);

    const handleSend = async () => {
        const content = inputValue.trim();
        if (!content || loadingSend) return;
        setInputValue('');

        // Optimistic update: hiển thị tin nhắn user ngay lập tức
        const optimistic: AiMessage = {
            messageId: uuidv4(),
            conversationId,
            sender: 'user',
            content,
            createdAt: new Date().toISOString(),
        };
        dispatch(appendOptimisticMessage(optimistic));
        dispatch(sendMessage({ conversationId, content }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (loadingMessages) {
        return (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Messages area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: 40, fontSize: 13 }}>
                        <p>🤖 Xin chào Admin!</p>
                        <p>Bạn có thể hỏi tôi về doanh thu, lịch sân, hay thống kê.</p>
                    </div>
                )}
                {messages.map((msg) => (
                    <MessageBubble key={msg.messageId} message={msg} />
                ))}
                {loadingSend && <TypingDots />}
                <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div style={{
                borderTop: '1px solid #e5e7eb',
                padding: '12px 16px',
                display: 'flex',
                gap: 8,
            }}>
                <Input.TextArea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập câu hỏi... (Enter để gửi)"
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    disabled={loadingSend}
                    style={{ borderRadius: 12, fontSize: 13 }}
                />
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    disabled={!inputValue.trim() || loadingSend}
                    style={{ background: '#059669', borderColor: '#059669', borderRadius: 12, height: 'auto' }}
                />
            </div>
        </div>
    );
};

export default ChatWindow;

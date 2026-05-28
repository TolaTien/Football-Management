import React from 'react';
import type { AiMessage } from '@/entities/ai/types';

interface Props {
    message: AiMessage;
}

const MessageBubble: React.FC<Props> = ({ message }) => {
    const isUser = message.sender === 'user';

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                marginBottom: 12,
            }}
        >
            {!isUser && (
                <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#059669', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    marginRight: 8, flexShrink: 0,
                }}>
                    <span style={{ color: 'white', fontSize: 16 }}>🤖</span>
                </div>
            )}
            <div
                style={{
                    maxWidth: '75%',
                    padding: '10px 14px',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isUser ? '#059669' : '#f3f4f6',
                    color: isUser ? 'white' : '#111827',
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}
            >
                {message.content}
            </div>
        </div>
    );
};

export default MessageBubble;

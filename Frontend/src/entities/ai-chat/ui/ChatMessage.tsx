import React from 'react';
import type { AiMessage } from '../api/types';

interface ChatMessageProps {
  message: AiMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'model';

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isBot
            ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
            : 'bg-primary text-white rounded-tr-sm'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm break-words">{message.content}</p>
        <span
          className={`text-[10px] mt-1 block ${
            isBot ? 'text-gray-400' : 'text-gray-200'
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};

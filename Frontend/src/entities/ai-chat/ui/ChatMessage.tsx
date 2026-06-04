import React from 'react';
import type { AiMessage } from '../api/types';
import { useAppSelector } from '@/app/store/hooks';
import dayjs from 'dayjs';

interface ChatMessageProps {
  message: AiMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'model';
  const { currentUser } = useAppSelector((state) => state.user);

  return (
    <div className={`flex w-full mb-4 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 ${isBot ? 'justify-start flex-row' : 'justify-end flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black shadow-sm ${
        isBot 
          ? 'bg-slate-100 text-emerald-800 border border-slate-200' 
          : 'bg-emerald-800 text-white border border-emerald-700'
      }`}>
        {isBot ? (
          <span className="material-symbols-outlined text-sm font-semibold select-none">smart_toy</span>
        ) : (
          <span>{currentUser?.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}</span>
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-xs leading-relaxed ${
          isBot
            ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            : 'bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-tr-none'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <span
          className={`text-[8px] mt-1 block text-right font-medium ${
            isBot ? 'text-slate-400' : 'text-emerald-300'
          }`}
        >
          {dayjs(message.createdAt).format('HH:mm')}
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { GroundingChip } from './GroundingChip';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] sm:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? 'bg-gray-900 text-white' : 'bg-brand-600 text-white'
        }`}>
          {isUser ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <div className={`px-4 py-3 rounded-2xl shadow-sm text-base leading-relaxed whitespace-pre-wrap ${
            isUser 
              ? 'bg-gray-900 text-white rounded-tr-sm' 
              : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
          }`}>
            {message.text}
          </div>

          {/* Grounding Sources (Map Cards) */}
          {message.groundingChunks && message.groundingChunks.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {message.groundingChunks.map((chunk, idx) => (
                <GroundingChip key={idx} chunk={chunk} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
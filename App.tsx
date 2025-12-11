import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatMessage as ChatMessageType, AppStatus, Coordinates } from './types';
import { generateLocationResponse } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá! Sou o Localizei. Posso ajudar você a encontrar lugares, serviços ou pontos turísticos. O que você procura hoje?',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Request Geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Location access denied or failed:", error);
        }
      );
    }
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || status === AppStatus.PROCESSING) return;

    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setStatus(AppStatus.PROCESSING);

    try {
      const response = await generateLocationResponse(userMsg.text, userLocation);
      
      const modelMsg: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        groundingChunks: response.groundingChunks,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, modelMsg]);
      setStatus(AppStatus.IDLE);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMsg: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Desculpe, tive um problema ao buscar essas informações. Por favor, tente novamente.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Main Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {status === AppStatus.PROCESSING && (
            <div className="flex justify-start w-full mb-6">
              <div className="flex flex-row gap-3">
                 <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                 </div>
                 <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm text-gray-500 italic text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <span>Procurando lugares...</span>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-gray-50 pt-2 pb-4">
          <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto">
            <div className="relative flex items-center">
               <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ex: Onde tem pizza perto daqui?"
                className="w-full pl-6 pr-14 py-4 bg-white border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-shadow"
                disabled={status === AppStatus.PROCESSING}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || status === AppStatus.PROCESSING}
                className="absolute right-2 p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 7-7 7 7"/>
                  <path d="M12 19V5"/>
                </svg>
              </button>
            </div>
            
            {!userLocation && (
              <p className="text-center text-xs text-amber-600 mt-2 flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                Ative a localização para resultados mais precisos.
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default App;
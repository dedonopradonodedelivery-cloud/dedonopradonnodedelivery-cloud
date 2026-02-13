import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { X, Send, Loader2, Mic, RefreshCw, AlertCircle } from 'lucide-react';
import { ChatMessage } from '@/types';

const TucoAvatarLarge: React.FC = () => (
  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20">
    <svg viewBox="0 0 240 200" className="w-8 h-8">
        <defs>
        <linearGradient id="tuco_body_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="tuco_beak_grad" x1="0%" y1="0%" x2="100%" y2="20%">
            <stop offset="0%" stopColor="#FFD233" />
            <stop offset="45%" stopColor="#FF9F00" />
            <stop offset="100%" stopColor="#FF4D00" />
        </linearGradient>
        </defs>
        <path d="M75 175C35 175 15 145 20 95C25 45 55 25 90 25C120 25 145 50 145 100C145 150 115 175 80 175Z" fill="url(#tuco_body_grad)" />
        <path d="M88 162C72 162 64 148 64 108C64 68 76 48 94 48C102 48 110 58 114 78C118 98 114 144 104 156C100 160 94 162 88 162Z" fill="white" />
        <circle cx="94" cy="82" r="18" fill="white" /> 
        <circle cx="99" cy="82" r="9.5" fill="#0F172A" /> 
        <circle cx="103" cy="77" r="3.5" fill="white" /> 
        <path d="M115 60C155 48 220 70 230 100C235 125 185 140 145 140Z" fill="url(#tuco_beak_grad)" />
    </svg>
  </div>
);

interface AssistantProps {
    isExternalOpen: boolean;
    onClose: () => void;
}

export const GeminiAssistant: React.FC<AssistantProps> = ({ isExternalOpen, onClose }) => {
  const INITIAL_GREETING = 'Olá! Sou o Tuco 🦜 Como posso ajudar você no bairro hoje?';
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: INITIAL_GREETING, type: 'response' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = useCallback(async (messageOverride?: string) => {
    const textToSend = (messageOverride || input).trim();
    if (!textToSend || isLoading) return;

    if (!messageOverride) setInput('');
    
    const userMsg: ChatMessage = { role: 'user', text: textToSend, type: 'response' };
    
    setMessages(prev => [
        ...prev.filter(m => m.type !== 'error'), 
        userMsg
    ]);
    
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Filtramos o histórico para garantir que:
      // 1. Comece sempre com uma mensagem do usuário (Regra da API Gemini para histórico)
      // 2. Não inclua a saudação inicial se ela for a única mensagem do modelo antes do primeiro user input
      const chatHistory = messages
        .filter(m => m.type === 'response' && m.text && m.text !== INITIAL_GREETING)
        .map(m => ({ 
          role: m.role, 
          parts: [{ text: m.text || '' }] 
        }));

      // Usamos a API de Chat que é mais robusta para conversação
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Você é Tuco, o assistente inteligente oficial do Localizei JPA. 
          Sua missão é ajudar moradores a encontrar lojas, serviços, cupons e vagas de emprego em Jacarepaguá/RJ. 
          Bairros de atuação: Freguesia, Taquara, Pechincha, Anil, Tanque, Curicica, etc.
          Personalidade: Extremamente útil, rápido, amigável, usa emojis de vez em quando e conhece o Rio de Janeiro.`,
          temperature: 0.7,
        },
        history: chatHistory
      });

      const result = await chat.sendMessage({ message: textToSend });
      const modelText = result.text;
      
      if (!modelText) throw new Error("EMPTY_RESPONSE");

      setMessages(prev => [
        ...prev,
        { role: 'model', text: modelText, type: 'response' }
      ]);

    } catch (error: any) {
      console.error("[Tuco Error]", error);
      let errorMessage = "Tive um problema técnico para te responder agora.";
      
      setMessages(prev => [
        ...prev,
        { 
          role: 'model', 
          text: errorMessage, 
          type: 'error',
          action: 'retry',
          originalUserMessage: textToSend
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const startVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) handleSend(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, [handleSend]);

  if (!isExternalOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header - Identical to Image */}
        <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] p-5 flex justify-between items-center shadow-md relative z-10">
          <div className="flex items-center gap-3">
            <TucoAvatarLarge />
            <div>
              <h3 className="font-black text-white text-xl tracking-tight leading-none">TUCO</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]"></div>
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-50">Pronto para ajudar</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl text-white transition-colors active:scale-90">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Chat Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50 dark:bg-gray-950 no-scrollbar scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] p-4 rounded-[1.75rem] text-sm font-semibold leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#2563EB] text-white rounded-br-none shadow-blue-500/10' 
                  : msg.type === 'error'
                    ? 'bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 rounded-bl-none text-center'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
              }`}>
                {msg.type === 'error' ? (
                  <div className="space-y-4 py-1">
                    <p>{msg.text}</p>
                    <button 
                      onClick={() => handleSend(msg.originalUserMessage)}
                      className="w-full flex items-center justify-center gap-2 bg-[#EF4444] text-white px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md"
                    >
                      <RefreshCw size={14} strokeWidth={3} /> Tentar Novamente
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`Erro Tuco: ${msg.text}`);
                        alert("Instruções copiadas!");
                      }}
                      className="text-[8px] text-rose-400 uppercase font-black tracking-widest hover:underline"
                    >
                      Copiar instruções de erro
                    </button>
                  </div>
                ) : (
                  <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-[1.75rem] rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex gap-1.5 py-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                </div>
             </div>
          )}
        </div>

        {/* Input Area - Identical to Image */}
        <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-3">
            <div className="relative flex-1 group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    placeholder="Como o Tuco pode te ajudar?"
                    className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white rounded-[1.25rem] px-5 py-4 pr-12 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/30 border border-blue-100/50 dark:border-gray-700 placeholder-gray-400 transition-all disabled:opacity-50"
                />
                <button
                    type="button"
                    onClick={startVoiceInput}
                    disabled={isLoading}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all active:scale-95
                                ${isListening ? 'text-[#EF4444] animate-pulse' : 'text-gray-400 hover:text-blue-500'}`}
                >
                    <Mic className="w-5 h-5 fill-current" />
                </button>
            </div>
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#3B82F6] text-white p-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-90 transition-all flex items-center justify-center shrink-0 disabled:opacity-50"
            >
              <Send className="w-5 h-5 fill-current transform rotate-[-15deg]" />
            </button>
          </form>
          <p className="text-[8px] text-center text-gray-400 font-black uppercase tracking-[0.1em] mt-4 opacity-70">
            Powered by Google Gemini • JPA Intelligence
          </p>
        </div>
      </div>
    </div>
  );
};
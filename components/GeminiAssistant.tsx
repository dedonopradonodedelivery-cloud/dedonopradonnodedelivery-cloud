
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { X, Send, Loader2, Mic, RefreshCw, AlertCircle, Copy, Check } from 'lucide-react';
import { ChatMessage } from '@/types';
import { LOKA_MASCOT_BASE64 } from '@/constants';

const LokaAvatarLarge: React.FC = () => (
  <div className="w-10 h-10 bg-transparent rounded-full flex items-center justify-center overflow-hidden">
    <img src={LOKA_MASCOT_BASE64} alt="Mascote LOKA" className="w-12 h-12 object-contain" />
  </div>
);

interface AssistantProps {
    isExternalOpen: boolean;
    onClose: () => void;
}

export const GeminiAssistant: React.FC<AssistantProps> = ({ isExternalOpen, onClose }) => {
  const INITIAL_GREETING = 'Olá! Sou a LOKA 🦜 Como posso ajudar você no bairro hoje?';
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: INITIAL_GREETING, type: 'response' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastError, setLastError] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const copyErrorDetails = () => {
    if (!lastError) return;
    const errorLog = `
--- LOCALIZEI JPA - ERRO IA ---
Timestamp: ${new Date().toISOString()}
Message: ${lastError.message || 'Erro desconhecido'}
Status: ${lastError.status || 'N/A'}
Model: gemini-3-flash-preview
Endpoint: generateContent
    `.trim();
    
    navigator.clipboard.writeText(errorLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    setLastError(null);

    try {
      // Inicialização conforme diretrizes obrigatórias
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construção do histórico para o modelo
      const history = messages
        .filter(m => m.type === 'response' && m.text && m.text !== INITIAL_GREETING)
        .map(m => ({ 
          role: m.role, 
          parts: [{ text: m.text || '' }] 
        }));

      // Chamada direta conforme diretrizes: ai.models.generateContent
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...history, { role: 'user', parts: [{ text: textToSend }] }],
        config: {
          systemInstruction: `Você é LOKA, a assistente inteligente oficial do Localizei JPA. 
          Sua missão é ajudar moradores a encontrar lojas, serviços, cupons e vagas de emprego em Jacarepaguá/RJ. 
          Bairros de atuação: Freguesia, Taquara, Pechincha, Anil, Tanque, Curicica, etc.
          Personalidade: Extremamente útil, rápido, amigável, usa emojis e conhece Jacarepaguá como ninguém. LOKA, a IA de JPA.`,
          temperature: 0.7,
          topP: 0.95,
        },
      });

      const modelText = response.text;
      
      if (!modelText) throw new Error("A API retornou uma resposta vazia (Empty Response).");

      setMessages(prev => [
        ...prev,
        { role: 'model', text: modelText, type: 'response' }
      ]);

    } catch (error: any) {
      console.error("[LOKA API Error]", error);
      setLastError(error);
      
      setMessages(prev => [
        ...prev,
        { 
          role: 'model', 
          text: "Tive um problema técnico para te responder agora. Pode ser a conexão ou um ajuste no sistema.", 
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
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] p-5 flex justify-between items-center shadow-md relative z-10">
          <div className="flex items-center gap-3">
            <LokaAvatarLarge />
            <div>
              <h3 className="font-black text-white text-xl tracking-tight leading-none uppercase">LOKA</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]"></div>
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-50">LOKA, a IA de JPA</p>
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
                    ? 'bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 rounded-bl-none'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
              }`}>
                {msg.type === 'error' ? (
                  <div className="space-y-4 py-1 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black uppercase text-[10px] tracking-widest">
                        <AlertCircle size={14} /> Ops! Algo deu errado
                    </div>
                    <p>{msg.text}</p>
                    <div className="grid grid-cols-1 gap-2 w-full">
                        <button 
                          onClick={() => handleSend(msg.originalUserMessage)}
                          className="w-full flex items-center justify-center gap-2 bg-[#EF4444] text-white px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md"
                        >
                          <RefreshCw size={14} strokeWidth={3} /> Tentar Novamente
                        </button>
                        <button 
                          onClick={copyErrorDetails}
                          className="flex items-center justify-center gap-2 text-[8px] text-rose-400 uppercase font-black tracking-widest hover:underline"
                        >
                          {/* Fixed invalid JSX by adding fragment */}
                          {copied ? <><Check size={10}/> Copiado</> : <><Copy size={10}/> Copiar detalhes do erro</>}
                        </button>
                    </div>
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

        {/* Input Area */}
        <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-3">
            <div className="relative flex-1 group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    placeholder="Como a LOKA pode te ajudar?"
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
            Powered by Google Gemini • Vercel Ready v1.1
          </p>
        </div>
      </div>
    </div>
  );
};

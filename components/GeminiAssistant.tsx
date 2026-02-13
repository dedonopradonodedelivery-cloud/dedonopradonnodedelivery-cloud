
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { X, Send, Loader2, Mic, RefreshCw, AlertCircle } from 'lucide-react';
import { ChatMessage } from '@/types';

const TucoAvatarLarge: React.FC = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" rx="30" fill="url(#assist_tuco_bg)" />
      <defs>
        <linearGradient id="assist_tuco_bg" x1="0" y1="0" x2="100" y2="100">
          <stop stopColor="#2D6DF6" />
          <stop offset="1" stopColor="#1E5BFF" />
        </linearGradient>
        <linearGradient id="assist_beak" x1="60" y1="30" x2="95" y2="60">
          <stop stopColor="#FFD233" />
          <stop offset="0.6" stopColor="#FF9F00" />
          <stop offset="1" stopColor="#FF6B00" />
        </linearGradient>
      </defs>
      <g transform="translate(10, 10) scale(0.8)">
        <path d="M50 85C25 85 10 70 10 45C10 20 25 10 50 10C75 10 90 25 90 50C90 75 75 85 50 85Z" fill="#0F172A" />
        <path d="M50 80C35 80 25 68 25 50C25 32 35 20 50 20C55 20 58 22 58 28C58 35 55 40 50 40C42 40 38 45 38 50C38 55 42 60 50 60C55 60 58 65 58 72C58 78 55 80 50 80Z" fill="white" opacity="0.95" />
        <path d="M75 35C95 30 115 45 110 65C105 78 85 82 70 70L65 45C65 38 68 35 75 35Z" fill="url(#assist_beak)" />
        <circle cx="65" cy="40" r="8" fill="#1E5BFF" />
        <circle cx="65" cy="40" r="3.5" fill="#0F172A" />
      </g>
    </svg>
);

interface AssistantProps {
    isExternalOpen: boolean;
    onClose: () => void;
}

export const GeminiAssistant: React.FC<AssistantProps> = ({ isExternalOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá! Sou o Tuco 🦜 Como posso ajudar você no bairro hoje?', type: 'response' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll sempre que as mensagens mudarem ou o estado de loading mudar
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      scrollRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading, isExternalOpen]);

  const handleSend = useCallback(async (messageOverride?: string) => {
    const textToSend = (messageOverride || input).trim();
    if (!textToSend || isLoading) return;

    // 1. Limpar input e remover estados temporários anteriores (erros/typing)
    if (!messageOverride) setInput('');
    setMessages(prev => prev.filter(m => m.type !== 'typing' && m.type !== 'error'));

    // 2. Adicionar mensagem do usuário
    const userMsg: ChatMessage = { role: 'user', text: textToSend, type: 'response' };
    setMessages(prev => [...prev, userMsg, { role: 'model', type: 'typing' }]);
    setIsLoading(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      // 3. Preparar contexto (últimas 6 mensagens para economia de tokens e precisão)
      const context = messages
        .filter(m => m.type === 'response' && m.text)
        .slice(-6)
        .map(m => ({ role: m.role, parts: [{ text: m.text || '' }] }));

      const payload = [...context, { role: 'user', parts: [{ text: textToSend }] }];

      // Timeout de segurança de 15 segundos
      const responsePromise = ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: payload,
        config: {
          systemInstruction: `Você é Tuco, o assistente inteligente oficial do Localizei JPA. 
          Jacarepaguá é um bairro enorme no Rio de Janeiro. Sua missão é ajudar moradores a encontrar lojas, 
          serviços (como eletricistas, encanadores), cupons e vagas de emprego. 
          Personalidade: Útil, rápido, amigável e conhece bem as sub-regiões (Freguesia, Taquara, Pechincha, Anil, etc).`,
          temperature: 0.7,
        },
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 15000)
      );

      const response: any = await Promise.race([responsePromise, timeoutPromise]);
      
      const modelText = response.text || "Pode repetir de outra forma? Não consegui processar essa informação.";

      // 4. Sucesso: Substituir typing pela resposta real
      setMessages(prev => [
        ...prev.filter(m => m.type !== 'typing'),
        { role: 'model', text: modelText, type: 'response' }
      ]);
    } catch (error: any) {
      console.error("Tuco Chat Error:", error);
      // 5. Erro: Substituir typing por mensagem de erro com retry
      setMessages(prev => [
        ...prev.filter(m => m.type !== 'typing'),
        { 
          role: 'model', 
          text: "Ops! Tive um soluço técnico aqui. Pode tentar enviar de novo?", 
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
    if (!SpeechRecognition) {
        alert("Seu navegador não suporta entrada de voz.");
        return;
    }

    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, [handleSend]);

  if (!isExternalOpen) return null;

  return (
    <div className="fixed inset-0 z-[1002] flex items-end justify-center sm:items-center sm:bg-black/60 p-4 pb-24 sm:pb-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md h-[80vh] sm:h-[650px] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom duration-500">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 flex justify-between items-center shadow-lg relative z-10">
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl p-1">
                <TucoAvatarLarge />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tighter uppercase leading-none">Tuco</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">
                  {isLoading ? 'Pensando...' : 'Pronto para ajudar'}
                </p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-950 no-scrollbar scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-lg' 
                  : msg.type === 'error'
                    ? 'bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-bl-none'
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 shadow-sm rounded-bl-none'
              }`}>
                {msg.type === 'typing' ? (
                    <div className="flex gap-1 py-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                ) : (
                    <div className="space-y-3">
                      <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                      {msg.type === 'error' && msg.action === 'retry' && (
                        <button 
                          onClick={() => handleSend(msg.originalUserMessage)}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all"
                        >
                          <RefreshCw size={14} /> Tentar novamente
                        </button>
                      )}
                    </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== 'model' && (
             <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex gap-1 py-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
            <div className="relative flex-1">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    placeholder={isLoading ? "Tuco está pensando..." : "Como o Tuco pode te ajudar?"}
                    className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl px-5 py-4 pr-12 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50"
                />
                <button
                    type="button"
                    onClick={startVoiceInput}
                    disabled={isLoading}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all active:scale-95
                                ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-blue-500'}`}
                >
                    <Mic className="w-5 h-5 fill-current" />
                </button>
            </div>
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white p-4 rounded-2xl disabled:opacity-50 hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center justify-center min-w-[56px]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 fill-current" />}
            </button>
          </form>
          <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest mt-4 opacity-50">
            Powered by Google Gemini • JPA Intelligence
          </p>
        </div>
      </div>
    </div>
  );
};

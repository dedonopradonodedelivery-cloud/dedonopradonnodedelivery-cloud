
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { X, Send, Loader2, Mic } from 'lucide-react'; // Import Mic icon
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
  const [isListening, setIsListening] = useState(false); // State for mic listening
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null); // Ref for SpeechRecognition instance

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isExternalOpen]);

  // Modified handleSend to accept an optional message to send
  const handleSend = useCallback(async (messageToSend?: string) => {
    const userMsg = messageToSend || input;
    if (!userMsg.trim() || isLoading) return;

    // Clear any previous typing/error messages from the end of the chat
    setMessages(prev => prev.filter(m => m.type === 'response'));

    const currentUserMsg: ChatMessage = { role: 'user', text: userMsg, type: 'response' };
    
    // Add user message to chat only if it's a new message
    // This prevents duplicating the message if voice input is auto-sending and the text is already in state
    if (messages.length === 0 || messages.at(-1)?.text !== userMsg || messages.at(-1)?.role !== 'user') {
      setMessages(prev => [...prev, currentUserMsg]);
    }
    
    // Clear input field if it was a manual send or if the voice transcript was consumed
    if (!messageToSend || (messageToSend && input === messageToSend)) {
      setInput('');
    }

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'model', type: 'typing' }]); // Add typing indicator

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      // Build conversation context from previous response messages
      const conversationContext = messages
        .filter(m => m.type === 'response' && m.text)
        .map(m => ({ role: m.role, parts: [{ text: m.text || '' }] }));

      const payload = [...conversationContext, { role: 'user', parts: [{ text: userMsg }] }];

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: payload,
        config: {
          systemInstruction: `Você é Tuco, assistente premium do Localizei JPA. Personalidade: Amigável, Natural, Sofisticada. Nunca repita saudações iniciais. Foco: Ajudar a encontrar serviços, comércios e classificados em Jacarepaguá.`,
          temperature: 0.7,
        },
      });
      
      // Replace typing indicator with model's response
      setMessages(prev => [...prev.slice(0, -1), { role: 'model', text: response.text || "Pode repetir?", type: 'response' }]);
    } catch (error: any) {
      setMessages(prev => [...prev.slice(0, -1), { role: 'model', text: "Ops, tive um problema técnico.", type: 'error' }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]); // Dependencies for useCallback

  const startVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Seu navegador não suporta entrada de voz.");
        return;
    }

    // Stop any ongoing recognition before starting a new one
    if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false; // We only care about the final result
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition; // Store instance to manage it

    recognition.onstart = () => {
        setIsListening(true);
        setInput(''); // Clear input when starting voice capture
        setMessages(prev => prev.filter(m => m.type === 'response')); // Clear temporary UI messages
    };

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // Display transcribed text in the input field
        // Automatically trigger sending the message if text is detected
        if (transcript.trim()) {
            handleSend(transcript); // Pass the transcript directly to handleSend
        }
    };

    recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            alert('Permissão de microfone negada. Por favor, habilite o acesso ao microfone nas configurações do seu navegador.');
        } else {
            // Only add a specific error message if it's not a permission issue
            setMessages(prev => [...prev, { role: 'model', text: "Não entendi. Pode repetir?", type: 'error' }]);
        }
    };

    recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null; // Clear the ref
    };

    recognition.start();
  }, [handleSend, setInput, setMessages]); // Dependencies for useCallback

  if (!isExternalOpen) return null;

  return (
    <div className="fixed inset-0 z-[1002] flex items-end justify-center sm:items-center sm:bg-black/60 p-4 pb-24 sm:pb-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md h-[80vh] sm:h-[650px] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 flex justify-between items-center shadow-lg relative z-10">
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl p-1">
                <TucoAvatarLarge />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tighter uppercase">Tuco</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Assistente Inteligente</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-950 no-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-lg' 
                  : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 shadow-sm rounded-bl-none'
              }`}>
                {msg.type === 'typing' ? (
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                ) : (
                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
            <div className="relative flex-1"> {/* Wrapper for input and mic icon */}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="O que você precisa no bairro?"
                    className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl px-5 py-4 pr-12 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <button
                    type="button" // Important: keep as type="button" to prevent form submission
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
              className="bg-blue-600 text-white p-4 rounded-2xl disabled:opacity-50 hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 fill-current" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
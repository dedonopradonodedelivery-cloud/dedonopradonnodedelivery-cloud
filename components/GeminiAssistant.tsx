
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/types';
import { STORES } from '@/constants';

const TucoAvatar: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background Circle with Premium Gradient */}
    <circle cx="50" cy="50" r="48" fill="url(#tuco_bg_grad)" />
    
    <defs>
      <linearGradient id="tuco_bg_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4D8BFF" />
        <stop offset="1" stopColor="#1E5BFF" />
      </linearGradient>
      
      <linearGradient id="tuco_beak_grad" x1="55" y1="35" x2="85" y2="65" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFCC33" />
        <stop offset="1" stopColor="#FF8800" />
      </linearGradient>
    </defs>

    {/* Mascot Group centered to avoid cropping */}
    <g transform="translate(5, 5)">
      {/* Body - Clean Silhouette */}
      <path 
        d="M45 75C25 75 15 60 15 40C15 20 25 15 45 15C60 15 70 25 70 45C70 65 60 75 45 75Z" 
        fill="#0F172A" 
      />
      
      {/* Chest - Minimalist White */}
      <path 
        d="M45 70C35 70 28 62 28 50C28 38 35 30 45 30C48 30 50 32 50 35C50 38 48 40 45 40C40 40 38 45 38 50C38 55 40 60 45 60C48 60 50 62 50 65C50 68 48 70 45 70Z" 
        fill="white" 
        opacity="0.95"
      />

      {/* Beak - Iconic Shape, adjusted margins */}
      <path 
        d="M65 35C82 32 92 42 88 55C84 65 70 68 60 62L58 45C58 40 60 36 65 35Z" 
        fill="url(#tuco_beak_grad)" 
      />
      
      {/* Eye - Modern & Charismatic */}
      <circle cx="58" cy="38" r="7" fill="#1E5BFF" />
      <circle cx="58" cy="38" r="3" fill="#0F172A" />
      <circle cx="59.5" cy="36.5" r="1.2" fill="white" />
    </g>
  </svg>
);

export const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá! Sou o Tuco 🦜 Como posso ajudar você no bairro hoje?', type: 'response' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (retryMessage?: string) => {
    const userMsg = retryMessage || input;
    if (!userMsg.trim() || isLoading) return;

    // Guardar mensagem atual para o histórico antes de limpar o input
    const currentUserMsg: ChatMessage = { role: 'user', text: userMsg, type: 'response' };

    setInput('');
    setIsLoading(true);
    
    // Adiciona a mensagem do usuário se não for um retry
    if (!retryMessage) {
      setMessages(prev => [...prev, currentUserMsg]);
    }
    
    // Adiciona o placeholder de digitação
    setMessages(prev => [...prev, { role: 'model', type: 'typing' }]);

    let intermediateTimer: ReturnType<typeof setTimeout> | null = null;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      // Inicia timer para mensagem intermediária de "personalidade"
      intermediateTimer = setTimeout(() => {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.type === 'typing') {
            const intermediateMessages = ["Boa 👍 Já entendi...", "Perfeito 😌 Só um instante...", "Deixa comigo..."];
            const randomMsg = intermediateMessages[Math.floor(Math.random() * intermediateMessages.length)];
            return [...prev.slice(0, -1), { role: 'model', text: randomMsg, type: 'intermediate' }];
          }
          return prev;
        });
      }, 1800);

      // PREPARAÇÃO DO HISTÓRICO PARA O GEMINI (Contexto/Memória)
      // Filtramos mensagens de erro, typing e intermediárias para manter o contexto limpo
      const conversationContext = messages
        .filter(m => m.type === 'response' && m.text)
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text || '' }]
        }));

      // Adiciona a mensagem atual ao contexto enviado para a API
      const payload = [...conversationContext, { role: 'user', parts: [{ text: userMsg }] }];

      const apiCallPromise = ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: payload,
        config: {
          systemInstruction: `Você é Tuco, assistente inteligente do app Localizei, um aplicativo premium de descoberta de serviços, comércios e classificados do bairro.

Sua personalidade deve ser: Amigável, Natural, Moderna, Leve e Elegante (premium, nunca infantil). Seu tom deve parecer humano, fluido e agradável.

REGRAS DE COMPORTAMENTO:
1. Nunca reinicie a conversa após a primeira interação. Não repita saudações completas como "Olá, sou o Tuco".
2. Sempre responda de forma contextual. Considere as mensagens anteriores enviadas no histórico.
3. Evite respostas robóticas ou institucionais. Prefira mensagens curtas e conversacionais.
4. Quando o usuário enviar mensagens curtas (ex: "opa", "oi"): Responda de forma leve, ex: "Olá 😉 Como posso ajudar?", "Oi 😌 O que você procura?". NUNCA reinicie apresentação.
5. Objetivo: Ajudar a encontrar Serviços, Comércios e Classificados úteis em Jacarepaguá.
6. Seja objetivo. Evite textos longos desnecessários. Transmita inteligência + proximidade + sofisticação.
7. Nunca soe como chatbot genérico.`,
          temperature: 0.6, // Aumentado levemente para maior naturalidade
        },
      });
      
      const timeoutPromise = new Promise<GenerateContentResponse>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 10000)
      );

      const response = await Promise.race([apiCallPromise, timeoutPromise]);
      
      setMessages(prev => [
        ...prev.slice(0, -1), 
        { role: 'model', text: response.text || "Desculpe, tive um contratempo. Pode repetir?", type: 'response' }
      ]);

    } catch (error: any) {
      const errorMessageText = error.message === 'timeout'
        ? "Tive uma pequena demora aqui 😕\nQuer tentar novamente?"
        : "Ops, tive um problema técnico. Tente novamente mais tarde.";

      setMessages(prev => [
        ...prev.slice(0, -1), 
        { role: 'model', text: errorMessageText, type: 'error', action: 'retry', originalUserMessage: userMsg }
      ]);
      console.error("Tuco Assistant Error:", error);
    } finally {
      setIsLoading(false);
      if (intermediateTimer) clearTimeout(intermediateTimer);
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] shadow-xl shadow-black/5 cursor-pointer transition-all active:scale-[0.99] group border border-gray-100 dark:border-gray-800 flex items-center gap-5"
      >
        <div className="w-16 h-16 flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-1 overflow-hidden flex items-center justify-center">
            <TucoAvatar className="w-full h-full" />
        </div>
        <div className="flex-1">
            <h3 className="font-black text-xl text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Olá, eu sou o Tuco!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">O que você busca no bairro agora?</p>
            <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-blue-500/60">
                Eletricista • Gás • Indicação • Ajuda
            </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[1002] flex items-end justify-center sm:items-center sm:bg-black/60 p-4 pb-24 sm:pb-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md h-[80vh] sm:h-[650px] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 flex justify-between items-center shadow-lg relative z-10">
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl p-1">
                    <TucoAvatar className="w-full h-full" />
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-tighter">Tuco</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Assistente Premium</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-950 no-scrollbar">
              {messages.map((msg, idx) => {
                if (msg.type === 'typing') {
                    return (
                        <div key={idx} className="flex justify-start animate-in slide-in-from-bottom-2">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tuco está pensando...</span>
                            </div>
                        </div>
                    );
                }
                
                return (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-500/20' 
                          : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 shadow-sm rounded-bl-none'
                      }`}>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                        {msg.action === 'retry' && msg.originalUserMessage && (
                            <button
                                onClick={() => handleSend(msg.originalUserMessage)}
                                className="mt-4 w-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest border border-blue-100 dark:border-blue-800 hover:bg-blue-100 transition-colors"
                            >
                                Tentar Novamente
                            </button>
                        )}
                      </div>
                    </div>
                );
              })}
            </div>

            <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="O que você precisa no bairro?"
                  className="flex-1 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 dark:placeholder-gray-600 transition-all"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 text-white p-4 rounded-2xl disabled:opacity-50 disabled:grayscale hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 fill-current" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { STORES } from '../constants';

const JotaAvatar: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
      fill="url(#paint0_linear_jota_avatar)"
    />
    {/* --- NOVO AVATAR DO JOTA --- */}
    <path 
      d="M9 25 C11 19, 14 15, 20 14 L30 16 C34 17, 34 20, 31 21 L23 23 C18 26, 12 28, 9 25 Z" 
      fill="white"
    />
    <circle cx="21" cy="17" r="2" fill="#1E5BFF"/>
    <circle cx="21.8" cy="16.2" r="0.6" fill="white"/>
    {/* --- FIM DO NOVO AVATAR --- */}
    <defs>
      <linearGradient
        id="paint0_linear_jota_avatar"
        x1="0"
        y1="0"
        x2="40"
        y2="40"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4D8BFF" />
        <stop offset="1" stopColor="#1E5BFF" />
      </linearGradient>
    </defs>
  </svg>
);

export const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá! Sou o Jota 🐊, seu assistente virtual do bairro. Como posso te ajudar a encontrar o que precisa em Jacarepaguá hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const systemInstruction = `Você é o Jota 🐊, um assistente virtual em formato de jacaré estilizado, mascote do app "Localizei JPA". Sua personalidade é a de um especialista local extremamente ágil, inteligente e prestativo.

**TOM E ESTILO (OBRIGATÓRIO):**
- **Natural e Moderno:** Use uma linguagem fluida e atual, como um assistente digital de ponta.
- **Seguro e Prestativo:** Demonstre confiança e disposição para ajudar imediatamente.
- **Levemente Simpático:** Seja amigável, mas nunca excessivamente informal ou caricato (evite piadas ou gírias exageradas).

**DIRETRIZES DE PROGRESSÃO (ESTÁGIO INICIAL):**
1.  **ESCOPO PRIORITÁRIO:** Sua especialidade inicial é em **[Serviços]**, **[Produtos Populares]** e **[Indicações]**. Concentre-se em resolver essas solicitações com perfeição.
2.  **EVITAR COMPLEXIDADE:** Não tente resolver tudo. Se um pedido for muito complexo ou fora do seu escopo atual (ex: debates, informações da comunidade muito específicas), responda de forma honesta e redirecione. Ex: "Ainda estou aprendendo sobre isso. Por enquanto, posso te ajudar a encontrar um serviço ou produto no bairro. O que você busca?".
3.  **REGRA CRÍTICA - CONFIANÇA PRIMEIRO:** Sua prioridade máxima é a taxa de acerto para construir a confiança do usuário. É melhor admitir uma limitação temporária do que errar. Minimize a frustração inicial.

**DIRETRIZES DE COMPORTAMENTO:**
1.  **RESPOSTAS ÁGEIS:** Sempre comece com frases curtas e seguras que mostrem entendimento instantâneo. Exemplos preferidos: "Boa 😌 Já entendi.", "Perfeito 👍 Vamos resolver isso.", "Deixa comigo.".
2.  **SEGURANÇA PRIMEIRO:**
    - Se houver **ambiguidade** ("preciso de um serviço barato"), faça uma pergunta curta e inteligente: "Entendi 👍 Qual tipo de serviço?".
    - Se tiver **baixa confiança** na dedução, confirme: "Ok, parece que você precisa de um eletricista. Confirma?".
    - **Nunca invente** informações ou assuma dados críticos.
3.  **CENÁRIOS PROBLEMÁTICOS:**
    - **Sem Resultados:** "Ainda não encontrei alguém disponível 😕 Quer ampliar a busca ou tentar outra opção?". Nunca diga "Nenhum resultado encontrado".
    - **Categoria Inexistente:** "Boa 👍 Ainda não temos essa categoria no bairro. Quer que eu registre seu pedido?".
4.  **ZERO FRICÇÃO:** Nunca diga "Não entendi" ou peça para o usuário "buscar em outra aba". Sua função é guiar e resolver.

**FLUXO DE RESPOSTA:**
1.  **Análise Interna:** Classifique a intenção do usuário como [Serviço], [Produto] ou [Comunidade], mas **NÃO** mencione essa classificação na sua resposta ao usuário.
2.  **Resposta ao Usuário:** Vá direto ao ponto, começando com uma das frases de confiança e seguindo com a ação (resposta direta, pergunta de esclarecimento ou pedido de confirmação).

**EXEMPLOS ATUALIZADOS:**
- **Usuário:** "meu chuveiro queimou e preciso de alguém pra hoje!"
  **Jota:** "Deixa comigo. Parece que você precisa de um eletricista para uma emergência, confirma?"

- **Usuário:** "problema no carro"
  **Jota:** "Boa 👍 É para manutenção, guincho ou um orçamento?"
  
- **Usuário:** "tem aluguel de jet ski na freguesia?"
  **Jota:** "Boa 👍 Ainda não temos essa categoria no bairro. Quer que eu registre seu pedido?"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction,
          temperature: 0.5,
        },
      });

      const text = response.text;
      setMessages(prev => [...prev, { role: 'model', text: text || "Desculpe, não entendi. Pode tentar de outra forma?" }]);

    } catch (error) {
      console.error("Gemini Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Ops, tive um problema técnico. Tente novamente mais tarde." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Bloco estático do Jota */}
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-lg shadow-black/5 cursor-pointer transition-all active:scale-[0.99] group border border-gray-100 dark:border-gray-800 flex items-center gap-4"
      >
        <JotaAvatar className="w-16 h-16 flex-shrink-0" />
        <div className="flex-1">
            <h3 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Olá, eu sou o Jota!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">O que você precisa no bairro agora?</p>
            <div className="mt-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Ex: eletricista, gás, indicação, ajuda…
            </div>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-[1002] flex items-end justify-center sm:items-center sm:bg-black/50 p-4 pb-24 sm:pb-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md h-[80vh] sm:h-[600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3 text-white">
                <JotaAvatar className="w-10 h-10" />
                <div>
                  <h3 className="font-bold text-lg">Jota, seu Assistente</h3>
                  <p className="text-xs text-blue-100">Inteligência Artificial do Bairro</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-sm rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Digitando...</span>
                    </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pergunte sobre lojas, serviços..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:placeholder-gray-500"
                />
                <button 
                  type="submit"
                  disabled={isThinking || !input.trim()}
                  className="bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
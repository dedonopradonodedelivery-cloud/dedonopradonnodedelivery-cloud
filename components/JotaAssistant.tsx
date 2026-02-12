
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sparkles, Send, X, Loader2, Zap, ShoppingBag, Users, MessageSquare, ArrowRight, Clock, CheckCircle2, ChevronRight, Check, AlertCircle, HelpCircle, SearchX } from 'lucide-react';

interface JotaAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, data?: any) => void;
  initialMessage?: string;
}

interface JotaAnalysis {
  tipo: 'Serviço' | 'Produto' | 'Comunidade' | 'Amíguo' | 'Inexistente' | 'SemResultados';
  categoria_label: string;
  urgencia: 'Baixa' | 'Média' | 'Alta' | 'Imediata';
  resposta_humana: string; 
  sugerir_acao?: 'solicitar_orcamento' | 'buscar_lojas' | 'ver_comunidade' | 'registrar_demanda';
  rota_destino?: string;
  sugestoes_interativas?: string[]; 
  confianca: 'baixa' | 'media' | 'alta';
}

export const JotaAssistant: React.FC<JotaAssistantProps> = ({ isOpen, onClose, onNavigate, initialMessage }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'jota', text: string, analysis?: JotaAnalysis }[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async (text: string) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsThinking(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Você é o Jota 🤖, a inteligência ultra-ágil de Jacarepaguá.
          
          PERSONALIDADE:
          - Inteligente, ágil, prestativo e levemente simpático.
          - Tom natural, seguro e moderno. Nunca caricato.
          - Respostas humanas (resposta_humana) devem ter entre 3 e 6 palavras no fluxo normal.

          COMPORTAMENTO SEGURO:
          1. AMBIGUIDADE: Se o pedido for vago (ex: "preciso de serviço", "carro"), responda EXATAMENTE: "Entendi 👍 Qual tipo de serviço?" e forneça opções específicas em 'sugestoes_interativas'.
          2. BAIXA CONFIANÇA: Nunca assuma dados críticos. Confirme antes de agir.
          3. INEXISTENTE: Se a categoria não existir em JPA, responda: "Boa 👍 Ainda não temos essa categoria no bairro." e mude tipo para 'Inexistente'.
          4. SEM RESULTADOS: Se não houver prestadores ativos no banco, responda: "Ainda não encontrei alguém disponível 😕" e mude tipo para 'SemResultados'.
          5. CONVERSÃO: Priorize levar o usuário para a rota correta o mais rápido possível.

          MAPEAMENTO:
          - Serviço -> 'services_landing'
          - Produto -> 'explore'
          - Conversa -> 'neighborhood_posts'

          RETORNE APENAS JSON:
          {
            "tipo": "Serviço" | "Produto" | "Comunidade" | "Amíguo" | "Inexistente" | "SemResultados",
            "categoria_label": "Nome Curto",
            "urgencia": "Baixa" | "Média" | "Alta" | "Imediata",
            "resposta_humana": "string (3-6 palavras)",
            "sugerir_acao": "solicitar_orcamento" | "buscar_lojas" | "ver_comunidade" | "registrar_demanda",
            "rota_destino": "string",
            "sugestoes_interativas": ["Opção A", "Opção B"],
            "confianca": "baixa" | "media" | "alta"
          }`,
          responseMimeType: "application/json",
        },
      });

      const analysis: JotaAnalysis = JSON.parse(response.text || '{}');
      setMessages(prev => [...prev, { role: 'jota', text: analysis.resposta_humana, analysis }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'jota', text: "Tô aqui 😌 O que manda?" }]);
    } finally {
      setIsThinking(false);
    }
  };

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'Imediata': return 'bg-red-500 text-white shadow-lg animate-pulse';
      case 'Alta': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in fade-in duration-300">
      <header className="px-6 pt-12 pb-6 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <span className="font-black text-xl italic">J</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
                <h2 className="font-black text-lg uppercase tracking-tighter dark:text-white leading-none">Jota 🤖</h2>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Inteligência JPA</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 hover:text-gray-900 active:scale-90 transition-all"><X size={20} /></button>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar pb-32">
        {messages.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center animate-bounce-slow">
                <Sparkles className="w-10 h-10 text-blue-500" />
            </div>
            <div className="space-y-2">
                <h3 className="font-black text-xl text-gray-800 dark:text-white uppercase tracking-tighter leading-tight">Manda pra mim 🤖</h3>
                <p className="text-sm text-gray-400 max-w-[240px] font-medium leading-relaxed">O que você precisa no bairro agora?</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-3 animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-5 rounded-[2.2rem] text-sm font-semibold shadow-sm border ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-100 dark:border-gray-800 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
            
            {msg.analysis && (
              <div className="w-full max-w-[85%] space-y-4 animate-in fade-in duration-500 delay-150">
                {/* Meta-tags de Reconhecimento */}
                {['Serviço', 'Produto', 'Comunidade'].includes(msg.analysis.tipo) && (
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
                      {msg.analysis.tipo === 'Serviço' && <Zap size={10} className="text-amber-500" />}
                      {msg.analysis.tipo === 'Produto' && <ShoppingBag size={10} className="text-blue-500" />}
                      {msg.analysis.tipo === 'Comunidade' && <Users size={10} className="text-purple-500" />}
                      <span className="text-[10px] font-black uppercase tracking-tight text-gray-600 dark:text-gray-400">{msg.analysis.categoria_label}</span>
                    </div>
                    
                    {msg.analysis.urgencia !== 'Baixa' && (
                      <div className={`px-3 py-1.5 rounded-full border shadow-sm flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${getUrgencyStyles(msg.analysis.urgencia)}`}>
                          <Clock size={10} />
                          {msg.analysis.urgencia}
                      </div>
                    )}
                  </div>
                )}

                {/* Sugestões de Resposta Rápida (Smart Disambiguation) */}
                {msg.analysis.sugestoes_interativas && msg.analysis.sugestoes_interativas.length > 0 && (
                    <div className="flex flex-wrap gap-2 py-1">
                        {msg.analysis.sugestoes_interativas.map(sug => (
                            <button 
                                key={sug}
                                onClick={() => handleSend(sug)}
                                className="px-4 py-2.5 bg-white dark:bg-gray-800 text-[#1E5BFF] dark:text-blue-400 rounded-full text-[11px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900 shadow-sm active:scale-95 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/40"
                            >
                                {sug}
                            </button>
                        ))}
                    </div>
                )}

                {/* Bloco de "Sem Resultados" */}
                {msg.analysis.tipo === 'SemResultados' && (
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <SearchX className="text-gray-400" size={20} />
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-200">Quer ampliar a busca ou tentar outra opção?</p>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => handleSend("Ampliar busca")} className="flex-1 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100 dark:border-gray-700">Ampliar busca</button>
                             <button onClick={() => setInput("Outra opção")} className="flex-1 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100 dark:border-gray-700">Outra opção</button>
                        </div>
                    </div>
                )}

                {/* Bloco de "Categoria Inexistente" */}
                {msg.analysis.tipo === 'Inexistente' && (
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <HelpCircle className="text-blue-500" size={20} />
                            <p className="text-xs font-bold text-blue-900 dark:text-blue-200">Quer que eu registre seu pedido?</p>
                        </div>
                        <button 
                            onClick={() => { onClose(); onNavigate('services_landing'); }}
                            className="w-full bg-[#1E5BFF] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                        >
                            Registrar demanda no bairro
                        </button>
                    </div>
                )}

                {/* Botão de Ação Primária (Conversão Direta) */}
                {msg.analysis.rota_destino && msg.analysis.confianca === 'alta' && (
                    <button 
                        onClick={() => { onClose(); onNavigate(msg.analysis!.rota_destino!); }}
                        className="w-full bg-[#1E5BFF] text-white py-5 rounded-[1.5rem] flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all group"
                    >
                        {msg.analysis.sugerir_acao === 'solicitar_orcamento' ? 'Resolver agora' : 'Ver opções em JPA'}
                        <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-[2rem] w-fit border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Jota está agilizando...</span>
          </div>
        )}
      </main>

      <footer className="p-4 pb-10 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 sticky bottom-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-2 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="O que você precisa, vizinho?"
            className="flex-1 bg-transparent border-none outline-none px-5 py-4 text-sm font-bold dark:text-white placeholder-gray-400"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isThinking}
            className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all disabled:opacity-50"
          >
            <Send size={24} className="ml-1" />
          </button>
        </form>
      </footer>
    </div>
  );
};

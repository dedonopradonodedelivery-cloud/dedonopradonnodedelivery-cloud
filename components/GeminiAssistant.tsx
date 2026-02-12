
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Zap, ShoppingBag, Users, ArrowRight, HelpCircle, SearchX, Clock, CheckCircle2,
    MessageCircle, X, Send, Sparkles, Loader2, 
    // FIX: Imported missing icons
    MessageSquare, AlertCircle
} from 'lucide-react';

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

interface JotaMessage {
  role: 'user' | 'jota';
  text: string;
  analysis?: JotaAnalysis;
}

interface JotaAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, data?: any) => void;
  initialMessage?: string;
}

const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'Imediata': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50';
      case 'Alta': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50';
      default: return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50';
    }
};

const JotaMessageContent: React.FC<{ 
  message: JotaMessage, 
  onNavigate: (view: string, data?: any) => void, 
  onSend: (text: string) => void 
}> = ({ message, onNavigate, onSend }) => {
    const { text, analysis } = message;

    if (!analysis) {
        return <p className="text-gray-800 dark:text-gray-200">{text}</p>;
    }

    const icons = {
        Serviço: <Zap size={12} className="text-amber-500" />,
        Produto: <ShoppingBag size={12} className="text-blue-500" />,
        Comunidade: <Users size={12} className="text-purple-500" />
    };

    const actionButtons: { [key: string]: { label: string; icon: React.ReactNode; action: () => void } } = {
        solicitar_orcamento: { label: 'Pedir Orçamento Grátis', icon: <MessageSquare size={14} />, action: () => onNavigate('services_landing') },
        buscar_lojas: { label: 'Explorar Lojas', icon: <ShoppingBag size={14} />, action: () => onNavigate('explore') },
        ver_comunidade: { label: 'Ir para JPA Conversa', icon: <Users size={14} />, action: () => onNavigate('neighborhood_posts') },
        registrar_demanda: { label: 'Registrar Minha Demanda', icon: <HelpCircle size={14} />, action: () => onNavigate('services_landing') }
    };
    
    const action = analysis.sugerir_acao ? actionButtons[analysis.sugerir_acao] : null;

    return (
        <div className="space-y-4">
            <p className="text-gray-800 dark:text-gray-200">{text}</p>
            
            <div className="flex flex-wrap gap-2">
              {['Serviço', 'Produto', 'Comunidade'].includes(analysis.tipo) && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600">
                  {icons[analysis.tipo as keyof typeof icons]}
                  <span className="text-[10px] font-black uppercase tracking-tight text-gray-600 dark:text-gray-400">{analysis.categoria_label}</span>
                </div>
              )}
              {analysis.urgencia !== 'Baixa' && (
                  <div className={`px-3 py-1.5 rounded-full border shadow-sm flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${getUrgencyStyles(analysis.urgencia)}`}>
                      <Clock size={10} /> {analysis.urgencia}
                  </div>
              )}
            </div>

            {analysis.sugestoes_interativas && analysis.sugestoes_interativas.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {analysis.sugestoes_interativas.map(sug => (
                        <button key={sug} onClick={() => onSend(sug)} className="px-4 py-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800 hover:bg-blue-100 active:scale-95 transition-all">
                            {sug}
                        </button>
                    ))}
                </div>
            )}
            
            {action && analysis.confianca === 'alta' && (
                <button onClick={action.action} className="w-full mt-2 bg-blue-600 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/10">
                    {action.icon} {action.label} <ArrowRight size={14} />
                </button>
            )}

            {analysis.tipo === 'Inexistente' && (
                 <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl flex items-center gap-3">
                    <SearchX size={18} className="text-gray-400" />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Quer que eu anote sua sugestão para o time?</p>
                 </div>
            )}
            {analysis.tipo === 'SemResultados' && (
                 <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={18} className="text-gray-400" />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Posso te ajudar com outra coisa?</p>
                 </div>
            )}
        </div>
    );
};

export const JotaAssistant: React.FC<JotaAssistantProps> = ({ isOpen, onClose, onNavigate, initialMessage }) => {
  const [messages, setMessages] = useState<JotaMessage[]>([
    { role: 'jota', text: 'Olá! Sou o Jota, a inteligência do bairro. Posso encontrar serviços, produtos e até te conectar com a vizinhança. O que você precisa?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialMessage && messages.length <= 1) {
      handleSend(initialMessage);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);
  
  const handleSend = async (sendText?: string) => {
    const userMsg = sendText || input;
    if (!userMsg.trim()) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const systemInstruction = `Você é o Jota 🤖, a inteligência ultra-ágil do app "Localizei JPA" para Jacarepaguá, RJ.

        PERSONALIDADE:
        - Inteligente, ágil, prestativo e simpático. Tom natural, seguro e moderno.
        - Respostas humanas (resposta_humana) devem ter entre 3 e 8 palavras.
        
        COMPORTAMENTO SEGURO:
        1. AMBIGUIDADE: Se o pedido for vago (ex: "preciso de serviço", "carro"), responda "Entendi 👍 Qual tipo de serviço?" e forneça opções em 'sugestoes_interativas'.
        2. BAIXA CONFIANÇA: Nunca assuma dados críticos. Confirme antes de agir.
        3. INEXISTENTE: Se a categoria não existir em JPA, responda "Boa 👍 Ainda não temos essa categoria no bairro." e mude tipo para 'Inexistente'.
        4. SEM RESULTADOS: Se não houver prestadores ativos, responda "Ainda não encontrei alguém disponível 😕" e mude tipo para 'SemResultados'.
        
        MAPEAMENTO DE ROTAS:
        - Serviço -> 'services_landing'
        - Produto/Loja -> 'explore'
        - Conversa/Comunidade -> 'neighborhood_posts'
        
        RETORNE APENAS JSON com a seguinte estrutura:
        {
          "tipo": "Serviço" | "Produto" | "Comunidade" | "Amíguo" | "Inexistente" | "SemResultados",
          "categoria_label": "Nome Curto da Categoria/Serviço",
          "urgencia": "Baixa" | "Média" | "Alta" | "Imediata",
          "resposta_humana": "string (3-8 palavras)",
          "sugerir_acao": "solicitar_orcamento" | "buscar_lojas" | "ver_comunidade" | "registrar_demanda",
          "rota_destino": "string (conforme mapeamento)",
          "sugestoes_interativas": ["Opção Curta A", "Opção Curta B"],
          "confianca": "baixa" | "media" | "alta"
        }`;
        
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const analysis: JotaAnalysis = JSON.parse(response.text || '{}');
      setMessages(prev => [...prev, { role: 'jota', text: analysis.resposta_humana || "Entendido! Deixa eu ver o que encontro para você.", analysis }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'jota', text: "Opa, tive um problema técnico. Tente me perguntar de novo." }]);
    } finally {
      setIsThinking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[400px] h-[90vh] max-h-[850px] bg-[#F8F9FC] dark:bg-gray-950 flex flex-col rounded-[3rem] shadow-2xl border-8 border-black overflow-hidden relative ring-4 ring-gray-700"
        onClick={e => e.stopPropagation()}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-xl z-50"></div>
        
        <header className="px-6 pt-12 pb-6 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 flex items-center justify-between z-40">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transition-transform duration-500 ${isThinking ? 'scale-110' : ''}`}>
              <span className={`font-black text-xl italic transition-opacity ${isThinking ? 'opacity-0' : 'opacity-100'}`}>J</span>
              {isThinking && <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse absolute" />}
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
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-3 animate-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[85%] p-5 rounded-[2.2rem] text-sm font-semibold shadow-sm border ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                  : 'bg-white dark:bg-gray-900 rounded-tl-none border-gray-100 dark:border-gray-800'
              }`}>
                {msg.role === 'jota' ? (
                  <JotaMessageContent message={msg} onNavigate={(v, d) => { onClose(); onNavigate(v, d); }} onSend={handleSend} />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
          )}
        </main>

        <footer className="p-4 pb-10 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 z-40">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
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
    </div>
  );
};

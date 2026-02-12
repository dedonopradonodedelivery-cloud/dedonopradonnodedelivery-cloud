import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { X, Send, Sparkles, Loader2, Zap, ShoppingBag, MessageSquare, ArrowRight, Bot, AlertTriangle, Clock } from 'lucide-react';
import { ChatMessage } from '../types';

interface JotaAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, data?: any) => void;
  initialMessage?: string;
}

interface JotaAnalysis {
  intent: 'Serviço' | 'Produto' | 'Comunidade' | 'Outro';
  category: string;
  urgency: 'Imediata' | 'Alta' | 'Normal';
  human_response: string;
  suggestedAction: 'open_services' | 'open_explore' | 'open_community' | 'none';
  smartOptions?: string[]; // Botões de resposta rápida sugeridos pela IA
}

export const JotaAssistant: React.FC<JotaAssistantProps> = ({ isOpen, onClose, onNavigate, initialMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Oi! Sou o Jota. 🤖 Do que você precisa no bairro agora?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<JotaAnalysis | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialMessage && messages.length === 1) {
      handleSend(initialMessage);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);
  
  const callGeminiAPI = async (userMsg: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const systemInstruction = `Você é o Jota 🤖, a inteligência central do Localizei JPA. 
Sua missão é ser o assistente mais útil e direto de Jacarepaguá.

TOM E PERSONALIDADE:
1.  TOM IDEAL: Seja natural, seguro, fluido e moderno. Levemente simpático, mas nunca excessivamente informal ou caricato.
2.  COMPORTAMENTO: Ágil, inteligente e prestativo. Seu objetivo é resolver.
3.  EXEMPLOS DE ESTILO: "Boa 😌 Já entendi.", "Perfeito 👍 Vamos resolver isso.", "Deixa comigo."

ESCOPO E EVOLUÇÃO (COMPORTAMENTO PROGRESSIVO):
1.  FOCO INICIAL: Sua prioridade é acertar o básico com perfeição para construir confiança. Concentre-se em resolver solicitações claras e diretas.
2.  PRIORIDADES ATUAIS:
    *   SERVIÇOS: Identifique e direcione pedidos de profissionais (eletricista, pintor, etc.).
    *   PRODUTOS POPULARES: Identifique e direcione buscas por itens comuns (bolo, gás, pizza, farmácia).
    *   INDICAÇÕES DIRETAS: Responda a pedidos de indicação claros ("alguém conhece...?").
3.  EVITAR COMPLEXIDADE: Não tente resolver problemas complexos, debates da comunidade ou solicitações de múltiplos passos. Para esses casos, sua \`human_response\` deve direcionar para a área correta do app (ex: "Para debates, o ideal é postar no JPA Conversa. Quer que eu te leve pra lá?"). Sua meta é ter uma alta taxa de acerto, mesmo que o escopo seja limitado.

DIRECIONAMENTO EFICIENTE (FLUXO PRINCIPAL):
1.  OBJETIVO: Seu principal objetivo é entender a intenção do usuário e direcioná-lo o mais rápido possível para a área correta do app (Profissionais, Lojistas, Comunidade). Isso gera uma sensação de eficiência e conversão rápida.
2.  AÇÃO PROATIVA: Use o campo \`suggestedAction\` sempre que a intenção for clara. Evite perguntas desnecessárias. Vá direto ao ponto.
3.  EXEMPLOS DE FLUXO:
    *   "Preciso de um eletricista" -> \`intent: "Serviço"\`, \`suggestedAction: "open_services"\`.
    *   "Onde comprar bolo?" -> \`intent: "Produto"\`, \`suggestedAction: "open_explore"\`.
    *   "Alguém conhece uma diarista?" -> \`intent: "Comunidade"\`, \`suggestedAction: "open_community"\`.

COMPORTAMENTO SEGURO (REGRAS CRÍTICAS):
1.  AMBIGUIDADE: Se a solicitação for ambígua (ex: "serviço barato", "preciso de ajuda"), sua \`human_response\` DEVE ser uma pergunta para esclarecer. Não assuma a categoria. Exemplo: "Preciso de um serviço barato" -> "Entendi 👍 Qual tipo de serviço?".
2.  BAIXA CONFIANÇA: Se não tiver certeza da intenção, confirme. Ex: "Você está procurando um produto ou um serviço?".
3.  NÃO INVENTE: Nunca invente informações, preços, horários ou nomes de lojas. Se não souber, diga que pode buscar no app.
4.  SEM DADOS CRÍTICOS: Nunca assuma dados críticos. Peça confirmação.
5.  SEM RESULTADOS: Se não houver resultados para a busca do usuário, sua \`human_response\` DEVE ser: "Ainda não encontrei alguém disponível 😕 Quer ampliar a busca ou tentar outra opção?". NÃO use a frase "Nenhum resultado encontrado".
6.  CATEGORIA INEXISTENTE: Se a categoria solicitada não existir, sua \`human_response\` DEVE ser: "Boa 👍 Ainda não temos essa categoria no bairro. Quer que eu registre seu pedido?".

REGRAS GERAIS:
1. NUNCA diga "não entendi" ou peça para reformular. Faça perguntas inteligentes.
2. SMART OPTIONS: Se a solicitação for ampla, mas a intenção for clara (ex: "restaurantes"), sugira 3 opções curtas de resposta no array 'smartOptions' (ex: "Japonês", "Pizza", "Lanches").
3. CONCISÃO: Responda como uma pessoa real no WhatsApp. Use emojis com moderação.

MAPEAMENTO DE INTENÇÃO:
- 'Serviço': Mão de obra (reparos, aulas, fretes). Direciona para Profissionais.
- 'Produto': Itens para comprar (comida, gás, farmácia). Direciona para Lojistas.
- 'Comunidade': Indicações, dúvidas sobre o bairro. Direciona para os fluxos corretos da comunidade.

Responda SEMPRE em JSON:
{
  "intent": "Serviço" | "Produto" | "Comunidade" | "Outro",
  "category": "String curta",
  "urgency": "Imediata" | "Alta" | "Normal",
  "human_response": "Sua resposta curta e proativa aqui.",
  "suggestedAction": "open_services" | "open_explore" | "open_community" | "none",
  "smartOptions": ["Opção 1", "Opção 2", "Opção 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intent: { type: Type.STRING },
              category: { type: Type.STRING },
              urgency: { type: Type.STRING },
              human_response: { type: Type.STRING },
              suggestedAction: { type: Type.STRING },
              smartOptions: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["intent", "category", "urgency", "human_response", "suggestedAction"]
          },
          temperature: 0.3,
        },
      });

      const analysis: JotaAnalysis = JSON.parse(response.text || '{}');
      setLastAnalysis(analysis);
      // Substitui a mensagem de "ack" pela resposta final.
      setMessages(prev => [...prev.slice(0, -1), { role: 'model', text: analysis.human_response }]);

    } catch (error) {
      console.error(error);
      // Substitui a mensagem de "ack" pela mensagem de erro.
      setMessages(prev => [...prev.slice(0, -1), { role: 'model', text: "Tive um soluço técnico aqui. O que você precisa?" }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const userMsg = textOverride || input;
    if (!userMsg.trim() || isThinking) return;
    
    if (!textOverride) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLastAnalysis(null);

    // Pausa para dar um ritmo mais natural à conversa.
    await new Promise(r => setTimeout(r, 700));

    // Adiciona uma mensagem de confirmação para o usuário.
    const ackMessages = ["Boa 👍 Já entendi...", "Deixa comigo, estou verificando...", "Ok, só um momento..."];
    const randomAck = ackMessages[Math.floor(Math.random() * ackMessages.length)];
    setMessages(prev => [...prev, { role: 'model', text: randomAck }]);
    
    setIsThinking(true);

    // Outra pausa antes de chamar a API para simular o "pensamento".
    await new Promise(r => setTimeout(r, 1200));
    
    callGeminiAPI(userMsg);
  };

  if (!isOpen) return null;

  const handleAction = (action: string) => {
    switch (action) {
      case 'open_services': onNavigate('services_landing'); break;
      case 'open_explore': onNavigate('explore'); break;
      case 'open_community': onNavigate('neighborhood_posts'); break;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-950 w-full max-w-md h-full sm:h-[90vh] sm:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative border-l border-r border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom duration-500">
        
        {/* Header Superior */}
        <div className="bg-gradient-to-b from-[#1E5BFF] to-[#001D4A] p-6 pt-12 sm:pt-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4 text-white">
            <div className={`w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg transition-all duration-300 ${isThinking ? 'scale-110 ring-4 ring-white/20' : ''}`}>
              <Bot className={`w-7 h-7 text-white transition-all ${isThinking ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h3 className="font-black text-xl uppercase tracking-tighter leading-none">Jota 🤖</h3>
              <p className="text-[9px] font-black text-blue-100 uppercase tracking-widest mt-1">Jacarepaguá em tempo real</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all active:scale-90">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Área de Mensagens */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-950 no-scrollbar">
          {messages.map((msg, idx) => {
            // A última mensagem do modelo é substituída pelo indicador de digitação se a IA estiver pensando.
            const isLastModelMessage = msg.role === 'model' && idx === messages.length - 1;
            if (isThinking && isLastModelMessage) {
              return (
                <div key={idx} className="flex justify-start animate-in fade-in">
                  <div className="max-w-[85%] p-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-tl-none">
                    <div className="flex items-center justify-center gap-1.5 h-5">
                      <span className="w-2 h-2 bg-blue-300 rounded-full animate-dot-bounce" style={{ animationDelay: '0s' }}></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-dot-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-dot-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#1E5BFF] text-white rounded-tr-none' 
                    : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {/* Quick Replies (Smart Options) */}
          {!isThinking && lastAnalysis?.smartOptions && lastAnalysis.smartOptions.length > 0 && (
             <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-bottom-1 duration-500">
                {lastAnalysis.smartOptions.map((option, i) => (
                    <button 
                        key={i}
                        onClick={() => handleSend(option)}
                        className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900 px-4 py-2 rounded-full text-xs font-bold text-[#1E5BFF] shadow-sm hover:bg-blue-50 active:scale-95 transition-all"
                    >
                        {option}
                    </button>
                ))}
             </div>
          )}

          {/* Sugestão de Ação Principal */}
          {!isThinking && lastAnalysis?.suggestedAction && lastAnalysis.suggestedAction !== 'none' && (
              <div className="pt-2 animate-in zoom-in duration-500">
                  <button 
                    onClick={() => handleAction(lastAnalysis.suggestedAction)}
                    className="w-full bg-white dark:bg-gray-900 border-2 border-[#1E5BFF]/30 p-5 rounded-[2.5rem] flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl shadow-blue-500/5"
                  >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-[#1E5BFF]">
                            {lastAnalysis.intent === 'Serviço' && <Zap size={22} />}
                            {lastAnalysis.intent === 'Produto' && <ShoppingBag size={22} />}
                            {lastAnalysis.intent === 'Comunidade' && <MessageSquare size={22} />}
                            {lastAnalysis.intent === 'Outro' && <Sparkles size={22} />}
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Sugestão do Jota</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                                {lastAnalysis.intent === 'Serviço' ? 'Solicitar Orçamento' : 
                                 lastAnalysis.intent === 'Produto' ? 'Explorar Lojas' : 
                                 'Ver no JPA Conversa'}
                            </p>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#1E5BFF] group-hover:translate-x-1 transition-transform" />
                  </button>
              </div>
          )}
        </div>

        {/* Rodapé de Entrada */}
        <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-3"
          >
            <div className="relative flex-1 group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isThinking ? "Jota está agilizando..." : "Escreva do seu jeito..."}
                  disabled={isThinking}
                  className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 border-none shadow-inner transition-all"
                />
            </div>
            <button 
              type="submit"
              disabled={isThinking || !input.trim()}
              className="bg-[#1E5BFF] text-white p-4 rounded-2xl disabled:opacity-50 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-90"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-4">Jota antecipa o que você precisa 🏠</p>
        </div>
      </div>
    </div>
  );
};

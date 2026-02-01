import React, { useState, useEffect, useRef } from 'react';
import { 
    ChevronLeft, 
    Send, 
    ShieldAlert, 
    MoreVertical, 
    Check, 
    Clock,
    Info,
    AlertTriangle,
    Eye,
    User as UserIcon,
    Building,
    Paperclip,
    ClipboardList,
    MapPin,
    Zap
} from 'lucide-react';
import { ServiceMessage, ServiceRequest } from '../types';

interface ServiceChatViewProps {
  requestId: string;
  userRole: 'resident' | 'merchant' | 'admin';
  onBack: () => void;
}

export const ServiceChatView: React.FC<ServiceChatViewProps> = ({ requestId, userRole, onBack }) => {
  const [messages, setMessages] = useState<ServiceMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [requestInfo, setRequestInfo] = useState<ServiceRequest | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAdmin = userRole === 'admin';
  const isResident = userRole === 'resident';
  const isMerchant = userRole === 'merchant';

  useEffect(() => {
    // 1. Carregar informações do pedido original do LocalStorage
    const savedReqs = JSON.parse(localStorage.getItem('service_requests_mock') || '[]');
    const req = savedReqs.find((r: any) => r.id === requestId);
    if (req) setRequestInfo(req);

    // 2. Carregar histórico de mensagens existente
    const savedMsgs = JSON.parse(localStorage.getItem(`msgs_${requestId}`) || '[]');
    
    // 3. Lógica de Inicialização do Chat (Briefing do Pedido)
    const chatInitKey = `chat_initialized_${requestId}`;
    const isInitialized = localStorage.getItem(chatInitKey) === 'true';

    if (!isInitialized && req) {
        // MENSAGEM 1: O BRIEFING DO PEDIDO (Fixado como sistema)
        const briefingMsg: ServiceMessage = {
            id: 'briefing-system',
            requestId,
            senderId: 'system',
            senderName: 'Localizei JPA',
            senderRole: 'resident',
            text: `📋 **RESUMO DO PEDIDO - #${req.id.split('-')[1]}**\n\n` +
                  `• **Serviço:** ${req.serviceType}\n` +
                  `• **Bairro:** ${req.neighborhood}\n` +
                  `• **Prazo:** ${req.urgency}\n` +
                  `• **Data Solicitação:** ${new Date(req.createdAt).toLocaleString()}\n\n` +
                  `**Descrição do Cliente:**\n"${req.description}"`,
            timestamp: req.createdAt
        };

        // MENSAGEM 2: BOAS-VINDAS DINÂMICA
        const welcomeMsg: ServiceMessage = {
            id: 'welcome-system',
            requestId,
            senderId: 'system',
            senderName: 'Localizei JPA',
            senderRole: 'resident',
            text: isMerchant 
                ? 'Olá! Você liberou este lead. Use o chat abaixo para enviar seu orçamento e combinar os detalhes com o cliente.' 
                : '✅ Pedido enviado! Profissionais do seu bairro já estão analisando sua solicitação.',
            timestamp: new Date().toISOString()
        };

        const initialMsgs = [briefingMsg, welcomeMsg];
        setMessages(initialMsgs);
        localStorage.setItem(`msgs_${requestId}`, JSON.stringify(initialMsgs));
        localStorage.setItem(chatInitKey, 'true');
    } else {
        setMessages(savedMsgs);
    }
  }, [requestId, userRole]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    if (messages.length > 0) {
        localStorage.setItem(`msgs_${requestId}`, JSON.stringify(messages));
    }
  }, [messages, requestId]);

  const handleSend = () => {
    if (!inputText.trim() || isAdmin) return;
    
    const newMsg: ServiceMessage = {
      id: `msg-${Date.now()}`,
      requestId,
      senderId: 'current-user-id',
      senderName: isResident ? 'Morador' : 'Profissional',
      senderRole: isResident ? 'resident' : 'merchant',
      text: inputText,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/20 backdrop-blur-sm flex justify-center animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-950 flex flex-col h-full pb-[80px] shadow-2xl relative overflow-hidden">
        
        {/* Header do Chat */}
        <header className={`px-5 py-5 border-b flex items-center justify-between sticky top-0 z-20 ${isAdmin ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-all active:scale-90">
                <ChevronLeft size={20}/>
            </button>
            <div className="w-10 h-10 rounded-full bg-[#1E5BFF] flex items-center justify-center text-white shadow-md shrink-0">
              {isMerchant ? <UserIcon size={18} /> : <Building size={18} />}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-bold text-gray-900 dark:text-white leading-tight truncate">
                  {isAdmin ? 'Auditoria' : isMerchant ? (requestInfo?.userName || 'Cliente') : 'Atendimento Profissional'}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">
                    #{requestId.split('-')[1]} – {requestInfo?.serviceType}
                  </p>
              </div>
            </div>
          </div>
          <button className="p-2 text-gray-400"><MoreVertical size={20} /></button>
        </header>

        {/* Auditoria Label */}
        {isAdmin && (
          <div className="bg-amber-500 text-white px-5 py-2 flex items-center justify-center gap-2 z-10 shadow-sm">
              <Eye size={12} strokeWidth={3} />
              <span className="text-[9px] font-black uppercase tracking-widest">Modo Leitura / Auditoria</span>
          </div>
        )}

        {/* Corpo do Chat */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar bg-gray-50 dark:bg-gray-950">
          {messages.map((msg) => {
            const isSystem = msg.senderId === 'system';
            const isMe = !isSystem && msg.senderRole === userRole;
            const isBriefing = msg.id === 'briefing-system';
            
            if (isSystem) {
              return (
                  <div key={msg.id} className="flex justify-center px-2">
                      <div className={`p-5 rounded-3xl text-left w-full shadow-sm border ${
                          isBriefing 
                          ? 'bg-white dark:bg-gray-900 border-indigo-100 dark:border-indigo-900/50' 
                          : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800'
                      }`}>
                          <div className="flex items-center gap-2 mb-3">
                            {isBriefing ? <ClipboardList size={16} className="text-indigo-600" /> : <Info size={16} className="text-[#1E5BFF]" />}
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isBriefing ? 'text-indigo-600' : 'text-[#1E5BFF]'}`}>
                                {isBriefing ? 'Contexto do Pedido' : 'Aviso do Sistema'}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed whitespace-pre-wrap font-medium ${isBriefing ? 'text-gray-700 dark:text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                              {msg.text}
                          </p>
                          {isBriefing && (
                            <div className="mt-4 pt-3 border-t border-indigo-50 dark:border-indigo-900/30 flex gap-4">
                                <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase"><MapPin size={10}/> {requestInfo?.neighborhood}</div>
                                <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase"><Zap size={10}/> {requestInfo?.urgency}</div>
                            </div>
                          )}
                      </div>
                  </div>
              );
            }

            return (
              <div key={msg.id} className={`flex flex-col gap-1.5 max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                  <div className={`p-4 rounded-3xl shadow-sm border ${
                      isMe 
                      ? 'bg-[#1E5BFF] text-white rounded-tr-none border-blue-600' 
                      : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-tl-none border-gray-100 dark:border-gray-800'
                  }`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <Check size={10} className="text-blue-400" />}
                  </div>
              </div>
            );
          })}
        </main>

        {/* Input de Mensagem */}
        {!isAdmin && (
          <footer className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-3">
                  <button className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 hover:text-blue-500 transition-colors">
                    <Paperclip size={20} />
                  </button>
                  <input 
                      type="text" 
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSend()}
                      placeholder="Responda o cliente aqui..."
                      className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#1E5BFF] transition-all dark:text-white"
                  />
                  <button 
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                      className="w-14 h-14 bg-[#1E5BFF] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                      <Send size={20} />
                  </button>
              </div>
          </footer>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    Zap,
    CheckCircle2,
    X,
    XCircle,
    Handshake,
    Palette
} from 'lucide-react';
import { ServiceMessage, ServiceRequest, ServiceLead } from '../types';

interface ServiceChatViewProps {
  requestId: string;
  professionalId: string;
  userRole: 'resident' | 'merchant' | 'admin';
  onBack: () => void;
}

export const ServiceChatView: React.FC<ServiceChatViewProps> = ({ requestId, professionalId, userRole, onBack }) => {
  const [messages, setMessages] = useState<ServiceMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [requestInfo, setRequestInfo] = useState<ServiceRequest | null>(null);
  const [leadInfo, setLeadInfo] = useState<ServiceLead | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAdmin = userRole === 'admin';
  const isResident = userRole === 'resident';
  const isMerchant = userRole === 'merchant';
  const isDesignerChat = requestId.startsWith('DSG-');

  const chatKey = `msgs_${requestId}`;

  // REGRA: Verifica se o pedido está fechado e quem é o vencedor
  const isRequestClosed = requestInfo?.status === 'closed';
  const isWinner = requestInfo?.winnerId === professionalId;
  const isBlocked = isRequestClosed && !isWinner;

  useEffect(() => {
    // 1. Carregar histórico de mensagens
    const savedMsgs = JSON.parse(localStorage.getItem(chatKey) || '[]');
    setMessages(savedMsgs);

    if (!isDesignerChat) {
        // Lógica para pedidos de serviço regulares
        const savedReqs = JSON.parse(localStorage.getItem('service_requests_mock') || '[]');
        const req = savedReqs.find((r: any) => r.id === requestId);
        if (req) setRequestInfo(req);

        const savedLeads = JSON.parse(localStorage.getItem('unlocked_leads_full_mock') || '[]');
        const lead = savedLeads.find((l: any) => l.requestId === requestId && l.merchantId === professionalId);
        if (lead) setLeadInfo(lead);
    }
  }, [requestId, professionalId, chatKey, isDesignerChat]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || isAdmin || isBlocked) return;
    
    const newMsg: ServiceMessage = {
      id: `msg-${Date.now()}`,
      requestId,
      senderId: 'current-user-id',
      senderName: isResident ? 'Morador' : (isDesignerChat ? 'Designer' : (leadInfo?.merchantName || 'Profissional')),
      senderRole: isResident ? 'resident' : 'merchant',
      text: inputText,
      timestamp: new Date().toISOString()
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(chatKey, JSON.stringify(updated));
    setInputText('');
  };

  const handleNegocioFechado = () => {
    if (isDesignerChat) {
        alert("Sua arte está em produção. Você será notificado por aqui!");
        return;
    }
    
    setShowConfirmModal(false);

    // 1. Atualizar o status do pedido globalmente
    const savedReqs = JSON.parse(localStorage.getItem('service_requests_mock') || '[]');
    const updatedReqs = savedReqs.map((r: ServiceRequest) => {
        if (r.id === requestId) {
            return { ...r, status: 'closed', winnerId: professionalId };
        }
        return r;
    });
    localStorage.setItem('service_requests_mock', JSON.stringify(updatedReqs));
    
    const myReq = updatedReqs.find((r: any) => r.id === requestId);
    if (myReq) setRequestInfo(myReq);

    // 2. Adicionar mensagem de sistema no chat
    const sysMsg: ServiceMessage = {
        id: `sys-closed-${Date.now()}`,
        requestId,
        senderId: 'system',
        senderName: 'Localizei JPA',
        senderRole: 'resident',
        text: "✨ NEGÓCIO FECHADO! ✨\nVocê confirmou que este serviço será realizado por este profissional.",
        timestamp: new Date().toISOString()
    };
    
    const updatedMsgs = [...messages, sysMsg];
    setMessages(updatedMsgs);
    localStorage.setItem(chatKey, JSON.stringify(updatedMsgs));
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white dark:bg-gray-950 flex flex-col h-full animate-in slide-in-from-right duration-300">
        
        {/* Header do Chat */}
        <header className={`px-5 py-5 border-b flex items-center justify-between sticky top-0 z-20 ${isAdmin ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-all active:scale-90 shrink-0">
                <ChevronLeft size={20}/>
            </button>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md shrink-0 overflow-hidden ${isDesignerChat ? 'bg-indigo-600' : 'bg-[#1E5BFF]'}`}>
                {isDesignerChat ? <Palette size={20} /> : (leadInfo?.merchantLogo ? <img src={leadInfo.merchantLogo} className="w-full h-full object-cover" /> : <Building size={18} />)}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-bold text-gray-900 dark:text-white leading-tight truncate">
                  {isDesignerChat ? (isResident ? 'Time de Design' : 'Minha Campanha') : (isMerchant ? (requestInfo?.userName || 'Cliente') : (leadInfo?.merchantName || 'Time Localizei'))}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-gray-400' : 'bg-green-500'}`}></span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">
                    {isDesignerChat ? `Briefing de Campanha #${requestId.split('-')[1]}` : `#{requestId.split('-')[1]} – {requestInfo?.serviceType}`}
                  </p>
              </div>
            </div>
          </div>
        </header>

        {/* Corpo do Chat */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar bg-gray-50 dark:bg-gray-950">
          
          {isDesignerChat && (
              <div className="flex justify-center px-2 mb-4">
                  <div className="p-5 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 shadow-sm w-full flex gap-4 items-start">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-xl text-indigo-600 dark:text-indigo-300">
                        <Palette size={18} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-widest mb-1">Criação Profissional</h4>
                        <p className="text-xs text-indigo-700 dark:text-indigo-400 font-medium leading-relaxed">
                            Envie suas informações agora e nosso time responderá em até 24h úteis.
                        </p>
                    </div>
                  </div>
              </div>
          )}

          {messages.map((msg) => {
            const isSystem = msg.senderId === 'system';
            const isMe = !isSystem && msg.senderRole === userRole;
            
            if (isSystem) {
              return (
                  <div key={msg.id} className="flex justify-center px-2">
                      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 p-4 rounded-2xl text-center w-full">
                          <p className="text-xs text-blue-700 dark:text-blue-400 font-bold leading-relaxed whitespace-pre-wrap">
                              {msg.text}
                          </p>
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
                  </div>
              </div>
            );
          })}
        </main>

        {/* Input Area */}
        {!isAdmin && !isBlocked && (
          <footer className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-3">
                  <button className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400">
                    <Paperclip size={20} />
                  </button>
                  <input 
                      type="text" 
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSend()}
                      placeholder="Escreva sua mensagem..."
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
  );
};

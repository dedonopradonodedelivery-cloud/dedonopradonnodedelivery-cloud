
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
    Handshake
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

  const chatKey = `msgs_${requestId}_${professionalId}`;

  // REGRA: Verifica se o pedido está fechado e quem é o vencedor
  const isRequestClosed = requestInfo?.status === 'closed';
  const isWinner = requestInfo?.winnerId === professionalId;
  const isBlocked = isRequestClosed && !isWinner;

  useEffect(() => {
    // 1. Carregar informações do pedido original
    const savedReqs = JSON.parse(localStorage.getItem('service_requests_mock') || '[]');
    const req = savedReqs.find((r: any) => r.id === requestId);
    if (req) setRequestInfo(req);

    // 2. Carregar informações do profissional/lead
    const savedLeads = JSON.parse(localStorage.getItem('unlocked_leads_full_mock') || '[]');
    const lead = savedLeads.find((l: any) => l.requestId === requestId && l.merchantId === professionalId);
    if (lead) setLeadInfo(lead);

    // 3. Carregar histórico de mensagens
    const savedMsgs = JSON.parse(localStorage.getItem(chatKey) || '[]');
    setMessages(savedMsgs);
  }, [requestId, professionalId, chatKey]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || isAdmin || isBlocked) return;
    
    const newMsg: ServiceMessage = {
      id: `msg-${Date.now()}`,
      requestId,
      senderId: 'current-user-id',
      senderName: isResident ? 'Morador' : (leadInfo?.merchantName || 'Profissional'),
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
    
    // Atualiza localmente
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
            <div className="w-10 h-10 rounded-full bg-[#1E5BFF] flex items-center justify-center text-white shadow-md shrink-0 overflow-hidden">
                {leadInfo?.merchantLogo ? <img src={leadInfo.merchantLogo} className="w-full h-full object-cover" /> : <Building size={18} />}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-bold text-gray-900 dark:text-white leading-tight truncate">
                  {isMerchant ? (requestInfo?.userName || 'Cliente') : (leadInfo?.merchantName || 'Time Localizei')}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-gray-400' : 'bg-green-500'}`}></span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">
                    #{requestId.split('-')[1]} – {requestInfo?.serviceType}
                  </p>
              </div>
            </div>
          </div>
          
          {/* Botão Negócio Fechado (Apenas para Residentes) */}
          {isResident && !isRequestClosed && (
            <button 
                onClick={() => setShowConfirmModal(true)}
                className="bg-emerald-500 text-white text-[9px] font-black uppercase px-2.5 py-2 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all shrink-0"
            >
                Negócio Fechado
            </button>
          )}

          {isWinner && (
             <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-1.5 rounded-lg flex items-center gap-1 border border-emerald-100 dark:border-emerald-800">
                <CheckCircle2 size={12} />
                <span className="text-[8px] font-black uppercase">Vencedor</span>
             </div>
          )}
        </header>

        {/* Banner de Status Bloqueado */}
        {isBlocked && (
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 px-5 py-2.5 flex items-center justify-center gap-2 z-10 border-b border-gray-200 dark:border-gray-700">
                <XCircle size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest text-center">Este pedido foi fechado com outro profissional.</span>
            </div>
        )}

        {/* Corpo do Chat */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar bg-gray-50 dark:bg-gray-950">
          
          {/* Bolha de Resumo Original */}
          {requestInfo && (
              <div className="flex justify-center px-2 mb-4">
                  <div className="p-5 rounded-[2rem] bg-white dark:bg-gray-900 border border-indigo-50 dark:border-indigo-900/50 shadow-sm w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <ClipboardList size={14} className="text-indigo-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Descrição do Pedido</span>
                      </div>
                      <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                          "{requestInfo.description}"
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase"><MapPin size={10}/> {requestInfo.neighborhood}</div>
                        <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase"><Clock size={10}/> {requestInfo.urgency}</div>
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
                      <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 p-4 rounded-2xl text-center w-full">
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold leading-relaxed whitespace-pre-wrap">
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

        {/* Modal de Confirmação Negócio Fechado */}
        {showConfirmModal && (
            <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 mx-auto">
                        <Handshake size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">Confirmar Negócio Fechado?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8 leading-relaxed">
                        Ao confirmar, as outras conversas deste pedido serão encerradas e você terá o registro oficial de que fechou com este profissional.
                    </p>
                    <div className="space-y-3">
                        <button 
                            onClick={handleNegocioFechado}
                            className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-xs uppercase tracking-widest"
                        >
                            Sim, fechar negócio
                        </button>
                        <button 
                            onClick={() => setShowConfirmModal(false)}
                            className="w-full py-4 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

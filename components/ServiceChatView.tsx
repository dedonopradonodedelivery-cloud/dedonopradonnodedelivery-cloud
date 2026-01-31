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
    Paperclip
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

  useEffect(() => {
    // 1. Carregar informações do pedido
    const savedReqs = JSON.parse(localStorage.getItem('service_requests_mock') || '[]');
    const req = savedReqs.find((r: any) => r.id === requestId);
    if (req) setRequestInfo(req);

    // 2. Carregar histórico de mensagens
    const savedMsgs = JSON.parse(localStorage.getItem(`msgs_${requestId}`) || '[]');
    
    // 3. Lógica de Mensagens Automáticas (Sent Once)
    const autoMsgKey = `auto_msg_sent_${requestId}`;
    const alreadySent = localStorage.getItem(autoMsgKey) === 'true';

    if (!alreadySent && isResident && !isAdmin) {
        const isBannerService = req?.serviceType?.toLowerCase().includes('banner') || req?.serviceType?.toLowerCase().includes('arte');
        
        const welcomeMsg: ServiceMessage = {
            id: 'auto-1',
            requestId,
            senderId: 'system',
            senderName: 'Localizei JPA',
            senderRole: 'resident',
            text: '✅ Pedido enviado! Parabéns por escolher nossos Serviços Verificados. Já notificamos profissionais do seu bairro. Em instantes vamos te orientar com os próximos passos por aqui. 😊',
            timestamp: new Date().toISOString()
        };

        const instructionMsg: ServiceMessage = {
            id: 'auto-2',
            requestId,
            senderId: 'system',
            senderName: 'Localizei JPA',
            senderRole: 'resident',
            text: `Para agilizar, me envie essas informações ${isBannerService ? 'que você quer que apareça no banner' : 'do que você precisa'}:\n\n1) Título (curto e direto)\n2) Descrição curta (1–2 linhas)\n3) Sua logo em alta definição (PNG de preferência; se tiver CDR/AI/PDF também serve)\n4) Se tiver, fotos ou referência do serviço desejado`,
            timestamp: new Date().toISOString()
        };

        const initialMsgs = [...savedMsgs, welcomeMsg, instructionMsg];
        setMessages(initialMsgs);
        localStorage.setItem(`msgs_${requestId}`, JSON.stringify(initialMsgs));
        localStorage.setItem(autoMsgKey, 'true');
    } else {
        setMessages(savedMsgs);
    }
  }, [requestId, userRole, isAdmin, isResident]);

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
      senderName: userRole === 'resident' ? 'Morador Teste' : 'Profissional Teste',
      senderRole: userRole,
      text: inputText,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/20 backdrop-blur-sm flex justify-center animate-in fade-in duration-300">
      {/* 
          AJUSTE DE LAYOUT: 
          Adicionado pb-[80px] para garantir que o input (footer) 
          fique acima da BottomNav fixa (que tem 80px de altura).
      */}
      <div className="w-full max-w-md bg-white dark:bg-gray-950 flex flex-col h-full pb-[80px] shadow-2xl relative overflow-hidden">
        
        {/* Header do Chat */}
        <header className={`px-5 py-5 border-b flex items-center justify-between sticky top-0 z-20 ${isAdmin ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-all active:scale-90">
                <ChevronLeft size={20}/>
            </button>
            <div className="w-10 h-10 rounded-full bg-[#1E5BFF] flex items-center justify-center text-white shadow-md shrink-0">
              {userRole === 'resident' ? <Building size={18} /> : <UserIcon size={18} />}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-bold text-gray-900 dark:text-white leading-tight truncate">
                  {isAdmin ? 'Auditoria de Chat' : userRole === 'resident' ? 'Time de Atendimento' : requestInfo?.userName}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">
                    #{requestInfo?.id?.split('-')[1] || '0000'} – {requestInfo?.serviceType || 'Serviço'}
                  </p>
              </div>
            </div>
          </div>
          <button className="p-2 text-gray-400"><MoreVertical size={20} /></button>
        </header>

        {/* Alerta Administrativo */}
        {isAdmin && (
          <div className="bg-amber-500 text-white px-5 py-2 flex items-center justify-center gap-2 shadow-lg z-10">
              <Eye size={14} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest">Visualização administrativa (somente leitura)</span>
          </div>
        )}

        {/* Mensagens */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar bg-gray-50 dark:bg-gray-950">
          {messages.map((msg) => {
            const isSystem = msg.senderId === 'system';
            const isMe = !isSystem && msg.senderRole === userRole;
            
            if (isSystem) {
              return (
                  <div key={msg.id} className="flex justify-center px-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-2xl text-left w-full shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Info size={14} className="text-[#1E5BFF]" />
                            <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest">Aviso do Sistema</span>
                          </div>
                          <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
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
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <Check size={10} className="text-blue-50" />}
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
                      placeholder="Escreva sua mensagem..."
                      className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#1E5BFF] transition-all dark:text-white"
                  />
                  <button 
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                      className="w-14 h-14 bg-[#1E5BFF] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                      <Send size={20} />
                  </button>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-4 opacity-30">
                  <ShieldAlert size={10} />
                  <p className="text-[8px] font-black uppercase tracking-[0.3em]">Conexão Segura Localizei</p>
              </div>
          </footer>
        )}
        
        {isAdmin && (
          <footer className="p-8 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-2 shrink-0">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-tight">O Administrador não pode enviar mensagens.</span>
              </div>
              <p className="text-[10px] text-gray-400 italic">Conversa sendo monitorada para fins de auditoria e suporte.</p>
          </footer>
        )}
      </div>
    </div>
  );
};

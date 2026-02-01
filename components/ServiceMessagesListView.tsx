import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  MessageSquare, 
  Clock, 
  Search, 
  Store as StoreIcon, 
  ShieldCheck, 
  X,
  ChevronRight,
  AlertCircle,
  // FIX: Added missing CheckCircle2 import
  CheckCircle2
} from 'lucide-react';
import { ServiceRequest, ServiceLead, ServiceMessage } from '../types';

interface ServiceMessagesListViewProps {
  onBack: () => void;
  onOpenChat: (requestId: string, professionalId: string) => void;
}

export const ServiceMessagesListView: React.FC<ServiceMessagesListViewProps> = ({ 
  onBack, 
  onOpenChat 
}) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [unlockedLeads, setUnlockedLeads] = useState<ServiceLead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Carrega dados simulados
    const savedReqs = JSON.parse(localStorage.getItem('service_requests_mock') || '[]');
    setRequests(savedReqs);

    // No MVP, as conversas são baseadas em leads desbloqueados
    // Se não houver no storage, criamos mocks para o morador visualizar
    let savedLeads = JSON.parse(localStorage.getItem('unlocked_leads_full_mock') || '[]');
    
    if (savedLeads.length === 0 && savedReqs.length > 0) {
        // Mock de profissionais que responderam ao pedido
        savedLeads = [
            { 
                id: 'lead-1', 
                requestId: savedReqs[0].id, 
                merchantId: 'm-1', 
                merchantName: 'Carlos Elétrica JPA', 
                status: 'unlocked',
                merchantLogo: 'https://i.pravatar.cc/100?u=carlos'
            },
            { 
                id: 'lead-2', 
                requestId: savedReqs[0].id, 
                merchantId: 'm-2', 
                merchantName: 'InstalBem Serviços', 
                status: 'unlocked',
                merchantLogo: 'https://i.pravatar.cc/100?u=instalbem'
            }
        ];
        localStorage.setItem('unlocked_leads_full_mock', JSON.stringify(savedLeads));
    }
    setUnlockedLeads(savedLeads);
  }, []);

  const conversationItems = useMemo(() => {
    return unlockedLeads.map(lead => {
        const req = requests.find(r => r.id === lead.requestId);
        if (!req) return null;

        // Busca última mensagem
        const msgs = JSON.parse(localStorage.getItem(`msgs_${lead.requestId}_${lead.merchantId}`) || '[]');
        const lastMsg = msgs[msgs.length - 1];

        return {
            lead,
            request: req,
            lastMsg: lastMsg?.text || `Olá! Vi seu pedido de ${req.serviceType.toLowerCase()}.`,
            timestamp: lastMsg?.timestamp ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Agora',
            isClosed: req.status === 'closed',
            isWinner: req.winnerId === lead.merchantId
        };
    }).filter(Boolean);
  }, [unlockedLeads, requests]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return conversationItems;
    return conversationItems.filter(item => 
        item?.lead.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.request.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversationItems, searchTerm]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-in fade-in duration-300">
      
      {/* Header Estilo WhatsApp */}
      <header className="bg-white dark:bg-gray-900 px-5 pt-10 pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all">
                <ChevronLeft size={20} />
            </button>
            <div>
                <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Conversas de Serviços</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Seus pedidos em andamento</p>
            </div>
        </div>

        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por profissional ou serviço..."
                className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white transition-all shadow-inner"
            />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {filteredItems.length === 0 ? (
            <div className="py-24 px-8 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mb-6 text-[#1E5BFF] animate-pulse">
                    <Clock size={40} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Aguardando respostas...</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                    Seu pedido foi enviado para os profissionais do seu bairro. Assim que alguém responder, a conversa aparecerá aqui.
                </p>
            </div>
        ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredItems.map((item: any) => (
                    <div 
                        key={`${item.lead.requestId}_${item.lead.merchantId}`}
                        onClick={() => onOpenChat(item.lead.requestId, item.lead.merchantId)}
                        className={`flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer relative ${item.isClosed && !item.isWinner ? 'opacity-50 grayscale' : ''}`}
                    >
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700">
                                <img src={item.lead.merchantLogo} className="w-full h-full object-cover" alt={item.lead.merchantName} />
                            </div>
                            {item.isWinner && (
                                <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-lg border-2 border-white dark:border-gray-950">
                                    <CheckCircle2 size={12} strokeWidth={3} />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">
                                    {item.lead.merchantName}
                                </h4>
                                <span className="text-[10px] font-medium text-gray-400 shrink-0">{item.timestamp}</span>
                            </div>
                            
                            <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mb-1 truncate">
                                {item.request.serviceType}
                            </p>

                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 italic">
                                {item.isClosed && !item.isWinner ? "Conversa encerrada" : item.lastMsg}
                            </p>
                        </div>
                        
                        <ChevronRight size={16} className="text-gray-200" />
                        
                        {item.isClosed && !item.isWinner && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100/10 backdrop-blur-[1px] px-3 py-1 rounded-full border border-gray-200 text-[8px] font-black uppercase tracking-widest text-gray-400 rotate-[-12deg]">
                                Encerrada
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
    ChevronLeft, 
    ArrowRight, 
    Zap, 
    MapPin, 
    Clock, 
    CheckCircle2, 
    DollarSign,
    Loader2,
    MessageSquare,
    AlertCircle,
    ShoppingBag
} from 'lucide-react';
import { ServiceRequest } from '../types';

interface MerchantLeadsViewProps {
  onBack: () => void;
  onOpenChat: (requestId: string) => void;
}

export const MerchantLeadsView: React.FC<MerchantLeadsViewProps> = ({ onBack, onOpenChat }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [unlockedLeads, setUnlockedLeads] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('service_requests_mock');
    const unlocked = JSON.parse(localStorage.getItem('unlocked_leads_mock') || '[]');
    if (saved) setRequests(JSON.parse(saved));
    setUnlockedLeads(unlocked);
  }, []);

  const handleUnlock = (requestId: string) => {
    setIsProcessing(requestId);
    
    // Simulação de pagamento de R$ 5,90
    setTimeout(() => {
        const newUnlocked = [...unlockedLeads, requestId];
        setUnlockedLeads(newUnlocked);
        localStorage.setItem('unlocked_leads_mock', JSON.stringify(newUnlocked));
        setIsProcessing(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Central de Leads</h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Oportunidades de Serviço</p>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-md mx-auto">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-100 dark:border-blue-800/30 flex gap-4 items-center">
            <Zap size={24} className="text-[#1E5BFF] shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-300 font-bold uppercase leading-tight">
                Receba pedidos de moradores e feche novos serviços hoje mesmo.
            </p>
        </div>

        <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Pedidos recentes no bairro</h3>
            
            {requests.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center opacity-30">
                    <ShoppingBag size={48} className="text-gray-400 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">Nenhum pedido novo<br/>no momento.</p>
                </div>
            ) : requests.map(req => {
                const isUnlocked = unlockedLeads.includes(req.id);
                return (
                    <div key={req.id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h4 className="font-black text-gray-900 dark:text-white text-base uppercase tracking-tight">{req.serviceType}</h4>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-1"><MapPin size={10} /> {req.neighborhood}</div>
                                        <div className="flex items-center gap-1"><Clock size={10} /> {req.urgency}</div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <span className="text-[10px] font-black text-gray-500">ID: {req.id.slice(-4)}</span>
                                </div>
                            </div>

                            <p className={`text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed italic ${!isUnlocked && 'blur-sm select-none'}`}>
                                "{req.description}"
                            </p>

                            {isUnlocked ? (
                                <button 
                                    onClick={() => onOpenChat(req.id)}
                                    className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest active:scale-95 transition-all"
                                >
                                    <MessageSquare size={16} /> Abrir chat com cliente
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <AlertCircle size={14} className="text-amber-500" />
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Descrição e contato ocultos</p>
                                    </div>
                                    <button 
                                        onClick={() => handleUnlock(req.id)}
                                        disabled={isProcessing === req.id}
                                        className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-xs uppercase tracking-widest active:scale-95 transition-all"
                                    >
                                        {isProcessing === req.id ? <Loader2 size={18} className="animate-spin" /> : (
                                            <>
                                                <DollarSign size={16} /> Liberar Contato (R$ 5,90)
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </main>
    </div>
  );
};

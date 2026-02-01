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
    ShoppingBag,
    Info,
    ChevronRight,
    Users
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
    
    // Simulação de pagamento de R$ 5,90 (lógica preservada)
    setTimeout(() => {
        const newUnlocked = [...unlockedLeads, requestId];
        setUnlockedLeads(newUnlocked);
        localStorage.setItem('unlocked_leads_mock', JSON.stringify(newUnlocked));
        setIsProcessing(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
            Central de Leads
          </h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Oportunidades de Negócio</p>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-md mx-auto">
        
        {/* Bloco de Texto do Topo */}
        <section className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
            Pedidos reais de moradores do seu bairro
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Libere o contato, converse direto com o cliente e feche novos serviços.
          </p>
        </section>

        {/* Bloco Como Funciona */}
        <section className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={14} className="text-[#1E5BFF]" /> Como funciona
            </h3>
            <ul className="space-y-3">
                {[
                    "Moradores solicitam serviços pelo app",
                    "Você escolhe quais pedidos deseja acessar",
                    "Cada contato pode ser liberado por até 5 profissionais",
                    "Após liberar, o chat com o cliente é aberto"
                ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1E5BFF] mt-1.5 shrink-0" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{text}</p>
                    </li>
                ))}
            </ul>
        </section>

        {/* Lista de Leads */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedidos recentes</h3>
                <span className="text-[9px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">Atualizado agora</span>
            </div>
            
            {requests.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center opacity-30">
                    <ShoppingBag size={48} className="text-gray-400 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">Aguardando novos pedidos...</p>
                </div>
            ) : requests.map(req => {
                const isUnlocked = unlockedLeads.includes(req.id);
                return (
                    <div key={req.id} className={`bg-white dark:bg-gray-900 rounded-[2.5rem] border transition-all ${isUnlocked ? 'border-emerald-500/30 shadow-md' : 'border-gray-100 dark:border-gray-800 shadow-sm'} overflow-hidden`}>
                        <div className="p-6">
                            {/* Topo do Card */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h4 className="font-black text-gray-900 dark:text-white text-base uppercase tracking-tighter">
                                        {req.serviceType.toUpperCase() === 'GERAL' ? 'SERVIÇO RÁPIDO' : req.serviceType.toUpperCase()}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">
                                            <MapPin size={10} /> {req.neighborhood}
                                        </div>
                                        <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-800/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                                            <Clock size={10} /> {req.urgency}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-gray-300 uppercase">ID: {req.id.split('-')[1]}</span>
                            </div>

                            {/* Corpo do Card */}
                            <div className="mb-6">
                                <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium line-clamp-2 ${!isUnlocked && 'select-none'}`}>
                                    "{req.description}"
                                </p>
                                {!isUnlocked && (
                                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                                        <AlertCircle size={10} /> Descrição e contato ocultos
                                    </p>
                                )}
                            </div>

                            {/* Rodapé do Card */}
                            {isUnlocked ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                                        <CheckCircle2 size={16} />
                                        <span className="text-xs font-black uppercase tracking-widest">Contato liberado</span>
                                    </div>
                                    <button 
                                        onClick={() => onOpenChat(req.id)}
                                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest active:scale-95 transition-all"
                                    >
                                        Conversar com cliente
                                        <ChevronRight size={16} strokeWidth={3} />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => handleUnlock(req.id)}
                                        disabled={isProcessing === req.id}
                                        className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 text-xs uppercase tracking-widest active:scale-95 transition-all"
                                    >
                                        {isProcessing === req.id ? <Loader2 size={18} className="animate-spin" /> : (
                                            <>
                                                <Zap size={16} fill="currentColor" /> LIBERAR CONTATO (R$ 5,90)
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-tight">
                                        Até 5 profissionais podem liberar este contato
                                    </p>
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
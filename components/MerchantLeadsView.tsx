import React, { useState, useEffect, useMemo } from 'react';
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
    Users,
    ShieldCheck,
    Settings2,
    X,
    Eye,
    ShieldAlert
} from 'lucide-react';
import { ServiceRequest } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface MerchantLeadsViewProps {
  onBack: () => void;
  onOpenChat: (requestId: string) => void;
  isAdmin?: boolean;
}

export const MerchantLeadsView: React.FC<MerchantLeadsViewProps> = ({ onBack, onOpenChat, isAdmin = false }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [unlockedLeads, setUnlockedLeads] = useState<string[]>([]);
  const [merchantProfile, setMerchantProfile] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // REGRA: Controle de Adesão (Opt-in) - ADM sempre tem adesão ativa virtualmente
  const [hasOptedIn, setHasOptedIn] = useState<boolean>(() => {
    if (isAdmin) return true;
    return localStorage.getItem(`leads_optin_${user?.id}`) === 'true';
  });
  
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        try {
            // 1. Carrega Perfil do Lojista (Apenas se não for ADM)
            if (user && !isAdmin) {
                const { data: profile } = await supabase.from('merchants').select('category, subcategory').eq('owner_id', user.id).maybeSingle();
                setMerchantProfile(profile);
            }

            // 2. Carrega Leads do Storage Simulado
            const saved = localStorage.getItem('service_requests_mock');
            const unlocked = JSON.parse(localStorage.getItem('unlocked_leads_mock') || '[]');
            if (saved) setRequests(JSON.parse(saved));
            setUnlockedLeads(unlocked);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, [user, isAdmin]);

  // --- REGRA DE COMPATIBILIDADE (ADM IGNORA FILTROS) ---
  const filteredRequests = useMemo(() => {
    if (isAdmin) return requests; // ADM VÊ TUDO
    if (!merchantProfile || !hasOptedIn) return [];
    
    return requests.filter(req => {
        const leadType = req.serviceType.toLowerCase();
        const mCat = merchantProfile.category?.toLowerCase();
        const mSub = merchantProfile.subcategory?.toLowerCase();

        return leadType === mCat || leadType === mSub || 
               (mCat === 'serviços' && ['obras & reformas', 'serviços rápidos', 'casa & instalações'].includes(leadType));
    });
  }, [requests, merchantProfile, hasOptedIn, isAdmin]);

  const handleUnlock = (requestId: string) => {
    if (isAdmin) {
        // ADM libera sem custos para auditoria
        onOpenChat(requestId);
        return;
    }
    setIsProcessing(requestId);
    setTimeout(() => {
        const newUnlocked = [...unlockedLeads, requestId];
        setUnlockedLeads(newUnlocked);
        localStorage.setItem('unlocked_leads_mock', JSON.stringify(newUnlocked));
        setIsProcessing(null);
    }, 1500);
  };

  const handleOptIn = () => {
    setIsLoading(true);
    setTimeout(() => {
        setHasOptedIn(true);
        localStorage.setItem(`leads_optin_${user?.id}`, 'true');
        setIsLoading(false);
    }, 800);
  };

  const handleOptOut = () => {
    if (isAdmin) return; // ADM não faz opt-out do monitoramento
    if (confirm("Ao desativar, você deixará de visualizar novas oportunidades de serviço. Deseja continuar?")) {
        setHasOptedIn(false);
        localStorage.setItem(`leads_optin_${user?.id}`, 'false');
        setShowSettings(false);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#1E5BFF]" size={32} />
        </div>
    );
  }

  // --- TELA DE APRESENTAÇÃO (ADM PULA ISSO) ---
  if (!hasOptedIn && !isAdmin) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans animate-in fade-in duration-500 flex flex-col">
            <header className="px-5 h-20 flex items-center gap-4 shrink-0">
                <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl active:scale-90 transition-all">
                    <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
            </header>

            <main className="flex-1 p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mb-8 text-[#1E5BFF] shadow-xl shadow-blue-500/10">
                    <Zap size={48} fill="currentColor" />
                </div>

                <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4 uppercase tracking-tighter">
                    Oportunidades de serviço no seu bairro
                </h1>
                
                <div className="space-y-6 text-gray-600 dark:text-gray-400 mb-12">
                    <p className="text-sm font-medium leading-relaxed">
                        Moradores solicitam serviços pelo app e você pode escolher quais pedidos deseja acessar.
                    </p>
                    <p className="text-sm font-medium leading-relaxed">
                        Cada contato é pago e limitado a até 5 profissionais, garantindo mais qualidade e menos concorrência para o seu negócio.
                    </p>
                </div>

                <button 
                    onClick={handleOptIn}
                    className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                >
                    Participar dos Serviços por Leads
                    <ChevronRight size={18} strokeWidth={3} />
                </button>
            </main>
        </div>
    );
  }

  // --- TELA DA CENTRAL DE LEADS ---
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500">
      <header className={`sticky top-0 z-40 px-5 h-20 flex items-center gap-4 border-b shadow-sm backdrop-blur-md ${isAdmin ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/95 dark:bg-gray-900/95 border-gray-100 dark:border-gray-800'}`}>
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none truncate">
            {isAdmin ? 'Monitor de Leads' : 'Central de Leads'}
          </h1>
          <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isAdmin ? 'text-amber-600' : 'text-emerald-500'}`}>
              {isAdmin ? 'Visibilidade Master ADM' : 'Participação Ativa'}
          </p>
        </div>
        {!isAdmin && (
            <button onClick={() => setShowSettings(true)} className="p-3 text-gray-400 hover:text-[#1E5BFF] transition-colors">
                <Settings2 size={20} />
            </button>
        )}
      </header>

      <main className="p-6 space-y-8 max-w-md mx-auto">
        {/* Banner Informativo ADM vs Pro */}
        <section className={`p-5 rounded-[2.5rem] border shadow-sm ${isAdmin ? 'bg-amber-500/5 border-amber-500/10' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                {isAdmin ? <ShieldAlert size={14} className="text-amber-500" /> : <ShieldCheck size={14} className="text-[#1E5BFF]" />} 
                {isAdmin ? 'Modo Auditoria Ativo' : 'Modelo Ativo'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                {isAdmin 
                    ? 'Como administrador, você tem visão total de todos os pedidos de serviço do aplicativo. Clique em "Inspecionar" para auditar conversas e status.'
                    : `Você está habilitado para receber pedidos de ${merchantProfile?.subcategory || merchantProfile?.category}. Libere o contato para abrir o chat exclusivo com o morador.`}
            </p>
        </section>

        {/* Lista de Leads */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {isAdmin ? 'Todos os Pedidos do App' : 'Pedidos para você'}
                </h3>
            </div>
            
            {filteredRequests.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                    <ShoppingBag size={48} className="text-gray-200 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Aguardando novos pedidos...</p>
                </div>
            ) : filteredRequests.map(req => {
                const isUnlocked = unlockedLeads.includes(req.id);
                return (
                    <div key={req.id} className={`bg-white dark:bg-gray-900 rounded-[2.5rem] border transition-all ${isUnlocked || isAdmin ? 'border-emerald-500/30 shadow-md' : 'border-gray-100 dark:border-gray-800 shadow-sm'} overflow-hidden`}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h4 className="font-black text-gray-900 dark:text-white text-base uppercase tracking-tighter">
                                        {req.serviceType.toUpperCase()}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">
                                            <MapPin size={10} /> {req.neighborhood}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-gray-300 uppercase">#{req.id.split('-')[1]}</span>
                            </div>

                            <div className="mb-6">
                                <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium line-clamp-2 ${(!isUnlocked && !isAdmin) && 'select-none blur-[2px]'}`}>
                                    "{req.description}"
                                </p>
                            </div>

                            {isUnlocked || isAdmin ? (
                                <button 
                                    onClick={() => onOpenChat(req.id)}
                                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest active:scale-95 transition-all"
                                >
                                    {isAdmin ? 'Inspecionar Conversa' : 'Abrir chat com cliente'}
                                    <ChevronRight size={16} strokeWidth={3} />
                                </button>
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
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </main>

      {/* MODAL DE CONFIGURAÇÕES */}
      {showSettings && !isAdmin && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300" onClick={() => setShowSettings(false)}>
              <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-8">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Gerenciar Leads</h3>
                      <button onClick={() => setShowSettings(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
                  </div>
                  <button 
                    onClick={handleOptOut}
                    className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={18} strokeWidth={3} />
                    Desativar Participação
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

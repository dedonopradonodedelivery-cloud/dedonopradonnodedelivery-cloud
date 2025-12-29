
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  BadgeCheck, 
  Megaphone, 
  ChevronRight,
  Settings,
  HelpCircle,
  CreditCard,
  Bell,
  QrCode,
  Loader2,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  user?: User | null;
}

const STORE_DATA = {
  name: "Minha Loja",
  logo: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&auto=format&fit=crop",
};

const MenuLink: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  onClick?: () => void;
  badge?: number;
}> = ({ icon: Icon, label, onClick, badge }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white dark:bg-gray-800 p-5 border-b last:border-b-0 border-gray-100 dark:border-gray-700 flex items-center justify-between group active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors"
  >
    <div className="flex items-center gap-4">
      <div className="text-gray-400 group-hover:text-[#2D6DF6] transition-colors relative">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{label}</span>
    </div>
    <div className="flex items-center gap-2">
        {badge ? (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
        ) : null}
        <ChevronRight className="w-4 h-4 text-gray-300" />
    </div>
  </button>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user }) => {
  const [isCashbackEnabled, setIsCashbackEnabled] = useState(true);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const isVerified = !!user;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!supabase || !user) return;
    const merchantId = user.id;
    const fetchCount = async () => {
        const { count } = await supabase
            .from('cashback_transactions')
            .select('*', { count: 'exact', head: true })
            .eq('merchant_id', merchantId)
            .eq('status', 'pending');
        setPendingRequestsCount(count || 0);
    };
    fetchCount();
    const sub = supabase.channel('store_area_badge')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cashback_transactions', filter: `merchant_id=eq.${merchantId}` }, () => fetchCount())
        .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1E5BFF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32 font-sans animate-in fade-in duration-300 flex flex-col">
      
      {/* HEADER - 100% Width */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 shadow-sm shrink-0 w-full">
        <div className="flex items-center gap-3 mb-1">
          <button 
            onClick={onBack}
            className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Painel do Parceiro</span>
        </div>

        <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-gray-100 dark:border-gray-600 shadow-sm">
                <img src={STORE_DATA.logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
                <div className="flex items-center gap-1.5">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display leading-tight">
                        {user?.user_metadata?.full_name || STORE_DATA.name}
                    </h1>
                    {isVerified && <BadgeCheck className="w-5 h-5 text-white fill-[#1E5BFF]" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`relative flex h-2 w-2 rounded-full ${isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {isVerified ? 'Operação Ativa' : 'Aguardando Aprovação'}
                    </p>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full bg-gray-50 dark:bg-gray-950">
        
        {/* 1. TERMINAL DE CAIXA - 100% Width */}
        <section className="w-full border-b border-gray-100 dark:border-gray-800">
          <button
              onClick={() => onNavigate && onNavigate('merchant_panel')}
              className="w-full bg-gradient-to-r from-[#1E5BFF] to-[#1749CC] text-white p-6 flex items-center justify-between active:brightness-90 transition-all"
          >
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                      <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                      <h3 className="font-bold text-lg leading-none mb-1">Terminal de Caixa</h3>
                      <p className="text-xs text-blue-100">Gerar QR, PIN e validar compras</p>
                  </div>
              </div>
              <div className="flex items-center gap-3">
                {pendingRequestsCount > 0 && (
                   <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg animate-pulse">
                     {pendingRequestsCount} PENDENTES
                   </span>
                )}
                <ChevronRight className="w-5 h-5 text-white/70" />
              </div>
          </button>
        </section>

        {/* 2. CASHBACK DA LOJA - 100% Width */}
        <section className="w-full bg-white dark:bg-gray-800 p-6 border-b border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Cashback da Loja</h3>
                      <p className="text-xs text-gray-500">Fidelize seus clientes do bairro</p>
                    </div>
                </div>
                
                <button 
                    onClick={() => setIsCashbackEnabled(!isCashbackEnabled)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isCashbackEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isCashbackEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Taxa atual</p>
                    <p className="font-black text-gray-900 dark:text-white text-xl">5%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Retorno total</p>
                    <p className="font-black text-green-600 text-xl">R$ 0,00</p>
                </div>
            </div>

            <button 
                onClick={() => onNavigate && onNavigate('store_cashback_module')}
                className="w-full py-4 rounded-2xl bg-gray-100 dark:bg-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
                Configurar programa de fidelidade
                <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
        </section>

        {/* 3. ANÚNCIOS E DESTAQUES - 100% Width */}
        <section className="w-full bg-white dark:bg-gray-800 p-6 border-b border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                    <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Anúncios e Destaques</h3>
                  <p className="text-xs text-gray-500">Aumente sua visibilidade no app</p>
                </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-5 mb-6 border border-purple-100 dark:border-purple-800/30">
                <p className="text-sm font-bold text-purple-900 dark:text-purple-200 mb-1">Impulsione suas vendas</p>
                <p className="text-xs text-purple-700 dark:text-purple-400 leading-relaxed">
                  Apareça no topo das buscas e no banner principal da Freguesia.
                </p>
            </div>

            <button 
                onClick={() => onNavigate && onNavigate('store_ads_module')}
                className="w-full bg-[#1E5BFF] text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                Gerenciar campanhas
                <ChevronRight className="w-4 h-4" />
            </button>
        </section>

        {/* 4. AÇÕES (Minha Loja / Financeiro / Suporte) - 100% Width */}
        <section className="w-full mt-6">
            <div className="px-5 mb-3">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                  Administrativo
              </h3>
            </div>
            <div className="bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-800">
                <MenuLink 
                    icon={Settings} 
                    label="Perfil Público da Loja" 
                    onClick={() => onNavigate && onNavigate('store_profile')}
                />
                <MenuLink 
                    icon={CreditCard} 
                    label="Dados da Conta e Financeiro" 
                    onClick={() => onNavigate && onNavigate('store_finance')}
                />
                <MenuLink 
                    icon={HelpCircle} 
                    label="Suporte ao Parceiro" 
                    onClick={() => onNavigate && onNavigate('store_support')}
                />
            </div>
        </section>

        {/* Footer Area - Fundo contínuo bg-gray-50 ou dark:bg-gray-950 */}
        <div className="py-12 flex flex-col items-center justify-center opacity-30 mt-auto">
          <LayoutDashboard className="w-4 h-4 mb-2" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Localizei Business v1.2</p>
        </div>

      </div>
    </div>
  );
};

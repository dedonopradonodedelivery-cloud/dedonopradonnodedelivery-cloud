
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  BadgeCheck, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Repeat, 
  TrendingUp, 
  ChevronRight,
  Settings,
  HelpCircle,
  CreditCard,
  LayoutDashboard,
  Bell,
  QrCode,
  Tag,
  Briefcase,
  PlayCircle,
  Megaphone
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { MasterSponsorshipCard } from './MasterSponsorshipCard';
import { ExplanatoryVideoModal } from './ExplanatoryVideoModal';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  user?: User | null;
}

// Mock Base Data
const STORE_DATA = {
  name: "Hamburgueria Brasa",
  isVerified: true,
  logo: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&auto=format&fit=crop",
  baseKpis: {
    sales: 12450.00,
    orders: 142,
    newCustomers: 28,
    recurringCustomers: 114,
    cashbackGiven: 622.50,
    adBalance: 45.00
  },
  connectStatus: 'inactive'
};

type DateRange = '7d' | '15d' | '30d' | '90d' | 'custom';

// --- COMPONENTES VISUAIS INTERNOS ---

const KPICard: React.FC<{ 
  label: string; 
  value: string; 
  trend?: string;
  isPositive?: boolean;
}> = ({ label, value, trend, isPositive }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col justify-center h-24 shadow-sm">
    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider truncate mb-1">{label}</p>
    <div className="flex items-end justify-between mt-1">
        <p className="text-xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">{value}</p>
        {trend && (
            <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'} bg-gray-50 dark:bg-gray-700/50 px-1.5 py-0.5 rounded`}>
                {trend}
            </span>
        )}
    </div>
  </div>
);

const ToolListItem: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  subLabel?: string;
  onClick?: () => void;
  iconColor?: string;
  hasBorder?: boolean;
}> = ({ icon: Icon, label, subLabel, onClick, iconColor = "text-gray-400", hasBorder = true }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors active:scale-[0.99] group ${hasBorder ? 'border-b border-gray-50 dark:border-gray-700' : ''}`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-left">
        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
        {subLabel && <span className="block text-[10px] text-gray-400 font-medium mt-0.5">{subLabel}</span>}
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
  </button>
);

const GrowthCard: React.FC<{
    title: string;
    description: string;
    icon: React.ElementType;
    onClick: () => void;
    onVideoClick: (e: React.MouseEvent) => void;
    colorClass: string;
}> = ({ title, description, icon: Icon, onClick, onVideoClick, colorClass }) => (
    <div 
        onClick={onClick}
        className="w-full bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.99] group cursor-pointer relative overflow-hidden"
    >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div className="text-left flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{title}</h4>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-tight line-clamp-2">{description}</p>
        </div>
        
        {/* Botão de Vídeo Discreto */}
        <button 
            onClick={onVideoClick}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors z-10"
            title="Ver vídeo explicativo"
        >
            <PlayCircle className="w-5 h-5" />
        </button>
    </div>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user }) => {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [isCashbackEnabled, setIsCashbackEnabled] = useState(true);
  
  // Video State
  const [videoModal, setVideoModal] = useState<{isOpen: boolean, url: string, title: string}>({
    isOpen: false, url: '', title: ''
  });

  const handleOpenVideo = (e: React.MouseEvent, type: 'cashback' | 'connect' | 'ads') => {
    e.stopPropagation();
    const videos = {
        cashback: { url: "https://videos.pexels.com/video-files/4388636/4388636-sd_540_960_25fps.mp4", title: "Como funciona o Cashback" },
        connect: { url: "https://videos.pexels.com/video-files/3196024/3196024-sd_640_360_25fps.mp4", title: "JPA Connect" },
        ads: { url: "https://videos.pexels.com/video-files/1118330/1118330-sd_640_360_25fps.mp4", title: "Anúncios Patrocinados" }
    };
    setVideoModal({ isOpen: true, ...videos[type] });
  };

  const currentKpis = useMemo(() => {
    let multiplier = 1;
    if (dateRange === '7d') multiplier = 0.25;
    if (dateRange === '90d') multiplier = 3;

    return {
        sales: STORE_DATA.baseKpis.sales * multiplier,
        orders: Math.round(STORE_DATA.baseKpis.orders * multiplier),
        customers: Math.round(STORE_DATA.baseKpis.newCustomers * multiplier),
        cashback: STORE_DATA.baseKpis.cashbackGiven * multiplier,
    };
  }, [dateRange]);

  // Realtime Requests Listener
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

  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300">
      
      {/* 1) HEADER */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-6 sticky top-0 z-20 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 transition-colors">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Loja Online</span>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-100 dark:border-gray-600 shadow-sm shrink-0">
                <img src={STORE_DATA.logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display leading-tight flex items-center gap-1">
                    {STORE_DATA.name}
                    {STORE_DATA.isVerified && <BadgeCheck className="w-4 h-4 text-[#1E5BFF] fill-white" />}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Painel do Parceiro</p>
            </div>
        </div>
      </div>

      <div className="p-5 pb-32 space-y-8">
        
        {/* ALERTAS */}
        {pendingRequestsCount > 0 && (
            <button 
                onClick={() => onNavigate && onNavigate('merchant_requests')}
                className="w-full bg-rose-500 text-white p-4 rounded-2xl shadow-lg shadow-rose-500/20 flex items-center justify-between animate-pulse active:scale-95 transition-transform"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full"><Bell className="w-5 h-5 text-white" /></div>
                    <div className="text-left">
                        <p className="font-bold text-sm">Solicitações Pendentes</p>
                        <p className="text-[10px] text-rose-100 opacity-90">Clientes aguardando liberação</p>
                    </div>
                </div>
                <div className="w-8 h-8 bg-white text-rose-600 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                    {pendingRequestsCount}
                </div>
            </button>
        )}

        {/* 2) AÇÃO PRINCIPAL: TERMINAL */}
        <button
            onClick={() => onNavigate && onNavigate('merchant_panel')}
            className="w-full bg-gradient-to-r from-[#1E5BFF] to-[#0047FF] text-white p-6 rounded-3xl shadow-xl shadow-blue-500/20 flex items-center justify-between active:scale-[0.98] transition-transform group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                    <QrCode className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-lg leading-none mb-1">Terminal de Caixa</h3>
                    <p className="text-xs text-blue-100 font-medium">Validar compras e QR Codes</p>
                </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ChevronRight className="w-5 h-5 text-white" />
            </div>
        </button>

        {/* 3) KPIs */}
        <section>
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5" /> Visão Geral
                </h3>
                <div className="flex bg-gray-200 dark:bg-gray-800 p-0.5 rounded-lg">
                    {['7d', '30d'].map((d) => (
                        <button 
                            key={d}
                            onClick={() => setDateRange(d as DateRange)}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${dateRange === d ? 'bg-white dark:bg-gray-600 text-black dark:text-white shadow-sm' : 'text-gray-500'}`}
                        >
                            {d.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <KPICard label="Vendas" value={formatCurrency(currentKpis.sales)} trend="+12%" isPositive />
                <KPICard label="Cashback Gerado" value={formatCurrency(currentKpis.cashback)} />
                <KPICard label="Pedidos" value={currentKpis.orders.toString()} />
                <KPICard label="Novos Clientes" value={`+${currentKpis.customers}`} trend="+5%" isPositive />
            </div>
        </section>

        {/* 4) FERRAMENTAS (LISTA) */}
        <section>
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-3">
                Ferramentas da Loja
            </h3>
            
            <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <ToolListItem 
                    icon={Tag} 
                    label="Promoção da Semana" 
                    subLabel="Gerencie ofertas e descontos"
                    iconColor="text-purple-500"
                    onClick={() => onNavigate && onNavigate('weekly_promo')}
                />
                <ToolListItem 
                    icon={Briefcase} 
                    label="Vagas de Emprego" 
                    subLabel="Anuncie oportunidades no bairro"
                    iconColor="text-amber-500"
                    onClick={() => onNavigate && onNavigate('merchant_jobs')}
                />
                <ToolListItem 
                    icon={Settings} 
                    label="Minha Loja (Perfil)" 
                    subLabel="Fotos, horários e informações"
                    onClick={() => onNavigate && onNavigate('store_profile')}
                />
                <ToolListItem 
                    icon={CreditCard} 
                    label="Financeiro" 
                    subLabel="Conta bancária e repasses"
                    onClick={() => onNavigate && onNavigate('store_finance')}
                />
                <ToolListItem 
                    icon={HelpCircle} 
                    label="Suporte ao Lojista" 
                    onClick={() => onNavigate && onNavigate('store_support')}
                    hasBorder={false}
                />
            </div>
        </section>

        {/* 5) FIDELIZAÇÃO (CASHBACK) */}
        <section>
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-3">
                Fidelização
            </h3>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF]">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-base">Cashback da Loja</h4>
                            <p className="text-xs text-gray-500 font-medium">Status: {isCashbackEnabled ? <span className="text-green-500 font-bold">Ativo</span> : <span className="text-gray-400">Pausado</span>}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsCashbackEnabled(!isCashbackEnabled)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isCashbackEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isCashbackEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <div className="flex gap-8 mb-6 relative z-10 pl-2">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Taxa Atual</p>
                        <p className="font-black text-gray-900 dark:text-white text-2xl">5%</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Retorno Gerado</p>
                        <p className="font-black text-green-600 text-2xl">R$ 4,5k</p>
                    </div>
                </div>

                <div className="flex gap-3 relative z-10">
                    <button 
                        onClick={() => onNavigate && onNavigate('store_cashback_module')}
                        className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                    >
                        Gerenciar
                    </button>
                    <button 
                        onClick={(e) => handleOpenVideo(e, 'cashback')}
                        className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        title="Ver vídeo explicativo"
                    >
                        <PlayCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>

        {/* 6) CRESCIMENTO (AGRUPADO) */}
        <section className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-1">
                Crescimento & Visibilidade
            </h3>

            <div className="flex flex-col gap-3">
                <GrowthCard 
                    title="JPA Connect" 
                    description="Networking exclusivo para lojistas." 
                    icon={Users} 
                    colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                    onClick={() => onNavigate && onNavigate('freguesia_connect_public')}
                    onVideoClick={(e) => handleOpenVideo(e, 'connect')}
                />
                
                <GrowthCard 
                    title="Anúncios Patrocinados" 
                    description="Apareça no topo das buscas." 
                    icon={Megaphone} 
                    colorClass="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                    onClick={() => onNavigate && onNavigate('store_ads_module')}
                    onVideoClick={(e) => handleOpenVideo(e, 'ads')}
                />

                {/* Patrocinador Master */}
                <div className="pt-2">
                    <MasterSponsorshipCard isAvailable={true} />
                </div>
            </div>
        </section>

      </div>

      <ExplanatoryVideoModal 
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal(prev => ({ ...prev, isOpen: false }))}
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
    </div>
  );
};

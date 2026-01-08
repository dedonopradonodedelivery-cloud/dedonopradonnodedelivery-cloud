
import React, { useState, useMemo, useEffect } from 'react';
import { 
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
  Megaphone,
  User as UserIcon,
  Menu,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { MasterSponsorshipCard } from './MasterSponsorshipCard';
import { ExplanatoryVideoModal } from './ExplanatoryVideoModal';

interface StoreAreaViewProps {
  onBack: () => void; // Agora funciona como "Open Menu"
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

// --- COMPONENTES VISUAIS INTERNOS (ATOMICOS) ---

const StatBlock: React.FC<{ 
  label: string; 
  value: string; 
  trend?: string;
  isPositive?: boolean;
}> = ({ label, value, trend, isPositive }) => (
  <div className="flex flex-col px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider truncate mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
        <p className="text-lg font-black text-gray-900 dark:text-white leading-none tracking-tight">{value}</p>
        {trend && (
            <span className={`text-[9px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trend}
            </span>
        )}
    </div>
  </div>
);

const SettingsItem: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  onClick?: () => void;
  isLast?: boolean;
  alert?: boolean;
}> = ({ icon: Icon, label, onClick, isLast, alert }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors active:scale-[0.99] group ${!isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:text-[#1E5BFF] transition-colors`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
    </div>
    <div className="flex items-center gap-2">
        {alert && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
    </div>
  </button>
);

const GrowthItem: React.FC<{
    title: string;
    subtitle: string;
    icon: React.ElementType;
    onClick: () => void;
    onVideoClick: (e: React.MouseEvent) => void;
    accentColor: string;
}> = ({ title, subtitle, icon: Icon, onClick, onVideoClick, accentColor }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-1 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
        <div 
            onClick={onClick}
            className="flex items-center gap-4 p-4 cursor-pointer active:opacity-80 transition-opacity"
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${accentColor} bg-opacity-10 text-opacity-100`}>
                <Icon className={`w-5 h-5 ${accentColor.replace('bg-', 'text-')}`} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h4>
                <p className="text-[11px] text-gray-500 leading-tight">{subtitle}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
        
        {/* Botão de Vídeo Discreto na base do card */}
        <div className="px-4 pb-3 pt-0">
            <button 
                onClick={onVideoClick}
                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-[#1E5BFF] transition-colors w-fit"
            >
                <PlayCircle className="w-3 h-3" />
                Ver como funciona
            </button>
        </div>
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
  const handleMenuClick = onBack;

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300">
      
      {/* SEÇÃO 1: HEADER & IDENTIDADE */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-6 sticky top-0 z-20 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-100 dark:border-gray-600 shadow-sm shrink-0">
                    <img src={STORE_DATA.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-1">
                        {STORE_DATA.name}
                        {STORE_DATA.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-white" />}
                    </h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Loja Online</span>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={handleMenuClick} 
                className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 transition-colors"
            >
                <Menu className="w-6 h-6" />
            </button>
        </div>
      </div>

      <div className="p-5 pb-32 space-y-10"> {/* Espaçamento vertical aumentado para 40px (space-y-10) */}
        
        {/* ALERTAS (Condicional) */}
        {pendingRequestsCount > 0 && (
            <button 
                onClick={() => onNavigate && onNavigate('merchant_requests')}
                className="w-full bg-rose-500 text-white p-4 rounded-2xl shadow-lg shadow-rose-500/20 flex items-center justify-between animate-pulse active:scale-95 transition-transform -mt-4"
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

        {/* SEÇÃO 2: AÇÃO PRINCIPAL (TERMINAL) */}
        <section>
            <button
                onClick={() => onNavigate && onNavigate('merchant_panel')}
                className="w-full h-32 bg-gradient-to-r from-[#1E5BFF] to-[#0047FF] text-white rounded-[28px] shadow-xl shadow-blue-500/20 flex flex-col justify-center items-center relative overflow-hidden group active:scale-[0.98] transition-all"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
                
                <div className="bg-white/20 p-3 rounded-2xl mb-3 backdrop-blur-sm border border-white/10">
                    <QrCode className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-black text-xl leading-none mb-1 font-display tracking-tight">Terminal de Caixa</h3>
                <p className="text-xs text-blue-100 font-medium opacity-90">Validar compras e QR Codes</p>
            </button>
        </section>

        {/* SEÇÃO 3: VISÃO GERAL (Clean Grid) */}
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    Visão Geral
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
                <StatBlock label="Vendas" value={formatCurrency(currentKpis.sales)} trend="+12%" isPositive />
                <StatBlock label="Pedidos" value={currentKpis.orders.toString()} />
                <StatBlock label="Cashback" value={formatCurrency(currentKpis.cashback)} />
                <StatBlock label="Novos Clientes" value={`+${currentKpis.customers}`} trend="+5%" isPositive />
            </div>
        </section>

        {/* SEÇÃO 4: FERRAMENTAS (Lista Limpa) */}
        <section>
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-4">
                Configurações da Loja
            </h3>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <SettingsItem 
                    icon={Tag} 
                    label="Promoção da Semana" 
                    onClick={() => onNavigate && onNavigate('weekly_promo')}
                />
                <SettingsItem 
                    icon={Briefcase} 
                    label="Vagas de Emprego" 
                    onClick={() => onNavigate && onNavigate('merchant_jobs')}
                />
                <SettingsItem 
                    icon={Settings} 
                    label="Perfil Público" 
                    onClick={() => onNavigate && onNavigate('store_profile')}
                />
                <SettingsItem 
                    icon={CreditCard} 
                    label="Financeiro" 
                    onClick={() => onNavigate && onNavigate('store_finance')}
                />
                <SettingsItem 
                    icon={HelpCircle} 
                    label="Suporte" 
                    onClick={() => onNavigate && onNavigate('store_support')}
                    isLast
                />
            </div>
        </section>

        {/* SEÇÃO 5: FIDELIZAÇÃO (Destaque) */}
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Fidelização
                </h3>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF]">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Cashback Ativo</h4>
                            <p className="text-xs text-gray-500">Taxa atual: <span className="font-bold text-gray-700 dark:text-gray-300">5%</span></p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsCashbackEnabled(!isCashbackEnabled)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isCashbackEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isCashbackEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => onNavigate && onNavigate('store_cashback_module')}
                        className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white font-bold py-3 rounded-xl text-xs hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                        Gerenciar Regras
                    </button>
                    <button 
                        onClick={(e) => handleOpenVideo(e, 'cashback')}
                        className="px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-600 text-gray-400 hover:text-[#1E5BFF] transition-colors"
                        title="Ver vídeo explicativo"
                    >
                        <PlayCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>

        {/* SEÇÃO 6: CRESCIMENTO (Cards Separados) */}
        <section className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                Acelerar Crescimento
            </h3>

            <div className="grid grid-cols-1 gap-4">
                <GrowthItem 
                    title="JPA Connect" 
                    subtitle="Networking exclusivo para lojistas." 
                    icon={Users} 
                    accentColor="bg-indigo-600"
                    onClick={() => onNavigate && onNavigate('freguesia_connect_public')}
                    onVideoClick={(e) => handleOpenVideo(e, 'connect')}
                />
                
                <GrowthItem 
                    title="Anúncios Patrocinados" 
                    subtitle="Apareça no topo das buscas." 
                    icon={Megaphone} 
                    accentColor="bg-amber-500"
                    onClick={() => onNavigate && onNavigate('store_ads_module')}
                    onVideoClick={(e) => handleOpenVideo(e, 'ads')}
                />

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

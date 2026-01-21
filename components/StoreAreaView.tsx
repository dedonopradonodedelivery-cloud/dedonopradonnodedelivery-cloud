import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  BadgeCheck, 
  ShoppingBag, 
  Users, 
  ChevronRight,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Calendar,
  Briefcase,
  ArrowRight,
  Rocket,
  Tag,
  Coins,
  QrCode,
  Megaphone,
  Eye,
  Heart,
  Share2,
  Phone,
  MousePointerClick,
  TrendingUp,
  MapPin,
  HeartHandshake,
  MessageSquare,
  Lightbulb,
  Loader2,
  LogOut,
  DollarSign,
  Repeat,
  Wallet,
  Bell
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { BannerOrder, BannerMessage } from '../types';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  user?: User | null;
  bannerOrders?: BannerOrder[];
  bannerMessages?: BannerMessage[];
  onViewOrder?: (orderId: string) => void;
}

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
};

const KPICard: React.FC<{ icon: React.ElementType; label: string; value: string; color: string; trend?: string; }> = ({ icon: Icon, label, value, color, trend }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-28">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} bg-opacity-10 dark:bg-opacity-20`}>
      <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide truncate">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
        {trend && <p className="text-xs font-bold text-green-500">{trend}</p>}
      </div>
    </div>
  </div>
);

const MenuLink: React.FC<{ icon: React.ElementType; label: string; onClick?: () => void; highlight?: boolean; subtitle?: string; badge?: boolean; }> = ({ icon: Icon, label, onClick, highlight, subtitle, badge }) => (
  <button onClick={onClick} className={`w-full bg-white dark:bg-gray-800 p-4 border-b last:border-b-0 border-gray-100 dark:border-gray-700 flex items-center justify-between group active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors`}>
    <div className="flex items-center gap-3">
      <div className={`${highlight ? 'text-[#1E5BFF]' : 'text-gray-400'} group-hover:text-[#2D6DF6] transition-colors relative`}><Icon className="w-5 h-5" /></div>
      <div className="flex flex-col items-start">
        <span className={`text-sm font-semibold ${highlight ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>{label}</span>
        {subtitle && <span className="text-[10px] text-gray-400 font-medium">{subtitle}</span>}
      </div>
    </div>
    <div className="flex items-center gap-2">
        {badge && <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>}
        <ChevronRight className="w-4 h-4 text-gray-300" />
    </div>
  </button>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user, bannerOrders = [], bannerMessages = [], onViewOrder }) => {
  const storeId = user?.id || 'grupo-esquematiza';
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCashbackEnabled, setIsCashbackEnabled] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const hasUnreadMessages = useMemo(() => {
    const professionalOrders = bannerOrders.filter(o => o.bannerType === 'professional');
    return professionalOrders.some(order => {
        const lastTeamMessage = bannerMessages
            .filter(m => m.orderId === order.id && m.senderType === 'team')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        
        if (!lastTeamMessage) return false;
        if (!order.lastViewedAt) return true;
        
        return new Date(lastTeamMessage.createdAt) > new Date(order.lastViewedAt);
    });
  }, [bannerOrders, bannerMessages]);

  const professionalOrders = bannerOrders.filter(o => o.bannerType === 'professional');

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
        await signOut();
        if (onNavigate) onNavigate('home');
    } catch (error) {
        console.error("Logout failed", error);
    } finally {
        setIsLoggingOut(false);
    }
  };

  const formatCurrency = (val: number) => 
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 font-sans animate-in slide-in-from-right duration-300">
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 mb-1"><button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 transition-colors"><ChevronLeft className="w-6 h-6" /></button><span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Painel do Parceiro</span></div>
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-gray-100 dark:border-gray-600 shadow-sm"><img src={STORE_DATA.logo} alt="Logo" className="w-full h-full object-cover" /></div>
            <div>
                <div className="flex items-center gap-1.5"><h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display leading-tight">{STORE_DATA.name}</h1>{STORE_DATA.isVerified && <BadgeCheck className="w-5 h-5 text-white fill-[#1E5BFF]" />}</div>
                <p className="text-xs font-medium text-gray-500">Operação Ativa</p>
            </div>
        </div>
      </div>
      <div className="p-5 space-y-8">
        <div className="grid grid-cols-2 gap-3">
            <KPICard icon={DollarSign} label="Vendas Localizei" value={formatCurrency(STORE_DATA.baseKpis.sales)} color="bg-green-500" />
            <KPICard icon={ShoppingBag} label="Pedidos" value={STORE_DATA.baseKpis.orders.toString()} color="bg-blue-500" />
            <KPICard icon={TrendingUp} label="Cashback Gerado" value={formatCurrency(STORE_DATA.baseKpis.cashbackGiven)} color="bg-orange-500" />
            <KPICard icon={Wallet} label="Saldo Anúncios" value={formatCurrency(STORE_DATA.baseKpis.adBalance)} color="bg-gray-500" />
        </div>

        <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Ações</h3>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <MenuLink icon={LayoutDashboard} label="Desempenho do seu negócio" highlight />
                <MenuLink icon={Coins} label="Sistema de Cashback" highlight />
                <MenuLink icon={Megaphone} label="Anúncios de Banners" subtitle="Criação e gestão de banners" onClick={() => onNavigate?.('banner_config')} />
                {professionalOrders.length > 0 && (
                  <MenuLink 
                    icon={Briefcase} 
                    label="Acompanhar Pedidos" 
                    subtitle={`${professionalOrders.length} pedido(s) em andamento`}
                    onClick={() => {
                        if (professionalOrders.length === 1 && onViewOrder) {
                            onViewOrder(professionalOrders[0].id);
                        } else {
                            onNavigate?.('banner_orders_list');
                        }
                    }}
                    badge={hasUnreadMessages} 
                  />
                )}
                <MenuLink icon={Rocket} label="ADS / Patrocinados" subtitle="Apareça em destaque para mais clientes" onClick={() => onNavigate?.('sponsored_ads')} />
                <MenuLink icon={Tag} label="Promoção da Semana" subtitle="Ofertas em destaque na Home" onClick={() => onNavigate?.('weekly_promo')} />
                <MenuLink icon={Settings} label="Minha Loja (Perfil)" onClick={() => onNavigate?.('store_profile')} />
                <MenuLink icon={HelpCircle} label="Suporte" onClick={() => onNavigate?.('store_support')} />
            </div>
        </div>
        <div className="pt-4">
            <button 
                onClick={handleLogout} 
                disabled={isLoggingOut} 
                className="w-full bg-red-50 dark:bg-red-900/10 p-5 rounded-[2rem] border border-red-100 dark:border-red-900/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
                {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin text-red-600" /> : <LogOut className="w-5 h-5 text-red-600" />}
                <span className="font-bold text-red-600 text-sm">Sair da conta</span>
            </button>
        </div>
      </div>
    </div>
  );
};
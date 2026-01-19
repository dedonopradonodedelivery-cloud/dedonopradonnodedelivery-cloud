
import React, { useState, useMemo } from 'react';
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
  QrCode
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  user?: User | null;
}

const STORE_DATA = {
  name: "Hamburgueria Brasa",
  isVerified: true,
  logo: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&auto=format&fit=crop",
};

const KPICard: React.FC<{ icon: React.ElementType; label: string; value: string; color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-24">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color} bg-opacity-10 dark:bg-opacity-20`}><Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} /></div>
    <div>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide truncate">{label}</p>
      <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
    </div>
  </div>
);

const MenuLink: React.FC<{ icon: React.ElementType; label: string; onClick?: () => void; highlight?: boolean; subtitle?: string }> = ({ icon: Icon, label, onClick, highlight, subtitle }) => (
  <button onClick={onClick} className={`w-full bg-white dark:bg-gray-800 p-4 border-b last:border-b-0 border-gray-100 dark:border-gray-700 flex items-center justify-between group active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors`}>
    <div className="flex items-center gap-3">
      <div className={`${highlight ? 'text-[#1E5BFF]' : 'text-gray-400'} group-hover:text-[#2D6DF6] transition-colors`}><Icon className="w-5 h-5" /></div>
      <div className="flex flex-col items-start">
        <span className={`text-sm font-semibold ${highlight ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>{label}</span>
        {subtitle && <span className="text-[10px] text-gray-400 font-medium">{subtitle}</span>}
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-300" />
  </button>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate }) => {
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
        <div>
            <div className="flex items-center justify-between mb-4 px-1"><h2 className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><LayoutDashboard className="w-4 h-4 text-[#2D6DF6]" />Desempenho</h2></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <KPICard icon={ShoppingBag} label="Pedidos" value="142" color="bg-blue-500" />
                <KPICard icon={Users} label="Novos Clientes" value="+28" color="bg-purple-500" />
            </div>
        </div>

        {/* NOVA ÁREA DE CASHBACK */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-1 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <button 
                onClick={() => onNavigate?.('merchant_cashback_dashboard')}
                className="w-full p-6 flex items-center justify-between group active:bg-gray-50 dark:active:bg-gray-700/50 transition-all"
            >
                <div className="flex items-center gap-5 text-left">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-[#EAF0FF] dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF]">
                        <Coins className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">Configurar Cashback</h3>
                        <p className="text-xs text-gray-500 mt-1">Gerencie QR Code, PIN e taxas.</p>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-300 group-hover:text-[#1E5BFF] transition-colors">
                    <ChevronRight className="w-5 h-5" strokeWidth={3} />
                </div>
            </button>
        </div>

        <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Gestão da Loja</h3>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <MenuLink icon={Tag} label="Promoção da Semana" highlight={true} onClick={() => onNavigate?.('weekly_promo')} />
                <MenuLink icon={Briefcase} label="Vagas de Emprego" highlight={true} onClick={() => onNavigate?.('merchant_jobs')} />
                <MenuLink icon={Settings} label="Minha Loja (Perfil Público)" onClick={() => onNavigate?.('store_profile')} />
                <MenuLink icon={HelpCircle} label="Suporte ao Lojista" onClick={() => onNavigate?.('store_support')} />
            </div>
        </div>
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden group">
            <h3 className="font-black text-xl text-white font-display mb-2">Anuncie sua marca no app</h3>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">Apareça com destaque para todo o bairro e atraia novos clientes agora mesmo.</p>
            <button onClick={() => onNavigate?.('store_ads_module')} className="w-full bg-[#1E5BFF] text-white py-5 rounded-2xl text-sm font-black shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase">EU QUERO ANUNCIAR<ArrowRight className="w-5 h-5" strokeWidth={3} /></button>
        </div>
      </div>
    </div>
  );
};

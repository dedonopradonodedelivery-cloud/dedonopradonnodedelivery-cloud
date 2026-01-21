
import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Megaphone, 
  Palette, 
  LayoutGrid, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  Heart, 
  Info, 
  HelpCircle, 
  LogOut,
  User,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: SupabaseUser | null;
}

const ActionCard: React.FC<{ 
  icon: React.ElementType; 
  title: string; 
  subtitle: string; 
  onClick: () => void;
  colorClass: string;
}> = ({ icon: Icon, title, subtitle, onClick, colorClass }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-start p-5 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md active:scale-95 transition-all text-left group"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorClass} bg-opacity-10 transition-transform group-hover:scale-110`}>
      <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
    <h3 className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">
      {title}
    </h3>
    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
      {subtitle}
    </p>
  </button>
);

const ListItem: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  onClick: () => void;
  isDestructive?: boolean;
}> = ({ icon: Icon, label, onClick, isDestructive }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-50 dark:border-gray-700 last:border-b-0 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}>
        <Icon size={18} />
      </div>
      <span className={`text-sm font-semibold ${isDestructive ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
        {label}
      </span>
    </div>
    <ChevronRight size={16} className={isDestructive ? 'text-red-300' : 'text-gray-300'} />
  </button>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user }) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    onNavigate('home');
  };

  const storeName = user?.user_metadata?.store_name || "Sua Loja";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${storeName.replace(' ', '+')}&background=1E5BFF&color=fff`;

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-gray-950 font-sans animate-in fade-in duration-500 pb-32">
      
      {/* 1. TOPO / PERFIL */}
      <div className="bg-white dark:bg-gray-900 px-6 pt-12 pb-8 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-[2rem] border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden shrink-0">
            <img src={avatarUrl} alt={storeName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white truncate leading-tight uppercase tracking-tighter">
              {storeName}
            </h1>
            <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-1">Lojista Parceiro</p>
          </div>
        </div>
        
        <button 
          onClick={() => onNavigate('store_detail')}
          className="w-full py-3 rounded-2xl border-2 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-[0.98]"
        >
          <User size={14} />
          Ver perfil da loja
        </button>
      </div>

      <div className="p-6 space-y-10">
        
        {/* 2. SEÇÃO PRINCIPAL - AÇÕES */}
        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Painel de Ações</h2>
            <Sparkles size={16} className="text-blue-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ActionCard 
              icon={Palette}
              title="Criar Banner"
              subtitle="Crie ou solicite sua arte profissional"
              colorClass="bg-blue-500"
              onClick={() => onNavigate('store_ads_module')}
            />
            <ActionCard 
              icon={LayoutGrid}
              title="Meus Banners"
              subtitle="Veja e edite seus banners"
              colorClass="bg-purple-500"
              onClick={() => onNavigate('store_ads_module')}
            />
            <ActionCard 
              icon={Megaphone}
              title="Anunciar (ADS)"
              subtitle="Destaque sua loja no app"
              colorClass="bg-amber-500"
              onClick={() => onNavigate('store_ads_module')}
            />
            <ActionCard 
              icon={BarChart3}
              title="Meus Anúncios"
              subtitle="Acompanhe seus anúncios ativos"
              colorClass="bg-emerald-500"
              onClick={() => onNavigate('store_ads_module')}
            />
          </div>
        </section>

        {/* 3. SEÇÃO SERVIÇOS */}
        <section>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Serviços</h3>
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ListItem 
              icon={MessageSquare} 
              label="Chat com Designer" 
              onClick={() => window.open('https://wa.me/5521999999999', '_blank')} 
            />
            <ListItem 
              icon={FileText} 
              label="Pedidos de Banner" 
              onClick={() => alert('Em breve')} 
            />
            <ListItem 
              icon={CreditCard} 
              label="Pagamentos" 
              onClick={() => onNavigate('store_finance')} 
            />
          </div>
        </section>

        {/* 4. SEÇÃO GERAL */}
        <section>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Geral</h3>
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ListItem 
              icon={Heart} 
              label="Favoritos" 
              onClick={() => onNavigate('favorites')} 
            />
            <ListItem 
              icon={Info} 
              label="Quem Somos" 
              onClick={() => onNavigate('about')} 
            />
            <ListItem 
              icon={HelpCircle} 
              label="Suporte" 
              onClick={() => onNavigate('support')} 
            />
            <ListItem 
              icon={LogOut} 
              label="Sair da conta" 
              isDestructive
              onClick={handleLogout} 
            />
          </div>
        </section>

      </div>

      {/* Footer / Info */}
      <div className="mt-8 text-center opacity-30 px-10">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
          Localizei JPA Parceiros <br/> v1.2.0
        </p>
      </div>
    </div>
  );
};

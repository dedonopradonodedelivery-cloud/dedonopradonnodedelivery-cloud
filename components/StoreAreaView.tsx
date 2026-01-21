
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
  Sparkles,
  Compass,
  LifeBuoy
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: SupabaseUser | null;
}

// Componente para Grade de Ações Principais (2x2)
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
    <h3 className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1 leading-tight">
      {title}
    </h3>
    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight font-medium">
      {subtitle}
    </p>
  </button>
);

// Componente para Listas de Serviços (Blocos Padronizados)
const ServiceBlock: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  description?: string;
  onClick: () => void;
  isDestructive?: boolean;
}> = ({ icon: Icon, label, description, onClick, isDestructive }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-50 dark:border-gray-700 last:border-b-0 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors group"
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl transition-colors ${
        isDestructive 
          ? 'bg-red-50 text-red-500' 
          : 'bg-gray-50 dark:bg-gray-700 text-gray-400 group-hover:text-[#1E5BFF] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20'
      }`}>
        <Icon size={20} />
      </div>
      <div className="text-left">
        <p className={`text-sm font-bold ${isDestructive ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
          {label}
        </p>
        {description && (
          <p className="text-[10px] text-gray-400 font-medium leading-none mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
    <ChevronRight size={16} className={isDestructive ? 'text-red-300' : 'text-gray-300'} />
  </button>
);

const SectionHeader: React.FC<{ title: string; icon?: React.ElementType }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4 px-1">
    {Icon && <Icon size={14} className="text-gray-400" />}
    <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
      {title}
    </h2>
  </div>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user }) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    if (confirm('Deseja realmente sair da sua conta de lojista?')) {
      await signOut();
      onNavigate('home');
    }
  };

  const storeName = user?.user_metadata?.store_name || "Sua Loja";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${storeName.replace(' ', '+')}&background=1E5BFF&color=fff`;

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-gray-950 font-sans animate-in fade-in duration-500 pb-32">
      
      {/* 1. TOPO / PERFIL (Mantido conforme spec) */}
      <div className="bg-white dark:bg-gray-900 px-6 pt-12 pb-8 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-[2rem] border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden shrink-0">
            <img src={avatarUrl} alt={storeName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white truncate leading-tight uppercase tracking-tighter">
              {storeName}
            </h1>
            <p className="text-xs text-[#1E5BFF] font-bold uppercase tracking-widest mt-1">Lojista Parceiro</p>
          </div>
        </div>
        
        <button 
          onClick={() => onNavigate('store_detail')}
          className="w-full py-3.5 rounded-2xl border-2 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98]"
        >
          <User size={14} />
          Ver perfil da loja
        </button>
      </div>

      <div className="p-6 space-y-10">
        
        {/* 2. SEÇÃO: AÇÕES PRINCIPAIS */}
        <section>
          <SectionHeader title="Ações" icon={Sparkles} />
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

        {/* 3. SEÇÃO: SERVIÇOS */}
        <section>
          <SectionHeader title="Serviços" />
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ServiceBlock 
              icon={MessageSquare} 
              label="Chat com Designer" 
              description="Fale sobre ajustes e criação"
              onClick={() => window.open('https://wa.me/5521999999999', '_blank')} 
            />
            <ServiceBlock 
              icon={FileText} 
              label="Pedidos de Banner" 
              description="Acompanhe status e histórico"
              onClick={() => alert('Módulo de pedidos em desenvolvimento')} 
            />
            <ServiceBlock 
              icon={CreditCard} 
              label="Pagamentos" 
              description="Compras, recibos e cobranças"
              onClick={() => onNavigate('store_finance')} 
            />
          </div>
        </section>

        {/* 4. SEÇÃO: SUPORTE */}
        <section>
          <SectionHeader title="Suporte" />
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ServiceBlock 
              icon={LifeBuoy} 
              label="Suporte" 
              description="Dúvidas, ajuda e atendimento"
              onClick={() => onNavigate('store_support')} 
            />
            <ServiceBlock 
              icon={HelpCircle} 
              label="Central de Ajuda" 
              description="Perguntas frequentes"
              onClick={() => onNavigate('store_support')} 
            />
          </div>
        </section>

        {/* 5. SEÇÃO: GERAL */}
        <section>
          <SectionHeader title="Geral" />
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ServiceBlock 
              icon={Heart} 
              label="Favoritos" 
              onClick={() => onNavigate('favorites')} 
            />
            <ServiceBlock 
              icon={Compass} 
              label="Quem Somos" 
              onClick={() => onNavigate('about')} 
            />
            <ServiceBlock 
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
          Localizei JPA Parceiros <br/> v1.3.0
        </p>
      </div>
    </div>
  );
};

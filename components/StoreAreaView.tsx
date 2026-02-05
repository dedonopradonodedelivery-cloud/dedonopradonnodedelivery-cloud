
import React from 'react';
import { 
  ChevronRight, 
  Megaphone, 
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
  LifeBuoy,
  AlertTriangle,
  Crown,
  Star,
  Moon,
  Sun,
  ImageIcon,
  TrendingUp
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  user: SupabaseUser | null;
}

const ServiceBlock: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  description?: string;
  onClick: () => void;
  isDestructive?: boolean;
  colorClass?: string;
  badge?: number;
  labelBadge?: string;
  rightElement?: React.ReactNode;
}> = ({ icon: Icon, label, description, onClick, isDestructive, colorClass, badge, labelBadge, rightElement }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-b-0 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors group"
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl transition-colors relative ${
        isDestructive 
          ? 'bg-red-50 text-red-500' 
          : colorClass || 'bg-gray-50 dark:bg-gray-700 text-gray-400 group-hover:text-[#1E5BFF] group-hover:bg-blue-50'
      }`}>
        <Icon size={22} />
        {badge ? (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center animate-bounce">
            <span className="text-[10px] font-black text-white">{badge}</span>
          </div>
        ) : null}
      </div>
      <div className="text-left">
        <p className={`text-sm font-bold ${isDestructive ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
          {label}
        </p>
        {description && (
          <p className="text-[10px] text-gray-400 font-medium leading-tight mt-1 max-w-[200px]">
            {description}
          </p>
        )}
      </div>
    </div>
    {rightElement || <ChevronRight size={16} className={isDestructive ? 'text-red-300' : 'text-gray-300'} />}
  </button>
);

const SectionHeader: React.FC<{ title: string; icon?: React.ElementType }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-3 px-1">
    {Icon && <Icon size={14} className="text-[#1E5BFF]" />}
    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
      {title}
    </h2>
  </div>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user }) => {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    if (confirm('Deseja realmente sair da sua conta de lojista?')) {
      await signOut();
      onNavigate('home');
    }
  };

  const storeName = user?.user_metadata?.store_name || "Sua Loja";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${storeName.replace(' ', '+')}&background=1E5BFF&color=fff`;

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in fade-in duration-500 pb-32">
      
      <div className="bg-white dark:bg-gray-900 px-6 pt-12 pb-8 border-b border-gray-100 dark:border-gray-800 shadow-sm mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-[2rem] border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden shrink-0">
            <img src={avatarUrl} alt={storeName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white truncate leading-tight uppercase tracking-tighter">
              {storeName}
            </h1>
            <p className="text-xs text-[#1E5BFF] font-bold uppercase tracking-widest mt-1">Painel do Lojista</p>
          </div>
        </div>
        
        <button 
          onClick={() => onNavigate('store_profile')}
          className="w-full mt-6 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98]"
        >
          <User size={14} />
          Minha Loja (Perfil Público)
        </button>
      </div>

      <div className="px-6 space-y-10">
        
        <section>
          <SectionHeader title="Ações de Crescimento" icon={Sparkles} />
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ServiceBlock 
              icon={Crown} 
              label="Patrocinador Master" 
              description="Apareça em destaque em 90% das telas do bairro"
              onClick={() => onNavigate('sponsor_info')}
              colorClass="bg-amber-50 text-amber-600"
            />
            <ServiceBlock 
              icon={TrendingUp} 
              label="Patrocinados" 
              description="Suba para o topo da lista por R$ 0,90/dia"
              onClick={() => onNavigate('store_sponsored')}
              colorClass="bg-emerald-50 text-emerald-600"
            />
            <ServiceBlock 
              icon={LayoutGrid} 
              label="Banners em Destaque" 
              description="Sua loja nos banners da Home com benefícios exclusivos de Fundador Apoiador."
              onClick={() => onNavigate('store_ads_module')}
              colorClass="bg-purple-50 text-purple-600"
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Serviços" />
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ServiceBlock 
              icon={MessageSquare} 
              label="Chat com Designer" 
              description="Criação e acompanhamento do seu banner"
              onClick={() => onNavigate('store_ads_module', 'chat')} 
            />
            <ServiceBlock 
              icon={BarChart3} 
              label="Performance" 
              description="Estatísticas de visualização e cliques"
              onClick={() => onNavigate('merchant_performance')}
            />
            <ServiceBlock 
              icon={CreditCard} 
              label="Pagamentos" 
              description="Extratos, faturas e assinaturas"
              onClick={() => onNavigate('store_finance')} 
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Preferências" />
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ServiceBlock 
              icon={theme === 'dark' ? Moon : Sun} 
              label="Modo Noite" 
              description={theme === 'dark' ? "Ativado" : "Desativado"}
              onClick={toggleTheme}
              rightElement={
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1E5BFF]' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              }
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Suporte" />
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ServiceBlock 
              icon={LifeBuoy} 
              label="Suporte ao Lojista" 
              description="Ajuda com o app e conta"
              onClick={() => onNavigate('store_support')} 
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Geral" />
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
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

      <div className="mt-12 text-center opacity-30 px-10">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
          Localizei JPA Parceiros <br/> v1.5.0
        </p>
      </div>
    </div>
  );
};

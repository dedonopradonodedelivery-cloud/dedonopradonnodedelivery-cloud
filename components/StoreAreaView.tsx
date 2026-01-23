
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
  Users,
  Award
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate: (view: string, initialView?: 'sales' | 'chat') => void;
  user: SupabaseUser | null;
}

// Componente para Ações de Marketing (Cards Verticais)
const MarketingActionCard: React.FC<{
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
  iconBgClass: string;
  iconColorClass: string;
  badge?: number;
}> = ({ icon: Icon, label, description, onClick, iconBgClass, iconColorClass, badge }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-5 p-5 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group active:scale-[0.98]"
  >
    <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBgClass} group-hover:scale-105 transition-transform`}>
      <Icon size={28} className={iconColorClass} />
      {badge ? (
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center animate-bounce">
          <span className="text-xs font-black text-white">{badge}</span>
        </div>
      ) : null}
    </div>
    <div className="flex-1 text-left">
      <p className="font-black text-gray-800 dark:text-white text-base leading-tight">
        {label}
      </p>
      <p className="text-xs text-gray-400 font-medium leading-snug mt-1">
        {description}
      </p>
    </div>
    <ChevronRight size={20} className="text-gray-300 group-hover:text-[#1E5BFF]" />
  </button>
);

// Componente para Serviços (Lista Simples)
const ServiceBlock: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  description?: string;
  onClick: () => void;
}> = ({ icon: Icon, label, description, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-800 border-b border-gray-50 dark:border-gray-700 last:border-b-0 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors group"
  >
    <div className="flex items-center gap-4">
      <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-400 group-hover:text-[#1E5BFF] group-hover:bg-blue-50 transition-colors">
        <Icon size={22} />
      </div>
      <div className="text-left">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
          {label}
        </p>
        {description && (
          <p className="text-[10px] text-gray-400 font-medium leading-tight mt-1 max-w-[200px]">
            {description}
          </p>
        )}
      </div>
    </div>
    <ChevronRight size={16} className="text-gray-300" />
  </button>
);

const SectionHeader: React.FC<{ title: string; icon?: React.ElementType }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4 px-1">
    {Icon && <Icon size={14} className="text-[#1E5BFF]" />}
    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
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
      
      {/* 1. TOPO / PERFIL - CABEÇALHO PADRÃO DO LOJISTA */}
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

      <div className="px-6 space-y-12">
        
        {/* 2. SEÇÃO: AÇÕES DE MARKETING (CARDS) */}
        <section>
          <SectionHeader title="AÇÕES DE MARKETING" icon={Sparkles} />
          <div className="grid grid-cols-1 gap-4">
            <MarketingActionCard 
              icon={Crown} 
              label="Anunciar nos Banners" 
              description="Apareça em destaque para mais de 450 mil pessoas de Jacarepaguá"
              onClick={() => onNavigate('store_ads_module')}
              iconBgClass="bg-blue-100 dark:bg-blue-900/30"
              iconColorClass="text-blue-600 dark:text-blue-400"
            />
            <MarketingActionCard 
              icon={Megaphone} 
              label="Destaque Patrocinado" 
              description="Apareça como patrocinado na frente de todas as listas do app"
              onClick={() => onNavigate('store_ads_quick')}
              iconBgClass="bg-purple-100 dark:bg-purple-900/30"
              iconColorClass="text-purple-600 dark:text-purple-400"
            />
            <MarketingActionCard 
              icon={Star} 
              label="Avaliações" 
              description="Responda seus clientes e gerencie sua reputação"
              onClick={() => onNavigate('merchant_reviews')}
              badge={2}
              iconBgClass="bg-amber-100 dark:bg-amber-900/30"
              iconColorClass="text-amber-600 dark:text-amber-400"
            />
            <MarketingActionCard 
              icon={Users} 
              label="JPA Connect" 
              description="Networking exclusivo entre empresários de Jacarepaguá"
              onClick={() => onNavigate('jpa_connect_sales')}
              iconBgClass="bg-indigo-100 dark:bg-indigo-900/30"
              iconColorClass="text-indigo-600 dark:text-indigo-400"
            />
             <MarketingActionCard 
              icon={Award} 
              label="Seja Patrocinador Master" 
              description="Destaque máximo em nosso app"
              onClick={() => onNavigate('patrocinador_master')}
              iconBgClass="bg-amber-100 dark:bg-amber-900/30"
              iconColorClass="text-amber-500 dark:text-amber-400"
            />
          </div>
        </section>

        {/* 3. SEÇÃO: SERVIÇOS (Operacional e Financeiro) */}
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
              icon={FileText} 
              label="Pedidos de Banner" 
              description="Status de criação e aprovação"
              onClick={() => alert('Módulo de pedidos em desenvolvimento')} 
            />
             <ServiceBlock 
              icon={BarChart3} 
              label="Meus Anúncios" 
              description="Performance e estatísticas"
              onClick={() => onNavigate('merchant_performance')}
            />
            <ServiceBlock 
              icon={CreditCard} 
              label="Pagamentos" 
              description="Extratos, notas e assinaturas"
              onClick={() => onNavigate('store_finance')} 
            />
          </div>
        </section>

        {/* 4. SEÇÃO: GERAL (Logout, etc) */}
        <section>
          <SectionHeader title="Geral" />
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
             <ServiceBlock 
              icon={LifeBuoy} 
              label="Suporte" 
              description="Ajuda com o app e conta"
              onClick={() => onNavigate('store_support')} 
            />
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 transition-colors">
                  <LogOut size={22} />
                </div>
                <p className="text-sm font-bold text-red-500">Sair da conta</p>
              </div>
              <ChevronRight size={16} className="text-red-300" />
            </button>
          </div>
        </section>

      </div>

      {/* Footer / Info */}
      <div className="mt-12 text-center opacity-30 px-10">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
          Localizei JPA Parceiros <br/> v1.5.0
        </p>
      </div>
    </div>
  );
};

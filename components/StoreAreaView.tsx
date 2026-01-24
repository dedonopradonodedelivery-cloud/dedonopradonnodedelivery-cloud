
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
  Award,
  Tag,
  Wallet,
  Briefcase, // Adicionado para Vagas de Emprego
  Sun, // Adicionado para Modo Noite
  Moon, // Adicionado para Modo Noite
  Rocket, // FIX: Added missing Rocket icon
  Palette, // FIX: Added missing Palette icon
  Newspaper, // Ícone para Posts do Bairro
  BarChart2 // Ícone para Desempenho
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext'; // Importar useTheme

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate: (view: string, initialView?: 'sales' | 'chat') => void;
  user: SupabaseUser | null;
}

// Componente Visual Único e Padronizado para todos os itens do menu
const ServiceBlock: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  description?: string;
  onClick: () => void;
  isDestructive?: boolean;
  colorClass?: string;
  badge?: number;
  rightElement?: React.ReactNode;
}> = ({ icon: Icon, label, description, onClick, isDestructive, colorClass, badge, rightElement }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-800 border-b border-gray-50 dark:border-gray-700 last:border-b-0 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors group"
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

const SectionHeader: React.FC<{ title: string; icon?: React.ElementType; description?: string }> = ({ title, icon: Icon, description }) => (
  <div className="flex flex-col gap-1 mb-3 px-1">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={14} className="text-[#1E5BFF]" />}
      <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
        {title}
      </h2>
    </div>
    {description && <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none ml-6">{description}</p>}
  </div>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user }) => {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Usar o contexto de tema

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

      <div className="px-6 space-y-10">
        
        {/* NOVO BLOCO: Desempenho da Minha Loja */}
        <section>
          <SectionHeader 
            title="Desempenho da Minha Loja" 
            icon={BarChart2} 
            description="Veja como sua loja está se saindo no app." 
          />
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ServiceBlock 
              icon={BarChart2} 
              label="Ver Dashboard Completo" 
              description="Visualizações, cliques, engajamento e mais."
              onClick={() => onNavigate('merchant_performance_dashboard')}
              colorClass="bg-indigo-50 text-indigo-600"
            />
          </div>
        </section>

        {/* NOVO BLOCO: ORGÂNICOS / GRATUITOS */}
        <section>
          <SectionHeader 
            title="Orgânicos / Gratuitos" 
            icon={Sparkles} 
            description="Ferramentas gratuitas para ajudar sua loja a crescer no bairro." 
          />
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ServiceBlock 
              icon={Tag} 
              label="Cupons da Semana" 
              description="Atraia clientes com descontos semanais."
              onClick={() => onNavigate('weekly_promo')}
              colorClass="bg-blue-50 text-blue-600"
            />
            <ServiceBlock 
              icon={Briefcase} 
              label="Vagas de Emprego" 
              description="Encontre talentos locais e divulgue oportunidades."
              onClick={() => onNavigate('merchant_jobs')}
              colorClass="bg-emerald-50 text-emerald-600"
            />
            <ServiceBlock // NOVO ITEM: Posts do Bairro
              icon={Newspaper} 
              label="Posts do Bairro" 
              description="Compartilhe novidades e comunicados."
              onClick={() => onNavigate('create_bairro_post')}
              colorClass="bg-purple-50 text-purple-600"
            />
          </div>
        </section>

        {/* REORGANIZADO: IMPULSIONE SUA LOJA (Ações de Marketing Pagas) */}
        <section>
          <SectionHeader 
            title="Impulsione sua Loja" 
            icon={Rocket} 
            description="Campanhas pagas para alcançar mais clientes e aumentar suas vendas." 
          />
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ServiceBlock 
              icon={Megaphone} 
              label="Destaque Patrocinado" 
              description="Sua loja em evidência no topo das listas."
              onClick={() => onNavigate('store_ads_quick')}
              colorClass="bg-amber-50 text-amber-600"
            />
            <ServiceBlock 
              icon={Palette} 
              label="Banners Personalizados" 
              description="Crie ou gerencie banners exclusivos para seu negócio."
              onClick={() => onNavigate('store_ads_module')}
              colorClass="bg-purple-50 text-purple-600"
            />
            <ServiceBlock 
              icon={Crown} 
              label="Seja um Patrocinador Master" 
              description="O maior destaque do app com presença total."
              onClick={() => onNavigate('patrocinador_master')}
              colorClass="bg-yellow-50 text-yellow-600"
            />
          </div>
        </section>

        {/* 3. SEÇÃO: SERVIÇOS (Operacional e Financeiro) */}
        <section>
          <SectionHeader title="Serviços" />
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
             {/* MOVIDO AQUI: Cashback do Bairro */}
            <ServiceBlock 
              icon={Wallet}
              label="Cashback do Bairro"
              description="Fidelize clientes devolvendo parte do valor da compra."
              onClick={() => onNavigate('store_cashback_module')}
              colorClass="bg-green-50 text-green-600"
            />
            <ServiceBlock 
              icon={BarChart3} 
              label="Terminal de Caixa" 
              description="Gerar QR, PIN e validar transações de cashback."
              onClick={() => onNavigate('merchant_panel')} 
              colorClass="bg-blue-50 text-blue-600"
            />
            <ServiceBlock 
              icon={Star} 
              label="Avaliações" 
              description="Responda seus clientes e gerencie sua reputação"
              onClick={() => onNavigate('merchant_reviews')}
              badge={2} 
              colorClass="bg-amber-50 text-amber-600"
            />
            <ServiceBlock 
              icon={MessageSquare} 
              label="Chat com Designer" 
              description="Criação e acompanhamento do seu material"
              onClick={() => onNavigate('store_ads_module', 'chat')} 
            />
            <ServiceBlock 
              icon={FileText} 
              label="Pedidos de Banner" 
              description="Status de criação e aprovação"
              onClick={() => alert('Módulo de pedidos em desenvolvimento')} 
            />
            <ServiceBlock 
              icon={CreditCard} 
              label="Pagamentos" 
              description="Extratos, notas e assinaturas"
              onClick={() => onNavigate('store_finance')} 
            />
            {/* MOVIDO AQUI: Suporte ao Lojista */}
            <ServiceBlock 
              icon={LifeBuoy} 
              label="Suporte ao Lojista" 
              description="Ajuda com o app e conta"
              onClick={() => onNavigate('store_support')} 
              colorClass="bg-indigo-50 text-indigo-600"
            />
          </div>
        </section>

        {/* 4. SEÇÃO: PREFERÊNCIAS */}
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

        {/* 5. SEÇÃO: GERAL (Restante) */}
        <section>
          <SectionHeader title="Geral" />
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <ServiceBlock 
              icon={Heart} 
              label="Favoritos" 
              description="Locais que você marcou como favorito"
              onClick={() => onNavigate('favorites')} 
            />
            <ServiceBlock 
              icon={Compass} 
              label="Quem Somos" 
              description="Conheça mais sobre o Localizei JPA"
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
      <div className="mt-12 text-center opacity-30 px-10">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
          Localizei JPA Parceiros <br/> v1.5.0
        </p>
      </div>
    </div>
  );
};

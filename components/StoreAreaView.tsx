
import React from 'react';
import { 
  ChevronRight, 
  Megaphone, 
  LayoutGrid, 
  BarChart3, 
  MessageSquare, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  User,
  Sparkles,
  LifeBuoy,
  Crown,
  Star,
  Moon,
  Sun,
  ImageIcon,
  TrendingUp,
  Ticket,
  Video,
  Settings,
  ShoppingBag,
  Clock,
  Briefcase,
  Users,
  Tag,
  Zap,
  Store as StoreIcon,
  PieChart,
  Building,
  Handshake,
  FileText
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { InstitutionalSponsorBanner } from '@/components/InstitutionalSponsorBanner';
import { MandatoryVideoLock } from './MandatoryVideoLock';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  user: SupabaseUser | null;
}

const NavCard: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  description?: string;
  onClick: () => void;
  isDestructive?: boolean;
  colorClass?: string;
  badge?: number;
  rightElement?: React.ReactNode;
  topRightTag?: React.ReactNode;
}> = ({ icon: Icon, label, description, onClick, isDestructive, colorClass, badge, rightElement, topRightTag }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900/60 border-b border-blue-100/50 dark:border-white/5 last:border-b-0 active:bg-blue-50 dark:active:bg-slate-800 transition-colors group rounded-2xl mb-2 shadow-sm relative"
  >
    {topRightTag}
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl transition-colors relative ${
        isDestructive 
          ? 'bg-red-100 text-red-600 dark:bg-red-900/30' 
          : colorClass || 'bg-blue-50/50 dark:bg-slate-800 text-gray-400 group-hover:text-[#1E5BFF] shadow-sm'
      }`}>
        <Icon size={20} />
        {badge ? (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center animate-bounce">
            <span className="text-[10px] font-black text-white">{badge}</span>
          </div>
        ) : null}
      </div>
      <div className="text-left">
        <p className={`text-sm font-bold ${isDestructive ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
          {label}
        </p>
        {description && (
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight mt-0.5 max-w-[180px]">
            {description}
          </p>
        )}
      </div>
    </div>
    {rightElement || <ChevronRight size={16} className={isDestructive ? 'text-red-300' : 'text-gray-300 group-hover:text-[#1E5BFF] transition-colors'} />}
  </button>
);

const SectionHeader: React.FC<{ title: string; icon?: React.ElementType }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4 mt-8 px-2 first:mt-0">
    {Icon && <Icon size={14} className="text-[#1E5BFF]" />}
    <h2 className="text-[11px] font-black text-blue-400/80 dark:text-gray-500 uppercase tracking-[0.2em]">
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
    <MandatoryVideoLock 
      videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
      storageKey="merchant_panel"
    >
      <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans animate-in fade-in duration-500 pb-40">
        
        {/* HEADER DE PERFIL */}
        <div className="bg-white dark:bg-gray-950 px-6 pt-12 pb-8 border-b border-blue-100 dark:border-gray-800 shadow-sm mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-[2rem] border-4 border-[#F4F7FF] dark:border-slate-800 shadow-xl overflow-hidden shrink-0">
              <img src={avatarUrl} alt={storeName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white truncate leading-tight uppercase tracking-tighter">
                {storeName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border border-blue-100">Painel do Parceiro</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5">
          
          {/* 1. MINHA LOJA - CENTRALIZADO */}
          <section>
            <SectionHeader title="Minha Loja" icon={Building} />
            <NavCard 
              icon={StoreIcon} 
              label="Perfil Público da Loja" 
              description="Informações visíveis, busca e dados para emissão de nota"
              onClick={() => onNavigate('store_profile')} 
            />
          </section>

          {/* 2. PROMOÇÕES E VENDAS - MOVIDO PARA CIMA */}
          <section>
            <SectionHeader title="Promoções e Vendas" icon={Tag} />
            <NavCard 
              icon={Ticket} 
              label="Cupons de Desconto" 
              description="Crie e gerencie seus cupons"
              onClick={() => onNavigate('merchant_coupons')}
              colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
            />
            <NavCard 
              icon={Zap} 
              label="Promoções Ativas" 
              description="Vitrine de ofertas especiais"
              onClick={() => onNavigate('merchant_promotions')} 
            />
          </section>

          {/* 3. CRESCIMENTO E ANÚNCIOS */}
          <section>
            <SectionHeader title="Crescimento e Anúncios" icon={Sparkles} />
            <NavCard 
              icon={TrendingUp} 
              label="Patrocinados" 
              description="Suba para o topo por R$ 0,90/dia"
              onClick={() => onNavigate('store_sponsored')}
              colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
            />
            <NavCard 
              icon={LayoutGrid} 
              label="Banners em Destaque" 
              description="Sua loja nas áreas nobres do bairro"
              onClick={() => onNavigate('store_ads_module')}
              colorClass="bg-purple-50 text-purple-600 dark:bg-purple-900/20"
              topRightTag={
                <div 
                  className="absolute -top-4 -right-1 z-20 bg-yellow-400 text-slate-900 py-1.5 px-3 shadow-xl border border-yellow-500 animate-subtle-pulse flex flex-col items-center"
                  style={{
                    clipPath: 'polygon(100% 0%, 95% 5%, 100% 10%, 95% 15%, 100% 20%, 95% 25%, 100% 30%, 95% 35%, 100% 40%, 95% 45%, 100% 50%, 95% 55%, 100% 60%, 95% 65%, 100% 70%, 95% 75%, 100% 80%, 95% 85%, 100% 90%, 95% 95%, 100% 100%, 0% 100%, 5% 95%, 0% 90%, 5% 85%, 0% 80%, 5% 75%, 0% 70%, 5% 65%, 0% 60%, 5% 55%, 0% 50%, 5% 45%, 0% 40%, 5% 35%, 0% 30%, 5% 25%, 0% 20%, 5% 15%, 0% 10%, 5% 5%, 0% 0%)'
                  }}
                >
                  <p className="text-[8px] font-black leading-none mb-0.5">💎 A PARTIR DE R$ 49,90/MÊS</p>
                  <p className="text-[7px] font-bold opacity-80 leading-none">EXCLUSIVO PARA FUNDADORES</p>
                </div>
              }
            />
            <NavCard 
              icon={Crown} 
              label="Patrocinador Master" 
              description="Visibilidade em 90% do app"
              onClick={() => onNavigate('sponsor_info')}
              colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/20"
            />
            <NavCard 
              icon={Handshake} 
              label="JPA Connect" 
              description="Conectando lojistas do bairro"
              onClick={() => onNavigate('jpa_connect')}
              colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20"
              rightElement={<span className="text-[8px] font-black bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Em breve</span>}
            />
          </section>

          {/* 4. RELACIONAMENTO COM CLIENTES */}
          <section>
            <SectionHeader title="Relacionamento" icon={Users} />
            <NavCard 
              icon={Star} 
              label="Avaliações de Clientes" 
              description="Responda o que dizem sobre você"
              badge={3} 
              onClick={() => onNavigate('merchant_reviews')} 
            />
            <NavCard 
              icon={MessageSquare} 
              label="Mensagens / Chat" 
              description="Fale com interessados em serviços"
              onClick={() => onNavigate('merchant_leads')} 
            />
          </section>

          {/* 5. CONTEÚDO E MARCA */}
          <section>
            <SectionHeader title="Conteúdo e Marca" icon={ImageIcon} />
            <NavCard 
              icon={LayoutGrid} 
              label="Feed da Loja" 
              description="Publique fotos no seu perfil"
              onClick={() => onNavigate('neighborhood_posts')} 
            />
            <NavCard 
              icon={Video} 
              label="Vídeos Explicativos" 
              description="Envie até 2 vídeos da sua loja"
              onClick={() => onNavigate('store_profile')} 
            />
          </section>

          {/* 6. PERFORMANCE E FINANCEIRO */}
          <section>
            <SectionHeader title="Resultados" icon={BarChart3} />
            <NavCard 
              icon={PieChart} 
              label="Minha Performance" 
              description="Cliques, visualizações e alcance"
              onClick={() => onNavigate('merchant_performance')} 
            />
            <NavCard 
              icon={CreditCard} 
              label="Pagamentos e Faturas" 
              description="Extratos e planos ativos"
              onClick={() => onNavigate('store_finance')} 
            />
          </section>

          {/* 7. SUPORTE */}
          <section>
            <SectionHeader title="Suporte" icon={LifeBuoy} />
            <NavCard 
              icon={HelpCircle} 
              label="Central de Ajuda" 
              description="Dúvidas e orientações ao lojista"
              onClick={() => onNavigate('store_support')} 
            />
          </section>

          {/* 8. PREFERÊNCIAS */}
          <section>
            <SectionHeader title="Preferências" icon={Settings} />
            <NavCard 
              icon={theme === 'dark' ? Moon : Sun} 
              label="Modo Noite" 
              description={theme === 'dark' ? "Ativado" : "Desativado"}
              onClick={toggleTheme}
              rightElement={
                <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1E5BFF]' : 'bg-gray-300 dark:bg-gray-700'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              }
            />
            <NavCard 
              icon={LogOut} 
              label="Sair da Conta" 
              isDestructive
              onClick={handleLogout} 
            />
          </section>

          <InstitutionalSponsorBanner type="merchant" className="mt-12" />

          <div className="mt-16 text-center opacity-30 pb-12">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] leading-relaxed">
              Localizei JPA Parceiros <br/> Central de Gestão v2.0
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </MandatoryVideoLock>
  );
};

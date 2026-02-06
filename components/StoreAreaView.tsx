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
import { MandatoryVideoLock } from './components/MandatoryVideoLock';

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
    className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900/60 border-b border-gray-100 dark:border-white/5 last:border-b-0 active:bg-blue-50 dark:active:bg-slate-800 transition-colors group rounded-2xl mb-2 shadow-sm relative"
  >
    {topRightTag}
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl transition-colors relative ${
        isDestructive 
          ? 'bg-gray-100 text-gray-400' 
          : colorClass || 'bg-blue-50 text-blue-600'
      }`}>
        <Icon size={20} />
        {badge ? (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center animate-bounce">
            <span className="text-[10px] font-black text-white">{badge}</span>
          </div>
        ) : null}
      </div>
      <div className="text-left">
        <p className={`text-sm font-bold ${isDestructive ? 'text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
          {label}
        </p>
        {description && (
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight mt-0.5 max-w-[180px]">
            {description}
          </p>
        )}
      </div>
    </div>
    {rightElement || <ChevronRight size={16} className={isDestructive ? 'text-gray-200' : 'text-gray-300 group-hover:text-blue-600 transition-colors'} />}
  </button>
);

const SectionHeader: React.FC<{ title: string; icon?: React.ElementType }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4 mt-8 px-2 first:mt-0">
    {Icon && <Icon size={14} className="text-blue-600" />}
    <h2 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
      {title}
    </h2>
  </div>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user }) => {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    if (confirm('Deseja realmente sair da sua conta?')) {
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
      <div className="min-h-screen bg-white dark:bg-gray-950 font-sans animate-in fade-in duration-500 pb-40">
        <div className="bg-white dark:bg-gray-950 px-6 pt-12 pb-8 border-b border-gray-100 dark:border-gray-800 shadow-sm mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-[2rem] border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden shrink-0">
              <img src={avatarUrl} alt={storeName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white truncate leading-tight uppercase tracking-tighter">
                {storeName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border border-blue-100">Parceiro Oficial</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5">
          <section>
            <SectionHeader title="Minha Loja" />
            <NavCard icon={StoreIcon} label="Perfil Público" description="Como os moradores veem sua loja" onClick={() => onNavigate('store_profile')} />
          </section>

          <section>
            <SectionHeader title="Vendas e Ads" />
            <NavCard icon={Ticket} label="Cupons" description="Gerenciar cupons ativos" onClick={() => onNavigate('merchant_coupons')} />
            <NavCard 
              icon={LayoutGrid} 
              label="Banners" 
              description="Sua loja nas áreas nobres" 
              onClick={() => onNavigate('store_ads_module')} 
              topRightTag={
                <div className="absolute -top-4 -right-1 z-20 bg-yellow-400 text-slate-900 py-1.5 px-3 shadow-xl border border-yellow-500 flex flex-col items-center" style={{clipPath: 'polygon(100% 0%, 95% 5%, 100% 10%, 95% 15%, 100% 20%, 95% 25%, 100% 30%, 95% 35%, 100% 40%, 95% 45%, 100% 50%, 95% 55%, 100% 60%, 95% 65%, 100% 70%, 95% 75%, 100% 80%, 95% 85%, 100% 90%, 95% 95%, 100% 100%, 0% 100%, 5% 95%, 0% 90%, 5% 85%, 0% 80%, 5% 75%, 0% 70%, 5% 65%, 0% 60%, 5% 55%, 0% 50%, 5% 45%, 0% 40%, 5% 35%, 0% 30%, 5% 25%, 0% 20%, 5% 15%, 0% 10%, 5% 5%, 0% 0%)'}}>
                  <p className="text-[8px] font-black uppercase">Exclusivo</p>
                </div>
              }
            />
          </section>

          <section>
            <SectionHeader title="Preferências" />
            <NavCard 
              icon={theme === 'dark' ? Moon : Sun} 
              label="Modo Noite" 
              onClick={toggleTheme} 
              rightElement={
                <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full transform transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              }
            />
            <NavCard icon={LogOut} label="Sair da Conta" isDestructive onClick={handleLogout} />
          </section>
        </div>
      </div>
    </MandatoryVideoLock>
  );
};

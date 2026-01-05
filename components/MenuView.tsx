
import React, { useState } from 'react';
import { 
  User as UserIcon, 
  ChevronRight, 
  Heart, 
  Coins, 
  Share2, 
  Headphones, 
  Info, 
  LogOut, 
  Store, 
  Users,
  Loader2,
  LayoutDashboard,
  MessageCircle,
  X,
  Sun,
  Moon,
  Monitor,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { User } from '@supabase/supabase-js';
import { ThemeMode } from '../types';

interface MenuViewProps {
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
  onAuthClick: () => void;
  onNavigate: (view: string) => void;
  onBack?: () => void;
  currentTheme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
}

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  colorClass: string;
  subLabel?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, onClick, colorClass, subLabel }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group active:scale-[0.98] transition-transform mb-3"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div className="text-left">
        <span className="block font-semibold text-gray-800 dark:text-gray-100 text-sm">{label}</span>
        {subLabel && <span className="block text-xs text-gray-400 mt-0.5">{subLabel}</span>}
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
  </button>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 ml-1 mt-6">
    {title}
  </h3>
);

export const MenuView: React.FC<MenuViewProps> = ({ 
  user, 
  userRole, 
  onAuthClick, 
  onNavigate, 
  onBack, 
  currentTheme, 
  onThemeChange 
}) => {
  const { signOut } = useAuth();
  const isMerchant = userRole === 'lojista';
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // MOCK ADMIN CHECK - In real app, check role/claim
  const isAdmin = user?.email?.includes('admin'); 

  const profileTitle = user?.user_metadata?.full_name 
    ? user.user_metadata.full_name 
    : user?.email 
        ? user.email 
        : userRole === 'lojista' 
            ? 'Parceiro Localizei' 
            : 'Usuário Localizei';

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.warn("Erro ao realizar logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="bg-white dark:bg-gray-900 px-4 pt-10 pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Perfil</h2>
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-28 text-center">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-700 transform -rotate-6">
             <UserIcon className="w-10 h-10 text-[#1E5BFF]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Entre na sua conta
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 max-w-[280px] leading-relaxed font-medium">
            Faça login para acessar seus favoritos, cashback e acompanhar sua experiência no Localizei JPA.
          </p>
          <div className="w-full space-y-4">
            <button 
                onClick={onAuthClick}
                className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                Entrar ou criar conta
                <ChevronRight className="w-5 h-5 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-4 pt-10 pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display mb-0.5">Menu</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configurações e Atalhos</p>
        </div>
        {onBack && (
            <button onClick={onBack} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        )}
      </div>

      <div className="px-4 pb-5">
        <div 
          onClick={() => onNavigate('edit_profile')}
          className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform mb-6"
        >
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm">
            {user?.user_metadata?.avatar_url ? (
               <img src={user.user_metadata.avatar_url} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
               <UserIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">
                {profileTitle}
            </h3>
            <p className="text-xs text-primary-500 font-bold mt-0.5 flex items-center gap-1">
                Ver meu perfil completo
                <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {isMerchant && (
            <button 
                onClick={() => onNavigate('store_area')}
                className="w-full bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e3a8a] text-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-900/30 flex flex-col gap-6 relative overflow-hidden group active:scale-[0.98] transition-all mb-8 border border-white/10"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-400/20 transition-all duration-700"></div>
                
                <div className="relative z-10 flex items-start justify-between">
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                        <Store className="w-8 h-8 text-indigo-300" />
                    </div>
                    <div className="bg-[#1E5BFF] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg border border-white/10">
                        Painel Parceiro
                    </div>
                </div>

                <div className="relative z-10 text-left">
                    <h3 className="text-2xl font-bold mb-1 font-display">Minha Loja</h3>
                    <p className="text-indigo-200 text-sm font-medium">Gerencie vendas, cashback e anúncios.</p>
                </div>
            </button>
        )}

        {isAdmin && (
            <div className="mb-6">
                <SectionTitle title="Administração" />
                <MenuItem 
                    icon={ShieldAlert} 
                    label="Moderação" 
                    onClick={() => onNavigate('admin_moderation')} 
                    colorClass="bg-red-500 text-white dark:bg-red-600"
                    subLabel="Gerenciar denúncias"
                />
            </div>
        )}

        <SectionTitle title="Minha Conta" />
        <div className="space-y-3 mt-2">
            <MenuItem 
                icon={Heart} 
                label="Favoritos" 
                onClick={() => onNavigate('favorites')} 
                colorClass="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
            />
             <MenuItem 
                icon={Coins} 
                label="Meus Prêmios" 
                onClick={() => onNavigate('prize_history')} 
                colorClass="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
            />
             <MenuItem 
                icon={Share2} 
                label="Indique e Ganhe" 
                onClick={() => onNavigate('invite_friend')} 
                colorClass="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                subLabel="Em breve"
            />
        </div>

        <SectionTitle title="Suporte & Sobre" />
        <div className="space-y-3 mt-2">
            <MenuItem 
                icon={Headphones} 
                label="Suporte" 
                onClick={() => onNavigate('support')} 
                colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            />
            <MenuItem 
                icon={Info} 
                label="Sobre o App" 
                onClick={() => onNavigate('about')} 
                colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
            />
        </div>

        <SectionTitle title="Configurações" />
        <div className="space-y-3 mt-2">
            <button 
                onClick={() => onThemeChange && onThemeChange(currentTheme === 'dark' ? 'light' : 'dark')}
                className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group active:scale-[0.98] transition-transform"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {currentTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div className="text-left">
                        <span className="block font-semibold text-gray-800 dark:text-gray-100 text-sm">Tema</span>
                        <span className="block text-xs text-gray-400 mt-0.5">
                            {currentTheme === 'dark' ? 'Escuro' : 'Claro'}
                        </span>
                    </div>
                </div>
            </button>

             <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center gap-4 active:scale-[0.98] transition-transform"
             >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                    {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                </div>
                <span className="font-bold text-red-600 dark:text-red-400 text-sm">Sair da conta</span>
            </button>
        </div>

        {/* Master Sponsor in Menu */}
        <div className="mt-8">
            <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} />
        </div>

        <div className="mt-8 text-center pb-8">
            <p className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.3em]">
                Localizei JPA v1.0.4
            </p>
        </div>

      </div>
    </div>
  );
};

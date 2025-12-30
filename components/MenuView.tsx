
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
  BadgeCheck,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { User } from '@supabase/supabase-js';

interface MenuViewProps {
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
  onAuthClick: () => void;
  onNavigate: (view: string) => void;
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

export const MenuView: React.FC<MenuViewProps> = ({ user, userRole, onAuthClick, onNavigate }) => {
  const { signOut } = useAuth();
  const isMerchant = userRole === 'lojista';
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
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
        <div className="bg-white dark:bg-gray-900 px-5 pt-10 pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Perfil</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-28 text-center">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-700 transform -rotate-6">
             <UserIcon className="w-10 h-10 text-[#1E5BFF]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Entre na sua conta
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 max-w-[260px] leading-relaxed font-medium">
            Faça login para acessar seus favoritos, cashback e acompanhar sua experiência no Localizei Freguesia.
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
      <div className="bg-white dark:bg-gray-900 px-5 pt-10 pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display mb-0.5">Menu</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Configurações e Atalhos</p>
      </div>

      <div className="px-5 pb-5">
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

        {/* UX: Para Lojistas, o painel de gestão é o primeiro item de destaque no Menu */}
        {isMerchant && (
            <button 
                onClick={() => onNavigate('store_area')}
                className="w-full bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e3a8a] text-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-900/30 flex flex-col gap-6 relative overflow-hidden group active:scale-[0.98] transition-all mb-8 border border-white/10"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                
                <div className="flex justify-between items-start relative z-10">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.25em]">Área do Lojista</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                        </div>
                        <h3 className="font-black text-2xl tracking-tighter font-display">Minha Loja</h3>
                        <p className="text-xs text-indigo-200 font-medium">Gerencie vendas, anúncios e cashback</p>
                    </div>
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl">
                        <Store className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="mt-2 p-5 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <LayoutDashboard className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-white text-sm">Acessar Painel</p>
                            <span className="text-[10px] font-black text-blue-100 uppercase tracking-wider">Ver desempenho hoje</span>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white text-indigo-900 flex items-center justify-center shadow-lg transform group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-6 h-6" strokeWidth={3} />
                    </div>
                </div>
            </button>
        )}

        <SectionTitle title="Minha Conta" />
        <MenuItem 
            icon={Heart} 
            label="Favoritos" 
            onClick={() => onNavigate('favorites')} 
            colorClass="bg-red-500" 
            subLabel="Lojas que você salvou"
        />
        <MenuItem 
            icon={Coins} 
            label="Cashback" 
            onClick={() => onNavigate('user_statement')} 
            colorClass="bg-[#1E5BFF]" 
            subLabel="Acompanhe seu saldo e ganhos"
        />

        <SectionTitle title="Comunidade & Suporte" />
        {isMerchant && (
             <MenuItem 
                icon={Users} 
                label="Freguesia Connect" 
                onClick={() => onNavigate('freguesia_connect_dashboard')} 
                colorClass="bg-indigo-500" 
                subLabel="Rede de negócios da Freguesia"
            />
        )}
        <MenuItem 
            icon={Share2} 
            label="Indique um amigo" 
            onClick={() => onNavigate('invite_friend')} 
            colorClass="bg-green-500"
            subLabel="Convide amigos para usar o Localizei"
        />
        <MenuItem 
            icon={Headphones} 
            label="Suporte" 
            onClick={() => onNavigate('support')} 
            colorClass="bg-blue-500" 
            subLabel="Fale com a nossa equipe"
        />

        <SectionTitle title="Institucional" />
        <MenuItem 
            icon={Info} 
            label="Sobre a Localizei" 
            onClick={() => onNavigate('about')} 
            colorClass="bg-gray-500" 
        />

        <SectionTitle title="Parceiros & Publicidade" />
        <MasterSponsorBanner 
            onClick={() => onNavigate('patrocinador_master')}
            className="mb-4"
        />

        <div className="mt-8">
            <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-100 dark:border-red-900/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <LogOut className="w-4 h-4" />
                )}
                {isLoggingOut ? 'Saindo...' : 'Sair do aplicativo'}
            </button>
        </div>

        <div className="text-center pt-8 pb-4">
            <p className="text-[10px] text-gray-400">Localizei Freguesia v1.3.4</p>
        </div>
      </div>
    </div>
  );
};

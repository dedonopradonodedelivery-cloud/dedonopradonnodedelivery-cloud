

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
  Loader2
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
  
  // Decide o título do perfil: Nome > Email > Fallback Genérico
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
      // Chama o signOut do contexto
      // O contexto atualizará o estado 'user' para null
      // A App.tsx reagirá e renderizará a UI apropriada (Guest ou Home)
      await signOut();
    } catch (error) {
      console.warn("Erro ao realizar logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // --- GUEST VIEW (Not Authenticated) ---
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
        
        {/* Header Simples */}
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

  // --- LOGGED IN VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-in fade-in duration-300">
      
      {/* 1) Header - Fixo (Sticky) */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-10 pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display mb-0.5">Menu</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Configurações e Atalhos</p>
      </div>

      <div className="px-5 pb-5">
        
        {/* 2) Card de Perfil do Usuário (Cabeçalho) */}
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

        {/* 3) Merchant Area (Only if Merchant) */}
        {isMerchant && (
            <button 
                onClick={() => onNavigate('store_area')}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 rounded-2xl shadow-md shadow-indigo-500/20 flex items-center justify-between group active:scale-[0.98] transition-transform mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                        <Store className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-white text-lg">Painel do Parceiro</h3>
                        <p className="text-indigo-100 text-xs opacity-90">Gerencie sua loja e campanhas</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
            </button>
        )}

        <SectionTitle title="Atalhos" />
        <MenuItem icon={Heart} label="Minhas Lojas Favoritas" onClick={() => onNavigate('favorites')} colorClass="bg-red-100" />
        <MenuItem icon={Coins} label="Meu Cashback" subLabel="Saldo, extrato e ofertas" onClick={() => onNavigate('user_cashback_flow')} colorClass="bg-green-100" />
        <MenuItem icon={Share2} label="Indique um Amigo" onClick={() => onNavigate('invite_friend')} colorClass="bg-blue-100" />

        <SectionTitle title="Geral" />
        <MenuItem icon={Info} label="Sobre o Localizei" onClick={() => onNavigate('about')} colorClass="bg-gray-100" />
        <MenuItem icon={Headphones} label="Suporte" onClick={() => onNavigate('support')} colorClass="bg-yellow-100" />
        
        <SectionTitle title="Sair" />
        <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl shadow-sm border border-red-100 dark:border-red-800 flex items-center justify-center gap-3 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-[0.98]"
        >
            {isLoggingOut ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saindo...
                </>
            ) : (
                <>
                    <LogOut className="w-5 h-5" />
                    Sair da Conta
                </>
            )}
        </button>
      </div>
    </div>
  );
};


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
import { useAuth } from '@/contexts/AuthContext';
import { MasterSponsorBanner } from '@/components/MasterSponsorBanner';
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

          <h2 className="text-2xl font-bold text-gray-900 dark
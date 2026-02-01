import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  ChevronRight, 
  X, 
  Bell, 
  Check, 
  PlayCircle, 
  MapPin, 
  Heart, 
  HelpCircle, 
  LogOut, 
  Loader2, 
  Info, 
  Briefcase, 
  Store, 
  PlusCircle,
  Tag,
  Bookmark,
  Ticket
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '@supabase/supabase-js';
import { ThemeMode } from '../types';
import { supabase } from '../lib/supabaseClient';
import { MasterSponsorBanner } from './MasterSponsorBanner';

interface MenuViewProps {
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
  onAuthClick: () => void;
  onNavigate: (view: string) => void;
  onBack?: () => void;
  currentTheme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
}

const CATEGORIES_JOBS = ['Alimentação', 'Beleza', 'Serviços', 'Pets', 'Moda', 'Saúde', 'Educação', 'Tecnologia'];

export const MenuView: React.FC<MenuViewProps> = ({ 
  user, 
  userRole, 
  onAuthClick, 
  onNavigate, 
  onBack 
}) => {
  const { signOut } = useAuth();
  const isMerchant = userRole === 'lojista';
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try { await signOut(); onNavigate('home'); } catch (error) { console.warn(error); } finally { setIsLoggingOut(false); }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="bg-white dark:bg-gray-900 px-4 pt-10 pb-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Menu</h2>
          {onBack && (<button onClick={onBack} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"><X className="w-5 h-5" /></button>)}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-gray-100 transform -rotate-6"><UserIcon className="w-10 h-10 text-[#1E5BFF]" /></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Sua comunidade te espera</h2>
          <button onClick={onAuthClick} className="w-full bg-[#1E5BFF] text-white font-bold py-4 rounded-2xl shadow-xl">Entrar ou Criar Conta</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Menu</h2></div>
        {onBack && (<button onClick={onBack} className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400"><X className="w-6 h-6" /></button>)}
      </div>

      <div className="px-4 pb-5">
        {/* User Card */}
        <div onClick={() => onNavigate('store_profile')} className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer active:scale-[0.98] mb-6">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-6 h-6 text-gray-400" />}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{user?.user_metadata?.full_name || user?.email}</h3>
            <p className="text-xs text-[#1E5BFF] font-bold mt-0.5 flex items-center gap-1">Ver perfil <ChevronRight className="w-3 h-3" /></p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-2">Geral</h3>
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                <button onClick={() => onNavigate('user_coupons')} className="w-full p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 active:bg-gray-50"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500"><Ticket className="w-4 h-4" /></div><span className="text-sm font-bold text-gray-700 dark:text-gray-200">Meus Cupons</span></div><ChevronRight className="w-4 h-4 text-gray-300" /></button>
                <button onClick={() => onNavigate('favorites')} className="w-full p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 active:bg-gray-50"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-500"><Heart className="w-4 h-4" /></div><span className="text-sm font-bold text-gray-700 dark:text-gray-200">Favoritos</span></div><ChevronRight className="w-4 h-4 text-gray-300" /></button>
                <button onClick={() => onNavigate('saved_posts')} className="w-full p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 active:bg-gray-50"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-900/20 flex items-center justify-center text-gray-500"><Bookmark className="w-4 h-4" /></div><span className="text-sm font-bold text-gray-700 dark:text-gray-200">Postagens Salvas</span></div><ChevronRight className="w-4 h-4 text-gray-300" /></button>
                <button onClick={() => onNavigate('about')} className="w-full p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 active:bg-gray-50"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E5BFF]"><Info className="w-4 h-4" /></div><span className="text-sm font-bold text-gray-700 dark:text-gray-200">Quem Somos</span></div><ChevronRight className="w-4 h-4 text-gray-300" /></button>
                <button onClick={() => onNavigate('support')} className="w-full p-4 flex items-center justify-between active:bg-gray-50"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600"><HelpCircle className="w-4 h-4" /></div><span className="text-sm font-bold text-gray-700 dark:text-gray-200">Suporte</span></div><ChevronRight className="w-4 h-4 text-gray-300" /></button>
            </div>
        </div>

        {/* BANNER PATROCINADOR MASTER FINAL */}
        <section className="mb-8">
            <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label="Menu do App" />
        </section>

        <button onClick={handleLogout} disabled={isLoggingOut} className="w-full bg-red-50 dark:bg-red-900/10 p-5 rounded-[2rem] border border-red-100 dark:border-red-900/30 flex items-center justify-center gap-3 active:scale-[0.98]">
            {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin text-red-600" /> : <LogOut className="w-5 h-5 text-red-600" />}
            <span className="font-bold text-red-600 text-sm">Sair da conta</span>
        </button>
      </div>
    </div>
  );
};
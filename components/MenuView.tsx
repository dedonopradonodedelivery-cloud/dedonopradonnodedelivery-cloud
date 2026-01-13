
import React, { useState, useEffect } from 'react';
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
  ShieldAlert,
  Bell,
  Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { User } from '@supabase/supabase-js';
import { ThemeMode } from '../types';
import { supabase } from '../lib/supabaseClient';

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
  onBack, 
  currentTheme, 
  onThemeChange 
}) => {
  const { signOut } = useAuth();
  const isMerchant = userRole === 'lojista';
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Preferências de Vagas
  const [jobsAlerts, setJobsAlerts] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isUpdatingAlerts, setIsUpdatingAlerts] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data } = await supabase.from('profiles').select('jobsAlertsEnabled, jobCategories').eq('id', user?.id).single();
      if (data) {
        setJobsAlerts(!!data.jobsAlertsEnabled);
        setSelectedCategories(data.jobCategories || []);
      }
    } catch (e) {
      console.warn("Could not load job preferences", e);
    }
  };

  const updatePreferences = async (enabled: boolean, cats: string[]) => {
    if (!user) return;
    setIsUpdatingAlerts(true);
    await supabase.from('profiles').update({
      jobsAlertsEnabled: enabled,
      jobCategories: cats
    }).eq('id', user?.id);
    setIsUpdatingAlerts(false);
  };

  const toggleCategory = (cat: string) => {
    const newCats = selectedCategories.includes(cat) 
      ? selectedCategories.filter(c => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(newCats);
    updatePreferences(jobsAlerts, newCats);
  };

  const handleToggleAlerts = () => {
    const newState = !jobsAlerts;
    setJobsAlerts(newState);
    updatePreferences(newState, selectedCategories);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try { await signOut(); } catch (error) { console.warn(error); } finally { setIsLoggingOut(false); }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="bg-white dark:bg-gray-900 px-4 pt-10 pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Perfil</h2>
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"><X className="w-5 h-5" /></button>
          )}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-28 text-center">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-700 transform -rotate-6"><UserIcon className="w-10 h-10 text-[#1E5BFF]" /></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Entre na sua conta</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 max-w-[280px]">Faça login para acessar favoritos, cashback e alertas de vagas.</p>
          <button onClick={onAuthClick} className="w-full bg-[#1E5BFF] text-white font-bold py-4 rounded-2xl shadow-xl">Entrar ou criar conta</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 px-4 pt-10 pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display mb-0.5">Menu</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configurações e Atalhos</p>
        </div>
        {onBack && (
            <button onClick={onBack} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-white"><X className="w-6 h-6" /></button>
        )}
      </div>

      <div className="px-4 pb-5">
        <div onClick={() => onNavigate('edit_profile')} className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer active:scale-[0.98] mb-6">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm">
            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-6 h-6 text-gray-400" />}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{user?.user_metadata?.full_name || user?.email}</h3>
            <p className="text-xs text-primary-500 font-bold mt-0.5 flex items-center gap-1">Ver perfil completo <ChevronRight className="w-3 h-3" /></p>
          </div>
        </div>

        {/* BLOCO NOTIFICAÇÕES DE VAGAS */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Alertas de Vagas</h3>
            </div>
            <button 
              onClick={handleToggleAlerts}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${jobsAlerts ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${jobsAlerts ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {jobsAlerts && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categorias de interesse</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES_JOBS.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      selectedCategories.includes(cat) 
                      ? 'bg-orange-500 text-white border-orange-500' 
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-500 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {selectedCategories.includes(cat) && <Check className="w-3 h-3" />}
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-gray-400 italic">Push enviado apenas para vagas urgentes.</p>
            </div>
          )}
        </div>

        {isMerchant && (
            <button onClick={() => onNavigate('store_area')} className="w-full bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e3a8a] text-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col gap-6 relative overflow-hidden group mb-8 border border-white/10">
                <div className="relative z-10 flex items-start justify-between">
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md"><Store className="w-8 h-8 text-indigo-300" /></div>
                    <div className="bg-[#1E5BFF] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">Painel Parceiro</div>
                </div>
                <div className="relative z-10 text-left">
                    <h3 className="text-2xl font-bold mb-1 font-display">Minha Loja</h3>
                    <p className="text-indigo-200 text-sm font-medium">Gerencie vendas, cashback e anúncios.</p>
                </div>
            </button>
        )}

        <button onClick={handleLogout} disabled={isLoggingOut} className="w-full bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center gap-4 active:scale-[0.98]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600">{isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}</div>
            <span className="font-bold text-red-600 text-sm">Sair da conta</span>
        </button>
      </div>
    </div>
  );
};

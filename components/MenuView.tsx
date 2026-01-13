
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
  Wallet,
  HelpCircle,
  LogOut,
  Loader2,
  Info,
  BadgeCheck,
  Zap,
  Crown,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '@supabase/supabase-js';
import { ThemeMode } from '../types';
import { supabase } from '../lib/supabaseClient';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { useConfig } from '../contexts/ConfigContext';

interface MenuViewProps {
  user: User | null;
  userRole: 'cliente' | 'lojista' | 'admin' | null;
  onAuthClick: () => void;
  onNavigate: (view: string) => void;
  onBack?: () => void;
  currentTheme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
}

const CATEGORIES_JOBS = ['Alimentação', 'Beleza', 'Serviços', 'Pets', 'Moda', 'Saúde', 'Educação', 'Tecnologia'];
const JOBS_EXPLAINER_VIDEO = "https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4";
const CASHBACK_EXPLAINER_VIDEO = "https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4"; 

export const MenuView: React.FC<MenuViewProps> = ({ 
  user, 
  userRole, 
  onAuthClick, 
  onNavigate, 
  onBack, 
  currentTheme, 
  onThemeChange 
}) => {
  const { signOut, isAdmin } = useAuth();
  const { features } = useConfig();
  const isMerchant = userRole === 'lojista';
  const isAdministrator = isAdmin();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const [jobsAlerts, setJobsAlerts] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hasSeenJobsVideo, setHasSeenJobsVideo] = useState(false);
  const [hasSeenCashbackVideo, setHasSeenCashbackVideo] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState<{show: boolean, type: 'jobs' | 'cashback'}>({show: false, type: 'jobs'});

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data } = await supabase.from('profiles').select('jobsAlertsEnabled, jobCategories, hasSeenJobsVideo, hasSeenCashbackVideo').eq('id', user?.id).single();
      if (data) {
        setJobsAlerts(!!data.jobsAlertsEnabled);
        setSelectedCategories(data.jobCategories || []);
        setHasSeenJobsVideo(!!data.hasSeenJobsVideo);
        setHasSeenCashbackVideo(!!data.hasSeenCashbackVideo);
      }
    } catch (e) {
      console.warn("Could not load preferences", e);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;
    await supabase.from('profiles').update(updates).eq('id', user?.id);
  };

  const toggleCategory = (cat: string) => {
    const newCats = selectedCategories.includes(cat) 
      ? selectedCategories.filter(c => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(newCats);
    updateProfile({ jobCategories: newCats });
  };

  const handleToggleAlerts = () => {
    if (!features.jobsEnabled) return;
    const newState = !jobsAlerts;
    setJobsAlerts(newState);
    const updates: any = { jobsAlertsEnabled: newState };
    if (newState && !hasSeenJobsVideo) {
      setShowVideoModal({ show: true, type: 'jobs' });
      setHasSeenJobsVideo(true);
      updates.hasSeenJobsVideo = true;
    }
    updateProfile(updates);
  };

  const handleOpenWallet = () => {
    if (!features.cashbackEnabled) return;
    if (!hasSeenCashbackVideo) {
      setShowVideoModal({ show: true, type: 'cashback' });
      setHasSeenCashbackVideo(true);
      updateProfile({ hasSeenCashbackVideo: true });
    } else {
      onNavigate('user_statement');
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try { await signOut(); onNavigate('home'); } catch (error) { console.warn(error); } finally { setIsLoggingOut(false); }
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
      
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display mb-0.5">Menu</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Configurações e Atalhos</p>
        </div>
        {onBack && (
            <button onClick={onBack} className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
        )}
      </div>

      <div className="px-4 pb-5">
        
        <div onClick={() => onNavigate('edit_profile')} className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer active:scale-[0.98] mb-6">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm">
            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-6 h-6 text-gray-400" />}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{user?.user_metadata?.full_name || user?.email}</h3>
            <p className="text-xs text-[#1E5BFF] font-bold mt-0.5 flex items-center gap-1">Ver perfil completo <ChevronRight className="w-3 h-3" /></p>
          </div>
        </div>

        {/* --- ADMIN SECTION --- */}
        {isAdministrator && (
          <div className="mb-6 space-y-3">
             <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Administração</h3>
             <button 
                onClick={() => onNavigate('admin_config')}
                className="w-full bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 group active:scale-[0.98] transition-transform"
             >
                <div className="w-12 h-12 bg-[#1E5BFF]/10 rounded-2xl flex items-center justify-center text-[#1E5BFF]">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Configuração Remota</h3>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Feature Flags</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1E5BFF] transition-colors" />
             </button>
             <button 
                onClick={() => onNavigate('admin_moderation')}
                className="w-full bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 group active:scale-[0.98] transition-transform"
             >
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500">
                    <Bell className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Moderação</h3>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Posts e Denúncias</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-500 transition-colors" />
             </button>
          </div>
        )}

        {/* --- MERCHANT SECTION --- */}
        {isMerchant && (
            <div className="mb-6 space-y-3">
               <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Painel do Lojista</h3>
               <button 
                  onClick={() => onNavigate('store_area')}
                  className="w-full bg-slate-900 p-5 rounded-3xl shadow-xl border border-white/5 flex items-center gap-4 group active:scale-[0.98] transition-transform relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-[#1E5BFF] relative z-10">
                    <Zap className="w-6 h-6 fill-[#1E5BFF]" />
                  </div>
                  <div className="text-left flex-1 relative z-10">
                    <h3 className="text-base font-bold text-white">Central do Parceiro</h3>
                    <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest">Gestão e Vendas</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
               </button>
            </div>
        )}

        {features.cashbackEnabled && (
          <div className="bg-gradient-to-br from-[#1E5BFF] to-[#1749CC] rounded-[2rem] p-6 text-white shadow-xl shadow-blue-500/20 mb-6 relative overflow-hidden group cursor-pointer" onClick={handleOpenWallet}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start relative z-10">
                  <div>
                      <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Meu Saldo</p>
                      <h4 className="text-3xl font-black">R$ 12,40</h4>
                  </div>
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/10 group-hover:bg-white group-hover:text-[#1E5BFF] transition-all">
                      <ChevronRight className="w-5 h-5" />
                  </div>
              </div>
              <p className="mt-4 text-[10px] text-blue-100 opacity-80 font-medium leading-relaxed italic">"Economize nas lojas do bairro usando seu cashback."</p>
          </div>
        )}

        {features.jobsEnabled && (
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[#1E5BFF] dark:text-blue-400"><Bell className="w-5 h-5" /></div>
                      <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Alertas de Vagas</h4>
                          <p className="text-[10px] text-gray-500 font-medium">Não perca oportunidades locais</p>
                      </div>
                  </div>
                  <button onClick={handleToggleAlerts} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${jobsAlerts ? 'bg-[#1E5BFF]' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${jobsAlerts ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
              </div>

              {jobsAlerts && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Áreas de interesse</p>
                      <div className="flex flex-wrap gap-2">
                          {CATEGORIES_JOBS.map(cat => {
                              const isSelected = selectedCategories.includes(cat);
                              return (
                                  <button key={cat} onClick={() => toggleCategory(cat)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${isSelected ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-md shadow-blue-500/20' : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}>{cat}</button>
                              );
                          })}
                      </div>
                      <div className="mt-5 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                          <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Você receberá notificações PUSH quando novas vagas urgentes forem publicadas nestas categorias.</p>
                      </div>
                  </div>
              )}
          </div>
        )}

        <div className="space-y-2 mb-8">
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2 mb-3">Links Úteis</h3>
            <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                <button onClick={() => onNavigate('favorites')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700 group"><div className="flex items-center gap-3"><Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" /><span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Meus Favoritos</span></div><ChevronRight className="w-4 h-4 text-gray-300" /></button>
                <button onClick={() => onNavigate('support')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700 group"><div className="flex items-center gap-3"><HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" /><span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Suporte</span></div><ChevronRight className="w-4 h-4 text-gray-300" /></button>
                <button onClick={() => onNavigate('about')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"><div className="flex items-center gap-3"><Info className="w-5 h-5 text-gray-400 group-hover:text-[#1E5BFF] transition-colors" /><span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Sobre o Localizei JPA</span></div><ChevronRight className="w-4 h-4 text-gray-300" /></button>
            </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl flex gap-1 mb-8">
            {(['light', 'dark', 'auto'] as ThemeMode[]).map(m => (
                <button key={m} onClick={() => onThemeChange?.(m)} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${currentTheme === m ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400 dark:text-gray-500'}`}>{m === 'light' ? 'Claro' : m === 'dark' ? 'Escuro' : 'Auto'}</button>
            ))}
        </div>

        <button onClick={handleLogout} disabled={isLoggingOut} className="w-full py-4 text-red-500 dark:text-red-400 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2 border border-red-50 dark:border-red-900/20 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-[0.98]">
            {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />} {isLoggingOut ? 'Saindo...' : 'Sair da conta'}
        </button>

        {features.sponsorMasterBannerEnabled && (
          <div className="mt-8 mb-4">
             <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} />
          </div>
        )}

        <div className="mt-12 mb-10 opacity-30 text-center flex flex-col items-center">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-3 grayscale"><MapPin className="w-5 h-5" /></div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 dark:text-gray-400">Localizei JPA v14.0</p>
        </div>

      </div>

      {showVideoModal.show && (
          <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in duration-300">
              <div className="p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
                  <div className="flex items-center gap-3">
                      <PlayCircle className="w-5 h-5 text-[#1E5BFF]" />
                      <h3 className="text-white font-bold text-sm">
                          {showVideoModal.type === 'jobs' ? 'Como funcionam os Alertas' : 'O que é o Cashback?'}
                      </h3>
                  </div>
                  <button onClick={() => setShowVideoModal({...showVideoModal, show: false})} className="p-2 bg-white/10 rounded-full text-white"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 flex items-center justify-center bg-gray-900">
                  <video src={showVideoModal.type === 'jobs' ? JOBS_EXPLAINER_VIDEO : CASHBACK_EXPLAINER_VIDEO} className="w-full max-h-screen" controls autoPlay />
              </div>
              <div className="p-8 bg-black">
                  <button onClick={() => setShowVideoModal({...showVideoModal, show: false})} className="w-full bg-[#1E5BFF] text-white font-bold py-4 rounded-2xl text-base shadow-lg active:scale-95 transition-all">Entendido!</button>
              </div>
          </div>
      )}
    </div>
  );
};

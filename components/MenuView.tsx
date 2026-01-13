
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
  Crown
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
const JOBS_EXPLAINER_VIDEO = "https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4";
const CASHBACK_EXPLAINER_VIDEO = "https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4"; // Placeholder

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
  
  // --- ESTADOS ---
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
      
      {/* (A) Cabeçalho */}
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
        
        {/* (B) Card do Usuário */}
        <div onClick={() => onNavigate('edit_profile')} className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer active:scale-[0.98] mb-6">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm">
            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-6 h-6 text-gray-400" />}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{user?.user_metadata?.full_name || user?.email}</h3>
            <p className="text-xs text-[#1E5BFF] font-bold mt-0.5 flex items-center gap-1">Ver perfil completo <ChevronRight className="w-3 h-3" /></p>
          </div>
        </div>

        {/* (A) BANNER CARTEIRA & CASHBACK (PRIMEIRO) */}
        <div className="bg-gradient-to-br from-[#1E5BFF] to-[#1749CC] rounded-[2rem] p-6 text-white shadow-xl shadow-blue-500/20 mb-6 relative overflow-hidden group cursor-pointer" onClick={handleOpenWallet}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Carteira & Cashback</h3>
                        <p className="text-xs text-blue-100 font-medium">Veja seu saldo e benefícios.</p>
                    </div>
                </div>
                <ChevronRight className="w-6 h-6 opacity-50" />
            </div>
            <div className="mt-6 flex justify-end relative z-10">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowVideoModal({show: true, type: 'cashback'}); }}
                  className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/10 hover:bg-black/30"
                >
                    <PlayCircle className="w-3.5 h-3.5 text-amber-400" /> Como funciona (30s)
                </button>
            </div>
        </div>

        {/* (B) Card "Notificações de Vagas" */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-700 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Notificações de Vagas</h3>
            </div>
            <button 
              onClick={handleToggleAlerts}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${jobsAlerts ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${jobsAlerts ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Receba alertas de empresas do bairro.</p>
              <button onClick={() => setShowVideoModal({show: true, type: 'jobs'})} className="text-[10px] font-bold text-orange-600 flex items-center gap-1 hover:underline">
                <PlayCircle className="w-3 h-3" /> Como funciona (30s)
              </button>
          </div>

          {jobsAlerts && (
            <div className="space-y-4 animate-in fade-in duration-300 border-t border-gray-50 dark:border-gray-700 pt-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categorias de interesse</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES_JOBS.map(cat => (
                  <button key={cat} onClick={() => toggleCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${selectedCategories.includes(cat) ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'bg-gray-50 dark:bg-gray-700 text-gray-500 border-gray-200 dark:border-gray-600'}`}>
                    {selectedCategories.includes(cat) && <Check className="w-3 h-3" />}
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- ÁREA EXCLUSIVA LOJISTA --- */}
        {isMerchant && (
            <div className="mb-6">
               <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 ml-2">Painel Parceiro</h3>
               <button onClick={() => onNavigate('store_area')} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-[2rem] shadow-lg flex items-center justify-between active:scale-[0.98] transition-transform">
                   <div className="flex items-center gap-4">
                       <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                           <UserIcon className="w-5 h-5 text-indigo-300" />
                       </div>
                       <div className="text-left">
                           <h3 className="font-bold text-base">Minha Loja</h3>
                           <p className="text-[10px] text-indigo-200 uppercase tracking-wider font-bold">Gestão de Vendas e Cashback</p>
                       </div>
                   </div>
                   <ChevronRight className="w-5 h-5 text-white/40" />
               </button>
            </div>
        )}

        {/* (C) Seção de Atalhos do Usuário */}
        <div className="space-y-4 mb-8">
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 ml-2">Minha Conta</h3>
            
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                <button onClick={() => onNavigate('favorites')} className="w-full p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-500">
                            <Heart className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Favoritos</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>

                <button onClick={() => alert('Endereços - Em breve')} className="w-full p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Meus Endereços</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>

                <button onClick={() => onNavigate('about')} className="w-full p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E5BFF]">
                            <Info className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Quem Somos</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>

                <button onClick={() => onNavigate('support')} className="w-full p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                            <HelpCircle className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Ajuda / Suporte</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
            </div>
        </div>

        {/* (E) Banner Patrocinador Master */}
        <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} className="mb-8" />

        {/* (E) Sair da conta */}
        <button 
          onClick={handleLogout} 
          disabled={isLoggingOut} 
          className="w-full bg-red-50 dark:bg-red-900/10 p-5 rounded-[2rem] border border-red-100 dark:border-red-900/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all group"
        >
            {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin text-red-600" />
            ) : (
                <LogOut className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform" />
            )}
            <span className="font-bold text-red-600 text-sm">Sair da conta</span>
        </button>

        <div className="mt-8 text-center px-4">
            <p className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.4em]">Localizei JPA v14.2</p>
        </div>
      </div>

      {/* MODAL DO VÍDEO EXPLICATIVO */}
      {showVideoModal.show && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl relative border border-gray-100 dark:border-gray-800">
              <button onClick={() => setShowVideoModal({show: false, type: 'jobs'})} className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-[9/16] bg-black relative">
                <video 
                    src={showVideoModal.type === 'jobs' ? JOBS_EXPLAINER_VIDEO : CASHBACK_EXPLAINER_VIDEO} 
                    className="w-full h-full object-cover" 
                    autoPlay 
                    controls 
                    playsInline 
                />
              </div>
              <div className="p-6 text-center">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {showVideoModal.type === 'jobs' ? 'Entenda os alertas' : 'Economize com Cashback'}
                 </h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {showVideoModal.type === 'jobs' 
                        ? 'Você só recebe notificações de vagas que combinam com as categorias que você escolheu. Sem spam, apenas oportunidades reais.' 
                        : 'Ganhe parte do seu dinheiro de volta em todas as compras nas lojas parceiras do bairro. Use seu saldo para pagar contas futuras!'}
                 </p>
                 <button 
                   onClick={() => {
                       const type = showVideoModal.type;
                       setShowVideoModal({show: false, type: 'jobs'});
                       if (type === 'cashback') onNavigate('user_statement');
                   }}
                   className="mt-6 w-full py-3.5 bg-[#1E5BFF] text-white font-bold rounded-xl active:scale-95 transition-transform"
                 >
                   Entendido!
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

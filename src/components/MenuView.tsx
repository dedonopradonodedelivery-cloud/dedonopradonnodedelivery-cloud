
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  User as UserIcon, 
  ChevronRight, 
  X, 
  Bell, 
  Heart, 
  HelpCircle, 
  LogOut, 
  Loader2, 
  Info, 
  MessageSquare, 
  Tag, 
  Bookmark, 
  Ticket, 
  Package, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Moon, 
  CheckCircle2, 
  Crown,
  ArrowRight,
  Lightbulb,
  Smartphone,
  Play,
  Lock,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '@supabase/supabase-js';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { useFeatures } from '../contexts/FeatureContext';

interface MenuViewProps {
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
  onAuthClick: () => void;
  onNavigate: (view: string, data?: any) => void;
  onBack?: () => void;
}

const MenuSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-3 mb-8">
    <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2 mb-2">{title}</h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

const MenuItem: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  sublabel?: string; 
  badge?: string | number; 
  onClick: () => void; 
  isDestructive?: boolean;
  color?: string;
}> = ({ icon: Icon, label, sublabel, badge, onClick, isDestructive, color = "text-gray-500" }) => (
  <button 
    onClick={onClick} 
    className={`w-full p-4 flex items-center justify-between bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all group`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDestructive ? 'bg-red-50 text-red-500' : `bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-50 ${color}`}`}>
        <Icon size={20} />
      </div>
      <div className="text-left">
        <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${isDestructive ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>{label}</span>
            {badge && (
                <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">{badge}</span>
            )}
        </div>
        {sublabel && <p className="text-[10px] text-gray-400 font-medium mt-0.5">{sublabel}</p>}
      </div>
    </div>
    <ChevronRight className={`w-4 h-4 ${isDestructive ? 'text-red-200' : 'text-gray-300'}`} />
  </button>
);

export const MenuView: React.FC<MenuViewProps> = ({ 
  user, 
  onAuthClick, 
  onNavigate, 
  onBack 
}) => {
  const { signOut } = useAuth();
  const { currentNeighborhood } = useNeighborhood();
  const { isFeatureActive } = useFeatures();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const storageKey = `onboarding_video_user_${user?.id}`;
  const [hasWatchedVideo, setHasWatchedVideo] = useState(() => {
    return localStorage.getItem(storageKey) === 'true';
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setHasWatchedVideo(true);
    setIsPlaying(false);
    localStorage.setItem(storageKey, 'true');
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
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
        <div className="bg-white dark:bg-gray-900 px-4 pt-10 pb-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Menu</h2>
          {onBack && (<button onClick={onBack} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"><X className="w-5 h-5" /></button>)}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm border border-gray-100 transform -rotate-6"><UserIcon className="w-10 h-10 text-[#1E5BFF]" /></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Sua comunidade te espera</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xs">Entre para anunciar, comentar no feed e salvar seus cupons.</p>
          <button onClick={onAuthClick} className="w-full max-w-xs bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-xs">Entrar ou Criar Conta</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-300">
      {/* Header Fixo */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 flex items-center justify-between">
        <div><h2 className="text-2xl font-black text-gray-900 dark:text-white font-display uppercase tracking-tighter">Menu</h2></div>
        {onBack && (<button onClick={onBack} className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 active:scale-90 transition-all"><X className="w-6 h-6" /></button>)}
      </div>

      <div className="px-5">
        
        {/* BANNER DE ONBOARDING - SÓ APARECE SE NÃO ASSISTIDO */}
        {!hasWatchedVideo && (
          <section className="mt-6">
            <div className="relative bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-blue-500/30 ring-4 ring-blue-500/5">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500">
                      <Play size={24} className="ml-1" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-sm uppercase tracking-tight">Como o app funciona</h3>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">Este vídeo explica como usar o app e aproveitar tudo do seu bairro.</p>
                    </div>
                  </div>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black group border border-white/5">
                  <video 
                    ref={videoRef} 
                    src="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
                    className="w-full h-full object-cover"
                    onEnded={handleVideoEnd}
                    playsInline
                    controls={isPlaying}
                    onPlay={() => setIsPlaying(true)}
                  />
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                      <button onClick={handlePlayVideo} className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transform active:scale-90 transition-all hover:scale-105">
                        <Play className="w-8 h-8 text-blue-600 fill-blue-600 ml-1" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 py-2 bg-white/5 rounded-xl border border-white/5 animate-pulse">
                  <Lock size={12} className="text-amber-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ações limitadas até o fim do vídeo</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CONTEÚDO DO PAINEL */}
        <div className={`relative transition-all duration-700 ${!hasWatchedVideo ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
          
          {/* 1. TOPO DO MENU: Perfil */}
          <div 
            onClick={() => onNavigate('user_profile_full')} 
            className="mt-6 bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 cursor-pointer active:scale-[0.98] mb-8 group transition-all"
          >
            <div className="w-16 h-16 rounded-[1.5rem] bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-950 shadow-md group-hover:scale-105 transition-transform">
              {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-7 h-7 text-gray-400" />}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-black text-gray-900 dark:text-white text-lg truncate leading-tight uppercase tracking-tighter">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </h3>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                  Ativo em {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
              </p>
              <span className="text-[9px] font-bold text-gray-400 underline mt-2 block">Ver perfil completo</span>
            </div>
          </div>

          <MenuSection title="Minha atividade no bairro">
              <MenuItem 
                  icon={Zap} 
                  label="Avisar algo acontecendo" 
                  sublabel="Postagem em tempo real na Home (exige aprovação)"
                  onClick={() => onNavigate('happening_now_form')}
                  color="text-amber-500"
              />
              {isFeatureActive('community_feed') && (
                <MenuItem 
                    icon={MessageSquare} 
                    label="Meus comentários" 
                    sublabel="Histórico no JPA Conversa"
                    onClick={() => onNavigate('user_activity', { type: 'comentarios' })}
                    color="text-indigo-500"
                />
              )}
              {isFeatureActive('classifieds') && (
                <MenuItem 
                    icon={Package} 
                    label="Meus anúncios" 
                    sublabel="Gerenciar seus itens nos Classificados"
                    onClick={() => onNavigate('user_activity', { type: 'anuncios' })}
                    color="text-amber-500"
                />
              )}
              {isFeatureActive('service_chat') && (
                <MenuItem 
                    icon={Bell} 
                    label="Minhas solicitações" 
                    sublabel="Pedidos de orçamento e serviços"
                    onClick={() => onNavigate('service_messages_list')}
                    color="text-blue-500"
                />
              )}
              {isFeatureActive('customer_reviews') && (
                <MenuItem 
                    icon={Star} 
                    label="Avaliações que fiz" 
                    sublabel="Sua opinião sobre os lojistas"
                    onClick={() => onNavigate('user_activity', { type: 'avaliacoes' })}
                    color="text-yellow-500"
                />
              )}
          </MenuSection>

          <MenuSection title="Geral">
              {isFeatureActive('coupons') && (
                <MenuItem 
                    icon={Ticket} 
                    label="Meus Cupons" 
                    onClick={() => onNavigate('user_coupons')}
                    color="text-emerald-500"
                />
              )}
              <MenuItem 
                  icon={Heart} 
                  label="Favoritos" 
                  sublabel="Lojas e anúncios marcados"
                  onClick={() => onNavigate('favorites')}
                  color="text-rose-500"
              />
              <MenuItem 
                  icon={Bookmark} 
                  label="Postagens Salvas" 
                  onClick={() => onNavigate('saved_posts')}
                  color="text-blue-400"
              />
          </MenuSection>

          <MenuSection title="Institucional">
              <MenuItem icon={Smartphone} label="Como funciona o app" onClick={() => onNavigate('about_app')} color="text-blue-500" />
              <MenuItem icon={Info} label="Quem Somos" onClick={() => onNavigate('about')} color="text-slate-500" />
              <MenuItem icon={HelpCircle} label="Suporte" onClick={() => onNavigate('support')} color="text-indigo-400" />
              <MenuItem icon={Lightbulb} label="Sugerir melhoria" onClick={() => onNavigate('app_suggestion')} color="text-amber-500" />
          </MenuSection>

          <MenuSection title="Configurações">
              <MenuItem icon={ShieldCheck} label="Privacidade" onClick={() => onNavigate('privacy_policy')} color="text-emerald-600" />
              <MenuItem icon={LogOut} label="Sair da conta" onClick={handleLogout} isDestructive />
          </MenuSection>

          {isFeatureActive('master_sponsor') && (
            <div className="mt-4 mb-10 px-2 opacity-80">
                <div onClick={() => onNavigate('patrocinador_master')} className="bg-slate-900 rounded-3xl p-5 border border-white/5 flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400"><Crown size={18} /></div>
                        <div>
                            <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none">Patrocinador Master</p>
                            <p className="text-sm font-bold text-white mt-1">Grupo Esquematiza</p>
                        </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

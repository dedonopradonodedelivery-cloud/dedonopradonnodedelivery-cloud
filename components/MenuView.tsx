
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  User as UserIcon, 
  ChevronRight, 
  X, 
  Bell, 
  Heart, 
  HelpCircle, 
  LogOut, 
  Info, 
  MessageSquare, 
  Bookmark, 
  Ticket, 
  Package, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Crown,
  ArrowRight,
  Smartphone,
  Play,
  Lock,
  Zap,
  Tag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@supabase/supabase-js';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { useFeatures } from '@/contexts/FeatureContext';

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
  isSpecial?: boolean;
}> = ({ icon: Icon, label, sublabel, badge, onClick, isDestructive, color = "text-gray-500", isSpecial }) => (
  <button 
    onClick={onClick} 
    className={`w-full p-4 flex items-center justify-between bg-white dark:bg-gray-900 rounded-2xl border transition-all active:scale-[0.98] group shadow-sm ${isSpecial ? 'border-blue-100 dark:border-blue-900/30' : 'border-gray-100 dark:border-gray-800'}`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDestructive ? 'bg-red-50 text-red-500' : isSpecial ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF]' : `bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-50 ${color}`}`}>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display uppercase tracking-tight">Menu</h2>
          {onBack && (<button onClick={onBack} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"><X size={24} /></button>)}
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
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 flex items-center justify-between">
        <div><h2 className="text-2xl font-black text-gray-900 dark:text-white font-display uppercase tracking-tighter">Menu</h2></div>
        {onBack && (<button onClick={onBack} className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 active:scale-90 transition-all"><X className="w-6 h-6" /></button>)}
      </div>

      <div className="px-5">
        
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
              </div>
            </div>
          </section>
        )}

        <div className={`relative transition-all duration-700 ${!hasWatchedVideo ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
          
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

          {/* SEÇÃO DE BENEFÍCIOS (MAIOR DESTAQUE) */}
          {isFeatureActive('coupons') && (
            <MenuSection title="Meus Benefícios">
                <MenuItem 
                    icon={Tag} 
                    label="Cupons e Ofertas" 
                    sublabel="Descontos resgatados no bairro"
                    onClick={() => onNavigate('user_coupons')}
                    isSpecial
                    badge="Novo"
                />
                <MenuItem 
                    icon={Heart} 
                    label="Lojas Favoritas" 
                    sublabel="Estabelecimentos que você segue"
                    onClick={() => onNavigate('favorites')}
                    color="text-rose-500"
                />
            </MenuSection>
          )}

          <MenuSection title="Minha Atividade">
              {isFeatureActive('community_feed') && (
                <MenuItem 
                    icon={MessageSquare} 
                    label="Minhas Participações" 
                    sublabel="Histórico no JPA Conversa"
                    onClick={() => onNavigate('user_activity', { type: 'comentarios' })}
                    color="text-indigo-500"
                />
              )}
              {isFeatureActive('classifieds') && (
                <MenuItem 
                    icon={Package} 
                    label="Meus Anúncios" 
                    sublabel="Itens à venda ou doações"
                    onClick={() => onNavigate('user_activity', { type: 'anuncios' })}
                    color="text-amber-500"
                />
              )}
              {isFeatureActive('service_chat') && (
                <MenuItem 
                    icon={Zap} 
                    label="Solicitações de Serviço" 
                    sublabel="Pedidos de orçamento enviados"
                    onClick={() => onNavigate('service_messages_list')}
                    color="text-blue-500"
                />
              )}
          </MenuSection>

          <MenuSection title="Institucional">
              <MenuItem icon={Smartphone} label="Sobre o Super-App" onClick={() => onNavigate('about_app')} color="text-blue-500" />
              <MenuItem icon={HelpCircle} label="Suporte e Ajuda" onClick={() => onNavigate('support')} color="text-indigo-400" />
          </MenuSection>

          <MenuSection title="Configurações">
              <MenuItem icon={ShieldCheck} label="Privacidade e Termos" onClick={() => onNavigate('privacy_policy')} color="text-emerald-600" />
              <MenuItem icon={LogOut} label="Sair da Conta" onClick={handleLogout} isDestructive />
          </MenuSection>

          <div className="mt-4 mb-10 px-2 opacity-80">
              <div onClick={() => onNavigate('patrocinador_master')} className="bg-slate-900 rounded-3xl p-5 border border-white/5 flex items-center justify-between cursor-pointer group shadow-xl">
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
        </div>
      </div>
    </div>
  );
};

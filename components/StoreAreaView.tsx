
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  Megaphone, 
  LayoutGrid, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  Heart, 
  Info, 
  HelpCircle, 
  LogOut,
  User,
  Sparkles,
  Compass,
  LifeBuoy,
  AlertTriangle,
  Crown,
  Star,
  Moon,
  Sun,
  ImageIcon,
  Play,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

// --- CONFIGURAÇÃO DE DESENVOLVIMENTO ---
// Defina como true para pular o vídeo ao clicar no Play.
// Defina como false para produção.
const DEV_SKIP_VIDEO = true;

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate: (view: string, initialView?: 'sales' | 'chat') => void;
  user: SupabaseUser | null;
}

const ServiceBlock: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  description?: string;
  onClick: () => void;
  isDestructive?: boolean;
  colorClass?: string;
  badge?: number;
  labelBadge?: string;
  rightElement?: React.ReactNode;
}> = ({ icon: Icon, label, description, onClick, isDestructive, colorClass, badge, labelBadge, rightElement }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-b-0 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors group"
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl transition-colors relative ${
        isDestructive 
          ? 'bg-red-50 text-red-500' 
          : colorClass || 'bg-gray-50 dark:bg-gray-700 text-gray-400 group-hover:text-[#1E5BFF] group-hover:bg-blue-50'
      }`}>
        <Icon size={22} />
        {badge ? (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center animate-bounce">
            <span className="text-[10px] font-black text-white">{badge}</span>
          </div>
        ) : null}
      </div>
      <div className="text-left">
        <p className={`text-sm font-bold ${isDestructive ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
          {label}
        </p>
        {description && (
          <p className="text-[10px] text-gray-400 font-medium leading-tight mt-1 max-w-[200px]">
            {description}
          </p>
        )}
      </div>
    </div>
    {rightElement || <ChevronRight size={16} className={isDestructive ? 'text-red-300' : 'text-gray-300'} />}
  </button>
);

const SectionHeader: React.FC<{ title: string; icon?: React.ElementType }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-3 px-1">
    {Icon && <Icon size={14} className="text-[#1E5BFF]" />}
    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
      {title}
    </h2>
  </div>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user }) => {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [hasWatchedVideo, setHasWatchedVideo] = useState(() => {
    return localStorage.getItem(`onboarding_video_${user?.id}`) === 'true';
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLogout = async () => {
    if (confirm('Deseja realmente sair da sua conta de lojista?')) {
      await signOut();
      onNavigate('home');
    }
  };

  const handleVideoEnd = () => {
    setHasWatchedVideo(true);
    setIsPlaying(false);
    localStorage.setItem(`onboarding_video_${user?.id}`, 'true');
  };

  const handlePlayVideo = () => {
    // DEV MODE: Pula o vídeo imediatamente para facilitar testes
    if (DEV_SKIP_VIDEO) {
      handleVideoEnd();
      return;
    }

    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const storeName = user?.user_metadata?.store_name || "Sua Loja";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${storeName.replace(' ', '+')}&background=1E5BFF&color=fff`;

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-gray-950 font-sans animate-in fade-in duration-500 pb-32">
      
      {/* HEADER DO PAINEL */}
      <div className="bg-white dark:bg-gray-900 px-6 pt-12 pb-6 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl border-2 border-white dark:border-gray-800 shadow-lg overflow-hidden shrink-0">
            <img src={avatarUrl} alt={storeName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-gray-900 dark:text-white truncate leading-tight uppercase tracking-tighter">
              {storeName}
            </h1>
            <p className="text-xs text-[#1E5BFF] font-bold uppercase tracking-widest mt-1">Painel do Lojista</p>
          </div>
        </div>
      </div>

      {/* BANNER DE ONBOARDING OBRIGATÓRIO */}
      <section className="px-6 mt-6">
        <div className={`relative bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 ${hasWatchedVideo ? 'border border-emerald-500/30' : 'border border-blue-500/30 ring-4 ring-blue-500/5'}`}>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasWatchedVideo ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {hasWatchedVideo ? <CheckCircle2 size={24} /> : <Play size={24} className="ml-1" />}
                </div>
                <div>
                  <h3 className="font-black text-white text-sm uppercase tracking-tight">
                    {hasWatchedVideo ? "Onboarding Concluído" : "Assista para liberar seu painel"}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">
                    {hasWatchedVideo 
                      ? "Você já conhece o básico! Boas vendas." 
                      : "Este vídeo explica como usar o app e aproveitar melhor as oportunidades."}
                  </p>
                </div>
              </div>
              {hasWatchedVideo && (
                <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Assistido ✔</span>
              )}
            </div>

            {/* PLAYER DE VÍDEO */}
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
              
              {!isPlaying && !hasWatchedVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] transition-all group-hover:bg-black/40">
                  <button 
                    onClick={handlePlayVideo}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transform active:scale-90 transition-all hover:scale-105"
                  >
                    <Play className="w-8 h-8 text-blue-600 fill-blue-600 ml-1" />
                  </button>
                </div>
              )}
            </div>

            {!hasWatchedVideo && (
              <div className="mt-4 flex items-center justify-center gap-2 py-2 bg-white/5 rounded-xl border border-white/5 animate-pulse">
                <Lock size={12} className="text-amber-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Painel bloqueado até o fim do vídeo</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ÁREA DE CONTEÚDO (BLOQUEADA SE NÃO ASSISTIU) */}
      <div className={`relative transition-all duration-700 ${!hasWatchedVideo ? 'opacity-40 grayscale pointer-events-none scale-[0.98]' : 'opacity-100 scale-100'}`}>
        
        {/* OVERLAY DE BLOQUEIO VISUAL */}
        {!hasWatchedVideo && (
          <div className="absolute inset-0 z-10 flex items-start justify-center pt-20 pointer-events-none">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col items-center gap-2">
                <Lock className="text-amber-500" size={24} />
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">Painel Bloqueado</p>
            </div>
          </div>
        )}

        <div className="px-6 py-10 space-y-10">
          
          <section>
            <SectionHeader title="Ações" icon={Sparkles} />
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <ServiceBlock 
                icon={Crown} 
                label="Patrocinador Master" 
                description="Apareça em destaque em 90% das telas do bairro"
                onClick={() => onNavigate('patrocinador_master')}
                colorClass="bg-amber-50 text-amber-600"
              />
              <ServiceBlock 
                icon={ImageIcon} 
                label="Banner em Categoria" 
                description="Garante seu espaço exclusivo no carrossel de categorias"
                onClick={() => onNavigate('banner_sales_wizard')}
                colorClass="bg-blue-50 text-blue-600"
              />
              <ServiceBlock 
                icon={LayoutGrid} 
                label="Banners Home" 
                description="Anúncios visuais na página inicial"
                onClick={() => onNavigate('banner_sales_wizard')}
                colorClass="bg-purple-50 text-purple-600"
              />
              <ServiceBlock 
                icon={Star} 
                label="Avaliações" 
                description="Responda seus clientes e gerencie sua reputação"
                onClick={() => onNavigate('merchant_reviews')}
                badge={2} 
                colorClass="bg-amber-50 text-amber-600"
              />
            </div>
          </section>

          <section>
            <SectionHeader title="Serviços" />
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <ServiceBlock 
                icon={MessageSquare} 
                label="Chat com Designer" 
                description="Criação e acompanhamento do seu banner"
                onClick={() => onNavigate('store_ads_module', 'chat')} 
              />
              <ServiceBlock 
                icon={BarChart3} 
                label="Performance" 
                description="Estatísticas de visualização e cliques"
                onClick={() => onNavigate('merchant_performance')}
              />
              <ServiceBlock 
                icon={CreditCard} 
                label="Pagamentos" 
                description="Extratos, notas e assinaturas"
                onClick={() => onNavigate('store_finance')} 
              />
            </div>
          </section>

          <section>
            <SectionHeader title="Preferências" />
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <ServiceBlock 
                icon={theme === 'dark' ? Moon : Sun} 
                label="Modo Noite" 
                description={theme === 'dark' ? "Ativado" : "Desativado"}
                onClick={toggleTheme}
                rightElement={
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1E5BFF]' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                }
              />
            </div>
          </section>

          <section>
            <SectionHeader title="Suporte" />
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <ServiceBlock 
                icon={LifeBuoy} 
                label="Suporte" 
                description="Ajuda com o app e conta"
                onClick={() => onNavigate('store_support')} 
              />
            </div>
          </section>

          <section>
            <SectionHeader title="Geral" />
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <ServiceBlock 
                icon={Heart} 
                label="Favoritos" 
                onClick={() => onNavigate('favorites')} 
              />
              <ServiceBlock 
                icon={Compass} 
                label="Quem Somos" 
                onClick={() => onNavigate('about')} 
              />
              <ServiceBlock 
                icon={LogOut} 
                label="Sair da conta" 
                isDestructive
                onClick={handleLogout} 
              />
            </div>
          </section>

        </div>
      </div>

      <div className="mt-12 text-center opacity-30 px-10">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
          Localizei JPA Parceiros <br/> v1.5.0
        </p>
      </div>
    </div>
  );
};


import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Store, Category, AdType, CommunityPost } from '@/types';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Gift,
  CheckCircle2,
  Clock,
  Lock,
  Star,
  MessageSquare,
  Zap,
  Award,
  Loader2,
  Wrench,
  Key,
  Hammer,
  Plus,
  Heart,
  Share2,
  Bookmark
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_COMMUNITY_POSTS } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { LaunchOfferBanner } from './LaunchOfferBanner';
import { HomeBannerCarousel } from './HomeBannerCarousel';

interface HomeFeedFeedProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: Category) => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
}

const MiniPostCard: React.FC<{ post: CommunityPost; onNavigate: (view: string) => void; }> = ({ post, onNavigate }) => {
  const postImage = post.imageUrls?.[0] || 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?q=80&w=400&auto=format&fit=crop';
  
  const handleAction = (e: React.MouseEvent, message: string) => {
      e.stopPropagation();
      alert(message);
  };

  return (
    <div className="flex-shrink-0 w-1/2 snap-center p-1.5">
      <div 
        onClick={() => onNavigate('neighborhood_posts')}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer"
      >
        {/* Image with overlayed user info */}
        <div className="relative aspect-square w-full overflow-hidden">
          <img src={postImage} alt={post.content} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <img src={post.userAvatar} className="w-6 h-6 rounded-full border-2 border-white/80 object-cover" alt={post.userName} />
            <p className="text-xs font-bold text-white drop-shadow-md truncate">{post.userName}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-2 pt-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={(e) => handleAction(e, 'Curtido!')} className="text-gray-500 hover:text-rose-500 p-1 transition-colors"><Heart size={20} /></button>
            <button onClick={(e) => handleAction(e, 'Comentários!')} className="text-gray-500 hover:text-blue-500 p-1 transition-colors"><MessageSquare size={20} /></button>
          </div>
          <button onClick={(e) => handleAction(e, 'Salvo!')} className="text-gray-500 hover:text-yellow-500 p-1 transition-colors"><Bookmark size={20} /></button>
        </div>
        
        {/* Content */}
        <div className="px-3 pb-3">
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug line-clamp-2">
                {post.content}
            </p>
            <span className="text-[10px] text-gray-400 mt-2 block group-hover:text-blue-500 transition-colors">
                Ver post...
            </span>
        </div>
      </div>
    </div>
  );
};

export const HomeFeed: React.FC<HomeFeedFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onStoreClick, 
  stores,
  user,
  userRole
}) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');
  const [isAnimating, setIsAnimating] = useState(false);
  const { currentNeighborhood } = useNeighborhood();
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [scrollIndicator, setScrollIndicator] = useState({ width: '0%', left: '0%' });

  const [consecutiveDays, setConsecutiveDays] = useState(() => {
    return parseInt(localStorage.getItem('reward_consecutive_days') || '1');
  });

  const handleClaimReward = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      onNavigate('weekly_reward_page');
    }, 1200);
  };

  const updateScrollIndicator = useCallback(() => {
    const el = categoryScrollRef.current;
    if (el) {
        const { scrollWidth, clientWidth, scrollLeft } = el;
        if (scrollWidth <= clientWidth) {
            setScrollIndicator({ width: '0%', left: '0%' });
            return;
        }
        
        const thumbWidth = (clientWidth / scrollWidth) * 100;
        const thumbLeft = (scrollLeft / scrollWidth) * 100;

        setScrollIndicator({
            width: `${thumbWidth}%`,
            left: `${thumbLeft}%`
        });
    }
  }, []);

  useEffect(() => {
      const el = categoryScrollRef.current;
      if (el) {
          updateScrollIndicator(); 
          el.addEventListener('scroll', updateScrollIndicator, { passive: true });
          
          const resizeObserver = new ResizeObserver(updateScrollIndicator);
          resizeObserver.observe(el);
          
          return () => {
              el.removeEventListener('scroll', updateScrollIndicator);
              resizeObserver.unobserve(el);
          };
      }
  }, [updateScrollIndicator]);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      
      {userRole === 'lojista' && (
        <section className="px-4 py-4 bg-white dark:bg-gray-950">
           <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}

      {/* CATEGORIAS */}
      <div className="w-full bg-white dark:bg-gray-950 pt-4 pb-0">
        <div ref={categoryScrollRef} className="flex overflow-x-auto no-scrollbar px-4 pb-2 snap-x">
          <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => onSelectCategory(cat)}
                className="flex flex-col items-center group active:scale-95 transition-all"
              >
                <div className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 ${cat.color} border border-white/20`}>
                  <div className="flex-1 flex items-center justify-center w-full">{React.cloneElement(cat.icon as any, { className: "w-7 h-7 text-white drop-shadow-md", strokeWidth: 2.5 })}</div>
                  <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2"><span className="block w-full text-[9px] font-black text-white text-center uppercase tracking-tight">{cat.name}</span></div>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* SCROLL INDICATOR BAR */}
        <div className="px-4 pb-4 flex justify-center">
          <div className="w-1/3 h-[2px] bg-gray-100 dark:bg-gray-800 rounded-full">
            <div 
              className="h-full bg-brand-blue rounded-full" 
              style={{ 
                width: scrollIndicator.width, 
                marginLeft: scrollIndicator.left 
              }}
            ></div>
          </div>
        </div>
      </div>

      <HomeBannerCarousel onStoreClick={onStoreClick} />

      {/* 1. SISTEMA DE RECOMPENSA (VERSÃO COMPACTA) */}
      <section className="px-5 py-1 mb-2">
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-4 border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-900/5 relative overflow-hidden group">
          {/* Micro-animação de fundo quando ativado */}
          <div className={`absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl -mr-12 -mt-12 transition-opacity duration-1000 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-[#1E5BFF] border border-blue-100/50 dark:border-blue-800/30 shadow-sm">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-[9px] text-[#1E5BFF] uppercase tracking-[0.12em] leading-none mb-0.5">Recompensa da Semana</h3>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">Acesse e ganhe</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                <span className="text-[8px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">Dia {consecutiveDays} de 5</span>
              </div>
            </div>

            <div className="px-1 mb-3">
              <h2 className="text-[11px] font-bold text-gray-800 dark:text-gray-200 leading-tight">
                {consecutiveDays < 5 
                  ? "Cada dia conta para liberar seus benefícios exclusivos" 
                  : "Parabéns! Sua recompensa está pronta."}
              </h2>
            </div>

            {/* Marcadores de Progresso Compactos */}
            <div className="flex justify-between items-center mb-4 px-2">
              {[1, 2, 3, 4, 5].map((day) => {
                const isCompleted = day <= consecutiveDays;
                const isNext = day === consecutiveDays + 1;

                return (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-700 relative ${
                      isCompleted 
                        ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/10 scale-105' 
                        : isNext
                          ? 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-900 border-dashed animate-pulse'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-300 dark:text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 size={14} strokeWidth={3} />
                      ) : (
                        <span className="text-[8px] font-black">{day}</span>
                      )}
                      
                      {/* Brilho sutil no dia atual */}
                      {day === consecutiveDays && !isAnimating && (
                        <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={handleClaimReward}
              disabled={isAnimating}
              className={`w-full py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] ${
                isAnimating 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-[#1E5BFF] text-white shadow-blue-500/10 hover:brightness-110'
              }`}
            >
              {isAnimating ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  {consecutiveDays < 5 ? `Liberar Dia ${consecutiveDays}` : "Resgatar Recompensa"}
                  <ArrowRight size={12} strokeWidth={3} />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 2. ONDE O BAIRRO CONVERSA */}
      <section className="bg-white dark:bg-gray-950 pt-8 pb-4">
        <div className="px-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Onde o bairro conversa</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => onNavigate('neighborhood_posts')} className="text-xs font-bold text-blue-500">Ver tudo</button>
                  <button onClick={() => onNavigate('neighborhood_posts')} className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500"><Plus size={14} /></button>
                </div>
            </div>
        </div>
        {/* Posts */}
        <div className="flex overflow-x-auto no-scrollbar snap-x -mx-3.5 px-3.5">
            {MOCK_COMMUNITY_POSTS.slice(0, 5).map((post) => (
                <MiniPostCard key={post.id} post={post} onNavigate={onNavigate} />
            ))}
        </div>
      </section>
      
      {/* 3. PEÇA ORÇAMENTOS */}
      <section className="px-5 py-4 mb-6">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0 text-[#1E5BFF]">
              <Wrench size={20} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                  Peça orçamentos de profissionais do bairro
              </h2>
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-1">
                  Até 5 propostas • rápido • fácil • grátis
              </p>
          </div>
          <button 
            onClick={() => onNavigate('services')}
            className="ml-auto bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-3 px-5 rounded-xl text-[10px] uppercase tracking-wider active:scale-[0.98] transition-all whitespace-nowrap"
          >
            Solicitar
          </button>
        </div>
      </section>

      {/* LISTA EXPLORAR */}
      <div className="w-full bg-white dark:bg-gray-950 pt-1 pb-10">
        <div className="px-5">
          <SectionHeader 
            icon={Compass} 
            title="Explorar Bairro" 
            subtitle="Tudo o que você precisa" 
            onSeeMore={() => onNavigate('explore')}
          />
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-4">
            {['all', 'top_rated'].map((f) => (
              <button 
                key={f} 
                onClick={() => setListFilter(f as any)} 
                className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
              >
                {f === 'all' ? 'Tudo' : 'Top'}
              </button>
            ))}
          </div>
          <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter as any} user={user} onNavigate={onNavigate} premiumOnly={false} />
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void }> = ({ icon: Icon, title, subtitle, onSeeMore }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white shadow-sm">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div>
        <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">{title}</h2>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{subtitle}</p>
      </div>
    </div>
    <button onClick={onSeeMore} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest hover:underline active:opacity-60">Ver mais</button>
  </div>
);

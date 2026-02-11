
import React, { useState, useMemo, useRef } from 'react';
import { Store, Category, CommunityPost, ServiceRequest, ServiceUrgency, Classified } from '@/types';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Ticket,
  CheckCircle2, 
  Lock, 
  Zap, 
  Loader2, 
  Hammer, 
  Plus, 
  Heart, 
  Bookmark, 
  Home as HomeIcon,
  MessageSquare, 
  MapPin, 
  Camera, 
  X, 
  Send, 
  ChevronRight,
  ShieldAlert,
  Award,
  Users,
  Tag,
  AlertCircle,
  Hash,
  Crown
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_COMMUNITY_POSTS, MOCK_CLASSIFIEDS } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { LaunchOfferBanner } from '@/components/LaunchOfferBanner';
import { HomeBannerCarousel } from '@/components/HomeBannerCarousel';
import { FifaBanner } from '@/components/FifaBanner';
import { AcontecendoAgora } from '@/components/AcontecendoAgora';
import { CouponCarousel } from '@/components/CouponCarousel';
import { HojeNoBairro } from '@/components/HojeNoBairro';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800',
  'https://images.unsplash.com/photo-1534723452202-428aae1ad99d?q=80&w=800'
];

const getFallbackImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
};

const MiniPostCard: React.FC<{ post: CommunityPost; onNavigate: (view: string) => void; }> = ({ post, onNavigate }) => {
  const postImage = post.imageUrl || (post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : getFallbackImage(post.id));
  
  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'promotion': return <Tag className="w-2.5 h-2.5" />;
      case 'event': return <Calendar className="w-2.5 h-2.5" />;
      case 'alert': return <AlertCircle className="w-2.5 h-2.5" />;
      case 'recommendation': return <Award className="w-2.5 h-2.5" />;
      default: return <Hash className="w-2.5 h-2.5" />;
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'promotion': return 'Promoção';
      case 'event': return 'Evento';
      case 'alert': return 'Alerta';
      case 'recommendation': return 'Dica';
      default: return 'Radar';
    }
  };

  return (
    <div className="flex-shrink-0 w-32 snap-center p-1">
      <div 
        onClick={() => onNavigate('neighborhood_posts')}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer h-full transition-transform active:scale-[0.98]"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <img src={postImage} alt={post.content} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          <div className="absolute top-2 left-2">
             <span className="bg-[#1E5BFF] text-white text-[7px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-widest shadow-sm">
                {getPostTypeIcon(post.type)} {getPostTypeLabel(post.type)}
             </span>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-[10px] font-bold text-white drop-shadow-md truncate">{post.userName}</p>
          </div>
        </div>
        <div className="p-2.5 pt-2 flex-1">
            <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2 font-medium">
                {post.content}
            </p>
        </div>
      </div>
    </div>
  );
};

interface HomeFeedProps {
  onNavigate: (view: string, data?: any) => void;
  onSelectCategory: (category: Category) => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onStoreClick, 
  stores,
  user,
  userRole
}) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');
  const { currentNeighborhood } = useNeighborhood();
  
  const homeCategories = useMemo(() => {
    // Expandindo para compensar a remoção da seção de cima e evitar duplicidade
    const ids = ['cat-pharmacy', 'cat-market', 'cat-saude', 'cat-pets', 'cat-beauty', 'cat-services', 'cat-autos', 'cat-more'];
    return ids.map(id => CATEGORIES.find(c => c.id === id)).filter((c): c is Category => !!c);
  }, []);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-48">
      
      {userRole === 'lojista' && (
        <section className="px-4 py-4 bg-white dark:bg-gray-950">
           <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}

      {/* 1. RESUMO DO BAIRRO (CLIMA/TRÂNSITO) */}
      <HojeNoBairro />

      {/* 2. EXPLORE JPA — RESOLVA RÁPIDO (REPOSICIONADO E AMPLIADO) */}
      <section className="w-full bg-white dark:bg-gray-950 pt-6 pb-8 px-5 relative z-10">
        <div className="mb-5 px-1">
           <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Explore JPA</h2>
           <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Resolva Rápido</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {homeCategories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => onSelectCategory(cat)}
              className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[72px] active:scale-95 transition-all group"
            >
              <div className="w-16 h-16 rounded-[22px] bg-white dark:bg-gray-900 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-800 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                {React.cloneElement(cat.icon as any, { 
                  className: "w-7 h-7 text-[#1E5BFF]", 
                  strokeWidth: 2.5 
                })}
              </div>
              <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter text-center leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. CUPONS DO DIA */}
      <CouponCarousel onNavigate={onNavigate} />

      {/* 4. CARROSSEL PRINCIPAL */}
      <section className="bg-white dark:bg-gray-950 w-full mt-2">
        <HomeBannerCarousel onStoreClick={onStoreClick} onNavigate={onNavigate} />
      </section>

      {/* 5. ACONTECENDO AGORA */}
      <AcontecendoAgora onNavigate={onNavigate} />

      {/* 6. RADAR DO BAIRRO */}
      <section className="bg-white dark:bg-gray-950 py-6 mb-4 relative px-5">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF]">
                    <ShieldAlert size={18} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">Mural do Bairro</h2>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Radar de Jacarepaguá</p>
                </div>
            </div>
            <button onClick={() => onNavigate('neighborhood_posts')} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest hover:underline active:opacity-60">Ver feed completo</button>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar snap-x -mx-1 pb-2">
            {MOCK_COMMUNITY_POSTS.slice(0, 5).map((post) => (
                <MiniPostCard key={post.id} post={post} onNavigate={onNavigate} />
            ))}
        </div>
      </section>

      {/* 7. MISSÕES DO BAIRRO */}
      <section className="px-5 mb-10">
        <div className="bg-[#1E5BFF] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <Trophy className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest">Missões do Bairro</h3>
                            <p className="text-[8px] font-bold text-blue-100 uppercase tracking-[0.2em] opacity-80">Suba de nível no bairro</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-white text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">Dia 3/5</span>
                </div>

                <div className="space-y-4">
                    <p className="text-xs font-bold leading-relaxed text-blue-50">Acesse o app por 5 dias seguidos e libere seu <span className="text-yellow-300 underline">Selo de Morador Ativo</span> + benefícios extras.</p>
                    <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 relative">
                        <div className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 w-3/5 rounded-full transition-all duration-1000"></div>
                    </div>
                </div>

                <button 
                  onClick={() => onNavigate('weekly_reward_page')}
                  className="bg-white text-blue-600 font-black py-4 px-6 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-blue-50 active:scale-[0.98] transition-all"
                >
                  Ver recompensas desbloqueáveis <ArrowRight size={14} />
                </button>
            </div>
        </div>
      </section>

      {/* 8. EXPLORAR BAIRRO */}
      <div className="w-full bg-white dark:bg-gray-900 pt-1 pb-4">
        <div className="px-5">
          <SectionHeader icon={Compass} title="Explorar Bairro" subtitle="Tudo o que você precisa" onSeeMore={() => onNavigate('explore')} />
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-4">
            {['all', 'top_rated'].map((f) => (
              <button key={f} onClick={() => setListFilter(f as any)} className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>
                {f === 'all' ? 'Tudo' : 'Top'}
              </button>
            ))}
          </div>
          <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter as any} user={user} onNavigate={onNavigate} premiumOnly={false} />
        </div>
      </div>

      {/* 9. QUEM MOVIMENTA O BAIRRO */}
      <section className="px-5 pt-10 pb-20 mt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6 px-1">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shadow-sm">
                <Crown size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">Quem movimenta o bairro</h2>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Parceiros em Destaque</p>
              </div>
          </div>
          
          <LojasEServicosList 
            onStoreClick={onStoreClick} 
            activeFilter="all" 
            user={user} 
            onNavigate={onNavigate} 
            premiumOnly={true} 
          />
          
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center text-center">
              <p className="text-sm font-bold text-gray-400 mb-4">Sua loja também merece esse destaque?</p>
              <button 
                onClick={() => onNavigate('store_ads_module')}
                className="bg-white dark:bg-gray-800 text-[#1E5BFF] font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest border border-gray-100 dark:border-gray-700 shadow-sm active:scale-[0.98] transition-all"
              >
                  Anunciar como Parceiro
              </button>
          </div>
      </section>
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

const Calendar = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const Trophy = ({ size, className, fill }: { size?: number, className?: string, fill?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

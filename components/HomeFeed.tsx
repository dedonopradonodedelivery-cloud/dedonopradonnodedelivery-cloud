
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Users
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

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      
      {userRole === 'lojista' && (
        <section className="px-4 py-4 bg-white dark:bg-gray-950">
           <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}

      {/* CATEGORIAS */}
      <div className="w-full bg-white dark:bg-gray-950 pt-4 pb-0">
        <div className="flex overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
          <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all">
                <div className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 ${cat.color} border border-white/20`}>
                  <div className="flex-1 flex items-center justify-center w-full">{React.cloneElement(cat.icon as any, { className: "w-7 h-7 text-white drop-shadow-md", strokeWidth: 2.5 })}</div>
                  <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2"><span className="block w-full text-[9px] font-black text-white text-center uppercase tracking-tight">{cat.name}</span></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <HomeBannerCarousel onStoreClick={onStoreClick} />

      {/* 2. ONDE O BAIRRO CONVERSA */}
      <section className="px-5 py-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
              <Users size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">Onde o bairro conversa</h2>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">O que está rolando agora</p>
            </div>
          </div>
          <button onClick={() => onNavigate('community')} className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest">Ver tudo</button>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
            {MOCK_COMMUNITY_POSTS.slice(0, 4).map((post: CommunityPost) => (
                <div 
                    key={post.id} 
                    onClick={() => onNavigate('community')}
                    className="flex-shrink-0 w-44 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm active:scale-[0.98] transition-all"
                >
                    <div className="h-32 w-full overflow-hidden">
                        <img src={post.imageUrl} alt={post.userName} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                        <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-tighter truncate">{post.userName}</p>
                        <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium mt-0.5 line-clamp-1">{post.content}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>


      {/* LISTA EXPLORAR */}
      <div className="w-full bg-white dark:bg-gray-900 pt-1 pb-10">
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

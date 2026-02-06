import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Store, Category, CommunityPost, ServiceRequest, ServiceUrgency, Classified, HappeningNowPost } from '../types';
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
  Clock,
  Megaphone,
  Calendar,
  Tag
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_COMMUNITY_POSTS, MOCK_CLASSIFIEDS, MOCK_HAPPENING_NOW } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { LaunchOfferBanner } from './LaunchOfferBanner';
import { HomeBannerCarousel } from './HomeBannerCarousel';
import { FifaBanner } from './FifaBanner';

const HappeningNowCard: React.FC<{ item: HappeningNowPost; onNavigate: (v: string) => void }> = ({ item, onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const diff = new Date(item.expiresAt).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft('Expirado');
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`ativo por mais ${hours > 0 ? `${hours}h ` : ''}${mins}min`);
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [item.expiresAt]);

  const typeConfig = {
    promo: { label: 'Promoção', icon: Tag, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    event: { label: 'Evento', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    notice: { label: 'Aviso', icon: Megaphone, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' }
  };

  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <div className="flex-shrink-0 w-64 snap-center p-1.5">
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-full active:scale-[0.98] transition-transform">
        {item.imageUrl && (
          <div className="h-24 w-full overflow-hidden">
            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-4 flex flex-col flex-1">
          <div className={`w-fit px-2 py-0.5 rounded-lg ${config.bg} flex items-center gap-1 mb-2`}>
            <Icon size={10} className={config.color} />
            <span className={`text-[8px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>
          </div>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-2 flex-1">
            {item.title}
          </h3>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-gray-700">
            <div className="flex items-center gap-1 text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
              <Clock size={10} />
              {timeLeft}
            </div>
            <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
              Conferir <ChevronRight size={10} strokeWidth={3} />
            </button>
          </div>
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

const MiniPostCard: React.FC<{ post: CommunityPost; onNavigate: (view: string) => void; }> = ({ post, onNavigate }) => {
  return (
    <div className="flex-shrink-0 w-28 snap-center p-1">
      <div 
        onClick={() => onNavigate('neighborhood_posts')}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer h-full"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <img src={post.imageUrl || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800"} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-1 left-1.5 right-1">
            <p className="text-[9px] font-bold text-white drop-shadow-md truncate">{post.userName}</p>
          </div>
        </div>
        <div className="p-2 pt-1.5 flex-1">
            <p className="text-[9px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2 font-medium">
                {post.content}
            </p>
        </div>
      </div>
    </div>
  );
};

const MiniClassifiedCard: React.FC<{ item: Classified; onNavigate: (view: string) => void; }> = ({ item, onNavigate }) => {
  return (
    <div className="flex-shrink-0 w-40 snap-center p-1.5">
      <div 
        onClick={() => onNavigate('classifieds')}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer h-full"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <img src={item.imageUrl || "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600"} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          {item.price && (
             <div className="absolute bottom-2 right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                {item.price}
             </div>
          )}
        </div>
        <div className="p-3 flex flex-col flex-1 justify-between">
            <h3 className="text-xs font-bold text-gray-800 dark:text-white leading-tight line-clamp-2 mb-1">
                {item.title}
            </h3>
        </div>
      </div>
    </div>
  );
};

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
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);

  const itemsPerPage = 8;
  const orderedCategories = useMemo(() => {
    const firstPageIds = ['cat-saude', 'cat-fashion', 'cat-pets', 'cat-pro', 'cat-beauty', 'cat-autos', 'cat-sports', 'cat-edu'];
    const firstPage = firstPageIds.map(id => CATEGORIES.find(c => c.id === id)).filter((c): c is Category => !!c);
    const remaining = CATEGORIES.filter(c => !firstPageIds.includes(c.id));
    return [...firstPage, ...remaining];
  }, []);

  const categoryPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < orderedCategories.length; i += itemsPerPage) {
      pages.push(orderedCategories.slice(i, i + itemsPerPage));
    }
    return pages;
  }, [orderedCategories]);

  const activeHappenings = useMemo(() => {
    return MOCK_HAPPENING_NOW.filter(h => new Date(h.expiresAt).getTime() > Date.now() && h.status === 'active');
  }, []);

  const [wizardStep, setWizardStep] = useState(0);

  const handleScroll = () => {
    if (!categoryScrollRef.current) return;
    const scrollLeft = categoryScrollRef.current.scrollLeft;
    const width = categoryScrollRef.current.clientWidth;
    setCurrentCategoryPage(Math.round(scrollLeft / width));
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      
      {userRole === 'lojista' && (
        <section className="px-4 py-4 bg-white dark:bg-gray-950">
           <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}

      <section className="w-full bg-white dark:bg-gray-950 pt-4 pb-0 relative z-10">
        <div ref={categoryScrollRef} className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth" onScroll={handleScroll}>
          {categoryPages.map((pageCategories, pageIndex) => (
            <div key={pageIndex} className="min-w-full px-4 pb-2 snap-center">
              <div className="grid grid-cols-4 grid-rows-2 gap-x-2 gap-y-4">
                {pageCategories.map((cat, index) => (
                  <button key={`${cat.id}-${pageIndex}-${index}`} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all w-full">
                    <div className={`w-full max-w-[84px] aspect-square rounded-[25px] shadow-sm flex flex-col items-center justify-between p-2 ${cat.color} border border-white/20`}>
                      <div className="flex-1 flex items-center justify-center w-full">{React.cloneElement(cat.icon as any, { className: "w-6 h-6 text-white drop-shadow-md", strokeWidth: 2.5 })}</div>
                      <div className="w-full bg-black/10 backdrop-blur-[2px] py-0.5 rounded-b-[20px] -mx-2 -mb-2">
                        <span className="block w-full text-[8px] font-black text-white text-center uppercase tracking-tight leading-none py-0.5 truncate px-1">{cat.name}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1.5 pb-6 pt-2">
          {categoryPages.map((_, idx) => (
            <div key={idx} className={`rounded-full transition-all duration-300 ${idx === currentCategoryPage ? 'bg-gray-800 dark:bg-white w-1.5 h-1.5' : 'bg-gray-300 dark:bg-gray-700 w-1.5 h-1.5'}`} />
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-950 w-full">
        <HomeBannerCarousel onStoreClick={onStoreClick} onNavigate={onNavigate} />
      </section>

      {/* BLOCO: ACONTECENDO AGORA */}
      {activeHappenings.length > 0 && (
        <section className="bg-white dark:bg-gray-950 pt-2 pb-8 relative px-5 animate-in slide-in-from-bottom duration-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 leading-tight">
                Acontecendo agora
                <div className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </div>
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Promoções e eventos em tempo real</p>
            </div>
            <button 
              onClick={() => onNavigate('happening_now_form')}
              className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-blue-600 active:scale-90 transition-all"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar snap-x -mx-1.5">
            {activeHappenings.map(item => (
              <HappeningNowCard key={item.id} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-white dark:bg-gray-950 pt-2 pb-6 relative px-5">
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">JPA Conversa<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div></h2>
            <button onClick={() => onNavigate('neighborhood_posts')} className="text-xs font-bold text-blue-500">Ver tudo</button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar snap-x -mx-1 pb-2">
            {MOCK_COMMUNITY_POSTS.slice(0, 5).map((post) => (
                <MiniPostCard key={post.id} post={post} onNavigate={onNavigate} />
            ))}
        </div>
      </section>

      <section className="px-5 mb-6">
        <button onClick={() => onNavigate('weekly_reward_page')} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 flex items-center justify-between shadow-lg active:scale-[0.98] transition-all border border-white/10">
           <div className="flex items-center gap-3">
               <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"><Ticket className="text-white" size={20} /></div>
               <div className="text-left">
                 <p className="text-white font-black text-sm uppercase tracking-wide">Cupons Disponíveis</p>
                 <p className="text-emerald-100 text-[10px] font-medium opacity-90">Resgate descontos exclusivos no bairro</p>
               </div>
           </div>
           <ChevronRight className="text-white" size={16} />
        </button>
      </section>

      <section className="px-5 mb-8 bg-white dark:bg-gray-950">
        <FifaBanner onClick={() => setWizardStep(1)} />
      </section>

      <div className="w-full bg-white dark:bg-gray-900 pt-1 pb-10">
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
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void }> = ({ icon: Icon, title, subtitle, onSeeMore }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white shadow-sm"><Icon size={18} strokeWidth={2.5} /></div>
      <div>
        <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">{title}</h2>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{subtitle}</p>
      </div>
    </div>
    <button onClick={onSeeMore} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest hover:underline active:opacity-60">Ver mais</button>
  </div>
);

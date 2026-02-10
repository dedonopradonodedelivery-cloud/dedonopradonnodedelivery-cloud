
import React, { useState, useMemo } from 'react';
import { Store, Category, Classified } from '@/types';
import { 
  Compass, 
  Plus, 
  MapPin, 
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_CLASSIFIEDS } from '../constants';
import { LaunchOfferBanner } from '@/components/LaunchOfferBanner';
import { HomeBannerCarousel } from '@/components/HomeBannerCarousel';
import { FifaBanner } from '@/components/FifaBanner';
import { CouponCarousel } from '@/components/CouponCarousel';

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

const MiniClassifiedCard: React.FC<{ item: Classified; onNavigate: (view: string) => void; }> = ({ item, onNavigate }) => {
  const itemImage = item.imageUrl || getFallbackImage(item.id);
  return (
    <div className="flex-shrink-0 w-40 snap-center p-1.5">
      <div onClick={() => onNavigate('classifieds')} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 flex flex-col h-full cursor-pointer">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <img src={itemImage} alt={item.title} className="w-full h-full object-cover" />
          {item.price && (
             <div className="absolute bottom-2 right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-sm">{item.price}</div>
          )}
        </div>
        <div className="p-3 flex flex-col flex-1 justify-between">
            <h3 className="text-xs font-bold text-gray-800 dark:text-white leading-tight line-clamp-2 mb-1">{item.title}</h3>
            <p className="text-[9px] text-gray-400 font-medium uppercase truncate flex items-center gap-1"><MapPin size={8} /> {item.neighborhood}</p>
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

export const HomeFeed: React.FC<HomeFeedProps> = ({ onNavigate, onSelectCategory, onStoreClick, stores, user, userRole }) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');

  const homeCategories = useMemo(() => {
    // Saúde, Moda, Pets, Beleza, Comida
    const mainIds = ['cat-saude', 'cat-fashion', 'cat-pets', 'cat-beauty', 'cat-comida'];
    return mainIds.map(id => CATEGORIES.find(c => c.id === id)).filter(Boolean) as Category[];
  }, []);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      
      {userRole === 'lojista' && (
        <section className="px-4 py-4 w-full overflow-hidden">
           <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}

      {/* SEÇÃO DE CATEGORIAS */}
      <section className="w-full bg-white dark:bg-gray-950 pt-6 pb-2 relative z-10 px-4">
        <div className="flex items-center justify-between gap-1.5">
          {homeCategories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => onSelectCategory(cat)} 
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-all w-[15%]"
            >
              <div className={`w-full aspect-square rounded-[18px] shadow-sm flex items-center justify-center bg-[#1E5BFF] border border-white/20 transition-transform`}>
                {React.cloneElement(cat.icon as any, { 
                  className: "w-5 h-5 text-white drop-shadow-sm", 
                  strokeWidth: 2.5 
                })}
              </div>
              <span className="text-[8px] font-black text-gray-500 dark:text-gray-400 text-center uppercase tracking-tighter leading-tight truncate w-full">
                {cat.name}
              </span>
            </button>
          ))}

          <button 
            onClick={() => onNavigate('all_categories')} 
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-all w-[15%]"
          >
            <div className="w-full aspect-square rounded-[18px] shadow-sm flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <Plus className="w-6 h-6 text-gray-400 dark:text-gray-500" strokeWidth={3} />
            </div>
            <span className="text-[8px] font-black text-[#1E5BFF] dark:text-blue-400 text-center uppercase tracking-tighter leading-tight">
              + Mais
            </span>
          </button>
        </div>
      </section>

      <section className="w-full">
        <HomeBannerCarousel onStoreClick={onStoreClick} onNavigate={onNavigate} />
      </section>

      <CouponCarousel onNavigate={onNavigate} />

      <section className="px-4 mb-8 mt-4 w-full overflow-hidden">
        <FifaBanner onClick={() => onNavigate('services_landing')} />
      </section>

      <section className="bg-white dark:bg-gray-950 pb-8 px-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Classificados</h2>
            <button onClick={() => onNavigate('classifieds')} className="text-xs font-bold text-blue-500">Ver todos</button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar snap-x -mx-1.5">
            {MOCK_CLASSIFIEDS.slice(0, 5).map((item) => (<MiniClassifiedCard key={item.id} item={item} onNavigate={onNavigate} />))}
        </div>
      </section>

      <div className="w-full bg-white dark:bg-gray-900 pt-1 pb-10 px-4 overflow-hidden border-t border-gray-50 dark:border-gray-900 mt-4">
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

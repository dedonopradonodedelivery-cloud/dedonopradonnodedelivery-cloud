import React, { useState, useRef } from 'react';
import { Store, Category, EditorialCollection } from '../types';
import { SpinWheelView } from './SpinWheelView';
import { LojasEServicosList } from './LojasEServicosList';
import { SearchStores } from './SearchStores';
import { GeminiAssistant } from './GeminiAssistant';
import { Zap } from 'lucide-react';

interface HomeFeedProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: Category) => void;
  onSelectCollection: (collection: EditorialCollection) => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  searchTerm: string;
  user: any;
  userRole: 'cliente' | 'lojista' | null;
  onSpinWin: (reward: any) => void;
  onRequireLogin: () => void;
}

const MINI_BANNERS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
    title: 'Festival Gastronômico',
    subtitle: 'Os melhores sabores da Freguesia com descontos especiais.',
    action: () => {},
    theme: 'dark'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
    title: 'Ofertas da Semana',
    subtitle: 'Confira as promoções imperdíveis nos mercados locais.',
    action: () => {},
    theme: 'dark'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=800&auto=format&fit=crop',
    title: 'Serviços para sua Casa',
    subtitle: 'Encontre profissionais qualificados perto de você.',
    action: () => {},
    theme: 'dark'
  }
];

export const HomeFeed: React.FC<HomeFeedProps> = ({
  onNavigate,
  onSelectCategory,
  onSelectCollection,
  onStoreClick,
  stores,
  searchTerm,
  user,
  userRole,
  onSpinWin,
  onRequireLogin
}) => {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerScrollRef = useRef<HTMLDivElement>(null);

  const handleBannerScroll = () => {
    if (bannerScrollRef.current) {
      const scrollLeft = bannerScrollRef.current.scrollLeft;
      const width = bannerScrollRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setActiveBannerIndex(index);
    }
  };

  if (searchTerm) {
    return <SearchStores onStoreClick={onStoreClick} />;
  }

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      
      {/* Banner Carousel */}
      <div className="w-full relative group mt-0">
         <div 
            ref={bannerScrollRef}
            onScroll={handleBannerScroll}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full"
         >
            {MINI_BANNERS.map((banner) => {
                const heightClass = 'h-[35vh] min-h-[260px] max-h-[400px]';
                const gradientClass = "bg-gradient-to-t from-black/90 via-black/40 to-transparent";

                return (
                    <div key={banner.id} onClick={() => banner.action && banner.action()} className="min-w-full snap-center cursor-pointer relative px-4">
                        <div className={`w-full ${heightClass} bg-gray-200 relative overflow-hidden rounded-[24px] shadow-md`}>
                        
                        <div className="absolute inset-0 z-0">
                            <img src={banner.image} className="w-full h-full object-cover" alt="" />
                            <div className={`absolute inset-0 ${gradientClass}`} />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 z-10 flex flex-col justify-end h-full">
                            <h3 className="text-white font-bold text-3xl leading-tight mb-2 drop-shadow-md w-[90%]">{banner.title}</h3>
                            <p className="text-white/90 text-sm font-medium line-clamp-2 w-[90%] opacity-90">{banner.subtitle}</p>
                        </div>
                        </div>
                    </div>
                );
            })}
         </div>

         {/* Carousel Indicators */}
         <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
            {MINI_BANNERS.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                        idx === activeBannerIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                    }`}
                />
            ))}
         </div>
      </div>

      <div className="px-4 mt-6 space-y-8">
        
        {/* Spin Wheel Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-1 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <SpinWheelView 
                userId={user?.id || null} 
                userRole={userRole}
                onWin={onSpinWin}
                onRequireLogin={onRequireLogin}
                onViewHistory={() => onNavigate('prize_history')}
            />
        </div>

        {/* Lojas List */}
        <LojasEServicosList 
            onStoreClick={onStoreClick}
            onViewAll={() => onNavigate('explore')}
            user={user}
        />

      </div>

      {/* Gemini Assistant FAB */}
      <GeminiAssistant />
    </div>
  );
};
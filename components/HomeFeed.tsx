import React, { useRef, useState } from 'react';
import { Store, Category, EditorialCollection } from '../types';
import { LojasEServicosList } from './LojasEServicosList';
import { SpinWheelView } from './SpinWheelView';
import { GeminiAssistant } from './GeminiAssistant';

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

export const HomeFeed: React.FC<HomeFeedProps> = ({
  onNavigate,
  onStoreClick,
  user,
  userRole,
  onSpinWin,
  onRequireLogin
}) => {
  const bannerScrollRef = useRef<HTMLDivElement>(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const MINI_BANNERS = [
    {
      id: 1,
      title: "Ofertas do Dia",
      subtitle: "Descontos imperdíveis na Freguesia",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop",
      action: () => onNavigate('marketplace')
    },
    {
      id: 2,
      title: "Cashback Turbinado",
      subtitle: "Ganhe até 15% de volta hoje",
      image: "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?q=80&w=800&auto=format&fit=crop",
      action: () => onNavigate('cashback')
    },
    {
        id: 3,
        title: "Serviços Express",
        subtitle: "Encontre profissionais rápido",
        image: "https://images.unsplash.com/photo-1581578731117-104f2a412c54?q=80&w=800&auto=format&fit=crop",
        action: () => onNavigate('services')
    }
  ];

  const handleBannerScroll = () => {
    if (bannerScrollRef.current) {
      const scrollLeft = bannerScrollRef.current.scrollLeft;
      const width = bannerScrollRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setActiveBannerIndex(index);
    }
  };

  return (
    <div className="pb-24">
        <div className="w-full relative group mt-0">
             
             <div 
                ref={bannerScrollRef}
                onScroll={handleBannerScroll}
                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full"
             >
                {MINI_BANNERS.map((banner) => {
                    const heightClass = 'h-[35vh] min-h-[260px] max-h-[400px]';
                    let gradientClass = "bg-gradient-to-t from-black/90 via-black/40 to-transparent";

                    return (
                        <div key={banner.id} onClick={banner.action} className="min-w-full snap-center cursor-pointer relative">
                            <div className={`w-full ${heightClass} bg-gray-200 relative overflow-hidden rounded-b-[24px]`}>
                            
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

        {userRole !== 'lojista' && (
            <div className="px-4 mt-6">
                <SpinWheelView 
                    userId={user?.id}
                    userRole={userRole} 
                    onWin={onSpinWin}
                    onRequireLogin={onRequireLogin}
                    onViewHistory={() => onNavigate('prize_history')}
                />
            </div>
        )}

        <div className="px-4 mt-6">
            <LojasEServicosList 
                onStoreClick={onStoreClick} 
                onViewAll={() => onNavigate('explore')}
                activeFilter="all"
                user={user}
            />
        </div>

        <GeminiAssistant />
    </div>
  );
};

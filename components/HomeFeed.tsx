
import React, { useState, useEffect, useRef } from 'react';
import { AdType, Category, Store, EditorialCollection } from '../types';
import { 
  ChevronRight, 
  Coins, 
  Wrench, 
  Loader2,
  AlertCircle,
  ArrowRight,
  Filter,
  Percent,
  Star,
  X,
  MapPin,
  Store as StoreIcon,
  Compass,
  Wallet,
  Users,
  Search
} from 'lucide-react';
import { QuoteRequestModal } from './QuoteRequestModal';
import { supabase } from '../lib/supabaseClient';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { SpinWheelView } from './SpinWheelView';
import { getStoreLogo } from '../utils/mockLogos';

interface HomeFeedProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: Category) => void;
  onSelectCollection: (collection: EditorialCollection) => void;
  onStoreClick?: (store: Store) => void;
  searchTerm?: string;
  stores: Store[];
  user: User | null;
  userRole?: 'cliente' | 'lojista' | null;
  onSpinWin: (reward: any) => void;
  onRequireLogin: () => void;
}

const TOP_SEARCHED = [
  { id: 1, title: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format=fit=crop" },
  { id: 3, title: "Salão de beleza", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format=fit=crop" },
  { id: 4, title: "Veterinário", image: "https://images.unsplash.com/photo-1553688738-a278b9f063e0?q=80&w=400&auto=format=fit=crop" },
  { id: 5, title: "Mecânica", image: "https://images.unsplash.com/photo-1530046339160-ce3e41600f2e?q=80&w=400&auto=format=fit=crop" }
];

const EDITORIAL_THEMES: EditorialCollection[] = [
  { id: 'coffee', title: 'Melhores Cafés', subtitle: '', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format=fit=crop', keywords: ['café', 'padaria', 'confeitaria', 'bistrô'] },
  { id: 'barber', title: 'Corte de Confiança', subtitle: '', image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=600&auto=format=fit=crop', keywords: ['barbearia', 'cabeleireiro', 'salão', 'cortes'] },
  { id: 'sweets', title: 'Docerias Amadas', subtitle: '', image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?q=80&w=600&auto=format=fit=crop', keywords: ['doce', 'bolo', 'torta', 'sorvete', 'açaí'] },
  { id: 'top-rated', title: 'Os Top Avaliados', subtitle: '', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format=fit=crop', keywords: [] },
  { id: 'party', title: 'Festas', subtitle: '', image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af38?q=80&w=600&auto=format=fit=crop', keywords: ['festa', 'decoração', 'buffet'] },
  { id: 'fashion', title: 'Moda', subtitle: '', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600&auto=format=fit=crop', keywords: ['roupa', 'moda', 'boutique'] },
];

const CASHBACK_HIGHLIGHTS = [
  { id: 'cb1', name: 'Mundial', category: 'Mercado', cashback: 2, logoUrl: getStoreLogo(0) },
  { id: 'cb2', name: 'Drogaria Raia', category: 'Farmácia', cashback: 5, logoUrl: getStoreLogo(6) },
  { id: 'cb3', name: 'Petz', category: 'Pets', cashback: 8, logoUrl: getStoreLogo(5) },
  { id: 'cb4', name: 'Smart Fit', category: 'Academia', cashback: 10, logoUrl: getStoreLogo(7) },
  { id: 'cb5', name: 'Rei do Mate', category: 'Lanches', cashback: 15, logoUrl: getStoreLogo(8) },
];

// Modal da Roleta (bottom sheet)
const SpinWheelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userRole: 'cliente' | 'lojista' | null;
  onWin: (reward: any) => void;
  onRequireLogin: () => void;
  onViewHistory: () => void;
}> = ({ isOpen, onClose, userId, userRole, onWin, onRequireLogin, onViewHistory }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-transparent w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 z-50">
           <button 
                onClick={onClose} 
                className="p-2 text-gray-200 hover:text-white bg-black/30 backdrop-blur-sm rounded-full"
                aria-label="Fechar roleta"
            >
              <X className="w-5 h-5" />
            </button>
        </div>
        
        <div className="animate-in slide-in-from-bottom duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <SpinWheelView 
              userId={userId}
              userRole={userRole}
              onWin={onWin}
              onRequireLogin={onRequireLogin}
              onViewHistory={onViewHistory}
            />
        </div>
      </div>
    </div>
  );
};

export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onSelectCollection,
  onStoreClick, 
  searchTerm: externalSearchTerm,
  stores,
  user,
  userRole,
  onSpinWin,
  onRequireLogin
}) => {
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const activeSearchTerm = externalSearchTerm || '';
  
  const [searchResults, setSearchResults] = useState<Store[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bannerScrollRef = useRef<HTMLDivElement>(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedQuoteNiche, setSelectedQuoteNiche] = useState('');

  const [listFilter, setListFilter] = useState<'all' | 'cashback' | 'top_rated' | 'open_now'>('all');

  const [hasSpun, setHasSpun] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasSpun(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!activeSearchTerm.trim()) {
        setSearchResults([]); setHasSearched(false); setIsSearching(false); return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
        if (!supabase) { setIsSearching(false); return; }
        try {
            const { data, error } = await supabase.from('businesses').select('*')
                .or(`name.ilike.%${activeSearchTerm}%,category.ilike.%${activeSearchTerm}%,subCategory.ilike.%${activeSearchTerm}%,tags.ilike.%${activeSearchTerm}%`)
                .limit(20);
            if (error) throw error;
            const mappedResults: Store[] = (data || []).map((item: any) => ({
                id: item.id, name: item.name, category: item.category, subcategory: item.subCategory,
                logoUrl: item.logoUrl || getStoreLogo(item.name.length), // Use new logo logic
                rating: item.rating || 0,
                description: item.description || '', distance: 'Localizado', adType: AdType.ORGANIC, reviewsCount: 0,
            }));
            setSearchResults(mappedResults);
            setHasSearched(true);
        } catch (err) {
            console.error('Error in HomeFeed search:', err); setSearchResults([]);
        } finally { setIsSearching(false); }
    }, 400);

    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [activeSearchTerm]);

  const MINI_BANNERS = [
    { 
      id: 'discovery-findings',
      title: "Descubra achados da Freguesia.",
      subtitle: "Promoções, serviços e novidades.",
      icon: <Search className="w-8 h-8 text-white" />,
      image: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=800&auto=format=fit=crop",
      action: () => onNavigate('explore'),
      cta: "Descobrir",
      theme: 'blue-discovery'
    },
    { 
      id: 'community-connect', 
      title: "Conectando empreendedores.", 
      subtitle: "Uma rede que fortalece o bairro.", 
      icon: <Users className="w-8 h-8 text-white" />, 
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format=fit=crop", 
      action: () => onNavigate('freguesia_connect_public'), 
      cta: "Saiba mais",
      theme: 'blue-royal'
    },
    { 
      id: 'merchant-claim', 
      title: "Tem um negócio aqui?", 
      subtitle: "Cadastre sua loja na Localizei.", 
      icon: <StoreIcon className="w-8 h-8 text-white" />, 
      image: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?q=80&w=800&auto=format=fit=crop", 
      action: () => onNavigate('business_registration'), 
      cta: "Cadastrar",
      theme: 'blue-dark'
    },
    { 
      id: 'freguesia-hub', 
      title: "Tudo o que você precisa.", 
      subtitle: "Comércios, serviços e vantagens.", 
      icon: <MapPin className="w-8 h-8 text-white" />, 
      image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format=fit=crop", 
      action: () => onNavigate('explore'), 
      cta: "Conhecer",
      theme: 'blue-primary'
    },
    { 
      id: 'cashback-rewards', 
      title: "Ganhe cashback.", 
      subtitle: "Receba parte do valor de volta.", 
      icon: <Wallet className="w-8 h-8 text-white" />, 
      image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=800&auto=format=fit=crop", 
      action: () => onNavigate('cashback_info'), 
      cta: "Começar",
      theme: 'green'
    },
    { 
      id: 'services', 
      title: "Peça um Orçamento Grátis", 
      subtitle: "Receba até 5 propostas.", 
      icon: <Wrench className="w-8 h-8 text-white" />, 
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format=fit=crop", 
      action: () => onNavigate('services'), 
      cta: "Orçamento",
      theme: 'default'
    }
  ];

  const handleBannerScroll = () => {
    if (bannerScrollRef.current) {
        const { scrollLeft, clientWidth } = bannerScrollRef.current;
        // Simple calculation to find the index of the centered element
        const newIndex = Math.round(scrollLeft / clientWidth);
        setActiveBannerIndex(newIndex);
    }
  };

  const handleSpinWheelClick = () => {
    if (user) {
      setIsSpinWheelOpen(true);
    } else {
      onRequireLogin();
    }
  };

  const handleSpinWin = (reward: any) => {
    setIsSpinWheelOpen(false);
    onSpinWin(reward);
  };
  
  return (
    <div className="flex flex-col gap-4 mt-4 pb-24 bg-gray-50 dark:bg-gray-900 w-full max-w-md mx-auto !pt-0 animate-in fade-in duration-500">
      <style>{`
        @keyframes wheel-spin-once {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(1800deg); }
        }
        .spin-wheel-animate {
          animation: wheel-spin-once 5s ease-out forwards;
        }
      `}</style>
      
      {activeSearchTerm ? (
        <div className="px-5 mt-2 min-h-[50vh]">
             <div className="flex items-center gap-2 mb-4">
                {isSearching && <Loader2 className="w-5 h-5 animate-spin text-primary-500" />}
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    {isSearching ? 'Buscando...' : `Resultados para "${activeSearchTerm}"`}
                </h3>
             </div>
             {!isSearching && hasSearched && searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4"><AlertCircle className="w-8 h-8 text-gray-400" /></div>
                    <h4 className="text-gray-900 dark:text-white font-bold mb-1">Nenhum resultado encontrado</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">Tente uma categoria ou termo diferente.</p>
                </div>
             ) : (
                <div className="flex flex-col gap-3">
                    {searchResults.map((store, index) => (
                    <div key={`${store.id}-${index}`} onClick={() => onStoreClick && onStoreClick(store)} className="bg-white dark:bg-gray-800 rounded-xl p-2.5 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 hover:shadow-md transition-all cursor-pointer">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                          <img src={store.logoUrl || getStoreLogo(store.name.length)} alt={store.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="font-bold text-gray-800 dark:text-white line-clamp-1 text-sm">{store.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-md font-medium">{store.category}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 self-center" />
                    </div>
                    ))}
                </div>
             )}
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full mt-2">
            
            <div className="px-5 w-full">
              <div
                onClick={handleSpinWheelClick}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200/60 dark:border-gray-600 shadow-md shadow-blue-100/50 flex items-center px-2 py-3 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-xl -mr-6 -mt-6 pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/3 w-16 h-16 bg-indigo-400/20 rounded-full blur-lg pointer-events-none"></div>
                
                <div className="relative z-10 flex-shrink-0 mr-2">
                  <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50 relative ${hasSpun ? 'spin-wheel-animate' : ''}`}>
                    <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="15" fill="white" stroke="#FFE0B2" strokeWidth="1" />
                        <path d="M16 16 L16 1 A15 15 0 0 1 26.6 5.4 Z" fill="#FF5252" /> 
                        <path d="M16 16 L26.6 5.4 A15 15 0 0 1 31 16 Z" fill="#FFD740" />
                        <path d="M16 16 L31 16 A15 15 0 0 1 26.6 26.6 Z" fill="#448AFF" />
                        <path d="M16 16 L26.6 26.6 A15 15 0 0 1 16 31 Z" fill="#69F0AE" />
                        <path d="M16 16 L16 31 A15 15 0 0 1 5.4 26.6 Z" fill="#FF4081" />
                        <path d="M16 16 L5.4 26.6 A15 15 0 0 1 1 16 Z" fill="#E040FB" />
                        <path d="M16 16 L1 16 A15 15 0 0 1 5.4 5.4 Z" fill="#536DFE" />
                        <path d="M16 16 L5.4 5.4 A15 15 0 0 1 16 1 Z" fill="#FFAB40" />
                        <circle cx="16" cy="16" r="3" fill="white" stroke="#ECEFF1" strokeWidth="1" />
                        <circle cx="16" cy="16" r="1.5" fill="#37474F" />
                        <path d="M16 0 L18 4 H14 L16 0Z" fill="#D32F2F" stroke="white" strokeWidth="0.5" />
                    </svg>
                  </div>
                </div>
                
                <div className="relative z-10 flex-1 flex flex-col justify-center min-w-0 mr-1">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5 whitespace-nowrap">
                      Roleta Localizei
                    </span>
                    <span className="text-[11px] xs:text-[12px] sm:text-[13px] font-bold text-gray-900 dark:text-white leading-none whitespace-nowrap overflow-visible">
                      Ganhe prêmios todos os dias
                    </span>
                </div>

                <div className="relative z-10 flex-shrink-0 ml-1">
                    <button className="bg-gradient-to-r from-[#1E5BFF] to-[#1B54D9] text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-md shadow-blue-500/20 active:scale-95 transition-transform uppercase tracking-wide whitespace-nowrap">
                        Gire Agora
                    </button>
                </div>
              </div>
            </div>

            <div className="w-full relative group mt-0">
                 
                 <div 
                    ref={bannerScrollRef}
                    onScroll={handleBannerScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full"
                 >
                    {MINI_BANNERS.map((banner) => {
                        // Increased height to 35vh (approx 320-350px on modern phones)
                        const heightClass = 'h-[35vh] min-h-[260px] max-h-[400px]';
                        const theme = (banner as any).theme;
                        let gradientClass = "bg-gradient-to-t from-black/90 via-black/40 to-transparent";

                        return (
                            <div key={banner.id} onClick={banner.action} className="min-w-full snap-center cursor-pointer relative px-0">
                                <div className={`w-full ${heightClass} bg-gray-200 relative overflow-hidden rounded-[24px]`}>
                                
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

                 {/* Carousel Indicators - Overlay inside the image area at bottom */}
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

            <div className="pl-5 space-y-2.5 w-full">
                 <div className="flex items-center justify-between pr-5">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Achadinhos da Freguesia</h3>
                    <button 
                        onClick={() => onNavigate('marketplace')}
                        className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                    >
                        Ver mais
                    </button>
                 </div>
                 <div className="flex gap-3 overflow-x-auto pb-3 pr-5 no-scrollbar">
                    {EDITORIAL_THEMES.map((theme) => (
                       <div key={theme.id} className="min-w-[108px] w-[108px] h-[192px] rounded-2xl overflow-hidden relative cursor-pointer group active:scale-[0.98] transition-transform shadow-md" onClick={() => onSelectCollection(theme)}>
                          <img src={theme.image} alt={theme.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-center items-center p-3 text-center">
                             <h4 className="font-bold text-white text-base font-display leading-tight">{theme.title}</h4>
                          </div>
                       </div>
                    ))}
                 </div>
            </div>

            <div className="pl-5 space-y-2.5 w-full">
                 <div className="flex items-center justify-between pr-5">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Lojas com Cashback</h3>
                    <button 
                        onClick={() => onNavigate('explore')}
                        className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                    >
                        Ver todas
                    </button>
                 </div>
                 <div className="flex gap-3 overflow-x-auto pb-3 pr-5 no-scrollbar">
                    {CASHBACK_HIGHLIGHTS.map((store) => (
                       <div key={store.id} onClick={() => {
                           const mockStore: Store = {
                               id: store.id,
                               name: store.name,
                               category: store.category,
                               subcategory: store.category,
                               logoUrl: store.logoUrl,
                               rating: 4.5,
                               distance: '1.2km',
                               adType: AdType.ORGANIC,
                               description: 'Loja parceira com cashback.',
                               cashback: store.cashback
                           };
                           if (onStoreClick) onStoreClick(mockStore);
                       }} className="min-w-[140px] w-[140px] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group cursor-pointer active:scale-95 transition-transform">
                          <div className="h-24 w-full relative bg-gray-50 dark:bg-gray-700 flex items-center justify-center p-2">
                              <img src={store.logoUrl || getStoreLogo(store.name.length)} alt={store.name} className="w-full h-full object-contain rounded-lg" />
                              <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
                                <Coins className="w-3 h-3" />
                                {store.cashback}%
                              </div>
                          </div>
                          <div className="p-2.5 flex flex-col flex-1 justify-between">
                             <div>
                                <h4 className="font-bold text-gray-800 dark:text-white text-xs line-clamp-1">{store.name}</h4>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{store.category}</p>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
            </div>

            <div className="pl-5 space-y-2.5 w-full">
               <div className="flex items-center justify-between pr-5">
                   <h3 className="text-base font-semibold text-gray-900 dark:text-white">As lojas mais buscadas</h3>
                   <button 
                        onClick={() => onNavigate('explore')}
                        className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                    >
                        Ver mais
                    </button>
               </div>
               <div className="flex gap-3 overflow-x-auto pb-3 pr-5 no-scrollbar">
                  {TOP_SEARCHED.map((item) => (
                    <div key={item.id} className="min-w-[135px] w-[135px] h-[120px] rounded-xl overflow-hidden relative group cursor-pointer active:scale-95 transition-transform">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex flex-col justify-end">
                            <h4 className="text-white font-bold text-xs line-clamp-3">{item.title}</h4>
                        </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="px-5 w-full">
              <div 
                onClick={() => onNavigate('patrocinador_master')}
                className="w-full bg-[#1F2A44] rounded-2xl p-4 shadow-sm border border-transparent relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-inner flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1E5BFF]" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" fill="currentColor"/>
                        <path d="M8 8H16V10H10V11H15V13H10V14H16V16H8V8Z" fill="white"/>
                      </svg>
                   </div>

                   <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-0.5">Patrocinador Master</p>
                      <h3 className="text-white font-bold text-lg leading-tight truncate">Grupo Esquematiza</h3>
                      <p className="text-white text-xs mt-0.5 font-medium truncate">Transformando desafios em soluções seguras!</p>
                   </div>

                   <ChevronRight className="w-5 h-5 text-white opacity-80 group-hover:opacity-100 transition-colors" />
                </div>
              </div>
            </div>

            <div className="px-5 w-full -mb-2 mt-1">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-colors ${
                        listFilter === 'all'
                            ? 'bg-[#1E5BFF] text-white border-[#1E5BFF]'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => setListFilter('all')}
                    >
                        <Filter className="w-3 h-3" />
                        Todos
                    </button>
                    <button
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-colors ${
                        listFilter === 'cashback'
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => setListFilter('cashback')}
                    >
                        <Percent className="w-3 h-3" />
                        Cashback
                    </button>
                    <button
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-colors ${
                        listFilter === 'top_rated'
                            ? 'bg-[#1E5BFF] text-white border-[#1E5BFF]'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => setListFilter('top_rated')}
                    >
                        <Star className="w-3 h-3" />
                        Melhor avaliadas
                    </button>
                    <button
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-colors ${
                        listFilter === 'open_now'
                            ? 'bg-[#1E5BFF] text-white border-[#1E5BFF]'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => setListFilter('open_now')}
                    >
                        ⏱ Aberto agora
                    </button>
                </div>
            </div>

            <div className="px-5 pb-4 min-h-[300px] w-full">
                <LojasEServicosList 
                    onStoreClick={onStoreClick} 
                    onViewAll={() => onNavigate('explore')}
                    activeFilter={listFilter}
                    user={user}
                />
            </div>
        </div>
      )}

      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        categoryName={selectedQuoteNiche}
        onSuccess={() => onNavigate('service_success')}
      />

      <SpinWheelModal 
        isOpen={isSpinWheelOpen}
        onClose={() => setIsSpinWheelOpen(false)}
        userId={user?.id || null}
        userRole={userRole || null}
        onWin={handleSpinWin}
        onRequireLogin={onRequireLogin}
        onViewHistory={() => onNavigate('prize_history')}
      />
    </div>
  );
};

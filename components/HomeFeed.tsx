
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AdType, Category, Store, EditorialCollection } from '../types';
import { 
  ChevronRight, 
  Coins, 
  Loader2,
  AlertCircle,
  ArrowRight,
  Filter,
  Percent,
  Star,
  X,
  MapPin,
  Compass,
  Wallet,
  Users,
  Sparkles,
  TrendingUp,
  Flame,
  Trophy,
  Heart,
  Zap,
  ShoppingBag,
  Target,
  Clock,
  Calendar,
  CheckCircle2,
  Share2,
  Gift,
  Activity,
  Eye
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
  { id: 3, title: "Salão", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format=fit=crop" },
  { id: 4, title: "Veterinário", image: "https://images.unsplash.com/photo-1553688738-a278b9f063e0?q=80&w=400&auto=format=fit=crop" },
  { id: 5, title: "Mecânica", image: "https://images.unsplash.com/photo-1530046339160-ce3e41600f2e?q=80&w=400&auto=format=fit=crop" }
];

const EDITORIAL_THEMES: (EditorialCollection & { badge?: string; badgeColor?: string; icon?: React.ElementType })[] = [
  { 
    id: 'coffee', 
    title: 'Cafés', 
    subtitle: 'Pausa obrigatória', 
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format=fit=crop', 
    keywords: ['café', 'padaria', 'confeitaria', 'bistrô'],
    badge: 'Popular',
    badgeColor: 'bg-orange-500',
    icon: Flame
  },
  { 
    id: 'barber', 
    title: 'Barbearias', 
    subtitle: 'Estilo garantido', 
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=600&auto=format=fit=crop', 
    keywords: ['barbearia', 'cabeleireiro', 'salão', 'cortes'],
    badge: 'Trending',
    badgeColor: 'bg-purple-500',
    icon: TrendingUp
  },
  { 
    id: 'sweets', 
    title: 'Doces', 
    subtitle: 'Doçuras do bairro', 
    image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?q=80&w=600&auto=format=fit=crop', 
    keywords: ['doce', 'bolo', 'torta', 'sorvete', 'açaí'],
    badge: '4.9',
    badgeColor: 'bg-yellow-500',
    icon: Star
  },
  { 
    id: 'top-rated', 
    title: 'Elite', 
    subtitle: 'Os mais elogiados', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format=fit=crop', 
    keywords: [],
    badge: 'Top',
    badgeColor: 'bg-blue-500',
    icon: Trophy
  },
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
                className="p-2 text-gray-200 hover:text-white bg-black/30 backdrop-blur-sm rounded-full active:scale-95 transition-transform"
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

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedQuoteNiche, setSelectedQuoteNiche] = useState('');

  const [listFilter, setListFilter] = useState<'all' | 'cashback' | 'top_rated' | 'open_now'>('all');

  const [hasSpun, setHasSpun] = useState(false);
  
  // Daily Check-in State
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [streakCount, setStreakCount] = useState(2); // Mock streak start

  // Toast / Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Time-based Personalization (Shortened)
  const timeContext = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return { label: 'Café da Manhã', sub: 'Comece bem' };
    if (hour < 15) return { label: 'Almoço', sub: 'Fome?' };
    if (hour < 19) return { label: 'Lanche', sub: 'Pausa' };
    return { label: 'Jantar', sub: 'Delivery' };
  }, []);

  // 1) Dynamic Welcome Message Logic
  const welcomeMessage = useMemo(() => {
    const msgs = [
      "Bom te ver por aqui 👋",
      "Pronto para economizar hoje?",
      "O bairro tem novidades pra você",
      "Que bom ter você de volta 💙",
      "Descubra o melhor da Freguesia ✨"
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }, []);

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

  const showFeedback = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCheckIn = () => {
    setHasCheckedIn(true);
    setStreakCount(prev => prev + 1);
    // 3) Micro-feedback positivo
    showFeedback("Você está aproveitando bem 💙");
  };

  const handleInvite = () => {
    showFeedback("Boa escolha 👍 Convite simulado!");
  };
  
  return (
    <div className="flex flex-col gap-8 mt-4 pb-28 bg-gray-50 dark:bg-gray-900 w-full max-w-md mx-auto !pt-0 animate-in fade-in duration-500">
      <style>{`
        @keyframes wheel-spin-once {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(1800deg); }
        }
        .spin-wheel-animate {
          animation: wheel-spin-once 5s ease-out forwards;
        }
        @keyframes blob-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -15px) scale(1.05); }
        }
        @keyframes blob-float-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-10px, 10px) scale(1.1); }
        }
        .animate-blob {
          animation: blob-float 8s infinite ease-in-out;
        }
        .animate-blob-delay {
          animation: blob-float-reverse 10s infinite ease-in-out;
        }
        .animate-float-badge {
          animation: blob-float 6s infinite ease-in-out;
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
                    <div key={`${store.id}-${index}`} onClick={() => onStoreClick && onStoreClick(store)} className="bg-white dark:bg-gray-800 rounded-xl p-2.5 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]">
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
        <div className="flex flex-col gap-8 w-full mt-2">
            
            {/* 1) Dynamic Welcome Message */}
            <div className="px-5 -mb-2">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium font-display animate-in fade-in duration-700">
                {welcomeMessage}
              </p>
            </div>

            {/* --- NEW PREMIUM HERO SECTION --- */}
            <div className="px-5 w-full">
               <div className="w-full bg-gradient-to-br from-[#2D6DF6] via-[#2563EB] to-[#0F359E] rounded-[32px] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-blue-600/20 group transform transition-all active:scale-[0.99] hover:scale-[1.01] border border-white/10">
                  
                  {/* Dynamic Background Elements (Parallax-like) */}
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none mix-blend-overlay animate-blob"></div>
                  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-indigo-500/30 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none mix-blend-screen animate-blob-delay"></div>
                  
                  {/* Floating Cash Value Badge (Visual Promise) */}
                  <div className="absolute top-5 right-5 z-20 animate-float-badge cursor-default pointer-events-none sm:pointer-events-auto">
                    <div className="bg-white/20 backdrop-blur-lg border border-white/40 rounded-2xl p-2 pr-3 flex items-center gap-2 shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-500 group-hover:-translate-y-1">
                        <div className="bg-green-400 rounded-full w-8 h-8 flex items-center justify-center shadow-inner ring-2 ring-white/30">
                            <span className="font-bold text-green-900 text-xs">$</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase font-bold text-green-100 leading-none mb-0.5">Seu Saldo</span>
                            <span className="text-sm font-extrabold text-white leading-none tracking-tight">R$ 12,40</span>
                        </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col items-start pt-2">
                    {/* Top Badge */}
                    <div className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                        O Melhor do Bairro
                      </span>
                    </div>

                    {/* Headline with Soft Glow */}
                    <h1 className="text-[32px] leading-[1.1] font-display font-bold mb-3 drop-shadow-md tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-50 to-white animate-in fade-in slide-in-from-left-2 duration-700">
                      Explore e<br/>Economize.
                    </h1>

                    {/* Subtitle */}
                    <p className="text-blue-50 text-sm font-medium leading-relaxed mb-6 max-w-[85%] opacity-90">
                      O guia oficial de economia e lazer do seu bairro.
                    </p>

                    {/* Micro-signals (Value Props) */}
                    <div className="flex items-center gap-4 mb-8 w-full pr-10">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-sm flex-1 justify-center hover:bg-white/10 transition-colors">
                            <Wallet className="w-4 h-4 text-green-300 drop-shadow-sm" />
                            <span className="text-xs font-bold text-white">Cashback</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-sm flex-1 justify-center hover:bg-white/10 transition-colors">
                            <Sparkles className="w-4 h-4 text-yellow-300 drop-shadow-sm" />
                            <span className="text-xs font-bold text-white">Ofertas</span>
                        </div>
                    </div>

                    {/* Strong CTA with Smooth Transition */}
                    <button 
                      onClick={() => onNavigate('explore')}
                      className="w-full bg-white text-[#2D6DF6] text-sm font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-blue-900/10 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group/btn hover:bg-blue-50 hover:scale-[1.01] relative overflow-hidden"
                    >
                      <span className="relative z-10">Começar a explorar</span>
                      <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" strokeWidth={3} />
                    </button>
                  </div>
               </div>
            </div>

            {/* --- GAMIFIED DAILY CHECK-IN --- */}
            <div className="px-5 w-full">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    {/* Background Decorative Gradient */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity duration-500 ${hasCheckedIn ? 'opacity-100' : 'opacity-50'}`}></div>
                    
                    <div className="relative z-10">
                        {/* Header Flex */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {hasCheckedIn ? (
                                        <span className="text-green-600 flex items-center gap-1">
                                            Sequência Ativa <CheckCircle2 className="w-4 h-4" />
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            Sua Sequência <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                                        </span>
                                    )}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                                    {hasCheckedIn 
                                        ? "Continue assim! 🚀" 
                                        : "Marque presença. Ganhe recompensas."}
                                </p>
                            </div>
                            
                            {/* Streak Counter Badge */}
                            <div className="flex flex-col items-end">
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-2xl font-black leading-none ${hasCheckedIn ? 'text-green-500' : 'text-gray-800 dark:text-white'}`}>
                                        {streakCount}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Dias</span>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Progress Bar */}
                        <div className="flex justify-between items-center gap-1 mb-4">
                            {[...Array(7)].map((_, i) => {
                                const dayNum = i + 1;
                                const currentTarget = hasCheckedIn ? streakCount : streakCount + 1;
                                let status = 'future';
                                if (dayNum < currentTarget) status = 'completed';
                                else if (dayNum === currentTarget && !hasCheckedIn) status = 'active';
                                else if (dayNum === currentTarget && hasCheckedIn) status = 'just_completed';
                                
                                const isLast = i === 6;

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div className={`
                                            w-full h-1.5 rounded-full transition-all duration-500
                                            ${status === 'completed' || status === 'just_completed' ? 'bg-green-500' : ''}
                                            ${status === 'active' ? 'bg-orange-400 animate-pulse' : ''}
                                            ${status === 'future' ? 'bg-gray-100 dark:bg-gray-700' : ''}
                                        `}></div>
                                        {isLast && (
                                            <Gift className={`w-3 h-3 ${status.includes('completed') ? 'text-green-500' : 'text-gray-300'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Check-in Button (Hidden if done) */}
                        {!hasCheckedIn && (
                            <button 
                                onClick={handleCheckIn}
                                className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <Zap className="w-4 h-4 fill-current" />
                                Fazer Check-in
                            </button>
                        )}
                        
                        {hasCheckedIn && (
                            <div className="flex items-center justify-center gap-2 py-2 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/30">
                                <span className="text-xs font-bold text-green-700 dark:text-green-400">
                                    Volte amanhã!
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- PARA VOCÊ (PERSONALIZED) --- */}
            <div className="pl-5 space-y-3 w-full">
               <div className="mb-1 pr-5 flex justify-between items-end">
                   <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Para Você</h3>
                   </div>
               </div>
               
               <div className="flex gap-3 overflow-x-auto pb-2 pr-5 no-scrollbar snap-x">
                   {/* Card 1 */}
                   <div 
                        onClick={() => onNavigate('explore')}
                        className="snap-start min-w-[140px] p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-[110px] active:scale-95 transition-transform"
                   >
                        <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                            <Percent className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                                {timeContext.label}
                            </p>
                            <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">
                                Ofertas
                            </p>
                        </div>
                   </div>

                   {/* Card 2 */}
                   <div 
                        onClick={() => onNavigate('explore')}
                        className="snap-start min-w-[140px] p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-[110px] active:scale-95 transition-transform"
                   >
                        <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Perto</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">A &lt; 500m</p>
                        </div>
                   </div>

                   {/* Card 3 */}
                   <div 
                        onClick={() => onNavigate('explore')}
                        className="snap-start min-w-[140px] p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-[110px] active:scale-95 transition-transform"
                   >
                        <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                            <Compass className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Novidades</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">Para conhecer</p>
                        </div>
                   </div>
               </div>
            </div>

            {/* --- ORGULHO DA FREGUESIA --- */}
            <div className="px-5 w-full">
               <div className="relative bg-gradient-to-br from-[#F0F7FF] to-[#E6F0FF] dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-5 border border-blue-100 dark:border-gray-700 shadow-sm overflow-hidden active:scale-[0.99] transition-transform">
                  
                  <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                     <Heart className="w-24 h-24 text-blue-600 fill-blue-600" />
                  </div>

                  <div className="relative z-10">
                     <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wide mb-3">
                        <MapPin className="w-3 h-3" /> Projeto Local
                     </div>
                     
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">
                        Feito para a Freguesia 💙
                     </h3>
                     
                     <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed font-medium">
                        Fortaleça o comércio local e economize.
                     </p>

                     <button 
                        onClick={handleInvite}
                        className="w-full bg-white dark:bg-gray-700 border border-blue-100 dark:border-gray-600 text-blue-600 dark:text-blue-300 text-xs font-bold py-3 rounded-xl shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-600"
                     >
                        <Share2 className="w-3.5 h-3.5" />
                        Convidar vizinho
                     </button>
                  </div>
               </div>
            </div>

            {/* --- SPIN WHEEL CTA (ENHANCED) --- */}
            <div className="px-5 w-full">
              <div
                onClick={handleSpinWheelClick}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-white dark:from-gray-800 dark:to-gray-700 border border-indigo-100 dark:border-gray-600 shadow-sm flex items-center px-3 py-4 relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all duration-300"
              >
                <div className="relative z-10 flex-shrink-0 mr-3">
                  <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-indigo-100 dark:ring-gray-600 relative ${hasSpun ? 'spin-wheel-animate' : ''}`}>
                    <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="15" fill="white" stroke="#E0E7FF" strokeWidth="1" />
                        <path d="M16 16 L16 1 A15 15 0 0 1 26.6 5.4 Z" fill="#F43F5E" /> 
                        <path d="M16 16 L26.6 5.4 A15 15 0 0 1 31 16 Z" fill="#FBBF24" />
                        <path d="M16 16 L31 16 A15 15 0 0 1 26.6 26.6 Z" fill="#3B82F6" />
                        <path d="M16 16 L26.6 26.6 A15 15 0 0 1 16 31 Z" fill="#10B981" />
                        <path d="M16 16 L16 31 A15 15 0 0 1 5.4 26.6 Z" fill="#EC4899" />
                        <path d="M16 16 L5.4 26.6 A15 15 0 0 1 1 16 Z" fill="#A855F7" />
                        <path d="M16 16 L1 16 A15 15 0 0 1 5.4 5.4 Z" fill="#6366F1" />
                        <path d="M16 16 L5.4 5.4 A15 15 0 0 1 16 1 Z" fill="#F97316" />
                        <circle cx="16" cy="16" r="3" fill="white" stroke="#EEF2FF" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
                
                <div className="relative z-10 flex-1 flex flex-col justify-center min-w-0 mr-1">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5 whitespace-nowrap flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Prêmios diários
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                      Gire a Roleta
                    </span>
                </div>

                <div className="relative z-10 flex-shrink-0 ml-1">
                    <button className="bg-indigo-600 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-md shadow-indigo-200 dark:shadow-none active:scale-95 transition-transform uppercase tracking-wide whitespace-nowrap animate-pulse">
                        Jogar
                    </button>
                </div>
              </div>
            </div>

            {/* --- DESCUBRA (COLLECTIONS) --- */}
            <div className="pl-5 space-y-3 w-full">
                 <div className="flex items-center justify-between pr-5">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500 fill-purple-100" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Descubra</h3>
                    </div>
                    <button 
                        onClick={() => onNavigate('marketplace')}
                        className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-lg transition-colors active:scale-95"
                    >
                        Ver tudo
                    </button>
                 </div>
                 
                 <div className="flex gap-4 overflow-x-auto pb-4 pr-5 no-scrollbar snap-x snap-mandatory">
                    {EDITORIAL_THEMES.map((theme) => {
                       const Icon = theme.icon || Sparkles;
                       return (
                       <div key={theme.id} className="min-w-[140px] w-[140px] h-[200px] rounded-2xl overflow-hidden relative cursor-pointer group active:scale-[0.98] transition-transform shadow-lg shadow-black/5 snap-center" onClick={() => onSelectCollection(theme)}>
                          <img src={theme.image} alt={theme.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                          
                          {/* Social Proof Badge */}
                          {theme.badge && (
                              <div className={`absolute top-2 left-2 ${theme.badgeColor || 'bg-black/50'} backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm`}>
                                  <Icon className="w-3 h-3 text-white" />
                                  <span className="text-[9px] font-bold text-white uppercase tracking-wide">{theme.badge}</span>
                              </div>
                          )}

                          <div className="absolute bottom-0 left-0 p-3 w-full">
                             <h4 className="font-display font-bold text-white text-lg leading-tight drop-shadow-md mb-1">{theme.title}</h4>
                             <p className="text-[10px] text-gray-300 font-medium line-clamp-1">{theme.subtitle}</p>
                          </div>
                       </div>
                    )})}
                 </div>
            </div>

            {/* --- EM ALTA AGORA (DYNAMIC SOCIAL PROOF) --- */}
            <div className="pl-5 space-y-3 w-full">
                <div className="pr-5">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-orange-500" />
                            Em Alta Agora
                        </h3>
                        {/* Live Activity Badge */}
                        <span className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse border border-red-100 dark:border-red-900/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            AO VIVO
                        </span>
                    </div>
                    {/* Dynamic User Counter */}
                    <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300 font-bold">127 pessoas</span> explorando
                    </p>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-3 pr-5 no-scrollbar snap-x">
                    {/* Card 1 */}
                    <div 
                        onClick={() => onNavigate('explore')}
                        className="snap-start min-w-[150px] bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-100 dark:border-orange-800 rounded-2xl p-4 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform shadow-sm shadow-orange-100/50 dark:shadow-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-orange-900/40 flex items-center justify-center text-orange-500 mb-2 shadow-sm">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-orange-100 text-xs mb-0.5">Bombando</h4>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">8 locais cheios</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div 
                        onClick={() => onNavigate('explore')}
                        className="snap-start min-w-[150px] bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800 rounded-2xl p-4 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform shadow-sm shadow-green-100/50 dark:shadow-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-green-900/40 flex items-center justify-center text-green-500 mb-2 shadow-sm">
                            <Percent className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-green-100 text-xs mb-0.5">Super Cashback</h4>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">42 resgates hoje</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div 
                        onClick={() => onNavigate('explore')}
                        className="snap-start min-w-[150px] bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-800 rounded-2xl p-4 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform shadow-sm shadow-purple-100/50 dark:shadow-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-purple-900/40 flex items-center justify-center text-purple-500 mb-2 shadow-sm">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-purple-100 text-xs mb-0.5">Acabando</h4>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">12 vendo isso</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SEU CASHBACK (CLEANER) --- */}
            <div className="pl-5 space-y-3 w-full">
                 {/* Header */}
                 <div className="flex items-center justify-between pr-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Coins className="w-5 h-5 text-green-500 fill-green-500" />
                        Seu Cashback
                    </h3>
                    <button 
                        onClick={() => onNavigate('explore')}
                        className="text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full transition-colors active:scale-95"
                    >
                        Turbinar
                    </button>
                 </div>

                 {/* GAMIFICATION GOAL TRACKER (REWARD LOOP) */}
                 <div className="pr-5">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-700 rounded-2xl p-4 text-white shadow-lg shadow-green-500/20 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform" onClick={() => onNavigate('user_cashback_flow')}>
                        <div className="relative z-10 flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
                                <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                                Meta de Ganhos
                            </span>
                            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-lg text-white backdrop-blur-sm">
                                R$ 12,40 <span className="opacity-60">/ R$ 50,00</span>
                            </span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2 mb-2 overflow-hidden backdrop-blur-sm">
                            <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-full rounded-full transition-all duration-1000 w-[25%] shadow-[0_0_10px_rgba(250,204,21,0.6)] animate-pulse"></div>
                        </div>
                        <p className="text-[10px] font-medium text-green-50">
                            Falta pouco para o seu bônus! 🚀
                        </p>
                        
                        {/* Decorative background blur */}
                        <div className="absolute right-0 top-0 w-20 h-20 bg-white/10 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none group-hover:bg-white/20 transition-colors"></div>
                    </div>
                 </div>

                 <div className="flex gap-3 overflow-x-auto pb-3 pr-5 no-scrollbar mt-4">
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
                       }} className="min-w-[140px] w-[140px] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group cursor-pointer active:scale-95 transition-transform hover:shadow-md hover:border-green-100 dark:hover:border-green-900/30">
                          <div className="h-24 w-full relative bg-gray-50 dark:bg-gray-700 flex items-center justify-center p-2">
                              <img src={store.logoUrl || getStoreLogo(store.name.length)} alt={store.name} className="w-full h-full object-contain rounded-lg" />
                              <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-lg shadow-green-500/30 flex items-center gap-0.5 animate-pulse">
                                <Coins className="w-3 h-3 fill-white" />
                                {store.cashback}%
                              </div>
                          </div>
                          <div className="p-2.5 flex flex-col flex-1 justify-between">
                             <div>
                                <h4 className="font-bold text-gray-800 dark:text-white text-xs line-clamp-1 group-hover:text-green-600 transition-colors">{store.name}</h4>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{store.category}</p>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
            </div>

            <div className="pl-5 space-y-3 w-full">
               <div className="flex items-center justify-between pr-5">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white">Mais Buscados</h3>
                   <button 
                        onClick={() => onNavigate('explore')}
                        className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                    >
                        Ver mais
                    </button>
               </div>
               <div className="flex gap-3 overflow-x-auto pb-3 pr-5 no-scrollbar">
                  {TOP_SEARCHED.map((item) => (
                    <div key={item.id} className="min-w-[135px] w-[135px] h-[120px] rounded-2xl overflow-hidden relative group cursor-pointer active:scale-95 transition-transform shadow-sm">
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
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-all active:scale-95 ${
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
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-all active:scale-95 ${
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
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-all active:scale-95 ${
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
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-all active:scale-95 ${
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

            {/* 2) Habit Footer - Light emotional close */}
            <div className="mt-8 mb-4 flex flex-col items-center justify-center text-center opacity-60">
              <Star className="w-4 h-4 text-gray-400 mb-2" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Volte amanhã — sempre tem algo novo na Freguesia
              </p>
            </div>
        </div>
      )}

      {/* Toast de Convite / Feedback */}
      <div 
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl transition-all duration-300 z-50 flex items-center gap-2 ${
            toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
        {toastMessage}
      </div>

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

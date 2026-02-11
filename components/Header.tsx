
import React, { useMemo } from 'react';
import { Search, Mic, MapPin, ChevronDown, Check, ChevronRight, SearchX, ShieldCheck, Tag, Bell, Crown } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Store, Category } from '../types';
import { CATEGORIES } from '../constants';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onAuthClick: () => void;
  user: any;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
  userRole: "cliente" | "lojista" | null;
  onOpenMerchantQr?: () => void;
  customPlaceholder?: string;
  stores?: Store[];
  onStoreClick?: (store: Store) => void;
  isAdmin?: boolean;
  viewMode?: string;
  onOpenViewSwitcher?: () => void;
  onNotificationClick: () => void;
}

const NeighborhoodSelectorModal: React.FC = () => {
    const { currentNeighborhood, setNeighborhood, isSelectorOpen, toggleSelector } = useNeighborhood();
    if (!isSelectorOpen) return null;
    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-6" onClick={toggleSelector}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 duration-300 relative" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2 text-center">Escolha seu Bairro</h3>
                <div className="max-h-[60vh] overflow-y-auto no-scrollbar space-y-2">
                    <button onClick={() => setNeighborhood("Jacarepaguá (todos)")} className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-between ${currentNeighborhood === "Jacarepaguá (todos)" ? "bg-[#1E5BFF]/10 text-[#1E5BFF]" : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}>
                        <span>Jacarepaguá (todos)</span>
                        {currentNeighborhood === "Jacarepaguá (todos)" && <Check className="w-4 h-4" />}
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                    {NEIGHBORHOODS.map(hood => (
                        <button key={hood} onClick={() => setNeighborhood(hood)} className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-between ${currentNeighborhood === hood ? "bg-[#1E5BFF]/10 text-[#1E5BFF]" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>
                            <span>{hood}</span>
                            {currentNeighborhood === hood && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({
  user,
  userRole,
  searchTerm,
  onSearchChange,
  onNavigate,
  activeTab,
  stores = [],
  onStoreClick,
  onNotificationClick,
}) => {
  const { currentNeighborhood, toggleSelector } = useNeighborhood();

  const normalize = (text: any) => (String(text || "")).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const searchResults = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term || (activeTab !== 'home' && activeTab !== 'explore')) return { stores: [], categories: [] };
    const matchedCategories = CATEGORIES.filter(cat => normalize(cat.name).includes(term));
    const matchedStores = stores.filter(s => normalize(s.name + s.category + (s.neighborhood || "")).includes(term));
    return { stores: matchedStores.slice(0, 15), categories: matchedCategories.slice(0, 4) };
  }, [stores, searchTerm, activeTab]);

  const hoodDisplayName = currentNeighborhood === 'Jacarepaguá (todos)' ? 'Freguesia' : currentNeighborhood;
  
  const greetingData = useMemo(() => {
    const hour = new Date().getHours();
    let timeGreeting: string;
    let emoji: string;

    if (hour >= 5 && hour < 12) {
      timeGreeting = "Bom dia";
      emoji = "☀️";
    } else if (hour >= 12 && hour < 18) {
      timeGreeting = "Boa tarde";
      emoji = "🌤️";
    } else {
      timeGreeting = "Boa noite";
      emoji = "🌙";
    }

    if (!user) {
      return {
        title: <>{timeGreeting}! <span className="text-yellow-300">{emoji}</span> {hoodDisplayName}</>,
        subtitle: "Tudo para resolver a vida no bairro",
      };
    }

    if (userRole === 'lojista') {
      const storeName = user.user_metadata?.store_name || "Parceiro";
      return {
        title: <>{timeGreeting}, {storeName} 👑</>,
        subtitle: "Seus clientes estão por perto",
      };
    }

    // Regular logged-in user
    const userName = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || "Vizinho(a)";
    return {
      title: <>{timeGreeting}, {userName} <span className="text-yellow-300">{emoji}</span></>,
      subtitle: "O que vamos resolver hoje?",
    };
  }, [user, userRole, hoodDisplayName]);


  return (
    <>
      <div className="sticky top-0 z-40 w-full bg-[#1E5BFF] rounded-b-[2.5rem] shadow-2xl shadow-blue-500/20">
        <div className="max-w-md mx-auto flex flex-col relative p-5 pt-10 pb-6">
            
            {/* Top Row */}
            <div className="flex justify-between items-start mb-6">
                {/* Left Side: Greeting */}
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                        <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white leading-tight flex items-center gap-2">
                            {greetingData.title}
                        </h1>
                        <p className="text-xs text-white/70 font-medium">{greetingData.subtitle}</p>
                    </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button 
                        onClick={toggleSelector}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 active:scale-95 transition-all text-[10px] font-bold text-white shadow-md"
                    >
                        {hoodDisplayName} <Crown size={12} className="fill-yellow-300 text-yellow-400" /> <ChevronRight size={14} />
                    </button>
                    <button 
                        onClick={onNotificationClick}
                        className="relative p-2.5 text-white bg-white/10 backdrop-blur-md rounded-full border border-white/20 active:scale-95 transition-all shadow-md"
                    >
                        <Bell size={18} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white border-2 border-[#1E5BFF]">1</span>
                    </button>
                </div>
            </div>

            {/* Bottom Row: Search */}
            <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-200/80 pointer-events-none" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => onSearchChange(e.target.value)} 
                  placeholder="O que você precisa hoje?" 
                  className="block w-full pl-14 pr-12 bg-blue-900/20 backdrop-blur-md border-2 border-blue-400/30 rounded-2xl text-base font-medium text-white placeholder-blue-200/80 focus:outline-none focus:ring-4 focus:ring-white/10 py-4 shadow-inner transition-all" 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <Mic size={20} className="text-blue-200/80" />
                </div>
                
                {searchTerm.trim().length > 0 && (activeTab === 'home' || activeTab === 'explore') && (
                    <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="p-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                            {(searchResults.stores.length > 0 || searchResults.categories.length > 0) ? (
                                <div className="flex flex-col gap-1">
                                    {searchResults.categories.map(cat => (
                                        <button key={cat.id} onClick={() => { onNavigate('explore'); onSearchChange(''); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-left group">
                                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shrink-0 shadow-sm`}><Tag size={16} /></div>
                                            <div className="flex-1"><p className="text-sm font-bold text-gray-900 dark:text-white">{cat.name}</p><p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Categoria</p></div>
                                            <ChevronRight className="w-4 h-4 text-gray-300" />
                                        </button>
                                    ))}
                                    {searchResults.stores.map((store) => (
                                        <button key={store.id} onClick={() => { onStoreClick?.(store); onSearchChange(''); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl text-left transition-colors">
                                            <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                                                <img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{store.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{store.neighborhood} • {store.category}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-10 px-4 text-center text-gray-400">
                                    <SearchX size={32} className="mx-auto mb-3 opacity-20" />
                                    <p className="text-sm font-bold">Nenhum resultado</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
      <NeighborhoodSelectorModal />
    </>
  );
};

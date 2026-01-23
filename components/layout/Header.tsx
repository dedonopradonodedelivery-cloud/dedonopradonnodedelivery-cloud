import React, { useMemo } from 'react';
import { Search, User as UserIcon, MapPin, ChevronDown, Check, ChevronRight, SearchX, ShieldCheck, Tag, Bell } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../../contexts/NeighborhoodContext';
import { Store, Category } from '../../types';
import { CATEGORIES } from '../../constants';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onAuthClick: () => void;
  user: any;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
  userRole: 'cliente' | 'lojista' | 'admin' | null;
  stores?: Store[];
  onStoreClick?: (store: Store) => void;
  isAdmin?: boolean;
  viewMode?: string;
  onOpenViewSwitcher?: () => void;
}

const NeighborhoodSelectorModal: React.FC = () => {
    const { currentNeighborhood, setNeighborhood, isSelectorOpen, toggleSelector } = useNeighborhood();
    if (!isSelectorOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={toggleSelector}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2">Onde você está?</h3>
                <div className="max-h-[60vh] overflow-y-auto no-scrollbar space-y-2">
                    <button onClick={() => setNeighborhood("Jacarepaguá (todos)")} className={`w-full text-left px-4 py-4 rounded-2xl font-bold transition-all flex items-center justify-between ${currentNeighborhood === "Jacarepaguá (todos)" ? "bg-[#1E5BFF] text-white" : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}>
                        <span>Jacarepaguá (Todos)</span>
                        {currentNeighborhood === "Jacarepaguá (todos)" && <Check className="w-5 h-5" />}
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                    {NEIGHBORHOODS.map(hood => (
                        <button key={hood} onClick={() => setNeighborhood(hood)} className={`w-full text-left px-4 py-4 rounded-2xl font-bold transition-all flex items-center justify-between ${currentNeighborhood === hood ? "bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>
                            <span>{hood}</span>
                            {currentNeighborhood === hood && <Check className="w-5 h-5" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({
  onAuthClick, 
  user,
  searchTerm,
  onSearchChange,
  onNavigate,
  activeTab,
  stores = [],
  onStoreClick,
  isAdmin,
  viewMode,
  onOpenViewSwitcher
}) => {
  // Add setNeighborhood to destructuring (fixes missing name errors)
  const { currentNeighborhood, toggleSelector, setNeighborhood } = useNeighborhood();
  const showNeighborhoodFilter = ['home', 'explore', 'services', 'community_feed'].includes(activeTab);

  const normalize = (text: any) => (String(text || "")).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const searchResults = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term || (activeTab !== 'home' && activeTab !== 'explore')) return { stores: [], categories: [] };
    const matchedCategories = CATEGORIES.filter(cat => normalize(cat.name).includes(term));
    const matchedStores = stores.filter(s => normalize(s.name + s.category + (s.neighborhood || "")).includes(term));
    return { stores: matchedStores.slice(0, 15), categories: matchedCategories.slice(0, 4) };
  }, [stores, searchTerm, activeTab]);

  const dynamicPlaceholder = useMemo(() => {
    if (currentNeighborhood === "Jacarepaguá (todos)") {
      return "Buscar em Jacarepaguá";
    }
    return `Buscar em ${currentNeighborhood}`;
  }, [currentNeighborhood]);

  return (
    <>
        <div className="sticky top-0 z-40 w-full bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 shadow-sm transition-all duration-300">
            <div className="max-w-md mx-auto flex flex-col relative px-4 pt-4 pb-3">
                {/* Top Row: Location and Profile */}
                <div className="flex items-center justify-between mb-4">
                    <button onClick={toggleSelector} className="flex flex-col items-start active:scale-95 transition-transform group">
                        <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest leading-none mb-1">Localização</span>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-black text-gray-900 dark:text-white truncate max-w-[150px]">
                                {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#1E5BFF] group-hover:translate-y-0.5 transition-transform" />
                        </div>
                    </button>

                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <button onClick={onOpenViewSwitcher} className="bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-2 active:scale-95">
                                <ShieldCheck size={14} className="text-amber-600" />
                                <span className="text-[9px] font-black text-amber-800 dark:text-amber-200 uppercase">{viewMode}</span>
                            </button>
                        )}
                        <button onClick={onAuthClick} className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#1E5BFF] transition-all relative overflow-hidden shadow-inner">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Row */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#1E5BFF] transition-colors" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={(e) => onSearchChange(e.target.value)} 
                      placeholder={dynamicPlaceholder} 
                      className="block w-full pl-12 pr-4 bg-gray-100 dark:bg-gray-900 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 py-4 shadow-inner transition-all" 
                    />
                    
                    {searchTerm.trim().length > 0 && (activeTab === 'home' || activeTab === 'explore') && (
                        <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="p-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                                {(searchResults.stores.length > 0 || searchResults.categories.length > 0) ? (
                                    <div className="flex flex-col gap-1">
                                        {searchResults.categories.map(cat => (
                                            <button key={cat.id} onClick={() => { onNavigate('explore'); onSearchChange(''); }} className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-2xl transition-all group">
                                                <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-white shadow-md`}>
                                                    <Tag size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{cat.name}</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1E5BFF]" />
                                            </button>
                                        ))}
                                        {searchResults.stores.map(store => (
                                            <button key={store.id} onClick={() => { onStoreClick?.(store); onSearchChange(''); }} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all group">
                                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm shrink-0">
                                                    <img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-contain p-1" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{store.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{store.category} • {store.neighborhood}</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1E5BFF]" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center flex flex-col items-center">
                                        <SearchX className="w-12 h-12 text-gray-200 dark:text-gray-800 mb-4" />
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Nenhum resultado encontrado</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {showNeighborhoodFilter && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 pb-4 pt-1 transition-all duration-300">
                    <button 
                        onClick={() => setNeighborhood("Jacarepaguá (todos)")} 
                        className={`flex-shrink-0 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${currentNeighborhood === "Jacarepaguá (todos)" ? "bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20" : "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-800"}`}
                    >
                        Tudo
                    </button>
                    {NEIGHBORHOODS.map(hood => (
                        <button 
                            key={hood} 
                            onClick={() => setNeighborhood(hood)} 
                            className={`flex-shrink-0 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${currentNeighborhood === hood ? "bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20" : "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-800"}`}
                        >
                            {hood}
                        </button>
                    ))}
                </div>
            )}
        </div>
        <NeighborhoodSelectorModal />
    </>
  );
};
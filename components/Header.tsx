
import React, { useMemo } from 'react';
import { Search, User as UserIcon, MapPin, ChevronDown, Check, ChevronRight, SearchX, ShieldCheck, Tag } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Store } from '../types';
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
  onOpenMerchantQr?: () => void; // Mantido para compatibilidade, não renderizado
  customPlaceholder?: string;
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
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2">Escolha o Bairro</h3>
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
  // Added setNeighborhood to the destructuring here
  const { currentNeighborhood, setNeighborhood, toggleSelector } = useNeighborhood();
  const showNeighborhoodFilter = ['home', 'explore', 'services', 'community_feed'].includes(activeTab);

  const normalize = (text: any) => (String(text || "")).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const searchResults = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term || (activeTab !== 'home' && activeTab !== 'explore')) return { stores: [], categories: [] };
    const matchedCategories = CATEGORIES.filter(cat => normalize(cat.name).includes(term));
    const matchedStores = stores.filter(s => normalize(s.name + s.category + (s.neighborhood || "")).includes(term));
    return { stores: matchedStores.slice(0, 15), categories: matchedCategories.slice(0, 4) };
  }, [stores, searchTerm, activeTab]);

  // Placeholder dinâmico conforme o bairro selecionado
  const dynamicPlaceholder = useMemo(() => {
    if (currentNeighborhood === "Jacarepaguá (todos)") {
      return "O que você busca em JPA?";
    }
    return `O que você busca em ${currentNeighborhood}?`;
  }, [currentNeighborhood]);

  return (
    <>
        <div className="sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto flex flex-col relative">
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <button onClick={toggleSelector} className="flex items-center gap-1.5 active:scale-95">
                    <div className="p-1.5 bg-[#1E5BFF]/10 rounded-full"><MapPin className="w-3.5 h-3.5 text-[#1E5BFF]" fill="currentColor" /></div>
                    <div className="text-left flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">Local</span>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[120px]">{currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </div>
                    </div>
                </button>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <button onClick={onOpenViewSwitcher} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl flex items-center gap-2 active:scale-95 shadow-sm">
                            <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" />
                            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 uppercase">{viewMode}</span>
                        </button>
                    )}
                    <button onClick={onAuthClick} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1 pl-3 rounded-full border border-gray-100 dark:border-gray-700 shadow-inner">
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{user ? 'Perfil' : 'Entrar'}</span>
                        <div className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-[#1E5BFF] overflow-hidden relative shadow-sm">
                            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-4 h-4" />}
                        </div>
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-3 px-4 pt-2 pb-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={(e) => onSearchChange(e.target.value)} 
                      placeholder={dynamicPlaceholder} 
                      className="block w-full pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 py-3 shadow-inner" 
                    />
                    {searchTerm.trim().length > 0 && (activeTab === 'home' || activeTab === 'explore') && (
                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-gray-900 rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="p-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                                {(searchResults.stores.length > 0 || searchResults.categories.length > 0) ? (
                                    <div className="flex flex-col">
                                        {searchResults.categories.map(cat => (<button key={cat.id} onClick={() => { onNavigate('explore'); onSearchChange(''); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-left group"><div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shrink-0`}><Tag size={14} /></div><div className="flex-1"><p className="text-sm font-bold text-gray-900 dark:text-white">{cat.name}</p></div><ChevronRight className="w-4 h-4 text-gray-300" /></button>))}
                                        {searchResults.stores.map(store => (<button key={store.id} onClick={() => { onStoreClick?.(store); onSearchChange(''); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl text-left group"><div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0"><img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-contain" /></div><div className="flex-1 min-w-0"><p className="text-sm font-bold text-gray-900 dark:text-white truncate">{store.name}</p><p className="text-[9px] text-gray-400 font-medium truncate">{store.category} • {store.neighborhood}</p></div><ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1E5BFF]" /></button>))}
                                    </div>
                                ) : (
                                    <div className="py-8 px-4 text-center">
                                        <SearchX className="w-6 h-6 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Nenhum resultado</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showNeighborhoodFilter && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 pb-3 pt-1">
                    <button onClick={() => setNeighborhood("Jacarepaguá (todos)")} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${currentNeighborhood === "Jacarepaguá (todos)" ? "bg-[#1E5BFF] text-white border-[#1E5BFF]" : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-800"}`}>Todos</button>
                    {NEIGHBORHOODS.map(hood => (<button key={hood} onClick={() => setNeighborhood(hood)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${currentNeighborhood === hood ? "bg-[#1E5BFF] text-white border-[#1E5BFF]" : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-800"}`}>{hood}</button>))}
                </div>
            )}
        </div>
        </div>
        <NeighborhoodSelectorModal />
    </>
  );
};

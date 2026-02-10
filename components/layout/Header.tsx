import React, { useMemo, useState, useEffect, useCallback } from 'react';
// FIX: Added missing Tag and ChevronRight icons to the imports from lucide-react.
import { Search, ChevronDown, Check, Bell, X, Mic, Tag, ChevronRight } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../../contexts/NeighborhoodContext';
import { Store, Category } from '../../types';
import { CATEGORIES } from '../../constants';

interface HeaderProps {
  onNotificationClick: () => void;
  user: any;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigate: (view: string, data?: any) => void;
  activeTab: string;
  stores?: Store[];
  onStoreClick?: (store: Store) => void;
  isAdmin?: boolean;
  viewMode?: string;
  onOpenViewSwitcher?: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
  userRole?: string | null;
}

const NeighborhoodSelectorModal: React.FC = () => {
    const { currentNeighborhood, setNeighborhood, isSelectorOpen, toggleSelector } = useNeighborhood();
    if (!isSelectorOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-6" onClick={toggleSelector}>
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
  onNotificationClick, 
  searchTerm,
  onSearchChange,
  onNavigate,
  activeTab,
  stores = [],
  onStoreClick
}) => {
  const { currentNeighborhood, toggleSelector } = useNeighborhood();
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const checkNotifs = () => {
      const saved = localStorage.getItem('app_notifications');
      if (saved) {
        const notifs = JSON.parse(saved);
        setUnreadCount(notifs.filter((n: any) => !n.read).length);
      }
    };
    checkNotifs();
  }, []);

  const normalize = (text: any) => (String(text || "")).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const searchResults = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term || (activeTab !== 'home' && activeTab !== 'explore')) return { stores: [], categories: [] };
    const matchedCategories = CATEGORIES.filter(cat => normalize(cat.name).includes(term));
    const matchedStores = stores.filter(s => normalize(s.name + s.category + s.subcategory).includes(term)).slice(0, 15);
    return { stores: matchedStores, categories: matchedCategories.slice(0, 4) };
  }, [stores, searchTerm, activeTab]);

  const dynamicPlaceholder = currentNeighborhood === "Jacarepaguá (todos)" ? "O que busca em JPA?" : `O que busca em ${currentNeighborhood}?`;

  return (
    <>
        <div className="sticky top-0 z-40 w-full bg-[#1E5BFF] rounded-b-[2.5rem] shadow-lg border-b border-white/10">
            <div className="w-full max-w-md mx-auto flex flex-col relative pb-6">
                {/* Linha Superior: Logo, Bairro e Notificações */}
                <div className="flex items-center justify-between px-5 pt-10 pb-4">
                    <div className="flex items-center gap-3">
                        <img 
                          src="/logo.png" 
                          alt="Localizei" 
                          className="h-8 w-auto object-contain brightness-0 invert" 
                          onError={(e) => {
                             // Fallback caso a imagem não exista
                             e.currentTarget.style.display = 'none';
                             const parent = e.currentTarget.parentElement;
                             if(parent) {
                               const span = document.createElement('span');
                               span.className = 'text-white font-black text-xl tracking-tighter';
                               span.innerText = 'Localizei';
                               parent.prepend(span);
                             }
                          }}
                        />
                        
                        {/* Seletor de Bairros Estilizado */}
                        <button 
                            onClick={toggleSelector} 
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 active:scale-95 transition-all"
                        >
                            <span className="text-xs font-bold text-white whitespace-nowrap">
                                {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-white/70" />
                        </button>
                    </div>

                    <button 
                        onClick={onNotificationClick}
                        className="relative p-2.5 bg-white/10 rounded-2xl border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
                    >
                        <Bell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#1E5BFF] shadow-lg">
                                <span className="text-[9px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                            </span>
                        )}
                    </button>
                </div>

                {/* Barra de Pesquisa com Alto Contraste */}
                <div className="px-5">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                        <input 
                          type="text" 
                          value={searchTerm} 
                          onChange={(e) => onSearchChange(e.target.value)} 
                          placeholder={dynamicPlaceholder} 
                          className="block w-full pl-11 pr-12 bg-white/20 border border-white/20 rounded-2xl text-sm font-medium text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/10 py-3.5 shadow-xl backdrop-blur-sm transition-all" 
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {searchTerm ? (
                            <button onClick={() => onSearchChange('')} className="p-1.5 text-white/60 hover:text-white"><X size={18} /></button>
                          ) : (
                            <div className="p-1.5 text-white/40"><Mic size={18} /></div>
                          )}
                        </div>

                        {/* Resultados da Busca (Dropdown flutuante) */}
                        {searchTerm.trim().length > 0 && (activeTab === 'home' || activeTab === 'explore') && (
                            <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="p-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                                    {(searchResults.stores.length > 0 || searchResults.categories.length > 0) ? (
                                        <div className="flex flex-col gap-1">
                                            {searchResults.categories.map(cat => (
                                                <button key={cat.id} onClick={() => { onNavigate('explore'); onSearchChange(''); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-left group">
                                                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                                                        <Tag size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{cat.name}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Categoria</p>
                                                    </div>
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
                                        <div className="py-10 px-4 text-center">
                                            <SearchX className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Nenhum resultado para "{searchTerm}"</p>
                                            <p className="text-xs text-gray-400 mt-1">Tente buscar por termos mais genéricos.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <NeighborhoodSelectorModal />
    </>
  );
};

const SearchX = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

import React, { useMemo, useState, useEffect } from 'react';
import { Search, ChevronDown, Check, Bell, X, Mic, ShieldAlert, MapPin, Tag, ChevronRight } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../../contexts/NeighborhoodContext';
import { Store } from '../../types';
import { CATEGORIES } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onNotificationClick: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigate: (view: string, data?: any) => void;
  activeTab: string;
  stores?: Store[];
  onStoreClick?: (store: Store) => void;
  isAdmin?: boolean;
  viewMode?: string;
  onOpenViewSwitcher?: () => void;
  // Propriedades adicionadas para compatibilidade com o App.tsx
  isDarkMode?: boolean;
  toggleTheme?: () => void;
  user?: any;
  userRole?: "cliente" | "lojista" | null;
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
  onNotificationClick, 
  searchTerm,
  onSearchChange,
  onNavigate,
  activeTab,
  stores = [],
  onStoreClick,
  onOpenViewSwitcher,
  viewMode,
  // Props desestruturadas embora o componente use useAuth internamente por padrão
  user: userProp,
  userRole: userRoleProp
}) => {
  const { user: authUser } = useAuth();
  const { currentNeighborhood, toggleSelector } = useNeighborhood();
  const [unreadCount, setUnreadCount] = useState(0);

  // Usa o usuário do auth context como prioridade
  const user = authUser || userProp;

  // Regra Admin: dedonopradonodedelivery@gmail.com
  const isAdminUser = user?.email === 'dedonopradonodedelivery@gmail.com';
  
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

  const greeting = useMemo(() => {
    const neighborhood = currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood;
    return neighborhood;
  }, [currentNeighborhood]);

  const normalize = (text: any) => (String(text || "")).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const searchResults = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term || (activeTab !== 'home' && activeTab !== 'explore')) return { stores: [], categories: [] };
    const matchedCategories = CATEGORIES.filter(cat => normalize(cat.name).includes(term));
    const matchedStores = stores.filter(s => normalize(s.name + s.category + s.subcategory).includes(term)).slice(0, 15);
    return { stores: matchedStores, categories: matchedCategories.slice(0, 4) };
  }, [stores, searchTerm, activeTab]);

  return (
    <>
        <div className="sticky top-0 z-40 w-full bg-gradient-to-b from-[#1E5BFF] to-[#0E45CC] rounded-b-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-500">
            <div className="w-full max-w-md mx-auto flex flex-col relative pb-7 px-5">
                {/* Linha Superior: Logo, Seletor e Notificações */}
                <div className="flex items-center justify-between pt-12 pb-5">
                    <div className="flex flex-col items-start">
                        <h1 className="text-white font-black text-xl tracking-tighter leading-none flex items-center gap-1.5">
                            Localizei <span className="opacity-80">JPA</span>
                        </h1>
                        
                        {/* Seletor de Bairro Discreto */}
                        <button 
                            onClick={toggleSelector} 
                            className="flex items-center gap-1 mt-1 group active:opacity-60 transition-all"
                        >
                            <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{greeting}</span>
                            <ChevronDown size={10} className="text-white/50 group-hover:text-white transition-colors" strokeWidth={3} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {isAdminUser && (
                            <button 
                                onClick={onOpenViewSwitcher}
                                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all active:scale-95 border border-white/10"
                                title="Alternar Modo"
                            >
                                <ShieldAlert size={18} className="text-amber-400" />
                            </button>
                        )}
                        
                        <button 
                            onClick={onNotificationClick}
                            className="relative p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all active:scale-90 border border-white/10"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#1E5BFF] shadow-lg">
                                    <span className="text-[8px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Linha de Busca: Translucidez e Modernidade */}
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-white/50" />
                    </div>
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={(e) => onSearchChange(e.target.value)} 
                      placeholder={`O que busca em ${greeting}?`} 
                      className="block w-full pl-11 pr-12 bg-white/15 border border-white/10 rounded-2xl text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-4 focus:ring-white/5 py-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all" 
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {searchTerm ? (
                        <button onClick={() => onSearchChange('')} className="p-1.5 text-white/60 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                      ) : (
                        <div className="p-1.5 text-white/30 hover:text-white/60 transition-colors cursor-pointer">
                            <Mic size={18} />
                        </div>
                      )}
                    </div>

                    {/* Resultados de Busca (Dropdown) */}
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
                                    <div className="py-12 px-4 text-center text-gray-400">
                                        <X size={32} className="mx-auto mb-3 opacity-20" />
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

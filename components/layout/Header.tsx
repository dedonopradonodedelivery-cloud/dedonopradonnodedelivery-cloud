
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
  onOpenViewSwitcher?: () => void;
  viewMode?: string;
  user?: any;
  userRole?: "cliente" | "lojista" | null;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
  isAdmin?: boolean;
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
  user: userProp,
  isAdmin: isAdminProp
}) => {
  const { user: authUser } = useAuth();
  const { currentNeighborhood, toggleSelector } = useNeighborhood();
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const container = document.querySelector('.overflow-y-auto');
    if (!container) return;
    const handleScroll = () => setScrollY(container.scrollTop);
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollLimit = 50;
  const progress = Math.min(scrollY / scrollLimit, 1);
  
  const headerOpacity = 1 - progress;
  const headerTranslateY = -progress * 40;
  const searchTranslateY = -progress * 60; 

  const user = authUser || userProp;
  const isAdminUser = isAdminProp ?? (user?.email === 'dedonopradonodedelivery@gmail.com');
  
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
    const hour = new Date().getHours();
    let welcome = 'Bom dia';
    let icon = '☀️';
    if (hour >= 12 && hour < 18) { welcome = 'Boa tarde'; icon = '🌤️'; }
    else if (hour >= 18 || hour < 5) { welcome = 'Boa noite'; icon = '🌙'; }
    const name = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || '';
    return { title: `${welcome}${name ? `, ${name}` : ''} ${icon}`, sub: currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood };
  }, [user, currentNeighborhood]);

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
        <div className="sticky top-0 z-40 w-full transition-all duration-300">
            {/* Fundo Integrado - Bordas retas (Premium) no scroll */}
            <div 
              className="absolute inset-0 bg-splash-premium border-b border-white/5 shadow-sm"
              style={{ 
                height: `${Math.max(80, 180 - scrollY)}px`, 
                borderRadius: `0 0 ${Math.max(0, 2 - progress * 2)}rem ${Math.max(0, 2 - progress * 2)}rem`,
                transition: 'none' 
              }}
            />

            <div className="w-full max-w-md mx-auto flex flex-col relative px-5">
                
                {/* Topo (Saudação + Ações) */}
                <div 
                    className="flex items-center justify-between pt-8 pb-3"
                    style={{ 
                      opacity: headerOpacity, 
                      transform: `translateY(${headerTranslateY}px)`,
                      pointerEvents: progress > 0.8 ? 'none' : 'auto'
                    }}
                >
                    <h1 className="text-white font-black text-xl tracking-tight leading-none">
                        {greeting.title}
                    </h1>

                    <div className="flex items-center gap-2">
                        {isAdminUser && (
                            <button onClick={onOpenViewSwitcher} className="p-2 bg-white/10 rounded-xl text-white border border-white/10 active:scale-95 transition-all">
                                <ShieldAlert size={18} className="text-amber-400" />
                            </button>
                        )}
                        
                        {/* Seletor de Bairro movido para o lado do sino */}
                        <button 
                            onClick={toggleSelector} 
                            className="flex items-center gap-1.5 bg-white/10 px-3 py-2 rounded-xl border border-white/10 text-white text-[9px] font-black uppercase tracking-widest active:scale-95 backdrop-blur-md"
                        >
                            <MapPin size={12} className="text-blue-300 fill-current" />
                            <span>{greeting.sub}</span>
                        </button>

                        <button onClick={onNotificationClick} className="relative p-2.5 bg-white/10 rounded-xl text-white active:scale-90 border border-white/10">
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#1E5BFF] text-[8px] font-black">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Barra de Busca - Integrada e Fixa */}
                <div 
                  className="relative group pb-5 transition-transform duration-300 ease-out"
                  style={{ transform: `translateY(${searchTranslateY}px)` }}
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <input 
                          type="text" 
                          value={searchTerm} 
                          onChange={(e) => onSearchChange(e.target.value)} 
                          placeholder={`Buscar em ${greeting.sub}...`} 
                          className="block w-full pl-11 pr-10 rounded-2xl text-sm font-bold text-white placeholder-white/30 focus:outline-none py-4 bg-white/5 border border-white/10 backdrop-blur-md transition-all shadow-none" 
                        />
                        {searchTerm && (
                          <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"><X size={18} /></button>
                        )}
                    </div>

                    {/* Resultados */}
                    {searchTerm.trim().length > 0 && (activeTab === 'home' || activeTab === 'explore') && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="p-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                                {(searchResults.stores.length > 0 || searchResults.categories.length > 0) ? (
                                    <div className="flex flex-col gap-1">
                                        {searchResults.categories.map(cat => (
                                            <button key={cat.id} onClick={() => { onNavigate('explore'); onSearchChange(''); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl text-left group">
                                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shrink-0`}><Tag size={16} /></div>
                                                <div className="flex-1"><p className="text-sm font-bold text-gray-900 dark:text-white">{cat.name}</p></div>
                                                <ChevronRight className="w-4 h-4 text-gray-300" />
                                            </button>
                                        ))}
                                        {searchResults.stores.map((store) => (
                                            <button key={store.id} onClick={() => { onStoreClick?.(store); onSearchChange(''); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl text-left">
                                                <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                                                    <img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0"><p className="text-sm font-bold text-gray-900 dark:text-white truncate">{store.name}</p><p className="text-[10px] text-gray-400 font-bold uppercase truncate">{store.neighborhood} • {store.category}</p></div>
                                                <ChevronRight className="w-4 h-4 text-gray-300" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-10 text-center text-gray-400"><X size={32} className="mx-auto mb-3 opacity-20" /><p className="text-sm font-bold">Sem resultados</p></div>
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

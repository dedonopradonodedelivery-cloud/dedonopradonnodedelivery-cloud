
import React, { useMemo, useState, useEffect } from 'react';
import { Search, ChevronDown, Check, Bell, X, Mic, ShieldAlert, MapPin, Tag, ChevronRight } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../../contexts/NeighborhoodContext';
import { Store } from '../../types';
import { CATEGORIES } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';

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
  
  // Lógica de Scroll dinâmico
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const container = document.querySelector('.overflow-y-auto');
    if (!container) return;

    const handleScroll = () => {
      setScrollY(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Mapeamento das animações baseado no scroll (0 a 80px)
  const scrollLimit = 80;
  const progress = Math.min(scrollY / scrollLimit, 1);
  
  const headerOpacity = 1 - progress;
  const headerTranslateY = -progress * 40; // Sobe suavemente enquanto some
  const searchTranslateY = -progress * 78; // Puxa a barra de busca para o topo

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

    const neighborhood = currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood;

    if (viewMode === 'Visitante') return { title: `${welcome}! ${icon}`, sub: neighborhood };
    if (viewMode === 'Lojista' && user) {
      const storeName = user.user_metadata?.store_name || user.user_metadata?.full_name || user.email?.split('@')[0];
      return { title: `${welcome}, ${storeName} 👑`, sub: neighborhood };
    }
    if (user) {
      const name = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0];
      return { title: `${welcome}, ${name} ${icon}`, sub: neighborhood };
    }
    return { title: `${welcome}! ${icon}`, sub: neighborhood };
  }, [user, currentNeighborhood, viewMode]);

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
        <div className="sticky top-0 z-40 w-full transition-all duration-300 ease-out">
            {/* Background fixo do cabeçalho que encolhe */}
            <div 
              className="absolute inset-0 bg-splash-premium rounded-b-[2.5rem] shadow-lg shadow-black/10"
              style={{ height: `${Math.max(100, 185 - scrollY)}px`, transition: 'none' }}
            />

            <div className="w-full max-w-md mx-auto flex flex-col relative pb-6 px-5">
                
                {/* 1. SEÇÃO DE SAUDAÇÃO (DESAPARECE NO SCROLL) */}
                <div 
                    className="flex items-center justify-between pt-10 pb-4 transition-all duration-300"
                    style={{ 
                      opacity: headerOpacity, 
                      transform: `translateY(${headerTranslateY}px)`,
                      pointerEvents: progress > 0.5 ? 'none' : 'auto'
                    }}
                >
                    <div className="flex flex-col items-start gap-1.5">
                        <h1 className="text-white font-black text-xl tracking-tight leading-none">
                            {greeting.title}
                        </h1>
                        
                        <button 
                            onClick={toggleSelector} 
                            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/15 text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm backdrop-blur-md"
                        >
                            <MapPin size={10} className="text-blue-300 fill-current" />
                            <span>{greeting.sub}</span>
                            <ChevronDown size={10} strokeWidth={3} className="opacity-50" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {isAdminUser && (
                            <button onClick={onOpenViewSwitcher} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all active:scale-95 border border-white/10 flex items-center gap-2 shadow-sm">
                                <ShieldAlert size={18} className="text-amber-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{viewMode || 'ADM'}</span>
                            </button>
                        )}
                        <button onClick={onNotificationClick} className="relative p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all active:scale-90 border border-white/10">
                            <Bell size={22} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#1E5BFF] shadow-lg">
                                    <span className="text-[8px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* 2. BARRA DE BUSCA (FLUTUA PARA O TOPO) */}
                <div 
                  className="relative group mt-2 transition-transform duration-300 ease-out"
                  style={{ transform: `translateY(${searchTranslateY}px)` }}
                >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-white/60" />
                    </div>
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={(e) => onSearchChange(e.target.value)} 
                      placeholder={`O que busca em ${currentNeighborhood === "Jacarepaguá (todos)" ? "JPA" : currentNeighborhood}?`} 
                      className={`block w-full pl-11 pr-12 bg-white/15 border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/10 py-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all ${progress > 0.8 ? 'bg-white/20 shadow-xl' : ''}`} 
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {searchTerm ? (
                        <button onClick={() => onSearchChange('')} className="p-1.5 text-white/60 hover:text-white"><X size={18} /></button>
                      ) : (
                        <div className="p-1.5 text-white/40"><Mic size={18} /></div>
                      )}
                    </div>

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
                                    <div className="py-10 px-4 text-center text-gray-400">
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

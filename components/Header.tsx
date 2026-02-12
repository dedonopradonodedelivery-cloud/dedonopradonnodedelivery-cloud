
import React, { useMemo, useState, useEffect } from 'react';
import { Search, User as UserIcon, MapPin, ChevronDown, Check, ChevronRight, SearchX, ShieldCheck, Tag, Plus, CloudSun, Thermometer, TrafficCone } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '@/contexts/NeighborhoodContext';
import { Store, Category } from '@/types';
import { CATEGORIES } from '@/constants';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onAuthClick: () => void;
  user: any;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigate: (tab: string) => void;
  onSelectCategory: (category: Category) => void;
  onOpenMoreCategories: () => void;
  activeTab: string;
  userRole: "cliente" | "lojista" | null;
  stores?: Store[];
  onStoreClick?: (store: Store) => void;
  isAdmin?: boolean;
  viewMode?: string;
  onOpenViewSwitcher?: () => void;
  isSticky?: boolean;
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
                    <button onClick={() => setNeighborhood("Jacarepaguá (todos)")} className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-between ${currentNeighborhood === "Jacarepaguá (todos)" ? "bg-[#1E5BFF]/10 text-[#1E5BFF]" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>
                        <span>Jacarepaguá (todos)</span>
                        {currentNeighborhood === "Jacarepaguá (todos)" && <Check className="w-4 h-4" />}
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
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
  onSelectCategory,
  onOpenMoreCategories,
  activeTab,
  stores = [],
  onStoreClick,
  isAdmin,
  viewMode,
  onOpenViewSwitcher,
  isSticky = true
}) => {
  const { currentNeighborhood, toggleSelector } = useNeighborhood();
  const [weatherInfo, setWeatherInfo] = useState({
    weather: '',
    temp: 0,
    traffic: '',
    loading: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setWeatherInfo({
        weather: 'Parcialmente Nublado',
        temp: 28,
        traffic: 'Moderado',
        loading: false,
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
      return "O que você busca em JPA?";
    }
    return `O que você busca em ${currentNeighborhood}?`;
  }, [currentNeighborhood]);

  const headerCategories = useMemo(() => {
    const names = ['Saúde', 'Serviços', 'Pets', 'Moda', 'Beleza'];
    return CATEGORIES.filter(c => names.includes(c.name));
  }, []);

  const wrapperClasses = isSticky
    ? "sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800"
    : "w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800";

  return (
    <>
        <div className={wrapperClasses}>
          <div className="max-w-md mx-auto flex flex-col relative">
            <div className="flex items-center justify-between px-4 pt-3 pb-1 h-16">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#1E5BFF] rounded-xl flex items-center justify-center shadow-md">
                        <MapPin className="w-4 h-4 text-white" />
                    </div>
                    {activeTab === 'home' ? (
                        <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                            Olá, {user ? (user.user_metadata?.full_name?.split(' ')[0] || 'Membro') : 'Visitante'}
                        </h2>
                    ) : (
                        <span className="font-black text-lg text-gray-900 dark:text-white">JPA</span>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    <button onClick={toggleSelector} className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-inner active:scale-95 transition-transform">
                        <MapPin className="w-3.5 h-3.5 text-[#1E5BFF]" />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[80px]">
                            {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
                        </span>
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>
                    
                    {isAdmin && (
                        <button onClick={onOpenViewSwitcher} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl flex items-center gap-2 active:scale-95 shadow-sm h-10">
                            <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" />
                            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 uppercase">{viewMode}</span>
                        </button>
                    )}
                    
                    <button onClick={onAuthClick} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[#1E5BFF] overflow-hidden relative shadow-inner border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform">
                        {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
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

            {activeTab === 'home' && (
              <div className="w-full overflow-hidden border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-center gap-4 px-4 pb-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap overflow-x-auto no-scrollbar">
                  {weatherInfo.loading ? (
                    <span className="opacity-50 animate-pulse">Carregando informações do bairro...</span>
                  ) : (
                    <div className="flex items-center gap-3 animate-in fade-in duration-700">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-blue-500" />
                        <span className="uppercase">{currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}</span>
                      </div>
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-1.5">
                        <CloudSun size={12} className="text-amber-500" />
                        <span className="uppercase">{weatherInfo.weather}</span>
                      </div>
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-1.5">
                        <Thermometer size={12} className="text-rose-500" />
                        <span className="uppercase">{weatherInfo.temp}°C</span>
                      </div>
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-1.5">
                        <TrafficCone size={12} className="text-orange-500" />
                        <span className="uppercase">Trânsito {weatherInfo.traffic}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'home' && (
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar px-4 pb-4 pt-4">
                {headerCategories.map(cat => (
                  <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center gap-2 text-center group flex-shrink-0 w-16">
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shadow-sm border border-gray-100 dark:border-gray-700">
                      {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 18, strokeWidth: 2.5 })}
                    </div>
                    <span className="text-[9px] font-black uppercase text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{cat.name}</span>
                  </button>
                ))}
                <button onClick={onOpenMoreCategories} className="flex flex-col items-center gap-2 text-center group flex-shrink-0 w-16">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shadow-sm border border-gray-100 dark:border-gray-700">
                    <Plus size={18} strokeWidth={3} />
                  </div>
                  <span className="text-[9px] font-black uppercase text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">+ Mais</span>
                </button>
              </div>
            )}
        </div>
        </div>
        <NeighborhoodSelectorModal />
    </>
  );
};

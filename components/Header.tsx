
import React, { useMemo } from 'react';
import { Search, QrCode, User as UserIcon, MapPin, ChevronDown, Check, ChevronRight, SearchX, ShieldCheck } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Store } from '../types';

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
  // NOVAS PROPS ADM
  isAdmin?: boolean;
  viewMode?: string;
  onOpenViewSwitcher?: () => void;
}

const NeighborhoodSelectorModal: React.FC = () => {
    const { currentNeighborhood, setNeighborhood, isSelectorOpen, toggleSelector } = useNeighborhood();

    if (!isSelectorOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={toggleSelector}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2">Escolha o Bairro</h3>
                
                <div className="max-h-[60vh] overflow-y-auto no-scrollbar space-y-2">
                    <button
                        onClick={() => setNeighborhood("Jacarepaguá (todos)")}
                        className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-between ${
                            currentNeighborhood === "Jacarepaguá (todos)"
                            ? "bg-[#1E5BFF]/10 text-[#1E5BFF]"
                            : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                        }`}
                    >
                        <span>Jacarepaguá (todos)</span>
                        {currentNeighborhood === "Jacarepaguá (todos)" && <Check className="w-4 h-4" />}
                    </button>

                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>

                    {NEIGHBORHOODS.map(hood => (
                        <button
                            key={hood}
                            onClick={() => setNeighborhood(hood)}
                            className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-between ${
                                currentNeighborhood === hood
                                ? "bg-[#1E5BFF]/10 text-[#1E5BFF]"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                            }`}
                        >
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
  isDarkMode,
  toggleTheme,
  onAuthClick, 
  user,
  searchTerm,
  onSearchChange,
  activeTab,
  userRole,
  onOpenMerchantQr,
  customPlaceholder,
  stores = [],
  onStoreClick,
  isAdmin,
  viewMode,
  onOpenViewSwitcher
}) => {
  const isMerchant = userRole === 'lojista';
  /* Adicionado setNeighborhood na desestruturação do hook useNeighborhood para corrigir erros nas linhas 254 e 266 */
  const { currentNeighborhood, setNeighborhood, toggleSelector } = useNeighborhood();

  const showNeighborhoodFilter = ['home', 'explore', 'services'].includes(activeTab);

  const normalize = (text: any) => 
    (String(text || "")).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const filteredResults = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term || activeTab !== 'home') return [];
    
    return stores.filter(s => {
        if (!s) return false;
        const isActive = (s as any).status === undefined || (s as any).status === 'active';
        if (!isActive) return false;

        const searchableFields = [
            s.name,
            s.category,
            s.subcategory,
            s.description,
            s.neighborhood || "",
            ...((s as any).tags || [])
        ];

        const unifiedString = searchableFields.map(field => normalize(field)).join(' ');
        return unifiedString.includes(term);
    }).slice(0, 8);
  }, [stores, searchTerm, activeTab]);

  return (
    <>
        <div className="sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-all duration-300 ease-in-out shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto flex flex-col relative">
            
            {/* Top Row: Location, Admin Switcher & Profile */}
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <button 
                    onClick={toggleSelector}
                    className="flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                    <div className="p-1.5 bg-[#1E5BFF]/10 rounded-full">
                        <MapPin className="w-3.5 h-3.5 text-[#1E5BFF]" fill="currentColor" />
                    </div>
                    <div className="text-left flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide leading-none">Você está em</span>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[120px]">
                                {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
                            </span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </div>
                    </div>
                </button>

                <div className="flex items-center gap-2">
                    {/* ADM VIEW SWITCHER - PERSISTENTE NO HEADER PRINCIPAL */}
                    {isAdmin && (
                        <button 
                            onClick={onOpenViewSwitcher}
                            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl flex items-center gap-2 active:scale-95 transition-all shadow-sm"
                        >
                            <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" />
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest mb-0.5">Visão</span>
                                <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 uppercase">{viewMode}</span>
                            </div>
                            <ChevronDown size={12} className="text-amber-400" />
                        </button>
                    )}

                    <button 
                        onClick={onAuthClick}
                        className="flex items-center gap-2 outline-none group active:scale-95 transition-transform bg-gray-50 dark:bg-gray-800 p-1 pl-3 rounded-full border border-gray-100 dark:border-gray-700 shadow-inner"
                    >
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 group-hover:text-[#1E5BFF]">
                            {user ? 'Perfil' : 'Entrar'}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-[#1E5BFF] dark:text-blue-400 overflow-hidden relative shadow-sm">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Perfil" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-4 h-4" />
                            )}
                            {!user && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-gray-900"></div>}
                        </div>
                    </button>
                </div>
            </div>

            {/* Bottom Row: Search Bar */}
            <div className={`flex items-center gap-3 px-4 ${showNeighborhoodFilter ? 'pt-2 pb-2' : 'pt-2 pb-3'} transition-all duration-300 ease-in-out`}>
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#1E5BFF] transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={customPlaceholder || `Buscar lojas, serviços, produtos...`}
                        className={`block w-full pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 transition-all shadow-inner py-3`}
                    />

                    {searchTerm.trim().length > 0 && activeTab === 'home' && (
                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                                {filteredResults.length > 0 ? (
                                    <div className="flex flex-col">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">Melhores resultados</p>
                                        {filteredResults.map(store => (
                                            <button 
                                                key={store.id} 
                                                onClick={() => {
                                                    onStoreClick?.(store);
                                                    onSearchChange(''); 
                                                }} 
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-left group"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700 flex-shrink-0">
                                                    <img src={store.logoUrl || "/assets/default-logo.png"} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{store.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-tighter">{store.category}</span>
                                                        {store.neighborhood && (
                                                            <span className="text-[9px] text-gray-400 font-medium truncate">• {store.neighborhood}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1E5BFF] transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 px-4 text-center">
                                        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <SearchX className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Nenhum estabelecimento</p>
                                        <p className="text-xs text-gray-500">Não encontramos nada para "{searchTerm}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {isMerchant && onOpenMerchantQr && (
                    <button 
                        onClick={onOpenMerchantQr}
                        className={`w-11 h-11 rounded-2xl bg-[#1E5BFF] flex items-center justify-center text-white hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/30`}
                    >
                        <QrCode className="w-5 h-5" />
                    </button>
                )}
            </div>

            {showNeighborhoodFilter && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 pb-3 pt-1">
                    <button
                        onClick={() => setNeighborhood("Jacarepaguá (todos)")}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            currentNeighborhood === "Jacarepaguá (todos)"
                            ? "bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-sm shadow-blue-500/30"
                            : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-800 hover:bg-gray-100"
                        }`}
                    >
                        Todos
                    </button>
                    {NEIGHBORHOODS.map(hood => (
                        <button
                            key={hood}
                            onClick={() => setNeighborhood(hood)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                currentNeighborhood === hood
                                ? "bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-sm shadow-blue-500/30"
                                : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-800 hover:bg-gray-100"
                            }`}
                        >
                            {hood}
                        </button>
                    ))}
                </div>
            )}
        </div>
        </div>
        <NeighborhoodSelectorModal />
    </>
  );
};

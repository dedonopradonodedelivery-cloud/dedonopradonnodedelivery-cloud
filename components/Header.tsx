
import React from 'react';
import { Search, QrCode, User as UserIcon, MapPin, ChevronDown, Check } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';

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
  userRole,
  onOpenMerchantQr,
  customPlaceholder,
}) => {
  const isMerchant = userRole === 'lojista';
  const { currentNeighborhood, toggleSelector } = useNeighborhood();

  return (
    <>
        <div 
        className={`
            sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-all duration-300 ease-in-out shadow-sm border-b border-gray-100 dark:border-gray-800
        `}
        >
        <div className="max-w-md mx-auto flex flex-col">
            
            {/* Top Row: Location & Profile */}
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
                            <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[150px]">
                                {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
                            </span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </div>
                    </div>
                </button>

                {/* Profile / Menu Button */}
                <button 
                    onClick={onAuthClick}
                    className="flex items-center gap-2 outline-none group active:scale-95 transition-transform bg-gray-50 dark:bg-gray-800 p-1 pl-3 rounded-full border border-gray-100 dark:border-gray-700"
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

            {/* Bottom Row: Search Bar */}
            <div className={`flex items-center gap-3 px-4 pb-3 pt-2 transition-all duration-300 ease-in-out`}>
            
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#1E5BFF] transition-colors" />
                </div>
                <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={customPlaceholder || `Buscar em ${currentNeighborhood === "Jacarepaguá (todos)" ? "JPA" : currentNeighborhood}...`}
                className={`block w-full pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 transition-all shadow-inner py-3`}
                />
            </div>

            {/* Exibe QR Code no header APENAS para lojistas (atalho rápido) */}
            {isMerchant && onOpenMerchantQr && (
                <button 
                    onClick={onOpenMerchantQr}
                    className={`w-11 h-11 rounded-2xl bg-[#1E5BFF] flex items-center justify-center text-white hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/30`}
                >
                    <QrCode className="w-5 h-5" />
                </button>
            )}

            </div>
        </div>
        </div>
        
        <NeighborhoodSelectorModal />
    </>
  );
};


import React from 'react';
import { Search, QrCode, User as UserIcon } from 'lucide-react';

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

  return (
    <div 
      className={`
        sticky top-0 z-40 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md transition-all duration-300 ease-in-out shadow-sm border-b border-gray-100 dark:border-gray-800
      `}
    >
      <div className="max-w-md mx-auto flex flex-col">
        
        {/* Top Row: Search + Profile/Menu */}
        <div className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 ease-in-out`}>
          
          {/* Search Bar */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#1E5BFF] transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={customPlaceholder || "Buscar..."}
              className={`block w-full pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border-none rounded-full text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 transition-all shadow-inner py-2.5`}
            />
          </div>

          {/* Exibe QR Code no header APENAS para lojistas (atalho rápido) */}
          {isMerchant && onOpenMerchantQr && (
             <button 
                onClick={onOpenMerchantQr}
                className={`w-10 h-10 rounded-full bg-[#1E5BFF] flex items-center justify-center text-white hover:bg-blue-600 transition-all active:scale-95 shadow-md`}
             >
                <QrCode className="w-5 h-5" />
             </button>
          )}

          {/* Profile / Menu Button with Label */}
          <button 
            onClick={onAuthClick}
            className="flex flex-col items-center gap-0.5 outline-none group active:scale-95 transition-transform"
          >
             <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E5BFF] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all border border-blue-100 dark:border-blue-800 overflow-hidden relative">
               {user?.user_metadata?.avatar_url ? (
                 <img src={user.user_metadata.avatar_url} alt="Perfil" className="w-full h-full object-cover" />
               ) : (
                 <UserIcon className="w-5 h-5" />
               )}
               {/* Indicador de notificação (opcional) */}
               {!user && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></div>}
             </div>
             <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 group-hover:text-[#1E5BFF] leading-none tracking-tight">
                {user ? 'Perfil' : 'Entrar'}
             </span>
          </button>

        </div>
      </div>
    </div>
  );
};

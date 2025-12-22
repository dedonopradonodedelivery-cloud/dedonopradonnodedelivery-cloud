
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, QrCode } from 'lucide-react';
import { Category } from '../types';
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
  onOpenMerchantQr?: () => void;
  customPlaceholder?: string;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  toggleTheme,
  searchTerm,
  onSearchChange,
  activeTab,
  userRole,
  onOpenMerchantQr,
  customPlaceholder,
}) => {
  const isMerchant = userRole === 'lojista';

  return (
    <div 
      className={`
        sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-all duration-300 ease-in-out
      `}
    >
      <div className="max-w-md mx-auto flex flex-col">
        
        {/* Top Row: Search + Theme + (Merchant QR) */}
        <div className={`flex items-center gap-3 px-5 py-3 transition-all duration-300 ease-in-out`}>
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#2D6DF6] transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={customPlaceholder || "Buscar..."}
              className={`block w-full pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border-none rounded-full text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6DF6]/50 transition-all shadow-inner py-2.5`}
            />
          </div>

          <button 
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 border border-transparent dark:border-gray-700`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Exibe QR Code no header APENAS para lojistas (atalho rápido) */}
          {isMerchant && onOpenMerchantQr && (
             <button 
                onClick={onOpenMerchantQr}
                className={`w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF] hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all active:scale-95`}
             >
                <QrCode className="w-5 h-5" />
             </button>
          )}
        </div>
      </div>
    </div>
  );
};
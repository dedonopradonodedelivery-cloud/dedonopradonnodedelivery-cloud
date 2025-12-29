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
        sticky top-0 z-40 w-full bg-[#1E5BFF] transition-all duration-300 ease-in-out shadow-lg
      `}
    >
      <div className="max-w-md mx-auto flex flex-col">
        
        {/* Top Row: Search + Theme + (Merchant QR) */}
        <div className={`flex items-center gap-3 px-5 py-3 transition-all duration-300 ease-in-out`}>
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white/70 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={customPlaceholder || "Buscar..."}
              className={`block w-full pl-10 pr-4 bg-white/20 border-none rounded-full text-sm font-medium text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all shadow-inner py-2.5`}
            />
          </div>

          <button 
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95 border border-white/10`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Exibe QR Code no header APENAS para lojistas (atalho rápido) */}
          {isMerchant && onOpenMerchantQr && (
             <button 
                onClick={onOpenMerchantQr}
                className={`w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1E5BFF] hover:bg-blue-50 transition-all active:scale-95 shadow-sm`}
             >
                <QrCode className="w-5 h-5" />
             </button>
          )}
        </div>
      </div>
    </div>
  );
};
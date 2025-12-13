
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onAuthClick: () => void; // Kept for interface compatibility, but not used in UI
  user: any;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
  userRole: "cliente" | "lojista" | null;
  onOpenMerchantQr?: () => void;
  customPlaceholder?: string;
  onSelectCategory?: (category: Category) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  toggleTheme,
  searchTerm,
  onSearchChange,
  activeTab,
  customPlaceholder,
  onSelectCategory
}) => {
  const [showCategories, setShowCategories] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isHome = activeTab === 'home';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Logic: Show at top, hide on scroll down, show on scroll up
      if (currentScrollY < 10) {
        setShowCategories(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowCategories(false); // Scrolling down
      } else if (currentScrollY < lastScrollY) {
        setShowCategories(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    if (isHome) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      setShowCategories(false);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isHome]);

  // Reset state when tab changes
  useEffect(() => {
    setShowCategories(isHome);
  }, [isHome]);

  return (
    <div 
      className={`
        sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out shadow-sm
        ${showCategories && isHome ? 'pb-0' : 'pb-0'}
      `}
    >
      <div className="max-w-md mx-auto flex flex-col">
        
        {/* Top Row: Search + Theme */}
        <div className="flex items-center gap-3 px-5 py-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#2D6DF6] transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={customPlaceholder || "Buscar..."}
              className="block w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-full text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6DF6]/50 transition-all shadow-inner"
            />
          </div>

          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 border border-transparent dark:border-gray-700"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Categories Row (Collapsible) */}
        <div 
          className={`
            overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${showCategories && isHome ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar px-5 pb-3 pt-1">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => onSelectCategory && onSelectCategory(cat)}
                className="flex flex-col items-center gap-1.5 min-w-[64px] group cursor-pointer"
              >
                <div className="w-8 h-8 text-gray-400 group-hover:text-[#2D6DF6] transition-colors">
                  {/* Clone element to force color inheritance or styling if needed */}
                  {React.isValidElement(cat.icon) 
                    ? React.cloneElement(cat.icon as React.ReactElement<any>, { 
                        className: "w-7 h-7 text-gray-500 dark:text-gray-400 group-hover:text-[#2D6DF6] dark:group-hover:text-[#2D6DF6] transition-colors", 
                        strokeWidth: 1.5 
                      }) 
                    : cat.icon}
                </div>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white whitespace-nowrap transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

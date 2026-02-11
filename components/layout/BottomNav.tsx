
import React from 'react';
import { Home, User as UserIcon, Newspaper, Compass } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | 'admin' | null;
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'explore', icon: Compass, label: 'Explorar' },
    { id: 'classifieds', icon: Newspaper, label: 'Classificados' },
    { id: 'profile', icon: UserIcon, label: 'Menu' },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  // Helper para verificar se a aba está ativa, incluindo sub-rotas do perfil
  const getIsActive = (id: string) => {
    if (id === 'profile') {
      return ['profile', 'store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'about', 'support', 'favorites', 'user_profile_full', 'edit_profile_view'].includes(activeTab);
    }
    return activeTab === id;
  };

  const renderIconOrAvatar = (item: NavItem, isActive: boolean) => {
    if (item.id === 'profile' && user) {
      const photoUrl = user.user_metadata?.avatar_url;
      const userInitial = user.email?.charAt(0).toUpperCase() || 'U';

      return (
        <div className={`w-6 h-6 rounded-full overflow-hidden flex items-center justify-center transition-all duration-500 border ${
          isActive 
            ? 'border-white/50 scale-110 shadow-sm' 
            : 'border-gray-200 dark:border-gray-700 opacity-70'
        }`}>
          {photoUrl ? (
            <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-[9px] font-black ${
              isActive ? 'bg-[#1E5BFF] text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {userInitial}
            </div>
          )}
        </div>
      );
    }

    const Icon = item.icon;
    return (
      <div className="relative">
        {/* SVG Definition for Gradient - Rendered only once */}
        <svg width="0" height="0" className="absolute">
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E5BFF" />
            <stop offset="100%" stopColor="#030816" />
          </linearGradient>
        </svg>

        <Icon 
          size={22}
          style={{ stroke: isActive ? 'url(#icon-gradient)' : 'currentColor' }}
          className={`transition-all duration-300 ${
            isActive 
              ? 'opacity-100 drop-shadow-[0_2px_4px_rgba(30,91,255,0.2)]' 
              : 'text-gray-400 opacity-60'
          }`} 
          strokeWidth={isActive ? 2.8 : 2} 
        />
      </div>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white/80 dark:bg-gray-950/90 backdrop-blur-xl z-[1000] h-[85px] rounded-t-[2.5rem] shadow-[0_-8px_40px_rgba(0,0,0,0.06)] border-t border-gray-100/50 dark:border-gray-800/50">
      <div className="flex w-full h-full items-center justify-around px-4 relative">
        
        {navItems.map((item) => {
          const isActive = getIsActive(item.id);

          return (
            <button 
              key={item.id}
              onClick={() => handleTabClick(item.id)} 
              className={`relative flex-1 flex flex-col items-center justify-center h-full outline-none group z-10`}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="glassDrop"
                    className="absolute inset-0 m-1.5 rounded-[1.8rem] bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.04)] backdrop-blur-md"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                      mass: 1,
                    }}
                  />
                )}
              </AnimatePresence>

              <motion.div 
                className="relative z-20 flex flex-col items-center gap-1"
                animate={{ scale: isActive ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="flex items-center justify-center h-7 w-7">
                  {renderIconOrAvatar(item, isActive)}
                </div>
                
                <span className={`text-[8px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive 
                    ? 'text-[#1E5BFF] opacity-90' 
                    : 'text-gray-400 opacity-60'
                }`}>
                  {item.label}
                </span>
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

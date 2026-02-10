
import React, { useMemo } from 'react';
import { Home, User as UserIcon, Newspaper, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatures, FeatureKey } from '../contexts/FeatureContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | null;
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  featureKey?: FeatureKey;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole }) => {
  const { user } = useAuth();
  const { isFeatureActive } = useFeatures();

  // 1) Barra de navegação fixa inferior com Início, Buscar, Classificados e Perfil
  const allNavItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início', featureKey: 'home_tab' },
    { id: 'search', icon: Search, label: 'Buscar' }, 
    { id: 'classifieds', icon: Newspaper, label: 'Classificados', featureKey: 'classifieds' },
    { id: 'profile', icon: UserIcon, label: 'Perfil' },
  ];

  const activeNavItems = useMemo(() => {
    return allNavItems.filter(item => {
      if (!item.featureKey) return true; 
      return isFeatureActive(item.featureKey);
    });
  }, [isFeatureActive]);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  const renderIconOrAvatar = (item: NavItem, isActive: boolean) => {
    if (item.id === 'profile' && user) {
      const userInitial = user.email?.charAt(0).toUpperCase() || user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U';
      const photoUrl = user.user_metadata?.avatar_url;

      return (
        <div className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 border-2 ${
          isActive 
            ? 'border-[#1E5BFF] scale-110 shadow-lg' 
            : 'border-gray-200 dark:border-gray-700'
        }`}>
          {photoUrl ? (
            <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-[11px] font-black ${
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
      <Icon 
        size={24}
        className={`transition-all duration-300 ${
          isActive 
            ? 'text-[#1E5BFF] scale-110' 
            : 'text-gray-400 dark:text-gray-600'
        }`} 
        strokeWidth={isActive ? 2.5 : 2} 
      />
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-gray-900 z-[1000] h-[80px] rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] border-t border-gray-100 dark:border-gray-800">
      <div 
        className="grid w-full h-full px-2"
        style={{ gridTemplateColumns: `repeat(${activeNavItems.length}, minmax(0, 1fr))` }}
      >
        {activeNavItems.map((item) => {
          const isProfileTab = (item.id === 'profile' && ['store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'about', 'support', 'favorites', 'user_profile_full', 'edit_profile_view', 'user_coupons', 'merchant_coupons'].includes(activeTab));
          const isActive = activeTab === item.id || isProfileTab;

          return (
            <button 
              key={item.id}
              onClick={() => handleTabClick(item.id)} 
              className="w-full h-full flex flex-col items-center justify-center gap-1 active:scale-95 transition-all outline-none group" 
              aria-label={item.label}
            >
              <div className="relative flex items-center justify-center h-8">
                {renderIconOrAvatar(item, isActive)}
                {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-[#1E5BFF] rounded-full"></div>
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${
                isActive 
                  ? 'text-[#1E5BFF] translate-y-0.5' 
                  : 'text-gray-400 dark:text-gray-600'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

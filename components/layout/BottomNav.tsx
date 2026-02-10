
import React, { useMemo } from 'react';
import { Home, Newspaper, Search, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFeatures, FeatureKey } from '../../contexts/FeatureContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | 'admin' | null;
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  featureKey?: FeatureKey;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { isFeatureActive } = useFeatures();
  
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

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-gray-900 z-[1000] h-[80px] rounded-t-[1.5rem] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 dark:border-gray-800">
      <div className="flex w-full h-full justify-around items-center px-2">
        {activeNavItems.map((item) => {
          const isProfileGroup = ['profile', 'user_profile_full', 'edit_profile_view', 'user_coupons', 'merchant_coupons', 'store_area', 'store_finance', 'store_support'].includes(activeTab);
          const isActive = activeTab === item.id || (item.id === 'profile' && isProfileGroup);
          const Icon = item.icon;

          return (
            <button 
              key={item.id}
              onClick={() => handleTabClick(item.id)} 
              className="flex flex-col items-center justify-center flex-1 h-full outline-none active:scale-95 transition-all" 
              aria-label={item.label}
            >
              <Icon 
                size={22}
                className={`transition-all duration-300 ${isActive ? 'text-[#1E5BFF]' : 'text-gray-400'}`} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className={`font-black uppercase tracking-tighter text-[8px] mt-1 transition-all ${
                isActive ? 'text-[#1E5BFF]' : 'text-gray-400'
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

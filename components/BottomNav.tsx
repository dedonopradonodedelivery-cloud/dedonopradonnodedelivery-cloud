import React, { useMemo } from 'react';
import { Home, Newspaper, Compass, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatures, FeatureKey } from '@/contexts/FeatureContext';

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

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole }) => {
  const { user } = useAuth();
  const { isFeatureActive } = useFeatures();

  const allNavItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início', featureKey: 'home_tab' },
    { id: 'explore', icon: Compass, label: 'Guia', featureKey: 'explore_guide' },
    { id: 'classifieds', icon: Newspaper, label: 'Classificados', featureKey: 'classifieds' },
    { id: 'profile', icon: User, label: 'Menu' },
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

  if (activeNavItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-gray-900 z-[1000] h-[80px] rounded-t-[24px] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 dark:border-gray-800 px-1">
      <div 
        className="grid w-full h-full"
        style={{ gridTemplateColumns: `repeat(${activeNavItems.length}, minmax(0, 1fr))` }}
      >
        {activeNavItems.map((item) => {
          const isProfileGroup = [
            'profile', 'user_profile_full', 'edit_profile_view', 'store_area', 
            'merchant_panel', 'store_profile', 'merchant_performance', 'merchant_leads',
            'merchant_reviews', 'merchant_coupons', 'merchant_promotions', 'store_finance',
            'store_support', 'jpa_connect', 'store_claim_flow', 'app_suggestion', 
            'about_app', 'support', 'favorites', 'user_activity', 'my_neighborhoods', 'privacy_policy',
            'user_coupons', 'coupon_landing' // Adicionado para manter o menu ativo
          ].includes(activeTab);
          
          const isActive = 
            activeTab === item.id || 
            (item.id === 'profile' && isProfileGroup);
          
          const Icon = item.icon;

          return (
            <button 
              key={item.id}
              onClick={() => handleTabClick(item.id)} 
              className="w-full h-full flex flex-col items-center justify-center outline-none active:scale-95 transition-all relative group pt-1"
            >
              <div className="relative flex flex-col items-center">
                <Icon 
                  size={24}
                  className={`transition-colors duration-200 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500'}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500'}`}>
                  {item.label}
                </span>
              </div>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
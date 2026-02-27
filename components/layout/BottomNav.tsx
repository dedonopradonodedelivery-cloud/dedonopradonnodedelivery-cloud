
import React, { useMemo } from 'react';
import { Home, Compass, User } from 'lucide-react';
import { useFeatures, FeatureKey } from '@/contexts/FeatureContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
    { id: 'explore', icon: Compass, label: 'Explorar', featureKey: 'explore_guide' },
    { id: 'profile', icon: User, label: 'Menu' },
  ];

  const activeNavItems = useMemo(() => {
    return allNavItems.filter(item => {
      if (!item.featureKey) return true;
      return isFeatureActive(item.featureKey);
    });
  }, [isFeatureActive]);

  const activeIndex = useMemo(() => {
    const idx = activeNavItems.findIndex(item => {
        const isProfileGroup = [
            'profile', 'user_profile_full', 'edit_profile_view', 'store_area', 
            'merchant_panel', 'store_profile', 'merchant_performance', 'merchant_leads',
            'merchant_reviews', 'merchant_coupons', 'merchant_promotions', 'store_finance',
            'store_support', 'jpa_connect', 'store_claim_flow', 'app_suggestion', 
            'about_app', 'support', 'favorites', 'user_activity', 'my_neighborhoods', 'privacy_policy',
            'user_coupons', 'coupon_landing'
          ].includes(activeTab);
          return activeTab === item.id || (item.id === 'profile' && isProfileGroup);
    });
    return idx === -1 ? 0 : idx;
  }, [activeTab, activeNavItems]);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  if (activeNavItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl z-[1000] h-[85px] rounded-t-[32px] shadow-[0_-10px_50px_rgba(0,0,0,0.08)] border-t border-gray-100 dark:border-gray-800/50 px-4 flex items-center">
      <div className="relative w-full h-full grid" style={{ gridTemplateColumns: `repeat(${activeNavItems.length}, 1fr)` }}>
        
        {/* Floating Bubble Indicator */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 h-[52px] bg-brand-blue rounded-full shadow-lg shadow-blue-500/20 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0 flex items-center justify-center"
          style={{ 
            width: `calc(${(100 / activeNavItems.length)}% - 16px)`,
            left: `calc(${(activeIndex * (100 / activeNavItems.length))}% + 8px)`,
          }}
        />

        {activeNavItems.map((item) => {
          const isProfileGroup = [
            'profile', 'user_profile_full', 'edit_profile_view', 'store_area', 
            'merchant_panel', 'store_profile', 'merchant_performance', 'merchant_leads',
            'merchant_reviews', 'merchant_coupons', 'merchant_promotions', 'store_finance',
            'store_support', 'jpa_connect', 'store_claim_flow', 'app_suggestion', 
            'about_app', 'support', 'favorites', 'user_activity', 'my_neighborhoods', 'privacy_policy',
            'user_coupons', 'coupon_landing'
          ].includes(activeTab);
          
          const isActive = activeTab === item.id || (item.id === 'profile' && isProfileGroup);
          const Icon = item.icon;

          return (
            <button 
              key={item.id}
              onClick={() => handleTabClick(item.id)} 
              className="w-full h-full flex flex-col items-center justify-center outline-none relative z-10 active:scale-95 transition-transform duration-200"
            >
              <Icon 
                size={24}
                className={`transition-all duration-300 transform mb-1 ${isActive ? 'text-white' : 'text-brand-blue'}`}
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-white' : 'text-brand-blue'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

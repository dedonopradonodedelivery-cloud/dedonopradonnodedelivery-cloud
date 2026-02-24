
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
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-[1000] h-[85px] rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.06)] border-t border-gray-100 dark:border-gray-800 px-2 flex items-center">
      <div className="relative w-full h-full grid" style={{ gridTemplateColumns: `repeat(${activeNavItems.length}, minmax(0, 1fr))` }}>
        
        {/* REFINED MAGNETIC INDICATOR (Liquid Movement) */}
        <div 
          className="absolute top-[15%] h-[60%] bg-blue-500/5 dark:bg-blue-400/10 blur-md rounded-full transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] z-0"
          style={{ 
            width: `${(100 / activeNavItems.length) * 0.8}%`,
            left: `${(activeIndex * (100 / activeNavItems.length)) + (100 / activeNavItems.length) * 0.1}%`,
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
              className="w-full h-full flex flex-col items-center justify-center outline-none relative z-10 active:scale-95 transition-all duration-300"
            >
              <div className="relative mb-1 flex items-center justify-center">
                {/* SUBTLE ACTIVE BACKGROUND CIRCLE */}
                <div className={`absolute w-10 h-10 rounded-full bg-[#1E5BFF]/5 dark:bg-[#1E5BFF]/10 transition-all duration-500 ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
                
                <Icon 
                  size={24}
                  className={`transition-all duration-300 transform ${
                    isActive 
                      ? 'text-[#1E5BFF] scale-110 -translate-y-1' 
                      : 'text-slate-400 dark:text-slate-500 opacity-60 scale-100 translate-y-0'
                  }`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
              </div>
              
              <span className={`text-[9px] font-black uppercase tracking-[0.12em] transition-all duration-300 ${
                isActive 
                  ? 'text-[#1E5BFF] opacity-100 translate-y-0' 
                  : 'text-slate-400 dark:text-slate-500 opacity-40 translate-y-0.5'
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

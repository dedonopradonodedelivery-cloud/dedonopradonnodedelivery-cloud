
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

  // DEFINIÇÃO DE CORE NAVIGATION (Premium 3-Tab Layout)
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

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  if (activeNavItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-brand-blue z-[1000] h-[80px] rounded-t-[24px] shadow-[0_-10px_30px_rgba(0,0,0,0.15)] border-t border-white/10 px-1">
      <div 
        className="grid w-full h-full"
        style={{ gridTemplateColumns: `repeat(${activeNavItems.length}, minmax(0, 1fr))` }}
      >
        {activeNavItems.map((item) => {
          // Agrupamento de visualização de perfil para manter o item Menu ativo
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
              className="w-full h-full flex flex-col items-center justify-center outline-none active:scale-95 transition-all relative"
            >
              <div className="relative mb-1">
                <Icon 
                  size={24}
                  className={`transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-white/50'}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-white opacity-100' : 'text-white/40'}`}>
                {item.label}
              </span>
              
              {/* Indicador Ativo Minimalista (Padrão Apple/iOS) */}
              {isActive && (
                <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

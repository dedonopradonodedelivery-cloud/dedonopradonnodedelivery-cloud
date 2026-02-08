
import React, { useMemo } from 'react';
import { Home, Newspaper, MessageSquare, Ticket } from 'lucide-react';
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

  // Lista de itens da navegação, sem o "Menu"
  const allNavItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início', featureKey: 'home_tab' },
    { id: 'neighborhood_posts', icon: MessageSquare, label: 'JPA Conversa', featureKey: 'community_feed' },
    { id: 'coupons_trigger', icon: Ticket, label: 'Cupom', featureKey: 'coupons' }, 
    { id: 'classifieds', icon: Newspaper, label: 'Classificados', featureKey: 'classifieds' },
  ];

  const activeNavItems = useMemo(() => {
    return allNavItems.filter(item => {
      if (!item.featureKey) return true;
      return isFeatureActive(item.featureKey);
    });
  }, [isFeatureActive]);

  const handleTabClick = (id: string) => {
    if (id === 'coupons_trigger') {
      if (userRole === 'lojista') {
        setActiveTab('merchant_coupons');
      } else {
        setActiveTab('user_coupons');
      }
    } else {
      setActiveTab(id);
    }
  };

  const renderIconOrAvatar = (item: NavItem, isActive: boolean) => {
    const Icon = item.icon;
    return (
      <Icon 
        className={`w-6 h-6 transition-all duration-300 ${
          isActive 
            ? 'text-white opacity-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]' 
            : 'text-white opacity-70'
        }`} 
        strokeWidth={isActive ? 2.5 : 2} 
      />
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-[#1E5BFF] z-[1000] h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.3)] border-t border-white/10">
      <div 
        className="grid w-full h-full"
        style={{ gridTemplateColumns: `repeat(${activeNavItems.length}, minmax(0, 1fr))` }}
      >
        {activeNavItems.map((item) => {
          const isCouponTab = (item.id === 'coupons_trigger' && (activeTab === 'user_coupons' || activeTab === 'merchant_coupons'));
          const isActive = activeTab === item.id || isCouponTab;

          return (
            <div key={item.id} className="flex justify-center items-center h-full">
               <button 
                onClick={() => handleTabClick(item.id)} 
                className="w-full h-full flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform outline-none" 
                aria-label={item.label}
              >
                <div className="flex items-center justify-center h-8">
                  {renderIconOrAvatar(item, isActive)}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-tighter transition-all ${
                  isActive 
                    ? 'text-white opacity-100 scale-105' 
                    : 'text-white opacity-70'
                }`}>
                  {item.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

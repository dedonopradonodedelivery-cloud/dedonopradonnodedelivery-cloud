import React, { useMemo } from 'react';
import { Home, User as UserIcon, Newspaper, MessageSquare, Ticket, Compass } from 'lucide-react';
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
  badge?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole }) => {
  const { user } = useAuth();
  const { isFeatureActive } = useFeatures();
  
  const hasActiveCoupons = useMemo(() => {
    if (!user || userRole !== 'cliente') return false;
    try {
      const saved = JSON.parse(localStorage.getItem('user_saved_coupons') || '[]');
      return saved.some((c: any) => c.status === 'available');
    } catch {
      return false;
    }
  }, [user, userRole]);

  const allNavItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início', featureKey: 'home_tab' },
    { id: 'explore', icon: Compass, label: 'Guia', featureKey: 'explore_guide' },
    { id: 'cupom_trigger', icon: Ticket, label: 'Cupons', featureKey: 'coupons', badge: userRole !== 'lojista' ? hasActiveCoupons : false },
    { id: 'classifieds', icon: Newspaper, label: 'Classificados', featureKey: 'classifieds' },
    { id: 'neighborhood_posts', icon: MessageSquare, label: 'Conversa', featureKey: 'community_feed' },
    { id: 'profile', icon: UserIcon, label: 'Menu' },
  ];

  const activeNavItems = useMemo(() => {
    return allNavItems.filter(item => {
      if (!item.featureKey) return true;
      return isFeatureActive(item.featureKey);
    });
  }, [isFeatureActive]);

  const handleTabClick = (item: NavItem) => {
    if (item.id === 'cupom_trigger') {
      if (!user) {
        setActiveTab('coupon_landing');
      } else {
        setActiveTab(userRole === 'lojista' ? 'merchant_coupons' : 'user_coupons');
      }
    } else {
      setActiveTab(item.id);
    }
  };

  const renderIconOrAvatar = (item: NavItem, isActive: boolean, isSpecial: boolean) => {
    if (item.id === 'profile' && user) {
      const userInitial = user.email?.charAt(0).toUpperCase() || user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U';
      const photoUrl = user.user_metadata?.avatar_url;

      return (
        <div className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center transition-all duration-200 border-2 ${
          isActive ? 'border-white scale-110 shadow-lg' : 'border-white/20'
        }`}>
          {photoUrl ? (
            <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-[10px] font-black ${
              isActive ? 'bg-white text-blue-600' : 'bg-white/20 text-white/80'
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
        <Icon 
          size={isSpecial ? 26 : 22}
          className={`transition-all duration-300 ${
            isSpecial 
              ? (isActive ? 'text-blue-600' : 'text-blue-500') 
              : (isActive ? 'text-white scale-105' : 'text-white/60')
          }`} 
          strokeWidth={isSpecial || isActive ? 2.5 : 2} 
        />
        {item.badge && (
          <span className={`absolute ${isSpecial ? '-top-1 -right-1.5' : '-top-1 -right-1'} w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-sm`}></span>
        )}
      </div>
    );
  };

  if (activeNavItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-blue-600 z-[1000] h-[80px] rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.25)] border-t border-white/10 px-1">
      <div 
        className="grid w-full h-full"
        style={{ gridTemplateColumns: `repeat(${activeNavItems.length}, minmax(0, 1fr))` }}
      >
        {activeNavItems.map((item) => {
          const isProfileGroup = ['store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'about', 'support', 'favorites', 'user_profile_full', 'edit_profile_view'].includes(activeTab);
          const isCouponGroup = ['merchant_coupons', 'user_coupons', 'coupon_landing'].includes(activeTab);
          
          const isActive = 
            activeTab === item.id || 
            (item.id === 'profile' && isProfileGroup) ||
            (item.id === 'cupom_trigger' && isCouponGroup);

          const isSpecial = item.id === 'cupom_trigger' || item.id === 'classifieds';

          return (
            <div key={item.id} className="relative flex items-center justify-center">
              <button 
                onClick={() => handleTabClick(item)} 
                className={`flex flex-col items-center justify-center outline-none transition-all duration-300 ${
                  isSpecial 
                    ? `w-14 h-14 rounded-2xl bg-white shadow-[0_8px_20px_rgba(0,0,0,0.3)] border-2 border-amber-400 -translate-y-7 active:scale-90` 
                    : 'w-full h-full active:scale-95'
                }`} 
              >
                <div className={isSpecial ? '' : 'mb-1'}>
                  {renderIconOrAvatar(item, isActive, isSpecial)}
                </div>
                
                {/* O Label dos botões especiais fica fora do botão elevado para manter alinhamento na barra */}
                {!isSpecial && (
                  <span className={`font-black uppercase tracking-tighter text-[8px] ${
                    isActive ? 'text-white opacity-100' : 'text-white/60'
                  }`}>
                    {item.label}
                  </span>
                )}
              </button>

              {/* Label flutuante para itens especiais (posicionado de volta na barra) */}
              {isSpecial && (
                <span className={`absolute bottom-2 font-black uppercase tracking-tighter text-[8px] transition-all duration-300 ${
                  isActive ? 'text-white scale-110' : 'text-white/60'
                }`}>
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

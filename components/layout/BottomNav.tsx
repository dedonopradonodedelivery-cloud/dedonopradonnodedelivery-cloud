
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
  
  // Verificação de cupons ativos para o badge
  const hasActiveCoupons = useMemo(() => {
    if (!user || userRole !== 'cliente') return false;
    try {
      const saved = JSON.parse(localStorage.getItem('user_saved_coupons') || '[]');
      return saved.some((c: any) => c.status === 'available');
    } catch {
      return false;
    }
  }, [user, userRole]);

  // Lista completa de abas possíveis com seus respectivos mapeamentos de FeatureKey do ADM
  const allNavItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início', featureKey: 'home_tab' },
    { id: 'explore', icon: Compass, label: 'Guia', featureKey: 'explore_guide' },
    { id: 'cupom_trigger', icon: Ticket, label: 'Cupons', featureKey: 'coupons', badge: userRole !== 'lojista' ? hasActiveCoupons : false },
    { id: 'classifieds', icon: Newspaper, label: 'Classificados', featureKey: 'classifieds' },
    { id: 'neighborhood_posts', icon: MessageSquare, label: 'Conversa', featureKey: 'community_feed' },
    { id: 'profile', icon: UserIcon, label: 'Menu' }, // Menu sempre visível
  ];

  // FILTRAGEM REAL: Só renderiza se a funcionalidade estiver ON no ADM
  const activeNavItems = useMemo(() => {
    return allNavItems.filter(item => {
      // Se não tem featureKey (ex: aba Menu), é sempre visível
      if (!item.featureKey) return true;
      // Consulta o estado do toggle no ADM via FeatureContext
      return isFeatureActive(item.featureKey);
    });
  }, [isFeatureActive, userRole, hasActiveCoupons]);

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

  const renderIconOrAvatar = (item: NavItem, isActive: boolean) => {
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
          size={22}
          className={`transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-white/60'}`} 
          strokeWidth={isActive ? 2.5 : 2} 
        />
        {item.badge && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-blue-600 animate-pulse"></span>
        )}
      </div>
    );
  };

  // Se por algum motivo todas as abas forem desativadas, não renderiza a barra
  if (activeNavItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-blue-600 z-[1000] h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.2)] border-t border-white/10 px-2">
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

          return (
            <button 
              key={item.id}
              onClick={() => handleTabClick(item)} 
              className="w-full h-full flex flex-col items-center justify-center outline-none active:scale-95 transition-transform" 
            >
              <div className="mb-1">
                {renderIconOrAvatar(item, isActive)}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tighter transition-all ${
                isActive ? 'text-white opacity-100' : 'text-white/60'
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

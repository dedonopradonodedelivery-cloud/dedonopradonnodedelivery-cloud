
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

  // Filtra itens baseados nas flags do ADM (exceto Buscar e Perfil que são obrigatórios)
  const activeNavItems = useMemo(() => {
    return allNavItems.filter(item => {
      if (!item.featureKey) return true;
      return isFeatureActive(item.featureKey);
    });
  }, [isFeatureActive]);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  const renderIcon = (item: NavItem, isActive: boolean) => {
    const Icon = item.icon;
    return (
      <Icon 
        size={24}
        className={`transition-all duration-300 ${isActive ? 'text-[#1E5BFF] scale-110' : 'text-gray-400'}`} 
        strokeWidth={isActive ? 2.5 : 2} 
      />
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-gray-900 z-[1000] h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.08)] border-t border-gray-100 dark:border-gray-800 px-2">
      <div 
        className="grid w-full h-full"
        style={{ gridTemplateColumns: `repeat(${activeNavItems.length}, minmax(0, 1fr))` }}
      >
        {activeNavItems.map((item) => {
          const isProfileGroup = ['profile', 'user_profile_full', 'edit_profile_view', 'user_coupons', 'merchant_coupons', 'store_area', 'store_finance', 'store_support', 'merchant_performance', 'merchant_leads', 'merchant_reviews', 'merchant_promotions', 'jpa_connect'].includes(activeTab);
          
          const isActive = activeTab === item.id || (item.id === 'profile' && isProfileGroup);

          return (
            <button 
              key={item.id}
              onClick={() => handleTabClick(item.id)} 
              className="w-full h-full flex flex-col items-center justify-center outline-none active:scale-95 transition-all" 
              aria-label={item.label}
            >
              <div className="mb-1">
                {renderIcon(item, isActive)}
              </div>
              <span className={`font-black uppercase tracking-tighter text-[9px] transition-all ${
                isActive ? 'text-[#1E5BFF]' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-[#1E5BFF] rounded-full mt-1"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

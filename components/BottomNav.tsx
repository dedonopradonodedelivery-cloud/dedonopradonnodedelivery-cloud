import React, { useMemo } from 'react';
import { Home, Newspaper, MessageSquare, Ticket, Compass } from 'lucide-react';
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
  // Item "Menu" removido da barra inferior
  const allNavItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início', featureKey: 'home_tab' },
    { id: 'explore', icon: Compass, label: 'Guia', featureKey: 'explore_guide' },
    { id: 'cupom_trigger', icon: Ticket, label: 'Cupons', featureKey: 'coupons', badge: userRole !== 'lojista' ? hasActiveCoupons : false },
    { id: 'classifieds', icon: Newspaper, label: 'Classificados', featureKey: 'classifieds' },
    { id: 'neighborhood_posts', icon: MessageSquare, label: 'Conversa', featureKey: 'community_feed' },
  ];

  // FILTRAGEM REAL: Só renderiza se a funcionalidade estiver ON no ADM
  const activeNavItems = useMemo(() => {
    return allNavItems.filter(item => {
      // Se não tem featureKey (ex: itens fixos), é sempre visível
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

  const renderIconOrAvatar = (item: NavItem, isActive: boolean, isSpecial: boolean) => {
    const Icon = item.icon;
    return (
      <div className="relative">
        <Icon 
          size={isSpecial ? 25 : 22}
          className={`transition-all duration-300 ${isActive ? 'text-white scale-105' : 'text-white/60'}`} 
          strokeWidth={isActive ? 2.5 : 2} 
        />
        {item.badge && (
          <span className={`absolute ${isSpecial ? '-top-1 -right-1.5' : '-top-1 -right-1'} w-2 h-2 bg-yellow-400 rounded-full border border-blue-600 animate-pulse`}></span>
        )}
      </div>
    );
  };

  // Se por algum motivo todas as abas forem desativadas, não renderiza a barra
  if (activeNavItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-blue-600 z-[1000] h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.2)] border-t border-white/10 px-1">
      <div 
        className="grid w-full h-full"
        style={{ gridTemplateColumns: `repeat(${activeNavItems.length}, minmax(0, 1fr))` }}
      >
        {activeNavItems.map((item) => {
          const isCouponGroup = ['merchant_coupons', 'user_coupons', 'coupon_landing'].includes(activeTab);
          
          const isActive = 
            activeTab === item.id || 
            (item.id === 'cupom_trigger' && isCouponGroup);

          // IDENTIFICAÇÃO DE ABAS ESPECIAIS (CUPOM E CLASSIFICADOS)
          const isSpecial = item.id === 'cupom_trigger' || item.id === 'classifieds';

          return (
            <button 
              key={item.id}
              onClick={() => handleTabClick(item)} 
              className={`w-full h-full flex flex-col items-center justify-center outline-none active:scale-95 transition-all relative ${
                isSpecial 
                  ? 'bg-blue-500/10 shadow-[0_-4px_12px_rgba(0,0,0,0.15)] -translate-y-[2px]' 
                  : ''
              }`} 
            >
              {/* BORDA SUPERIOR INDICADORA PARA ITENS ESPECIAIS */}
              {isSpecial && (
                <div className="absolute top-0 left-[20%] right-[20%] h-[3px] bg-amber-400 rounded-b-full shadow-[0_1px_5px_rgba(251,191,36,0.4)]"></div>
              )}

              <div className={isSpecial ? 'mb-0.5 mt-1' : 'mb-1'}>
                {renderIconOrAvatar(item, isActive, isSpecial)}
              </div>
              <span className={`font-black uppercase tracking-tighter transition-all ${
                isSpecial ? 'text-[9px]' : 'text-[8px]'
              } ${
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
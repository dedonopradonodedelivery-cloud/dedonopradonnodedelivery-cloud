
import React, { useMemo } from 'react';
import { Home, User as UserIcon, Newspaper, MessageSquare, Ticket } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../AuthModal';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | 'admin' | null;
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  isMainAction?: boolean; // Flag para aplicar o estilo "alto-relevo" (elevated)
  badge?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole }) => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  // Lógica de badge para cupons ativos do cliente
  const hasActiveCoupons = useMemo(() => {
    if (!user || userRole !== 'cliente') return false;
    try {
      const saved = JSON.parse(localStorage.getItem('user_saved_coupons') || '[]');
      return saved.some((c: any) => c.status === 'available');
    } catch {
      return false;
    }
  }, [user, userRole, activeTab]);

  // Itens da barra fixa - ORDEM EXATA: Início, JPA Conversa, Cupom, Classificados, Menu
  const navItems = useMemo(() => {
    const items: NavItem[] = [
      { 
        id: 'home', 
        icon: Home, 
        label: 'Início', 
        isMainAction: false 
      },
      { 
        id: 'neighborhood_posts', 
        icon: MessageSquare, 
        label: 'JPA Conversa', 
        isMainAction: true // Destaque Alto-Relevo
      },
      { 
        id: 'cupom_trigger', 
        icon: Ticket, 
        label: 'Cupom', 
        isMainAction: true, // Destaque Alto-Relevo
        badge: userRole !== 'lojista' ? hasActiveCoupons : false 
      },
      { 
        id: 'classifieds', 
        icon: Newspaper, 
        label: 'Classificados', 
        isMainAction: true // Destaque Alto-Relevo
      },
      { 
        id: 'profile', 
        icon: UserIcon, 
        label: 'Menu', 
        isMainAction: false 
      },
    ];
    return items;
  }, [userRole, hasActiveCoupons]);

  const handleTabClick = (item: NavItem) => {
    if (item.id === 'cupom_trigger') {
      if (!user) {
        // Visitante: Abre modal de login
        setIsAuthModalOpen(true);
      } else {
        // Logado: Redireciona conforme o papel
        if (userRole === 'lojista') {
          setActiveTab('merchant_coupons');
        } else {
          setActiveTab('user_coupons');
        }
      }
    } else {
      setActiveTab(item.id);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    const role = localStorage.getItem('localizei_user_role') || 'cliente';
    if (role === 'lojista') {
      setActiveTab('merchant_coupons');
    } else {
      setActiveTab('user_coupons');
    }
  };

  const renderIconOrAvatar = (item: NavItem, isActive: boolean) => {
    if (item.id === 'profile' && user) {
      const photoUrl = user.user_metadata?.avatar_url;
      const userInitial = user.email?.charAt(0).toUpperCase() || user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U';

      return (
        <div className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center transition-all duration-200 border-2 ${
          isActive 
            ? 'border-blue-600 scale-110 shadow-lg shadow-blue-500/20' 
            : 'border-gray-200 dark:border-gray-700'
        }`}>
          {photoUrl ? (
            <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-[11px] font-black ${
              isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              {userInitial}
            </div>
          )}
        </div>
      );
    }

    const Icon = item.icon;
    
    // Cor do ícone baseada no estado
    const iconColor = isActive 
      ? 'text-blue-600 dark:text-blue-400' 
      : item.isMainAction 
        ? 'text-gray-600 dark:text-gray-400' // Cinza mais escuro dentro do destaque
        : 'text-gray-400 dark:text-gray-500'; // Cinza claro fora
    
    return (
      <div className="relative">
        <Icon 
          className={`w-6 h-6 transition-all duration-200 ${iconColor}`} 
          strokeWidth={item.isMainAction ? (isActive ? 2.5 : 2) : (isActive ? 2.5 : 2)} 
        />
        {item.badge && !isActive && (
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse shadow-sm"></span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-gray-950 z-[1000] h-[90px] rounded-t-[28px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] border-t border-gray-100 dark:border-gray-800 px-2 pb-2">
        <div className="grid w-full h-full grid-cols-5 items-end pb-3">
          {navItems.map((item) => {
            // Lógica de active state
            let isActive = false;
            
            if (item.id === 'cupom_trigger') {
               isActive = activeTab === 'merchant_coupons' || activeTab === 'user_coupons';
            } else if (item.id === 'profile') {
               isActive = ['store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'about', 'support', 'favorites'].includes(activeTab) || activeTab === 'profile';
            } else {
               isActive = activeTab === item.id;
            }

            return (
              <div key={item.id} className="flex justify-center h-full items-center">
                 <button 
                  onClick={() => handleTabClick(item)} 
                  className="w-full h-full flex flex-col items-center justify-center gap-1.5 outline-none group active:scale-95 transition-transform" 
                  aria-label={item.label}
                >
                  {/* 
                     CONTÊINER DE ÍCONE:
                     Se isMainAction = true (JPA Conversa, Cupom, Classificados): Aplica estilo Card/Pill "Elevated".
                     Se isMainAction = false (Início, Menu): Fica transparente/simples.
                  */}
                  <div className={`
                    flex items-center justify-center transition-all duration-300 relative
                    ${item.isMainAction 
                      ? `h-11 w-14 rounded-2xl border mb-0.5 ${
                          isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 shadow-md shadow-blue-500/10 -translate-y-1' 
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
                        }`
                      : 'h-8 w-8'
                    }
                  `}>
                    {renderIconOrAvatar(item, isActive)}
                  </div>
                  
                  <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors leading-none ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        user={null}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

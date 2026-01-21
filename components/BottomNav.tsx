
import React from 'react';
import { Home, Users, User, QrCode } from 'lucide-react';
import { useAuth } from './contexts/AuthContext'; // FIX: Corrected import path
import { RoleMode } from './types'; // FIX: Corrected import path for RoleMode
import { getAccountEntryRoute } from './lib/roleRoutes'; // FIX: Corrected import path

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | 'admin' | null;
  // FIX: Added viewMode prop
  viewMode: RoleMode;
}

interface NavItem {
  id: string;
  icon: any;
  label: string;
  isCenter?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole, viewMode }) => { // FIX: Destructured viewMode
  const { user } = useAuth();

  // Itens da barra: Home (Regular), Comunidade (Destaque), Cashback (Destaque), Menu (Regular)
  const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'community_feed', icon: Users, label: 'Comunidade', isCenter: true },
  ];

  // Botão central de ação dinâmica (Cashback / QR Code)
  if (viewMode !== 'ADM') { // FIX: Used viewMode to determine logic
    const isMerchantView = viewMode === 'Lojista';

    let centerId: string;
    if (!user) {
      centerId = 'cashback_landing'; // Rota para visitante
    } else if (isMerchantView) {
      centerId = 'merchant_qr_display'; // Rota para lojista
    } else {
      centerId = 'scan_cashback'; // Rota para cliente
    }

    const centerLabel = isMerchantView ? 'QR Code' : 'Cashback';

    navItems.push({ 
      id: centerId, 
      icon: QrCode, 
      label: centerLabel, 
      isCenter: true 
    });
  }

  // FIX: Dynamically get the profile tab ID based on viewMode
  const profileTabId = getAccountEntryRoute(viewMode);
  navItems.push({ id: profileTabId, icon: User, label: 'Menu' });

  const NavButton: React.FC<{ item: NavItem; isActive: boolean }> = ({ item, isActive }) => {
    const Icon = item.icon;

    // Layout idêntico para botões de destaque (Círculo azul/branco flutuante)
    if (item.isCenter) {
      return (
        <div className="relative w-16 flex justify-center -top-6">
          <button
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center group outline-none"
          >
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center 
              shadow-2xl shadow-black/40 border-[6px] border-[#1E5BFF] 
              active:scale-90 transition-all duration-200 
              ${isActive ? 'bg-[#1E5BFF]' : 'bg-white'}
            `}>
              <Icon 
                className={`w-7 h-7 transition-colors ${isActive ? 'text-white' : 'text-[#1E5BFF]'}`} 
                strokeWidth={2.5} 
              />
            </div>
            <span className="text-[10px] font-black uppercase text-white mt-1 tracking-tight whitespace-nowrap drop-shadow-sm">
              {item.label}
            </span>
          </button>
        </div>
      );
    }

    // Layout para botões regulares (Home e Menu)
    return (
      <button
        onClick={() => setActiveTab(item.id)}
        className="w-full h-[60px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform outline-none"
      >
        <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
          <Icon 
            className={`w-5 h-5 transition-colors ${isActive ? 'text-white fill-white' : 'text-white/60'}`} 
            strokeWidth={isActive ? 0 : 2}
          />
        </div>
        <span className={`text-[9px] font-black uppercase transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-[#1E5BFF] z-50 h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.2)] border-t border-white/10">
      <div className="flex items-end justify-around w-full px-2 h-full pb-2">
        {navItems.map((item) => {
          // FIX: Updated isActive logic to use viewMode for correct routing interpretation
          const isActive = activeTab === item.id || 
                          (item.id === 'scan_cashback' && ['scan_cashback', 'pay_cashback'].includes(activeTab)) ||
                          (item.id === 'merchant_qr_display' && ['merchant_qr_display', 'merchant_onboarding', 'store_area'].includes(activeTab) && viewMode === 'Lojista') || // Lojista: QR Code, Onboarding e Store Area
                          (item.id === 'cashback_landing' && ['cashback_landing', 'scan_cashback', 'pay_cashback'].includes(activeTab) && viewMode === 'Visitante') || // Visitante: Cashback Landing e fluxo de pagamento
                          (item.id === profileTabId && ['profile', 'about', 'support', 'favorites', 'edit_profile', 'wallet', 'user_cupons_history'].includes(activeTab) && viewMode === 'Usuário') ||
                          (item.id === profileTabId && ['store_area', 'store_profile', 'store_ads_module', 'banner_config', 'banner_checkout', 'sponsored_ads', 'sponsored_ads_checkout', 'sponsored_ads_success', 'banner_order_tracking', 'store_cashback_module', 'store_finance'].includes(activeTab) && viewMode === 'Lojista') ||
                          (item.id === 'home' && ['explore', 'services', 'category_detail', 'store_detail', 'patrocinador_master', 'service_subcategories', 'service_specialties', 'service_success', 'jobs_list'].includes(activeTab)) ||
                          (item.id === 'community_feed' && ['community_feed', 'freguesia_connect_public', 'freguesia_connect_dashboard', 'freguesia_connect_restricted'].includes(activeTab));
          
          return (
            <div key={item.id} className="flex-1 flex justify-center items-end h-full">
              <NavButton item={item} isActive={isActive} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
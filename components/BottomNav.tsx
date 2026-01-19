
import React from 'react';
import { Home, Users, User, QrCode } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | 'admin' | null;
}

interface NavItem {
  id: string;
  icon: any;
  label: string;
  isCenter?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole }) => {
  const { user } = useAuth();

  // Itens fixos da esquerda
  const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'community_feed', icon: Users, label: 'Comunidade', isCenter: true },
  ];

  // Adiciona o botão de Ação Central apenas se o usuário estiver logado
  if (user && userRole !== 'admin') {
    if (userRole === 'lojista') {
      navItems.push({ id: 'merchant_qr_display', icon: QrCode, label: 'Meu QR', isCenter: true });
    } else {
      navItems.push({ id: 'scan_cashback', icon: QrCode, label: 'Pagar', isCenter: true });
    }
  }

  // Item final fixo
  navItems.push({ id: 'profile', icon: User, label: 'Menu' });

  /**
   * COMPONENTE ÚNICO PARA BOTÕES FLUTUANTES
   * Garante consistência absoluta entre Comunidade e Cashback
   */
  const FloatingButton: React.FC<{ item: NavItem, isActive: boolean }> = ({ item, isActive }) => {
    const Icon = item.icon;
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
            ${isActive ? 'bg-[#FFD700]' : 'bg-white'}
          `}>
            <Icon 
              className="w-7 h-7 text-[#1E5BFF]" 
              strokeWidth={2.5} 
            />
          </div>
          <span className="text-[10px] font-black uppercase text-white mt-1 tracking-tight whitespace-nowrap drop-shadow-md">
            {item.label}
          </span>
        </button>
      </div>
    );
  };

  /**
   * COMPONENTE PARA BOTÕES PADRÃO (Início e Menu)
   */
  const StandardButton: React.FC<{ item: NavItem, isActive: boolean }> = ({ item, isActive }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => setActiveTab(item.id)}
        className="flex-1 h-[60px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform outline-none"
      >
        <div className={`
          p-2 rounded-xl transition-all duration-300
          ${isActive ? 'bg-white/20' : 'bg-transparent'}
        `}>
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
      <div className="flex items-end justify-between w-full px-4 h-full pb-2">
        {navItems.map((item) => {
          // Lógica expandida de estado ativo
          const isActive = activeTab === item.id || 
                          (item.id === 'scan_cashback' && activeTab === 'pay_cashback') ||
                          (item.id === 'merchant_qr_display' && activeTab === 'merchant_onboarding');

          return item.isCenter ? (
            <FloatingButton key={item.id} item={item} isActive={isActive} />
          ) : (
            <StandardButton key={item.id} item={item} isActive={isActive} />
          );
        })}
      </div>
    </div>
  );
};

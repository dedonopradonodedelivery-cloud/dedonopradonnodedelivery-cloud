
import React from 'react';
import { Home, Users, User, QrCode } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | 'admin' | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole }) => {
  const { user } = useAuth();

  // Itens fixos base
  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'community_feed', icon: Users, label: 'Comunidade', isCenter: true },
  ];

  // Adiciona botão dinâmico central baseado no papel do usuário
  // Regra: ADMIN não visualiza esses botões específicos de transação
  if (user && userRole !== 'admin') {
    if (userRole === 'lojista') {
      navItems.push({ id: 'merchant_qr_display', icon: QrCode, label: 'Meu QR', isAction: true } as any);
    } else if (userRole === 'cliente') {
      navItems.push({ id: 'scan_cashback', icon: QrCode, label: 'Pagar', isAction: true } as any);
    }
  }

  // Item final fixo
  navItems.push({ id: 'profile', icon: User, label: 'Menu' } as any);

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-[#1E5BFF] z-50 h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.2)] border-t border-white/10">
      <div className="flex items-end justify-between w-full px-4 h-full pb-2">
        {navItems.map((tab: any) => {
          const isActive = activeTab === tab.id || 
                          (tab.id === 'scan_cashback' && activeTab === 'pay_cashback');
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <div key={tab.id} className="relative w-16 flex justify-center -top-6">
                 <button
                    onClick={() => setActiveTab(tab.id)}
                    className="flex flex-col items-center group outline-none"
                 >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-black/20 border-[6px] border-[#1E5BFF] active:scale-95 transition-all duration-200 ${isActive ? 'bg-[#FFD700]' : 'bg-white'}`}>
                        <Icon className={`w-7 h-7 ${isActive ? 'text-[#1E5BFF]' : 'text-[#1E5BFF]'}`} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-white mt-1 tracking-tight whitespace-nowrap">
                        {tab.label}
                    </span>
                 </button>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 h-[60px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform outline-none"
            >
              <div className={`
                p-2 rounded-xl transition-all duration-300
                ${isActive ? 'bg-white/20' : 'bg-transparent'}
                ${tab.isAction ? 'bg-white/10 border border-white/10 shadow-inner' : ''}
              `}>
                <Icon 
                  className={`w-5 h-5 transition-colors ${isActive ? 'text-white fill-white' : 'text-white/60'}`} 
                  strokeWidth={isActive ? 0 : 2}
                />
              </div>
              <span className={`text-[9px] font-black uppercase transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

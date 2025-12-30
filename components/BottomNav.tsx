
import React from 'react';
import { Home, Search, QrCode, User, Wrench } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | null;
  onCashbackClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole, onCashbackClick }) => {
  // UX: Microcopy contextual baseado no estado de login.
  // Usuário deslogado vê o benefício ("Cashback"), usuário logado foca na ação ("Ler QR Code").
  const qrLabel = userRole ? 'Ler QR Code' : 'Cashback';

  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'explore', icon: Search, label: 'Explorar' },
    { id: 'qrcode_scan', icon: QrCode, label: qrLabel, isCenter: true },
    { id: 'services', icon: Wrench, label: 'Serviços' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-[#1E5BFF] z-50 h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.2)] border-t border-white/10">
      <div className="flex items-end justify-between w-full px-2 h-full pb-2">
        {navItems.map((tab) => {
          // Lógica de ativação: Serviços engloba sub-rotas de serviço
          const isActive = activeTab === tab.id || (tab.id === 'services' && activeTab.startsWith('service_'));
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <div key={tab.id} className="relative w-24 flex justify-center -top-6">
                 <button
                    onClick={onCashbackClick}
                    className="flex flex-col items-center group outline-none"
                 >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl shadow-black/20 border-[6px] border-[#1E5BFF] active:scale-95 transition-transform duration-200">
                        <Icon className="w-7 h-7 text-[#1E5BFF]" strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-bold text-white mt-1 tracking-tight whitespace-nowrap">
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
                p-1.5 rounded-xl transition-all duration-300
                ${isActive ? 'bg-white/20' : 'bg-transparent'}
              `}>
                <Icon 
                  className={`w-5 h-5 transition-colors ${isActive ? 'text-white fill-white' : 'text-white/60'}`} 
                  strokeWidth={isActive ? 0 : 2}
                />
              </div>
              <span className={`text-[10px] font-bold transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

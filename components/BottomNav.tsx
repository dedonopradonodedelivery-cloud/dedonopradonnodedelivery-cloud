
import React from 'react';
import { Home, Search, QrCode, Heart, User, Store, Wrench } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | null;
  onCashbackClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole, onCashbackClick }) => {
  const isMerchant = userRole === 'lojista';

  // Configuração para LOJISTA (Mantido fluxo existente simplificado ou adaptado se necessário)
  if (isMerchant) {
    const merchantNavItems = [
      { id: 'home', icon: Home, label: 'Início' },
      { id: 'explore', icon: Search, label: 'Descobrir' },
      { id: 'merchant_qr', icon: QrCode, label: 'Meu QR', isSpecial: true },
      { id: 'store_area', icon: Store, label: 'Minha Loja' },
      { id: 'profile', icon: User, label: 'Menu' },
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-gray-900 z-50 h-[70px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between h-full w-full px-4">
          {merchantNavItems.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            if ((tab as any).isSpecial) {
               return (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative -top-6 group"
                 >
                    <div className="w-14 h-14 bg-[#1E5BFF] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 border-4 border-white dark:border-gray-900 active:scale-95 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        {tab.label}
                    </span>
                 </button>
               );
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                <Icon 
                  className={`w-6 h-6 transition-colors ${isActive ? 'text-[#1E5BFF]' : 'text-gray-400 dark:text-gray-600'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[10px] font-medium ${isActive ? 'text-[#1E5BFF]' : 'text-gray-400 dark:text-gray-600'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Configuração para USUÁRIO FINAL (Cliente)
  const clientNavItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'explore', icon: Search, label: 'Explorar' },
    { id: 'qrcode_scan', icon: QrCode, label: 'Cashback', isCenter: true },
    { id: 'services', icon: Wrench, label: 'Serviços' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-gray-900 z-50 h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.08)] border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-end justify-between w-full px-2 h-full pb-2">
        {clientNavItems.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          // BOTÃO CENTRAL (CASHBACK)
          if ((tab as any).isCenter) {
            return (
              <div key={tab.id} className="relative w-20 flex justify-center -top-6">
                 <button
                    onClick={onCashbackClick} // Chama função específica para checar login/abrir camera
                    className="flex flex-col items-center group outline-none"
                 >
                    <div className="w-16 h-16 bg-gradient-to-tr from-[#1E5BFF] to-[#4D7CFF] rounded-full flex items-center justify-center shadow-xl shadow-blue-500/40 border-[6px] border-white dark:border-gray-900 active:scale-95 transition-transform duration-200">
                        <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>
                    <span className="text-[11px] font-bold text-[#1E5BFF] mt-1 tracking-tight">
                        {tab.label}
                    </span>
                 </button>
              </div>
            );
          }

          // BOTÕES NORMAIS
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 h-[60px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform outline-none"
            >
              <div className={`
                p-1.5 rounded-xl transition-all duration-300
                ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-transparent'}
              `}>
                <Icon 
                  className={`w-5 h-5 transition-colors ${isActive ? 'text-[#1E5BFF] fill-[#1E5BFF]' : 'text-gray-400 dark:text-gray-500'}`} 
                  strokeWidth={isActive ? 0 : 2}
                />
              </div>
              <span className={`text-[10px] font-bold transition-colors ${isActive ? 'text-[#1E5BFF]' : 'text-gray-400 dark:text-gray-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
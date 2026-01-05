
import React from 'react';
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, Info, Coins, ArrowRight } from 'lucide-react';
import { InstitutionalSponsorBanner } from './InstitutionalSponsorBanner';

interface Transaction {
  id: string;
  storeName: string;
  amount: number;
  type: 'earn' | 'use';
  date: string;
}

interface UserStatementViewProps {
  onBack: () => void;
  onExploreStores: () => void;
  balance?: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', storeName: 'Açougue do Zé', amount: 3.20, type: 'earn', date: 'Hoje, 14:20' },
  { id: '2', storeName: 'Salão Beleza Pura', amount: 1.50, type: 'earn', date: 'Ontem, 10:15' },
  { id: '3', storeName: 'Padaria Imperial', amount: 5.00, type: 'use', date: '05 Nov, 08:30' },
  { id: '4', storeName: 'Hamburgueria Brasa', amount: 2.75, type: 'earn', date: '02 Nov, 20:45' },
];

export const UserStatementView: React.FC<UserStatementViewProps> = ({ 
  onBack, 
  onExploreStores,
  balance = 12.40 
}) => {
  return (
    /* Root container garantindo fundo contínuo em toda a altura da tela */
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 h-16 flex items-center gap-4 shrink-0">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-white" />
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">Seu Cashback</h2>
      </div>

      <div className="flex-1 p-5 pb-32 bg-gray-50 dark:bg-gray-950">
        {/* Main Balance Card */}
        <div className="bg-[#1E5BFF] rounded-[32px] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden mb-8 border border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10">
            <span className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">
              Saldo Disponível
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold opacity-80">R$</span>
              <h1 className="text-5xl font-black font-display tracking-tighter">
                {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h1>
            </div>
            <div className="mt-6 flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
              <Coins className="w-3.5 h-3.5 text-yellow-300" />
              <p className="text-[11px] font-bold text-white">Pronto para usar no bairro</p>
            </div>
          </div>
        </div>

        {/* Statement List */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] ml-1 mb-2">
            Movimentações recentes
          </h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-[28px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {MOCK_TRANSACTIONS.length > 0 ? MOCK_TRANSACTIONS.map((tx, idx) => (
              <div 
                key={tx.id} 
                className={`p-5 flex items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  idx !== MOCK_TRANSACTIONS.length - 1 ? 'border-b border-gray-50 dark:border-gray-700' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    tx.type === 'earn' 
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                  }`}>
                    {tx.type === 'earn' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                      {tx.type === 'earn' ? tx.storeName : `Usado em ${tx.storeName}`}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${
                    tx.type === 'earn' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {tx.type === 'earn' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )) : (
              <div className="p-10 text-center">
                <p className="text-gray-400 text-sm font-medium">Nenhuma movimentação ainda.</p>
              </div>
            )}
          </div>
        </div>

        {/* Educational Section - Improved Copy */}
        <div className="mt-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-100/50 dark:border-blue-800/30">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-blue-900">
              <Info className="w-5 h-5 text-[#1E5BFF]" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Como multiplicar seu ganho?</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Use seu saldo para pagar até 30% da conta e receba novo cashback sobre o restante. É economia circular!
              </p>
            </div>
          </div>
          
          <button 
            onClick={onExploreStores}
            className="w-full mt-6 bg-[#1E5BFF] text-white font-bold text-sm py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Ver lojas com cashback
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Banner Patrocinador Master */}
        <InstitutionalSponsorBanner type="client" />
      </div>
    </div>
  );
};

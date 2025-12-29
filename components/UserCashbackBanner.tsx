
import React from 'react';
import { Wallet, ChevronRight, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

interface UserCashbackBannerProps {
  balance: number | null;
  loading?: boolean;
  error?: boolean;
  onClick: () => void;
}

export const UserCashbackBanner: React.FC<UserCashbackBannerProps> = ({ 
  balance, 
  loading = false, 
  error = false, 
  onClick 
}) => {
  const formattedBalance = balance !== null 
    ? balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) 
    : '0,00';

  const isZero = balance === 0;

  return (
    <button 
      onClick={onClick}
      className="w-full bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900/30 rounded-[28px] p-5 shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-between group overflow-hidden relative"
    >
      {/* Background Decor - Subtle blue glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF] shrink-0 group-hover:scale-110 transition-transform">
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin opacity-40" />
          ) : error ? (
            <AlertCircle className="w-6 h-6 text-red-500" />
          ) : (
            <Wallet className="w-6 h-6" />
          )}
        </div>

        <div className="text-left">
          <span className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-0.5">
            Seu Cashback
          </span>
          
          {loading ? (
            <div className="h-7 w-32 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg mt-1"></div>
          ) : error ? (
            <p className="text-sm font-bold text-gray-400">Indisponível no momento</p>
          ) : (
            <div className="flex flex-col">
              <h2 className="text-[19px] font-black text-gray-900 dark:text-white leading-tight">
                R$ <span className="text-emerald-600 dark:text-emerald-400">{formattedBalance}</span> disponíveis
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                {isZero ? 'Compre e ganhe em lojas parceiras' : 'Use em lojas da freguesia'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-xl text-[#1E5BFF] dark:text-blue-400 font-bold text-[11px] group-hover:bg-[#1E5BFF] group-hover:text-white transition-all relative z-10">
        Ver extrato
        <ChevronRight className="w-3.5 h-3.5" strokeWidth={3} />
      </div>
    </button>
  );
};

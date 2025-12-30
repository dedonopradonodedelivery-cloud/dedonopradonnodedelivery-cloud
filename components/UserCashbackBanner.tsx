
import React from 'react';
import { ChevronRight, BarChart3, Coins, Crown, Loader2, AlertCircle } from 'lucide-react';

interface UserCashbackBannerProps {
  role: 'cliente' | 'lojista';
  balance?: number; // Para cliente: saldo disponível
  totalGenerated?: number; // Para lojista: cashback total gerado
  loading?: boolean;
  error?: boolean;
  onClick: () => void;
}

export const UserCashbackBanner: React.FC<UserCashbackBannerProps> = ({ 
  role,
  balance = 0, 
  totalGenerated = 0,
  loading = false, 
  error = false, 
  onClick 
}) => {
  
  const isMerchant = role === 'lojista';
  const hasBalance = balance > 0;

  // Configurações visuais e de texto adaptativas
  const config = isMerchant ? {
    bg: 'bg-slate-900 border-indigo-500/30 shadow-indigo-900/20',
    accentColor: 'text-amber-400',
    iconBg: 'bg-indigo-500/10 text-amber-400',
    title: 'CASHBACK NO SEU NEGÓCIO',
    highlightLabel: totalGenerated > 0 
      ? `R$ ${totalGenerated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} gerados`
      : 'Comece a fidelizar',
    subtext: totalGenerated > 0 
      ? 'Mais clientes comprando na sua loja'
      : 'Ative o cashback para atrair mais clientes',
    cta: 'Ver desempenho',
    Icon: BarChart3
  } : {
    bg: 'bg-black border-amber-500/20 shadow-black/40',
    accentColor: 'text-amber-400',
    iconBg: 'bg-amber-400/10 text-amber-400',
    title: 'SEU CASHBACK',
    highlightLabel: hasBalance 
      ? `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} disponíveis`
      : 'Ganhe dinheiro de volta',
    subtext: hasBalance 
      ? 'Use para pagar em lojas da freguesia'
      : 'Compre no bairro e acumule saldo',
    cta: hasBalance ? 'Ver extrato' : 'Como ganhar',
    Icon: Coins
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full ${config.bg} border rounded-[28px] p-5 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-between group overflow-hidden relative`}
    >
      {/* Glossy overlay effect for premium feel */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl ${config.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin opacity-40" />
          ) : error ? (
            <AlertCircle className="w-6 h-6 text-red-500" />
          ) : (
            <config.Icon className="w-6 h-6" />
          )}
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
                {config.title}
            </span>
            {!isMerchant && hasBalance && <Crown className="w-2.5 h-2.5 text-amber-500" />}
          </div>
          
          {loading ? (
            <div className="h-7 w-32 bg-gray-800 animate-pulse rounded-lg mt-1"></div>
          ) : error ? (
            <p className="text-sm font-bold text-gray-500 italic">Dados indisponíveis</p>
          ) : (
            <div className="flex flex-col">
              <h2 className="text-[18px] font-black text-white leading-tight tracking-tight">
                <span className={`${config.accentColor} bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent`}>
                    {config.highlightLabel}
                </span>
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5 font-medium italic opacity-80">
                {config.subtext}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-white font-bold text-[10px] uppercase tracking-wider group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-500 transition-all duration-300 relative z-10">
        {config.cta}
        <ChevronRight className="w-3 h-3" strokeWidth={3} />
      </div>
    </button>
  );
};

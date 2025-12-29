
import React, { useState } from 'react';
import { ChevronLeft, TrendingUp, Users, ArrowUpRight, BarChart3, Zap, ChevronRight, Target } from 'lucide-react';

interface MerchantCashbackDashboardProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export const MerchantCashbackDashboard: React.FC<MerchantCashbackDashboardProps> = ({ onBack, onNavigate }) => {
  const [period, setPeriod] = useState<'7d' | '30d'>('30d');

  const stats = period === '30d' ? {
    generated: 320.00,
    impactedSales: 6400.00,
    activeCustomers: 48,
    averageTicket: 133.33,
    growth: '+12%'
  } : {
    generated: 85.50,
    impactedSales: 1710.00,
    activeCustomers: 14,
    averageTicket: 122.14,
    growth: '+5%'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </button>
          <h2 className="text-lg font-bold font-display">Cashback no seu negócio</h2>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-full border border-white/10 shadow-inner">
          <button 
            onClick={() => setPeriod('7d')}
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full transition-all ${period === '7d' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-gray-400'}`}
          >
            7D
          </button>
          <button 
            onClick={() => setPeriod('30d')}
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full transition-all ${period === '30d' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-gray-400'}`}
          >
            30D
          </button>
        </div>
      </div>

      <div className="p-5 pb-32">
        {/* Main Stats Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[32px] p-8 border border-white/10 shadow-2xl relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Total Gerado</span>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black font-display tracking-tighter bg-gradient-to-r from-white via-amber-100 to-amber-500 bg-clip-text text-transparent">
              R$ {stats.generated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h1>
            <p className="text-gray-400 text-sm mt-1 font-medium italic">Devolvidos em cashback para seus clientes</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Vendas Impactadas</span>
              <p className="text-lg font-bold text-white font-display">R$ {stats.impactedSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Crescimento</span>
              <p className="text-lg font-bold text-emerald-400 flex items-center justify-end gap-1">
                {stats.growth} <ArrowUpRight className="w-4 h-4" />
              </p>
            </div>
          </div>
        </div>

        {/* Secondary KPI Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900 p-5 rounded-3xl border border-white/5 shadow-lg flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Clientes Ativos</p>
              <p className="text-xl font-black text-white">{stats.activeCustomers}</p>
              <p className="text-[9px] text-gray-600 mt-1">Usaram cashback no mês</p>
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-3xl border border-white/5 shadow-lg flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Ticket Médio</p>
              <p className="text-xl font-black text-white">R$ {stats.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-[9px] text-gray-600 mt-1">Valor por transação</p>
            </div>
          </div>
        </div>

        {/* CTA Campaign */}
        <div className="bg-indigo-950/30 rounded-3xl p-6 border border-indigo-500/20 text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
          </div>
          <h4 className="font-bold text-white text-sm mb-2 px-4 leading-tight">
            O cashback ajuda a trazer mais clientes para sua loja
          </h4>
          <p className="text-xs text-gray-500 mb-6 font-medium">Impulsione suas vendas atraindo a vizinhança.</p>
          
          <button 
            onClick={() => onNavigate('store_ads_module')}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-4 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            CRIAR NOVA CAMPANHA
            <ChevronRight className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-2 opacity-30">
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3" />
            <p className="text-[9px] font-black uppercase tracking-widest">Dashboard do Parceiro Localizei</p>
          </div>
        </div>
      </div>
    </div>
  );
};

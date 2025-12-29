
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  BarChart3, 
  Zap, 
  ChevronRight, 
  Target,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { InstitutionalSponsorBanner } from './InstitutionalSponsorBanner';

interface MerchantCashbackDashboardProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

type Period = '7D' | '30D';

export const MerchantCashbackDashboard: React.FC<MerchantCashbackDashboardProps> = ({ onBack, onNavigate }) => {
  const [period, setPeriod] = useState<Period>('30D');

  // Dados simulados baseados no período
  const data = period === '30D' ? {
    impacto: 320.00,
    vendasImpactadas: 6400.00,
    tendencia: '+12%',
    clientesRetidos: 48,
    ticketMedio: 133.33,
    chartData: [45, 62, 58, 75, 90, 82, 100]
  } : {
    impacto: 85.50,
    vendasImpactadas: 1710.00,
    tendencia: '+5%',
    clientesRetidos: 14,
    ticketMedio: 122.14,
    chartData: [20, 35, 40, 30, 45, 50, 55]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-5 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </button>
          <h2 className="text-lg font-bold font-display tracking-tight">Cashback no seu negócio</h2>
        </div>
        
        {/* Period Filter Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-full border border-white/10 shadow-inner">
          {(['7D', '30D'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${
                period === p 
                ? 'bg-amber-500 text-slate-950 shadow-lg' 
                : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 pb-32 space-y-6">
        
        {/* Main Highlight Card - Impacto */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[32px] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.25em] mb-3 block">
              Impacto no Período
            </span>
            
            <div className="flex flex-col mb-8">
              <h1 className="text-4xl font-black font-display tracking-tighter text-white">
                R$ {data.impacto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h1>
              <p className="text-gray-400 text-sm mt-2 font-medium italic">
                Gerados em cashback para seus clientes
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-6">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Vendas Impactadas</span>
                <p className="text-lg font-bold text-white">R$ {data.vendasImpactadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Tendência</span>
                <p className="text-lg font-bold text-emerald-400 flex items-center justify-end gap-1">
                  {data.tendencia} <ArrowUpRight className="w-4 h-4" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 p-6 rounded-[28px] border border-white/5 shadow-lg flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{data.clientesRetidos}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Clientes Retidos</p>
              <p className="text-[9px] text-gray-600 mt-1 italic leading-tight">Usaram cashback no mês</p>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[28px] border border-white/5 shadow-lg flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">R$ {data.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Ticket Médio</p>
              <p className="text-[9px] text-gray-600 mt-1 italic leading-tight">Valor por transação</p>
            </div>
          </div>
        </div>

        {/* Visual Growth Chart Placeholder */}
        <div className="bg-slate-900 p-6 rounded-[28px] border border-white/5 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Crescimento semanal</h3>
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]"></div>
          </div>
          
          <div className="flex items-end justify-between h-28 gap-2 px-1">
            {data.chartData.map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className={`w-full rounded-t-lg transition-all duration-1000 ease-out ${
                    i === data.chartData.length - 1 
                    ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                    : 'bg-slate-800 group-hover:bg-slate-700'
                  }`}
                  style={{ height: `${h}%` }}
                ></div>
                {/* Simulated Label */}
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-600 uppercase">
                    {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Hoje'][i]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-500 font-medium italic">
                {data.impacto > 0 
                  ? 'Evolução positiva detectada no período.' 
                  : 'Seus dados aparecerão conforme os clientes utilizarem o cashback'}
            </p>
          </div>
        </div>

        {/* Reinforcement Card + CTA */}
        <div className="bg-indigo-950/20 rounded-[32px] p-8 border border-indigo-500/20 text-center relative overflow-hidden group shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-indigo-500/30">
            <TrendingUp className="w-7 h-7 text-indigo-400" />
          </div>
          <h4 className="font-black text-white text-lg mb-3 leading-tight">
            O cashback ajuda a trazer mais clientes para sua loja
          </h4>
          <p className="text-xs text-gray-400 mb-8 max-w-[240px] mx-auto leading-relaxed">
            Clientes Localizei preferem lojas que oferecem benefícios reais no bairro.
          </p>
          
          <button 
            onClick={() => onNavigate('store_ads_module')}
            className="w-full bg-white text-slate-950 font-black text-xs py-4 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-2xl hover:bg-amber-500"
          >
            IMPULSIONAR MINHA LOJA
            <ChevronRight className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        {/* Institutional Sponsor Banner */}
        <InstitutionalSponsorBanner type="merchant" />

        {/* Discreet Footer */}
        <div className="pt-4 flex items-center justify-center gap-2 opacity-30">
          <Target className="w-3 h-3" />
          <p className="text-[9px] font-black uppercase tracking-[0.3em]">Painel do Parceiro Localizei</p>
        </div>
      </div>
    </div>
  );
};

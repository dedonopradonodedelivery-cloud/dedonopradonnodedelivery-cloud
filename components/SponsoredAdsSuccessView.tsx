import React from 'react';
import { CheckCircle2, Rocket, Calendar } from 'lucide-react';
import { SponsoredPlan } from '../types';

interface SponsoredAdsSuccessViewProps {
  plan: SponsoredPlan;
  onComplete: () => void;
}

export const SponsoredAdsSuccessView: React.FC<SponsoredAdsSuccessViewProps> = ({ plan, onComplete }) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + plan.days);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center p-8 animate-in fade-in">
      <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border-2 border-green-500/20">
        <Rocket size={48} className="text-green-400" />
      </div>
      <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-3">
        Patrocínio Ativado!
      </h2>
      <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed mb-10">
        Sua loja agora está em destaque no topo das buscas pelos próximos {plan.days} dias.
      </p>

      <div className="w-full max-w-sm bg-slate-800 rounded-3xl p-6 border border-white/10 space-y-4 mb-10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 flex items-center gap-2"><Calendar size={14}/> Início</span>
            <span className="font-bold text-white">{formatDate(startDate)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 flex items-center gap-2"><Calendar size={14}/> Fim</span>
            <span className="font-bold text-white">{formatDate(endDate)}</span>
          </div>
      </div>
      
      <button 
        onClick={onComplete}
        className="w-full max-w-sm bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-4 rounded-2xl shadow-lg border border-white/5 active:scale-[0.98] transition-all"
      >
        Voltar para o Painel
      </button>
    </div>
  );
};

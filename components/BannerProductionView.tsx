import React from 'react';
import { ChevronLeft, CheckCircle2, Clock } from 'lucide-react';

interface BannerProductionViewProps {
  onBack: () => void;
}

export const BannerProductionView: React.FC<BannerProductionViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-none">Acompanhar Banner</h1>
          <p className="text-xs text-slate-500">Status da sua solicitação</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-8 border-2 border-blue-500/20 animate-pulse">
            <Clock size={48} className="text-blue-400" />
        </div>

        <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-3">
            Banner em Produção
        </h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed mb-10">
            Nossa equipe de design já recebeu seu pedido. O banner profissional será criado e liberado no app para você.
        </p>

        <div className="w-full max-w-sm bg-slate-800 rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Status do Pedido:</span>
                <span className="font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full text-xs border border-amber-500/20">EM ANÁLISE</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Prazo Estimado:</span>
                <span className="font-bold text-white">Até 48h úteis</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Notificação:</span>
                <span className="font-bold text-white">Via WhatsApp</span>
            </div>
        </div>
        
        <button 
          onClick={onBack}
          className="mt-12 w-full max-w-sm bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl shadow-lg border border-white/5 active:scale-[0.98] transition-all"
        >
            Voltar para o Painel
        </button>
      </main>
    </div>
  );
};
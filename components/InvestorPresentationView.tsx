
import React from 'react';
import { ArrowLeft, Presentation } from 'lucide-react';

interface InvestorPresentationViewProps {
  onBack: () => void;
}

export const InvestorPresentationView: React.FC<InvestorPresentationViewProps> = ({ onBack }) => {
  const sections = [
    'Visão Geral',
    'Problema',
    'Solução',
    'Produto',
    'Modelo de Negócio',
    'Tração',
    'Mercado',
    'Roadmap',
    'Equipe',
    'Pedido / Proposta'
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col animate-in fade-in duration-500">
      <header className="bg-[#0F172A] border-b border-white/10 px-6 py-6 sticky top-0 z-50 shadow-sm shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white border border-white/10 transition-all active:scale-95 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-black text-xl uppercase tracking-tighter text-white">
                Apresentação para Investidor
              </h1>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Localizei JPA</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
            <Presentation size={20} />
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto no-scrollbar pb-32 max-w-4xl mx-auto w-full space-y-12">
        {sections.map((section, index) => (
          <section key={index} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-indigo-500 font-black text-lg">0{index + 1}.</span>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{section}</h2>
            </div>
            <div className="h-40 bg-slate-900/50 border border-dashed border-white/10 rounded-[2rem] flex items-center justify-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Espaço para conteúdo</p>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

import React from 'react';
import { Repeat, ArrowRight } from 'lucide-react';

interface TrocaTrocaIntroViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export const TrocaTrocaIntroView: React.FC<TrocaTrocaIntroViewProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#101828] text-white flex flex-col items-center justify-center p-8 font-display animate-in fade-in duration-500">
      <main className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-sm">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/20">
          <Repeat className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-wider mb-4">Troca-Troca do Bairro</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-xs">
          Deslize para encontrar alguém que queira o que você tem e tenha o que você quer. Sem burocracia.
        </p>

        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 w-full mb-12 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-700 rounded-lg overflow-hidden shrink-0">
            <img src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=400" className="w-full h-full object-cover" alt="Violão Yamaha" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Você está oferecendo</p>
            <p className="text-sm font-bold text-white truncate">Violão Yamaha C40</p>
          </div>
        </div>

        <button 
          onClick={() => onNavigate('troca_troca_swipe')}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 font-black py-5 rounded-2xl shadow-xl shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
        >
          Começar a explorar <ArrowRight size={16} strokeWidth={3} />
        </button>
      </main>
      
      <footer className="shrink-0 w-full pt-8">
        <button onClick={onBack} className="text-slate-500 font-bold text-xs uppercase tracking-widest">Voltar</button>
      </footer>
    </div>
  );
};

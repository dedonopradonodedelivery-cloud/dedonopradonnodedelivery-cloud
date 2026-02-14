
import React from 'react';
import { ChevronLeft, Check, Repeat, Plus, Sparkles, Handshake, Recycle, Lightbulb, ArrowRight } from 'lucide-react';

interface TradeOnboardingViewProps {
  onBack: () => void;
  onRegisterItem: () => void;
}

export const TradeOnboardingView: React.FC<TradeOnboardingViewProps> = ({ onBack, onRegisterItem }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans animate-in fade-in duration-500">
      {/* Header Minimalista */}
      <header className="px-6 pt-12 pb-4 flex items-center">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors text-gray-400"
        >
          <ChevronLeft size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-8 pb-12">
        {/* Cabeçalho Emocional */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter uppercase font-display">
            Troque o que você <br/> 
            não usa mais <span className="inline-block align-middle">🤝</span>
          </h1>
          <p className="text-base text-slate-500 font-medium mt-3 leading-relaxed">
            Aquela coisa parada na sua casa pode ser exatamente o que um vizinho precisa.
          </p>
        </div>

        {/* Elemento Visual - Ilustração Flat Moderna */}
        <div className="relative w-full aspect-[4/3] mb-12 flex items-center justify-center bg-blue-50/50 rounded-[3rem] overflow-hidden border border-blue-100/50">
          <svg viewBox="0 0 200 150" className="w-full h-full p-8 opacity-90 drop-shadow-sm">
            <defs>
              <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E5BFF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1E5BFF" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="75" r="60" fill="url(#circleGrad)" />
            
            {/* Elementos de Troca Estilizados */}
            <g className="animate-float">
                <rect x="40" y="50" width="30" height="40" rx="4" fill="#1E5BFF" fillOpacity="0.8" />
                <path d="M40 55 H70 M45 65 H65 M45 75 H60" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </g>
            <g className="animate-float-delayed">
                <circle cx="150" cy="90" r="25" fill="#FF6501" fillOpacity="0.7" />
                <path d="M140 90 L160 90 M150 80 L150 100" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </g>
            
            {/* Ícone de Repetir Central */}
            <g transform="translate(85, 60) scale(1.2)">
                <path 
                    d="M17 1l4 4-4 4M3 11l-4-4 4-4" 
                    stroke="#1E5BFF" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    fill="none" 
                />
                <path 
                    d="M21 5H9a5 5 0 00-5 5v1m-8 4h12a5 5 0 005-5v-1" 
                    stroke="#1E5BFF" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    fill="none" 
                />
            </g>
          </svg>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
             <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-blue-100 shadow-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Comunidade Viva</span>
             </div>
          </div>
        </div>

        {/* Bloco Explicativo */}
        <div className="space-y-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            Como funciona o Troca-Troca?
          </h3>
          
          <div className="grid gap-6">
            <div className="flex items-start gap-5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                <Plus size={20} strokeWidth={3} />
              </div>
              <p className="text-sm font-bold text-slate-700 leading-tight pt-2">
                Cadastrar algo que você não usa mais
              </p>
            </div>

            <div className="flex items-start gap-5 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles size={20} strokeWidth={2.5} />
              </div>
              <p className="text-sm font-bold text-slate-700 leading-tight pt-2">
                Descobrir itens oferecidos por vizinhos
              </p>
            </div>

            <div className="flex items-start gap-5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                <Handshake size={20} strokeWidth={2.5} />
              </div>
              <p className="text-sm font-bold text-slate-700 leading-tight pt-2">
                Trocar sem gastar dinheiro
              </p>
            </div>

            <div className="flex items-start gap-5 group">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-110 transition-transform">
                <Recycle size={20} strokeWidth={2.5} />
              </div>
              <p className="text-sm font-bold text-slate-700 leading-tight pt-2">
                Dar nova vida a objetos
              </p>
            </div>
          </div>
        </div>

        {/* Bloco Psicológico */}
        <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <Lightbulb size={20} />
          </div>
          <p className="text-xs font-bold text-slate-600 leading-relaxed">
            Aqui não é venda. Não tem preço. <br/>
            <span className="text-[#1E5BFF]">É troca entre vizinhos.</span>
          </p>
        </div>

        {/* Call to Action Principal */}
        <div className="mt-12 space-y-4">
          <button 
            onClick={onRegisterItem}
            className="w-full bg-gradient-to-r from-[#1E5BFF] to-[#0040DD] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            ✨ Cadastrar meu primeiro item
            <ArrowRight size={18} strokeWidth={3} />
          </button>
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Quanto mais itens cadastrados, mais trocas acontecem.
          </p>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(5px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};


import React from 'react';
import { ChevronLeft, Check, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

interface TradeOnboardingViewProps {
  onBack: () => void;
  onRegisterItem: () => void;
}

export const TradeOnboardingView: React.FC<TradeOnboardingViewProps> = ({ onBack, onRegisterItem }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans animate-in fade-in duration-500 overflow-x-hidden">
      {/* Header Minimalista */}
      <header className="px-6 pt-12 pb-4 flex items-center shrink-0">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors text-gray-400 active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-8 pb-32">
        {/* Cabeçalho Emocional */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter uppercase font-display">
            Troque o que você <br/> 
            não usa mais 🤝
          </h1>
          <p className="text-base text-slate-500 font-medium mt-3 leading-relaxed">
            Aquela coisa parada na sua casa pode ser exatamente o que um vizinho precisa.
          </p>
        </div>

        {/* Elemento Visual - Ilustração Flat Moderna Customizada */}
        <div className="relative w-full aspect-[4/3] mb-12 flex items-center justify-center bg-[#F0F5FF] rounded-[2.5rem] overflow-hidden border border-blue-100/50 shadow-inner">
          <svg viewBox="0 0 200 150" className="w-full h-full p-8 opacity-90">
            <defs>
              <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E5BFF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1E5BFF" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="75" r="65" fill="url(#circleGrad)" />
            
            {/* Vizinho 1 (Esquerda) */}
            <g className="animate-float">
                <circle cx="60" cy="90" r="15" fill="#1E5BFF" />
                <rect x="50" y="105" width="20" height="25" rx="4" fill="#1E5BFF" opacity="0.8" />
                <rect x="65" y="85" width="25" height="18" rx="3" fill="#FF6501" /> {/* Objeto sendo entregue */}
            </g>

            {/* Vizinho 2 (Direita) */}
            <g className="animate-float-delayed">
                <circle cx="140" cy="85" r="15" fill="#334155" />
                <rect x="130" y="100" width="20" height="25" rx="4" fill="#334155" opacity="0.8" />
                <rect x="110" y="95" width="25" height="18" rx="3" fill="#1E5BFF" opacity="0.6" /> {/* Objeto sendo recebido */}
            </g>
            
            <path d="M90 60 Q 100 50 110 60" stroke="#1E5BFF" strokeWidth="2" fill="none" strokeLinecap="round" className="animate-pulse" />
            <path d="M90 120 Q 100 130 110 120" stroke="#FF6501" strokeWidth="2" fill="none" strokeLinecap="round" className="opacity-40" />
          </svg>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
             <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-blue-100 shadow-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Economia do Bairro</span>
             </div>
          </div>
        </div>

        {/* Bloco Explicativo */}
        <div className="space-y-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            Como funciona o Troca-Troca?
          </h3>
          
          <div className="grid gap-6">
            {[
              "Cadastrar algo que você não usa mais",
              "Veja o que vizinhos oferecem",
              "Troque sem gastar dinheiro",
              "Dar nova vida a objetos"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100/50">
                  <Check size={20} strokeWidth={3} />
                </div>
                <p className="text-sm font-bold text-slate-700 leading-tight">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco de Quebra de Objeção */}
        <div className="mt-12 p-6 bg-[#F8F9FC] rounded-[2rem] border border-blue-50 flex gap-4 items-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0 border border-blue-50">
            <Lightbulb size={22} fill="currentColor" className="opacity-20" />
            <Lightbulb size={22} className="absolute" />
          </div>
          <p className="text-[13px] font-bold text-slate-600 leading-relaxed">
            Aqui não é venda. Não tem preço. <br/>
            <span className="text-[#1E5BFF]">É troca entre vizinhos.</span>
          </p>
        </div>

        {/* Call to Action Principal */}
        <div className="mt-12 space-y-4">
          <button 
            onClick={onRegisterItem}
            className="w-full bg-gradient-to-r from-[#1E5BFF] to-[#0040DD] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            ✨ Cadastrar um item para troca
          </button>
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Quanto mais itens cadastrados, mais trocas acontecem.
          </p>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(-4px); }
          50% { transform: translateY(4px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

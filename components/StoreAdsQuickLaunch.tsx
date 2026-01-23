
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Megaphone, 
  Zap, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Rocket,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';

interface StoreAdsQuickLaunchProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

const BENEFIT_LIST = [
  { icon: Rocket, text: "Apareça antes da concorrência", color: "text-blue-400" },
  { icon: Target, text: "Destaque para clientes da sua região", color: "text-emerald-400" },
  { icon: DollarSign, text: "Custo baixo, controle total", color: "text-amber-400" },
  { icon: Zap, text: "Ativação rápida, sem criar banner", color: "text-purple-400" },
  { icon: TrendingUp, text: "Mais visitas e chances de venda", color: "text-blue-400" },
];

export const StoreAdsQuickLaunch: React.FC<StoreAdsQuickLaunchProps> = ({ onBack, onNavigate }) => {
  const [days, setDays] = useState(14);
  const pricePerDay = 0.99;
  
  const totalInvestment = useMemo(() => {
    return (days * pricePerDay).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [days]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col animate-in fade-in slide-in-from-right duration-500">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-none flex items-center gap-2">Anunciar (ADS) <Megaphone size={16} className="text-[#1E5BFF]" /></h1>
          <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Presença Patrocinada</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-10 pb-40 max-w-md mx-auto w-full">
        
        {/* Intro Section */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-black text-white leading-tight font-display uppercase tracking-tight">
            Destaque sua loja para quem está pronto para comprar
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Com os ADS da Localizei, sua loja aparece em posições patrocinadas para clientes que estão buscando exatamente o que você vende.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Você paga pouco, escolhe quantos dias quer anunciar e ganha mais visibilidade sem complicação.
          </p>
        </section>

        {/* Benefits Section */}
        <section className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-6 space-y-4 shadow-xl">
          {BENEFIT_LIST.map((benefit, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform ${benefit.color}`}>
                <benefit.icon size={18} />
              </div>
              <p className="text-sm font-bold text-slate-300">{benefit.text}</p>
            </div>
          ))}
        </section>

        {/* Control Section */}
        <section className="space-y-8 py-4">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">
              Escolha por quantos dias anunciar
            </h3>
            <div className="bg-blue-600/10 px-4 py-2 rounded-2xl border border-blue-500/20 mt-2">
               <p className="text-xl font-black text-white">Dias selecionados: {days} dias</p>
            </div>
          </div>

          <div className="relative w-full px-2">
            <input 
              type="range" 
              min="7" 
              max="30" 
              step="1"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#1E5BFF] transition-all hover:bg-slate-700"
            />
            <div className="flex justify-between mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
              <span>7 Dias (Mínimo)</span>
              <span>30 Dias</span>
            </div>
          </div>
        </section>

        {/* Pricing Summary */}
        <section className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Valor por dia</span>
                <span className="text-lg font-black text-white">R$ 0,99</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total do investimento</span>
                <span className="text-3xl font-black text-[#1E5BFF]">R$ {totalInvestment}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                  Você pode anunciar a partir de menos de R$ 7, sem contrato e sem fidelidade. Remova as barreiras para seu crescimento.
                </p>
            </div>
        </section>

      </main>

      {/* CTA Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-[100] max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.6)]">
        <button 
          onClick={() => alert('Seguindo para pagamento simplificado (em desenvolvimento)')}
          className="w-full py-5 bg-[#1E5BFF] hover:bg-blue-600 text-white rounded-[2rem] shadow-xl shadow-blue-500/30 flex flex-col items-center justify-center transition-all active:scale-[0.98] group"
        >
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-black text-base uppercase tracking-widest">ATIVAR ADS AGORA</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Comece hoje mesmo</span>
        </button>
      </div>

    </div>
  );
};

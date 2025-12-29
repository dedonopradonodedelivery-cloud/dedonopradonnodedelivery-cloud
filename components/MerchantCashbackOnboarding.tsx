
import React from 'react';
import { ChevronLeft, TrendingUp, Users, Coins, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

interface MerchantCashbackOnboardingProps {
  onBack: () => void;
  onActivate: () => void;
}

export const MerchantCashbackOnboarding: React.FC<MerchantCashbackOnboardingProps> = ({ onBack, onActivate }) => {
  const benefits = [
    {
      icon: Users,
      title: "Mais visitas na loja",
      desc: "Clientes do bairro priorizam lojas que devolvem dinheiro."
    },
    {
      icon: TrendingUp,
      title: "Mais recompra",
      desc: "O saldo incentiva o cliente a voltar e comprar de novo."
    },
    {
      icon: Coins,
      title: "Dinheiro circulando no bairro",
      desc: "Fortaleça a economia local atraindo novos usuários."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      <div className="p-5 h-16 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-32 overflow-y-auto no-scrollbar bg-slate-950">
        <div className="text-center mt-4 mb-10">
          <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
            <Zap className="w-10 h-10 text-amber-400 fill-amber-400" />
          </div>
          <h1 className="text-3xl font-black font-display leading-tight tracking-tight mb-3 text-white">
            Atraia mais clientes <br/>
            <span className="text-amber-400 uppercase">com cashback</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-[280px] mx-auto leading-relaxed">
            A forma mais inteligente de fidelizar quem vive e consome na Freguesia.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {benefits.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-amber-400 shrink-0 border border-indigo-500/10">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/60 rounded-3xl p-6 border border-white/5 relative overflow-hidden mb-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="relative z-10 flex items-start gap-4">
             <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
             </div>
             <div>
                <h4 className="font-bold text-sm mb-1 text-white">Como funciona?</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Você define o percentual de volta (ex: 5%) e os clientes acumulam saldo para usar em qualquer loja parceira da Freguesia.
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-20">
        <button 
          onClick={onActivate}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
        >
          ATIVAR CASHBACK AGORA
          <ArrowRight className="w-5 h-5" strokeWidth={3} />
        </button>
        <p className="text-[10px] text-center text-gray-600 mt-4 font-bold uppercase tracking-widest">
            Sem taxas de adesão • Cancele quando quiser
        </p>
      </div>
    </div>
  );
};

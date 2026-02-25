
import React from 'react';
import { 
  ChevronLeft,
  Ticket, 
  Search, 
  LogIn, 
  QrCode, 
  ListChecks, 
  Info,
  ArrowRight
} from 'lucide-react';

interface CouponLandingViewProps {
  onLogin: () => void;
  onBack: () => void;
}

export const CouponLandingView: React.FC<CouponLandingViewProps> = ({ onLogin, onBack }) => {
  const steps = [
    {
      icon: Search,
      title: "Descubra",
      desc: "Encontre cupons de lojas próximas a você."
    },
    {
      icon: LogIn,
      title: "Faça login",
      desc: "Entre na sua conta para salvar o cupom."
    },
    {
      icon: QrCode,
      title: "Use na loja",
      desc: "Apresente o código no caixa para ganhar o desconto."
    },
    {
      icon: ListChecks,
      title: "Acompanhe",
      desc: "Gerencie seus resgates na aba 'Meus Cupons'."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Cupons do Bairro</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">
        
        {/* Hero */}
        <section className="text-center mb-10 mt-4">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-[#1E5BFF] shadow-xl shadow-blue-500/10">
            <Ticket size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-3">
            Descontos exclusivos para quem compra no bairro.
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
            Valorize o comércio local e economize nas suas lojas favoritas.
          </p>
        </section>

        {/* Steps */}
        <section className="space-y-6 mb-10">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#1E5BFF] shrink-0">
                <step.icon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{step.title}</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex gap-3 items-start">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
            Os cupons são gratuitos e ajudam você a economizar enquanto fortalece os negócios da Freguesia.
          </p>
        </div>

      </main>

      {/* Footer CTA */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto">
        <button 
          onClick={onLogin}
          className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
        >
          Entrar para resgatar cupons
          <ArrowRight size={16} />
        </button>
        <button 
           onClick={onLogin}
           className="w-full mt-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200"
        >
          Criar conta grátis
        </button>
      </footer>
    </div>
  );
};

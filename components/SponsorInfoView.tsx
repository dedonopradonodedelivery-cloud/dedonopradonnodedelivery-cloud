import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Crown, 
  CheckCircle2, 
  Zap, 
  Target, 
  ShieldCheck, 
  Users, 
  Layout, 
  MessageSquare, 
  Clock,
  Sparkles,
  Award,
  CalendarDays,
  Smartphone,
  // Added TrendingUp to the lucide-react imports
  TrendingUp
} from 'lucide-react';

interface SponsorInfoViewProps {
  onBack: () => void;
}

interface MonthOption {
  id: number;
  label: string;
  available: boolean;
}

const MONTHS: MonthOption[] = [
  { id: 1, label: 'Jan', available: false },
  { id: 2, label: 'Fev', available: false },
  { id: 3, label: 'Mar', available: true },
  { id: 4, label: 'Abr', available: true },
  { id: 5, label: 'Mai', available: true },
  { id: 6, label: 'Jun', available: true },
  { id: 7, label: 'Jul', available: true },
  { id: 8, label: 'Ago', available: true },
  { id: 9, label: 'Set', available: true },
  { id: 10, label: 'Out', available: true },
  { id: 11, label: 'Nov', available: true },
  { id: 12, label: 'Dez', available: true },
];

export const SponsorInfoView: React.FC<SponsorInfoViewProps> = ({ onBack }) => {
  const [selectedMonthIds, setSelectedMonthIds] = useState<number[]>([]);

  const toggleMonth = (id: number) => {
    setSelectedMonthIds(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const totals = useMemo(() => {
    const count = selectedMonthIds.length;
    const unitPrice = 1000;
    const originalUnitPrice = 2500;
    const promoTotal = count * unitPrice;
    const originalTotal = count * originalUnitPrice;
    const savings = originalTotal - promoTotal;

    return {
      count,
      promoTotal,
      originalTotal,
      savings
    };
  }, [selectedMonthIds]);

  const formatBRL = (val: number) => 
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col relative overflow-x-hidden">
      
      {/* 1. CABEÇALHO */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="flex flex-col">
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Patrocinador Master</h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">O topo do seu bairro, todos os dias.</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-64">
        {/* Intro Copy */}
        <section className="p-8 text-center bg-gradient-to-b from-white to-transparent dark:from-gray-900 dark:to-transparent">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border-4 border-white dark:border-gray-800 shadow-xl">
            <Crown className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium max-w-xs mx-auto">
            Sua marca aparece com destaque máximo no Localizei JPA e entra na rotina de quem realmente mora e compra no seu bairro.
          </p>
        </section>

        {/* 2. OFERTA COM ANCORAGEM */}
        <section className="px-6 mb-12">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2 block">Oportunidade Única</span>
              <div className="flex flex-col gap-1 mb-6">
                <span className="text-lg font-bold text-slate-500 line-through">De: R$ 2.500,00/mês</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-black uppercase text-slate-300">Por:</span>
                  {/* Fixed formatting: formatBRL already includes the currency symbol */}
                  <span className="text-4xl font-black text-white tracking-tighter">{formatBRL(1000)}<span className="text-base">/mês</span></span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 w-fit px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Você economiza R$ 1.500,00 por mês</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 w-fit px-3 py-1.5 rounded-full border border-blue-500/20">
                  <Zap size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Desconto de 60% na inauguração</span>
                </div>
              </div>

              <p className="text-[9px] text-slate-500 font-bold uppercase mt-8 tracking-wider">
                * Desconto de inauguração por tempo indeterminado. Sujeito a encerramento sem aviso prévio.
              </p>
            </div>
          </div>
        </section>

        {/* 3. PROVA DE VALOR */}
        <section className="px-6 mb-12">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-1">Por que o Patrocinador Master vale mais</h3>
          <div className="space-y-4">
            {[
              { icon: Target, title: "Presença constante", desc: "Sua marca aparece em pontos estratégicos do app." },
              { icon: Award, title: "Top of mind local", desc: "Você vira referência absoluta no bairro." },
              { icon: ShieldCheck, title: "Autoridade e confiança", desc: "Destaque premium para quem quer ser lembrado primeiro." },
              { icon: Users, title: "Foco em moradores reais", desc: "Alcance hiperlocal e qualificado diariamente." },
              { icon: Lock, title: "Exclusividade", desc: "Apenas 1 Patrocinador Master ativo por região definida." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-[#1E5BFF] shrink-0 border border-blue-100 dark:border-blue-800/30">
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. ONDE SUA MARCA APARECE */}
        <section className="px-6 mb-12">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-1">Sua marca em quase todo o app</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: Sparkles, title: "Tela de Splash", desc: "Impacto no primeiro segundo do app." },
              { icon: Layout, title: "Topo da Home", desc: "Destaque fixo e imbatível no Feed." },
              { icon: ArrowRight, title: "Rodapé de Páginas", desc: "Banner ao final das buscas internas." },
              { icon: Smartphone, title: "Página Institucional", desc: "Uma tela exclusiva para contar sua história." },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl text-[#1E5BFF] shadow-sm">
                  <item.icon size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-tight">{item.title}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-500 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. SELEÇÃO DE MESES */}
        <section className="px-6 mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-1">Escolha os meses</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-6 leading-relaxed">
              Selecione um ou mais meses. Você pode escolher meses não consecutivos.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {MONTHS.map(month => {
                const isSelected = selectedMonthIds.includes(month.id);
                return (
                  <button
                    key={month.id}
                    disabled={!month.available}
                    onClick={() => toggleMonth(month.id)}
                    className={`
                      relative py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border-2
                      ${!month.available 
                        ? 'bg-gray-50 dark:bg-gray-950 border-transparent text-gray-300 dark:text-gray-800 cursor-not-allowed opacity-50' 
                        : isSelected 
                          ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-lg shadow-blue-500/20 active:scale-95' 
                          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-blue-200'}
                    `}
                  >
                    {month.label}
                    {!month.available && (
                      <span className="absolute -top-1.5 -right-1.5 bg-gray-400 dark:bg-gray-700 text-white text-[7px] px-1 py-0.5 rounded-md">Indisponível</span>
                    )}
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white p-0.5 rounded-full shadow-md">
                        <CheckCircle2 size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <CalendarDays size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Meses selecionados: {totals.count}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-gray-900 dark:text-white">{formatBRL(totals.promoTotal)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. CTA SECUNDÁRIO */}
        <section className="px-6 pb-20">
          <button 
            onClick={() => window.open('https://wa.me/5521985559480', '_blank')}
            className="w-full py-5 bg-white dark:bg-gray-900 border-2 border-emerald-500/30 dark:border-emerald-500/10 rounded-[2rem] flex items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95"
          >
            <MessageSquare size={18} className="fill-emerald-600/10" />
            Falar com o time no WhatsApp
          </button>
        </section>
      </main>

      {/* 6. RESUMO DA COMPRA (FIXO) */}
      <div className="fixed bottom-[80px] left-0 right-0 z-[50] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{totals.count} {totals.count === 1 ? 'Mês Selecionado' : 'Meses Selecionados'}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-400 line-through font-bold">{formatBRL(totals.originalTotal)}</span>
              <span className="text-2xl font-black text-[#1E5BFF] tracking-tighter">{formatBRL(totals.promoTotal)}</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">Economia {formatBRL(totals.savings)}</span>
            <span className="text-[10px] font-black text-blue-500 uppercase mt-1">60% OFF</span>
          </div>
        </div>

        <button 
          disabled={totals.count === 0}
          className={`
            w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2
            ${totals.count === 0 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed shadow-none' 
              : 'bg-[#1E5BFF] text-white shadow-blue-500/30 active:scale-[0.98] hover:bg-blue-600'}
          `}
        >
          Continuar contratação
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>

    </div>
  );
};

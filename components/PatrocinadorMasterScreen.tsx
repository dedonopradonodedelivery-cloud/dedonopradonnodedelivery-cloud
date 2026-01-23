
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Info, 
  Lock,
  Phone,
  BarChart3,
  Users,
  Eye,
  Award,
  CalendarDays,
  Home, 
  LayoutGrid,
  List,
  Sparkles,
  ImageIcon,
  Repeat
} from 'lucide-react';

interface PatrocinadorMasterScreenProps {
  onBack: () => void;
}

const BenefitItem: React.FC<{ icon: React.ElementType, text: string }> = ({ icon: Icon, text }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
      <Icon className="w-5 h-5 text-emerald-400" />
    </div>
    <div>
      <p className="font-bold text-slate-200 text-sm leading-tight">{text}</p>
    </div>
  </div>
);

const PlacementItem: React.FC<{ icon: React.ElementType, text: string }> = ({ icon: Icon, text }) => (
  <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
    <div className="p-2 bg-slate-700 rounded-lg text-slate-300">
      <Icon className="w-4 h-4" />
    </div>
    <span className="font-semibold text-xs text-slate-300">{text}</span>
  </div>
);

export const PatrocinadorMasterScreen: React.FC<PatrocinadorMasterScreenProps> = ({ onBack }) => {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  
  const availableMonths = useMemo(() => {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const currentMonthIndex = new Date().getMonth();
    const months = [];
    for (let i = 0; i < 6; i++) {
        const monthIndex = (currentMonthIndex + i) % 12;
        months.push({
            name: monthNames[monthIndex],
            available: i >= 2
        });
    }
    return months;
  }, []);

  const handleMonthToggle = (monthName: string) => {
    setSelectedMonths(prev => {
      const isSelected = prev.includes(monthName);
      if (isSelected) {
        return prev.filter(m => m !== monthName);
      } else {
        if (prev.length < 3) {
          return [...prev, monthName];
        }
        return prev;
      }
    });
  };
  
  const pricing = useMemo(() => {
    const count = selectedMonths.length;
    const basePrice = 1500;
    const totalWithoutDiscount = count * basePrice;
    let discountPercent = 0;
    
    if (count === 1) discountPercent = 10;
    if (count === 2) discountPercent = 30;
    if (count === 3) discountPercent = 50;
    
    const totalSavings = totalWithoutDiscount * (discountPercent / 100);
    const finalTotal = totalWithoutDiscount - totalSavings;
    
    return {
        totalWithoutDiscount,
        discountPercent,
        totalSavings,
        finalTotal,
        basePrice,
    };
  }, [selectedMonths]);

  const areAllMonthsSoldOut = availableMonths.every(m => !m.available);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans animate-in slide-in-from-right duration-300 flex flex-col relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-white/5 shrink-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-300 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-bold text-white text-lg leading-tight">Patrocinador Master</h1>
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Plano de Máxima Visibilidade</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-80 px-6 pt-8 space-y-16">
        
        <section className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/20 border-2 border-white/10">
            <Award className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white font-display tracking-tight leading-none mb-6">
            Aqui você não compra um banner. <br/> Você compra <span className="text-amber-400">presença total</span> no app.
          </h2>
          <p className="text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
            O Patrocinador Master é a contratação de espaço publicitário premium, onde sua marca aparece em aproximadamente <strong>90% das áreas estratégicas</strong> do aplicativo.
          </p>
        </section>

        <div className="bg-slate-900/50 p-5 rounded-3xl border border-white/10 flex items-start gap-4">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
            <Info size={20} />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Aqui você contrata o espaço Patrocinador Master (por mês fechado). A criação dos materiais visuais acontece após a contratação, com suporte da nossa equipe de design.
          </p>
        </div>
        
        <section>
          <h3 className="font-bold text-lg text-white mb-6 text-center">Onde sua marca aparece:</h3>
          <div className="grid grid-cols-2 gap-3">
            <PlacementItem icon={Home} text="Home do app" />
            <PlacementItem icon={LayoutGrid} text="Topo das categorias" />
            <PlacementItem icon={List} text="Listas de empresas" />
            <PlacementItem icon={Sparkles} text="Destaques patrocinados" />
            <PlacementItem icon={ImageIcon} text="Banners principais" />
            <PlacementItem icon={Repeat} text="Espaços premium" />
          </div>
        </section>

        <section>
          <div className="text-center mb-8">
            <h3 className="font-bold text-xl text-white mb-2">Escolha seus meses</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">(venda por mês fechado)</p>
            <p className="text-xs text-slate-500 mt-3 max-w-md mx-auto">
              Você pode reservar até 3 meses. Cada mês garante sua marca com destaque máximo durante todo o período.
            </p>
          </div>

          {areAllMonthsSoldOut ? (
            <div className="bg-slate-900 border-2 border-amber-500/20 rounded-3xl p-8 text-center">
              <h4 className="text-lg font-bold text-amber-400 mb-3">Vagas Esgotadas</h4>
              <p className="text-slate-300 text-sm mb-4">No momento, as próximas vagas mensais estão esgotadas.</p>
              <button className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-xl">Entrar na lista de espera</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {availableMonths.map(month => {
                  const isSelected = selectedMonths.includes(month.name);
                  const isFull = selectedMonths.length >= 3 && !isSelected;
                  return (
                    <button
                      key={month.name}
                      disabled={!month.available || isFull}
                      onClick={() => handleMonthToggle(month.name)}
                      className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all duration-200 h-32
                        ${!month.available
                          ? 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed'
                          : isSelected
                            ? 'bg-blue-500/20 border-blue-500 scale-105'
                            : 'bg-slate-900 border-slate-800 hover:border-blue-500 disabled:opacity-30 disabled:hover:border-slate-800'
                        }
                      `}
                    >
                      <CalendarDays size={24} className={!month.available ? 'text-slate-600' : 'text-slate-300'} />
                      <span className="font-black text-lg mt-2">{month.name}</span>
                      {!month.available && <span className="text-[9px] font-bold text-red-400 uppercase mt-1">Esgotado</span>}
                    </button>
                  );
                })}
              </div>

              {selectedMonths.length > 0 && (
                <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4 text-sm animate-in fade-in">
                  <div className="flex justify-between"><span className="text-slate-400">Meses selecionados:</span><span className="font-bold text-white">{selectedMonths.join(', ')}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Valor por mês:</span><span className="font-bold text-white">R$ {pricing.basePrice.toFixed(2)}</span></div>
                  <div className="border-t border-white/5 pt-4 space-y-4">
                     <div className="flex justify-between text-emerald-400"><span className="font-bold">Desconto aplicado:</span><span className="font-bold">{pricing.discountPercent}% OFF</span></div>
                     <div className="flex justify-between text-emerald-400"><span className="font-bold">Economia total:</span><span className="font-bold">R$ {pricing.totalSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <p className="text-slate-200 font-bold">Total do pedido:</p>
                    <p className="text-2xl font-black text-amber-400">R$ {pricing.finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <p className="text-center text-xs text-slate-500 pt-4">Quanto mais meses você reserva, maior o desconto e maior sua economia em dinheiro.</p>
                </div>
              )}
            </>
          )}
        </section>

        <section>
          <h3 className="font-bold text-lg text-white mb-6 text-center">Benefícios Diretos:</h3>
          <div className="space-y-4">
            <BenefitItem icon={Eye} text="Máxima exposição local" />
            <BenefitItem icon={Award} text="Autoridade imediata no bairro" />
            <BenefitItem icon={Users} text="Sua marca sempre lembrada" />
            <BenefitItem icon={Phone} text="Mais chamadas, visitas e vendas" />
            <BenefitItem icon={BarChart3} text="Posicionamento acima da concorrência" />
          </div>
        </section>
        
        <section className="bg-slate-900 rounded-[2.5rem] p-8 border-2 border-amber-400/30 shadow-2xl shadow-black/30">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4 shadow-md shadow-amber-500/20">
              Oferta de Inauguração
            </span>
            <p className="text-lg text-slate-400 line-through">Valor normal: R$ {pricing.totalWithoutDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="text-center">
            <p className="text-6xl font-black text-white font-display tracking-tighter">R$ {pricing.finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="font-bold text-slate-300 text-lg">Total</p>
          </div>
        </section>

        <div className="flex items-center justify-center gap-3 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
          <Lock size={16} className="text-red-400" />
          <p className="text-xs text-red-300 font-bold uppercase tracking-wider">
            Vagas extremamente limitadas para manter exclusividade e performance.
          </p>
        </div>
      </main>

      {!areAllMonthsSoldOut && (
        <footer className="fixed bottom-0 left-0 right-0 p-5 bg-slate-950/80 backdrop-blur-md border-t border-white/5 z-30 max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <button 
                disabled={selectedMonths.length === 0}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-base py-5 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Quero contratar Patrocinador Master
                <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
            {selectedMonths.length === 0 && (
              <p className="text-red-400 text-xs font-bold mt-3 animate-in fade-in">
                Selecione ao menos 1 mês para continuar.
              </p>
            )}
          </div>
        </footer>
      )}
    </div>
  );
};

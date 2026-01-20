import React from 'react';
import { ChevronLeft, CheckCircle2, Rocket, Star } from 'lucide-react';
import { BannerPlan } from '../types';
import { BANNER_PLANS } from '../constants';

interface BannerSalesViewProps {
  onBack: () => void;
  onSelectPlan: (plan: BannerPlan) => void;
}

const formatCurrency = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

const PlanCard: React.FC<{ plan: BannerPlan; onSelect: () => void }> = ({ plan, onSelect }) => {
    return (
        <div className={`bg-slate-800 rounded-3xl p-6 border-2 flex flex-col transition-all duration-300 ${plan.isMostAdvantageous ? 'border-amber-400 shadow-2xl shadow-amber-500/10' : 'border-slate-700'}`}>
            {plan.isMostAdvantageous && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <Star size={12} className="fill-slate-900" /> Mais vantajoso
                </div>
            )}
            <h3 className="font-bold text-lg text-white">{plan.label}</h3>
            <p className="text-xs text-slate-400 mt-1 flex-1">{plan.benefit}</p>
            
            <div className="mt-6 mb-6">
                <p className="text-4xl font-black text-white tracking-tighter">{formatCurrency(plan.priceCents)}</p>
                {plan.installmentText && (
                    <p className="text-amber-400 font-bold text-xs">{plan.installmentText}</p>
                )}
                {plan.isPromo && (
                     <p className="text-xs text-slate-400 mt-2">Promoção por tempo limitado</p>
                )}
            </div>

            <button onClick={onSelect} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.isMostAdvantageous ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-white'}`}>
                Escolher e criar meu banner
            </button>
        </div>
    );
};


export const BannerSalesView: React.FC<BannerSalesViewProps> = ({ onBack, onSelectPlan }) => {
    
    const orderedPlans = [
        BANNER_PLANS.find(p => p.id === 'home_3m'),
        BANNER_PLANS.find(p => p.id === 'cat_3m'),
        BANNER_PLANS.find(p => p.id === 'home_1m'),
        BANNER_PLANS.find(p => p.id === 'cat_1m'),
    ].filter(p => p) as BannerPlan[];

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
            <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center gap-4">
                <button onClick={onBack} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95">
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="font-bold text-lg leading-none">Destaque sua Loja</h1>
                    <p className="text-xs text-slate-500">Planos de Anúncio</p>
                </div>
            </header>
            
            <main className="flex-1 overflow-y-auto p-6 space-y-12">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-3">
                        Atraia mais clientes
                    </h2>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                        Anuncie na Home ou nas Categorias para ser visto por milhares de moradores em Jacarepaguá.
                    </p>
                </div>

                <section>
                    <h3 className="font-bold text-center text-slate-400 text-xs uppercase tracking-widest mb-6">Como funciona</h3>
                    <div className="flex justify-between items-start text-center max-w-sm mx-auto relative">
                         <div className="absolute top-5 left-12 right-12 h-0.5 border-t-2 border-dashed border-slate-700 -z-0"></div>
                        <div className="flex flex-col items-center gap-2 w-1/3 relative">
                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700 font-bold text-blue-400">1</div>
                            <p className="text-[10px] font-bold text-slate-300 leading-tight">Escolha<br/>um plano</p>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-1/3 relative">
                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700 font-bold text-blue-400">2</div>
                            <p className="text-[10px] font-bold text-slate-300 leading-tight">Crie seu<br/>banner</p>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-1/3 relative">
                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700 font-bold text-blue-400">3</div>
                            <p className="text-[10px] font-bold text-slate-300 leading-tight">Pague e<br/>publique</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-8">
                    {orderedPlans.map(plan => (
                        <PlanCard key={plan.id} plan={plan} onSelect={() => onSelectPlan(plan)} />
                    ))}
                </section>
            </main>
        </div>
    );
};

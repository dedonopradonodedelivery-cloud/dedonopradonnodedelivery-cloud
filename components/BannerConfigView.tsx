
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Check, Home, LayoutGrid, MapPin, Search, Star, Rocket, Sparkles, TrendingUp, X, Map, BarChart, Banknote, Layers } from 'lucide-react';
import { BannerConfig } from '../types';
import { BANNER_BASE_PRICES_CENTS, NEIGHBORHOOD_OPTIONS } from '../constants';

interface BannerConfigViewProps {
  onBack: () => void;
  onConfigure: (config: BannerConfig) => void;
}

const formatCurrency = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

const calculateBannerPrice = (
  placement: 'Home' | 'Categorias' | 'Todos',
  duration: '1m' | '3m_promo',
  neighborhoodsCount: number
): number => {
    if (neighborhoodsCount === 0) return 0;

    let basePricePerMonth = 0;
    const placementKey = placement.toLowerCase() as 'home' | 'categorias';
    
    if (placement === 'Todos') {
        // Fallback for 'Todos' as requested to keep as is
        basePricePerMonth = BANNER_BASE_PRICES_CENTS['home'][duration === '1m' ? '1m_promo' : '3m_promo'] + 
                           BANNER_BASE_PRICES_CENTS['categorias'][duration === '1m' ? '1m_promo' : '3m_promo'];
    } else {
        // Use 1m_promo or 3m_promo depending on selection
        const durationKey = duration === '1m' ? '1m_promo' : '3m_promo';
        basePricePerMonth = BANNER_BASE_PRICES_CENTS[placementKey][durationKey];
    }

    const totalMonths = duration === '1m' ? 1 : 3;

    // Aumento de 10% por bairro adicional (limite 2.0x)
    const factor = 1 + Math.max(0, neighborhoodsCount - 1) * 0.10;
    const effectiveFactor = Math.min(factor, 2.0);
    const totalPrice = basePricePerMonth * totalMonths * effectiveFactor;
    
    return totalPrice;
};

export const BannerConfigView: React.FC<BannerConfigViewProps> = ({ onBack, onConfigure }) => {
    const [placement, setPlacement] = useState<'Home' | 'Categorias' | 'Todos'>('Home');
    const [duration, setDuration] = useState<'1m' | '3m_promo'>('3m_promo');
    const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
    
    const priceCents = useMemo(() => {
        return calculateBannerPrice(placement, duration, selectedNeighborhoods.length);
    }, [placement, duration, selectedNeighborhoods]);

    const savings = useMemo(() => {
        let price1m = 0;
        let price3m_promo = 0;

        if (placement === 'Todos') {
             price1m = BANNER_BASE_PRICES_CENTS.home['1m_original'] + BANNER_BASE_PRICES_CENTS.categorias['1m_original'];
             price3m_promo = BANNER_BASE_PRICES_CENTS.home['3m_promo'] + BANNER_BASE_PRICES_CENTS.categorias['3m_promo'];
        } else {
             const key = placement.toLowerCase() as 'home' | 'categorias';
             price1m = BANNER_BASE_PRICES_CENTS[key]['1m_original'];
             price3m_promo = BANNER_BASE_PRICES_CENTS[key]['3m_promo'];
        }

        const totalNormal = price1m * 3;
        const totalPromo = price3m_promo * 3;

        const savedAmount = totalNormal - totalPromo;
        const savedPercentage = totalNormal > 0 ? Math.round((savedAmount / totalNormal) * 100) : 0;
        
        return {
            percentage: savedPercentage,
            amount: formatCurrency(savedAmount)
        };
    }, [placement]);

    // Cálculo específico de economia para o card de 1 mês
    const oneMonthSavings = useMemo(() => {
        if (placement === 'Todos') return null;
        const key = placement.toLowerCase() as 'home' | 'categorias';
        const original = BANNER_BASE_PRICES_CENTS[key]['1m_original'];
        const promo = BANNER_BASE_PRICES_CENTS[key]['1m_promo'];
        return formatCurrency(original - promo);
    }, [placement]);


    const isReady = selectedNeighborhoods.length > 0 && !!duration && !!placement;

    const handleConfigure = () => {
        if (!isReady) return;
        const config: BannerConfig = {
            placement,
            duration,
            neighborhoods: NEIGHBORHOOD_OPTIONS.filter(n => selectedNeighborhoods.includes(n.id)),
            priceCents,
        };
        onConfigure(config);
    };

    const allNeighborhoodsSelected = selectedNeighborhoods.length === NEIGHBORHOOD_OPTIONS.length;

    const handleToggleAllNeighborhoods = () => {
        if (allNeighborhoodsSelected) {
            setSelectedNeighborhoods([]);
        } else {
            setSelectedNeighborhoods(NEIGHBORHOOD_OPTIONS.map(n => n.id));
        }
    };

    const currentPlacementKey = placement === 'Todos' ? 'home' : placement.toLowerCase() as 'home' | 'categorias';

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
            <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center gap-4">
                <button onClick={onBack} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95">
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="font-bold text-lg leading-none">Configurar Banner</h1>
                    <p className="text-xs text-slate-500">Defina seu plano</p>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-12 pb-48">
                <section className="text-center">
                    <h1 className="text-3xl font-black text-white font-display tracking-tight mb-4 leading-tight">
                        Coloque sua loja em destaque<br/>
                        para quem já quer comprar
                    </h1>
                    <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                        Jacarepaguá concentra mais de 450 mil moradores.
                        Com os banners patrocinados, sua loja ganha mais visibilidade, mais cliques e mais pedidos — enquanto seus concorrentes ficam para trás.
                    </p>
                </section>
                
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 grid grid-cols-2 gap-6 shadow-2xl shadow-blue-900/30 border border-blue-500/30">
                    <div className="flex items-start gap-3">
                        <Map size={20} className="text-white/80 shrink-0 mt-0.5"/>
                        <div>
                            <h4 className="font-bold text-sm text-white">Alcance local forte</h4>
                            <p className="text-xs text-blue-200/80 leading-snug">Impacte mais de 450 mil moradores de Jacarepaguá.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <Rocket size={20} className="text-white/80 shrink-0 mt-0.5"/>
                        <div>
                            <h4 className="font-bold text-sm text-white">Saia na frente do concorrente</h4>
                            <p className="text-xs text-blue-200/80 leading-snug">Sua loja aparece antes de quem não anuncia.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <Banknote size={20} className="text-white/80 shrink-0 mt-0.5"/>
                        <div>
                            <h4 className="font-bold text-sm text-white">Promoção de inauguração</h4>
                            <p className="text-xs text-blue-200/80 leading-snug">Planos com desconto especial por tempo limitado.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <BarChart size={20} className="text-white/80 shrink-0 mt-0.5"/>
                        <div>
                            <h4 className="font-bold text-sm text-white">Mais visibilidade, mais resultados</h4>
                            <p className="text-xs text-blue-200/80 leading-snug">Mais cliques, mais visitas e mais pedidos.</p>
                        </div>
                    </div>
                </div>

                <section>
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">1. Onde anunciar?</h2>
                    <div className="bg-slate-800 p-1.5 rounded-2xl flex gap-1.5 border border-slate-700 max-w-md mx-auto">
                        <button onClick={() => setPlacement('Home')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${placement === 'Home' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}><Home size={16}/> Home</button>
                        <button onClick={() => setPlacement('Categorias')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${placement === 'Categorias' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}><LayoutGrid size={16}/> Categorias</button>
                        <button onClick={() => setPlacement('Todos')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${placement === 'Todos' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}><Layers size={16}/> Todos</button>
                    </div>
                </section>

                <section>
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">2. Para quais bairros?</h2>
                    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                            <button 
                                onClick={handleToggleAllNeighborhoods}
                                className={`p-3 rounded-xl text-center text-xs font-bold transition-all border-2 ${allNeighborhoodsSelected ? 'bg-blue-500 border-blue-400 text-white' : 'bg-slate-600 border-slate-500 text-slate-200 hover:border-slate-400'}`}
                            >
                                {allNeighborhoodsSelected ? 'Desmarcar Todos' : 'Marcar Todos'}
                            </button>
                            {NEIGHBORHOOD_OPTIONS.map(hood => (
                                <button 
                                    key={hood.id}
                                    onClick={() => setSelectedNeighborhoods(prev => prev.includes(hood.id) ? prev.filter(i => i !== hood.id) : [...prev, hood.id])}
                                    className={`p-3 rounded-xl text-center text-xs font-bold transition-all border-2 ${selectedNeighborhoods.includes(hood.id) ? 'bg-blue-500 border-blue-400 text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'}`}
                                >
                                    {hood.name}
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-xs font-bold text-slate-500">Bairros selecionados: {selectedNeighborhoods.length}</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">3. Escolha a duração</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* CARD 1 MÊS - COM PROMOÇÃO */}
                        <button onClick={() => setDuration('1m')} className={`p-8 rounded-3xl text-center border-4 relative transition-all ${duration === '1m' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg"><Sparkles size={12} className="inline -mt-0.5 mr-1.5 fill-white"/>PROMOÇÃO DE INAUGURAÇÃO</div>
                            <p className="font-black text-4xl text-white">1 Mês</p>
                            <div className="mt-3 flex flex-col items-center">
                                <p className="text-xs text-slate-400 line-through font-bold">
                                    De {formatCurrency(BANNER_BASE_PRICES_CENTS[currentPlacementKey]['1m_original'])}
                                </p>
                                <p className="text-lg font-black text-blue-400">
                                    Por {formatCurrency(BANNER_BASE_PRICES_CENTS[currentPlacementKey]['1m_promo'])}
                                </p>
                            </div>
                            {oneMonthSavings && (
                                <p className="text-[10px] text-emerald-400 font-bold mt-2 uppercase tracking-wider">
                                    Economize {oneMonthSavings}
                                </p>
                            )}
                        </button>

                        {/* CARD 3 MESES - COM PROMOÇÃO EXISTENTE */}
                        <button onClick={() => setDuration('3m_promo')} className={`p-8 rounded-3xl text-center border-4 relative transition-all ${duration === '3m_promo' ? 'border-amber-400 bg-amber-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg"><Star size={12} className="inline -mt-0.5 mr-1.5 fill-slate-900"/>PROMOÇÃO DE INAUGURAÇÃO</div>
                            <p className="font-black text-4xl text-white">3 Meses</p>
                            <p className="text-sm font-bold text-amber-400 mt-2">Total com desconto</p>
                            <p className="text-[11px] text-slate-500 mt-4 leading-snug">
                                Você economiza <strong>{savings.percentage}%</strong> em relação ao plano mensal, o que representa <strong>{savings.amount} a menos</strong> no total, e garante mais tempo de destaque para sua loja.
                            </p>
                        </button>
                    </div>
                </section>

                <p className="text-center text-xs text-slate-500 font-medium pt-4">Você só paga no final, depois de criar e revisar seu banner.</p>
            </main>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-slate-900/80 backdrop-blur-md border-t border-white/5 z-20">
                <div className="bg-slate-800 p-4 rounded-2xl mb-4 border border-slate-700 flex justify-between items-center">
                    <div>
                        {duration === '3m_promo' && (
                            <span className="bg-slate-700 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-600">
                                3x sem juros
                            </span>
                        )}
                        {duration === '1m' && (
                            <span className="bg-slate-700 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-600 uppercase">
                                Preço Especial
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Total</span>
                        <span className="text-2xl font-black text-white">{formatCurrency(priceCents)}</span>
                    </div>
                </div>
                <button onClick={handleConfigure} disabled={!isReady} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform duration-150 shadow-lg shadow-blue-900/50">
                    Escolher e criar meu banner
                </button>
            </div>
        </div>
    );
};

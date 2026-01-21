
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Check, Home, LayoutGrid, MapPin, Search, Star, Rocket, Sparkles, TrendingUp, X, Map, BarChart, Banknote, Layers } from 'lucide-react';
import { BannerConfig } from '../types';
import { BANNER_BASE_PRICES_CENTS, NEIGHBORHOOD_OPTIONS } from '../constants';

interface BannerConfigViewProps {
  onBack: () => void;
  onConfigure: (config: BannerConfig) => void;
}

const formatCurrency = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

// Constante para o desconto de 3 meses, conforme solicitado no prompt.
const DESCONTO_FIXO_3M_PERCENT = 0.25; // 25%

// Função principal de cálculo de preços dinâmicos.
function calculateDynamicPrices(placement: 'Home' | 'Categorias' | 'Todos' | null, qtdBairrosSelecionados: number, duration: '1m' | '3m_promo' | null) {
    // Caso de borda: nenhum bairro selecionado.
    if (qtdBairrosSelecionados === 0 || placement === null || duration === null) {
        return {
            mensalBaseFullPrice: 0,
            plano1MesTotal: 0,
            plano3MesSemDescontoTotal: 0,
            plano3MesComDescontoTotal: 0,
            plano3MesPorMesComDesconto: 0,
            economiaReais: 0,
            economiaPercent: 0,
            totalFinal: 0
        };
    }

    // Calcula o fator de aumento de preço com base no número de bairros.
    // Primeiro bairro é base, cada adicional aumenta 10%, limitado a 2x o preço.
    const neighborhoodFactor = 1 + Math.max(0, qtdBairrosSelecionados - 1) * 0.10;
    const effectiveNeighborhoodFactor = Math.min(neighborhoodFactor, 2.0); // Limite de 2x.

    let basePricePerMonth_unit = 0; // Preço cheio por mês para 1 bairro
    
    if (placement === 'Todos') {
        // Preço de 'Todos' é a soma dos preços base da Home e Categorias
        basePricePerMonth_unit = BANNER_BASE_PRICES_CENTS.home.fullMonthlyPrice + 
                                 BANNER_BASE_PRICES_CENTS.categorias.fullMonthlyPrice;
    } else if (placement === 'Home') {
        basePricePerMonth_unit = BANNER_BASE_PRICES_CENTS.home.fullMonthlyPrice;
    } else if (placement === 'Categorias') {
        basePricePerMonth_unit = BANNER_BASE_PRICES_CENTS.categorias.fullMonthlyPrice;
    }

    const totalPlacementPricePerMonth_full = basePricePerMonth_unit * effectiveNeighborhoodFactor; // Preço cheio por mês para todos os bairros selecionados (sem desconto de duração)

    // Cálculos para 1 Mês (totalPlacementPricePerMonth_full já é o preço de 1 mês para todos os bairros)
    const plano1MesTotal = totalPlacementPricePerMonth_full;

    // Cálculos para 3 Meses
    const plano3MesSemDescontoTotal = totalPlacementPricePerMonth_full * 3;
    const plano3MesComDescontoTotal = plano3MesSemDescontoTotal * (1 - DESCONTO_FIXO_3M_PERCENT);
    const plano3MesPorMesComDesconto = plano3MesComDescontoTotal / 3;
    
    // Economia e percentual.
    const economiaReais = plano3MesSemDescontoTotal - plano3MesComDescontoTotal;
    const economiaPercent = DESCONTO_FIXO_3M_PERCENT * 100; // Usa diretamente a porcentagem do prompt.

    let totalFinal = 0;
    if (duration === '1m') {
        totalFinal = plano1MesTotal;
    } else if (duration === '3m_promo') {
        totalFinal = plano3MesComDescontoTotal;
    }

    return {
        mensalBaseFullPrice: Math.round(totalPlacementPricePerMonth_full), // Usamos totalPlacementPricePerMonth_full como mensalBase
        plano1MesTotal: Math.round(plano1MesTotal),
        plano3MesSemDescontoTotal: Math.round(plano3MesSemDescontoTotal),
        plano3MesComDescontoTotal: Math.round(plano3MesComDescontoTotal),
        plano3MesPorMesComDesconto: Math.round(plano3MesPorMesComDesconto),
        economiaReais: Math.round(economiaReais),
        economiaPercent: economiaPercent,
        totalFinal: Math.round(totalFinal)
    };
}

export const BannerConfigView: React.FC<BannerConfigViewProps> = ({ onBack, onConfigure }) => {
    const allNeighborhoodsIds = useMemo(() => NEIGHBORHOOD_OPTIONS.map(n => n.id), []);

    const [placement, setPlacement] = useState<'Home' | 'Categorias' | 'Todos' | null>('Home');
    const [duration, setDuration] = useState<'1m' | '3m_promo' | null>('3m_promo'); // Padrão para 3m_promo
    const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
    
    // Sincroniza selectedNeighborhoods ao mudar o placement para 'Todos'
    useEffect(() => {
        if (placement === 'Todos') {
            setSelectedNeighborhoods(allNeighborhoodsIds);
        }
        // Se mudar para Home/Categorias, a seleção de bairros permanece como está
    }, [placement, allNeighborhoodsIds]);

    // Hook `useMemo` para recalcular preços apenas quando as dependências mudam.
    const calculatedPrices = useMemo(() => {
        return calculateDynamicPrices(placement, selectedNeighborhoods.length, duration);
    }, [placement, selectedNeighborhoods.length, duration]);

    const {
        mensalBaseFullPrice,
        plano1MesTotal,
        plano3MesSemDescontoTotal,
        plano3MesComDescontoTotal,
        plano3MesPorMesComDesconto,
        economiaReais,
        economiaPercent,
        totalFinal
    } = calculatedPrices;

    // Lógica de habilitação do botão "Escolher e criar meu banner" no rodapé.
    const isReadyToProceed = selectedNeighborhoods.length > 0 && duration !== null && placement !== null && totalFinal > 0;

    const handleConfigure = () => {
        if (!isReadyToProceed) return;
        const config: BannerConfig = {
            placement: placement as 'Home' | 'Categorias' | 'Todos', // Já garantido por `isReadyToProceed`
            duration: duration as '1m' | '3m_promo', // Já garantido por `isReadyToProceed`
            neighborhoods: NEIGHBORHOOD_OPTIONS.filter(n => selectedNeighborhoods.includes(n.id)),
            priceCents: totalFinal, // O preço final calculado
        };
        onConfigure(config);
    };

    const allNeighborhoodsSelected = selectedNeighborhoods.length === allNeighborhoodsIds.length;

    const handleToggleAllNeighborhoods = () => {
        if (allNeighborhoodsSelected) {
            setSelectedNeighborhoods([]);
            if (placement === 'Todos') setPlacement('Home'); // Se desmarcar todos, 'Todos' deixa de ser válido
        } else {
            setSelectedNeighborhoods(allNeighborhoodsIds);
            // Se o usuário clica em "Marcar Todos", e o placement não é "Todos",
            // podemos inferir que ele quer "Todos", mas manteremos o placement atual para não surpreender.
        }
    };

    const handleToggleNeighborhood = (neighborhoodId: string) => {
        let newSelected;
        if (selectedNeighborhoods.includes(neighborhoodId)) {
            newSelected = selectedNeighborhoods.filter(id => id !== neighborhoodId);
        } else {
            newSelected = [...selectedNeighborhoods, neighborhoodId];
        }
        setSelectedNeighborhoods(newSelected);
    
        // Se o placement era 'Todos' e agora nem todos os bairros estão selecionados
        if (placement === 'Todos' && newSelected.length < allNeighborhoodsIds.length) {
            setPlacement('Home'); // Fallback para 'Home'
        }
    };

    const handleSelectPlacement = (newPlacement: 'Home' | 'Categorias' | 'Todos') => {
        setPlacement(newPlacement);
        // Se o novo placement for 'Todos' e não houver bairros selecionados, seleciona todos.
        // Ou se mudar para 'Todos' e já tiver bairros selecionados, mantém a seleção.
        // A lógica do useEffect já cobre a maior parte disso, mas forçar aqui garante.
        if (newPlacement === 'Todos' && selectedNeighborhoods.length === 0) {
            setSelectedNeighborhoods(allNeighborhoodsIds);
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
                        <button onClick={() => handleSelectPlacement('Todos')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${placement === 'Todos' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>
                            <Star size={16} className={`${placement === 'Todos' ? 'fill-white' : 'fill-slate-500'}`}/> Todos
                        </button>
                        <button onClick={() => handleSelectPlacement('Home')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${placement === 'Home' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}><Home size={16}/> Home</button>
                        <button onClick={() => handleSelectPlacement('Categorias')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${placement === 'Categorias' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}><LayoutGrid size={16}/> Categorias</button>
                    </div>
                     {placement === 'Todos' && selectedNeighborhoods.length > 0 && (
                        <p className="text-xs text-blue-300 text-center mt-3 font-medium animate-in fade-in">
                            Seu banner aparecerá na Home e em todas as Categorias, em todos os bairros.
                        </p>
                    )}
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
                                    onClick={() => handleToggleNeighborhood(hood.id)}
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
                        {/* CARD 1 MÊS */}
                        <button onClick={() => setDuration('1m')} className={`p-8 rounded-3xl text-center border-4 relative transition-all ${duration === '1m' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}>
                            <p className="font-black text-white text-3xl">1 Mês</p>
                            <p className="text-slate-400 text-sm mt-2">Preço normal</p>
                            
                            {selectedNeighborhoods.length > 0 ? (
                                <>
                                    <p className="font-black text-4xl text-white mt-3">
                                        {formatCurrency(plano1MesTotal)}
                                    </p>
                                    <p className="text-sm text-slate-400 mt-1">
                                        (equivale a {formatCurrency(mensalBaseFullPrice)}/mês)
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-slate-400 mt-4 italic">Selecione ao menos 1 bairro para ver o preço</p>
                            )}
                        </button>

                        {/* CARD 3 MESES - COM PROMOÇÃO */}
                        <button onClick={() => setDuration('3m_promo')} className={`p-8 rounded-3xl text-center border-4 relative transition-all ${duration === '3m_promo' ? 'border-amber-400 bg-amber-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg"><Star size={12} className="inline -mt-0.5 mr-1.5 fill-slate-900"/>PROMOÇÃO DE INAUGURAÇÃO</div>
                            <p className="font-black text-white text-3xl">3 Meses</p>
                            <p className="text-amber-400 text-sm mt-2">Total com desconto</p>

                            {selectedNeighborhoods.length > 0 ? (
                                <>
                                    <p className="text-xs text-slate-400 line-through font-bold mt-3">
                                        De: {formatCurrency(plano3MesSemDescontoTotal)}
                                    </p>
                                    <p className="font-black text-4xl text-white">
                                        Por: {formatCurrency(plano3MesComDescontoTotal)}
                                    </p>
                                    <p className="text-amber-400 font-bold text-base mt-2">
                                        Sai por apenas {formatCurrency(plano3MesPorMesComDesconto)}/mês
                                    </p>
                                    <p className="text-[10px] text-emerald-400 font-bold mt-2 uppercase tracking-wider">
                                        Você economiza {formatCurrency(economiaReais)} ({economiaPercent}%)
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-slate-400 mt-4 italic">Selecione ao menos 1 bairro para ver o preço</p>
                            )}
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
                        {duration === '1m' && selectedNeighborhoods.length > 0 && (
                            <span className="bg-slate-700 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-600 uppercase">
                                Preço Especial
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Total</span>
                        <span className="text-2xl font-black text-white">{formatCurrency(totalFinal)}</span>
                    </div>
                </div>
                {duration === '3m_promo' && selectedNeighborhoods.length > 0 && (
                    <p className="text-xs text-slate-400 text-center mb-4">
                        Equivalente a {formatCurrency(plano3MesPorMesComDesconto)}/mês
                    </p>
                )}
                <button onClick={handleConfigure} disabled={!isReadyToProceed} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform duration-150 shadow-lg shadow-blue-900/50">
                    Escolher e criar meu banner
                </button>
            </div>
        </div>
    );
};

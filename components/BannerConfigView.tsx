import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Check, Home, LayoutGrid, MapPin, Search, Star, Rocket, Sparkles, TrendingUp, X, Map, BarChart, Banknote } from 'lucide-react';
import { BannerConfig } from '../types';
import { BANNER_BASE_PRICES_CENTS, NEIGHBORHOOD_OPTIONS } from '../constants';

interface BannerConfigViewProps {
  onBack: () => void;
  onConfigure: (config: BannerConfig) => void;
}

const formatCurrency = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

const calculateBannerPrice = (
  placement: 'Home' | 'Categorias',
  duration: '1m' | '3m_promo',
  neighborhoodsCount: number
): number => {
    if (neighborhoodsCount === 0) return 0;

    const basePricePerMonth = BANNER_BASE_PRICES_CENTS[placement.toLowerCase() as 'home' | 'categorias'][duration];
    const totalMonths = duration === '1m' ? 1 : 3;

    const factor = 1 + Math.max(0, neighborhoodsCount - 1) * 0.10;
    const effectiveFactor = Math.min(factor, 2.0);
    const totalPrice = basePricePerMonth * totalMonths * effectiveFactor;
    
    return totalPrice;
};

export const BannerConfigView: React.FC<BannerConfigViewProps> = ({ onBack, onConfigure }) => {
    const [placement, setPlacement] = useState<'Home' | 'Categorias'>('Home');
    const [duration, setDuration] = useState<'1m' | '3m_promo'>('3m_promo');
    const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
    const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
    
    const priceCents = useMemo(() => {
        return calculateBannerPrice(placement, duration, selectedNeighborhoods.length);
    }, [placement, duration, selectedNeighborhoods]);

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

    const filteredNeighborhoods = useMemo(() => {
        return NEIGHBORHOOD_OPTIONS.filter(n => 
            n.name.toLowerCase().includes(neighborhoodSearch.toLowerCase())
        );
    }, [neighborhoodSearch]);

    const handleSelectAll = () => {
        setSelectedNeighborhoods(NEIGHBORHOOD_OPTIONS.map(n => n.id));
    };

    const handleClearAll = () => {
        setSelectedNeighborhoods([]);
    };

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
                    <h1 className="text-4xl font-black text-white font-display uppercase tracking-tighter mb-4">
                        COLOQUE SUA LOJA NA FRENTE DE QUEM QUER COMPRAR
                    </h1>
                    <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                        Mais de 450 mil moradores em Jacarepaguá acessam o app todos os meses.
                        Enquanto seus concorrentes aparecem primeiro, sua loja pode estar ficando para trás.
                        Com os banners patrocinados, você ganha mais visibilidade, mais cliques e mais pedidos — com investimento baixo e controle total.
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
                            <h4 className="font-bold text-sm text-white">Saia na frente</h4>
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
                            <h4 className="font-bold text-sm text-white">Mais resultados</h4>
                            <p className="text-xs text-blue-200/80 leading-snug">Mais cliques, mais visitas e mais pedidos.</p>
                        </div>
                    </div>
                </div>

                <section>
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">1. Onde anunciar?</h2>
                    <div className="bg-slate-800 p-1.5 rounded-2xl flex gap-1.5 border border-slate-700 max-w-md mx-auto">
                        <button onClick={() => setPlacement('Home')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${placement === 'Home' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}><Home size={16}/> Home</button>
                        <button onClick={() => setPlacement('Categorias')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${placement === 'Categorias' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}><LayoutGrid size={16}/> Categorias</button>
                    </div>
                </section>

                <section>
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">2. Para quais bairros?</h2>
                    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
                        <div className="flex items-center justify-end mb-6 gap-3">
                            <button onClick={handleSelectAll} className="p-3 rounded-xl text-center text-xs font-bold transition-all border-2 bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500">Marcar Todos</button>
                            <button onClick={handleClearAll} className="text-xs font-bold text-slate-500 hover:text-slate-300">Limpar</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                            {filteredNeighborhoods.map(hood => (
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
                        <button onClick={() => setDuration('1m')} className={`p-8 rounded-3xl text-center border-4 transition-all ${duration === '1m' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}>
                            <p className="font-black text-4xl text-white">1 Mês</p>
                            <p className="text-sm text-slate-400 mt-2">Preço normal</p>
                        </button>
                        <button onClick={() => setDuration('3m_promo')} className={`p-8 rounded-3xl text-center border-4 relative transition-all ${duration === '3m_promo' ? 'border-amber-400 bg-amber-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg"><Star size={12} className="inline -mt-0.5 mr-1.5 fill-slate-900"/>MAIS VANTAJOSO</div>
                            <p className="font-black text-4xl text-white">3 Meses</p>
                            <p className="text-sm font-bold text-amber-400 mt-2">Total com desconto • 3x sem juros</p>
                            <p className="text-[11px] text-slate-500 mt-4 leading-snug">Você economiza em relação ao preço mensal e garante mais tempo de destaque.</p>
                        </button>
                    </div>
                </section>

                <p className="text-center text-xs text-slate-500 font-medium pt-4">Você só paga no final, depois de criar e revisar seu banner.</p>
            </main>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-slate-900/80 backdrop-blur-md border-t border-white/5 z-20">
                <div className="bg-slate-800 p-4 rounded-2xl mb-4 border border-slate-700 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-black text-white">{formatCurrency(priceCents)}</span>
                </div>
                <button onClick={handleConfigure} disabled={!isReady} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform duration-150 shadow-lg shadow-blue-900/50">
                    Escolher e criar meu banner
                </button>
            </div>
        </div>
    );
};
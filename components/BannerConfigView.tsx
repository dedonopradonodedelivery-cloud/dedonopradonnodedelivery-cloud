import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Check, Home, LayoutGrid, MapPin, Search, Star, Rocket, Sparkles, TrendingUp, X } from 'lucide-react';
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
                    <h1 className="font-bold text-lg leading-none">Configurar Anúncio</h1>
                    <p className="text-xs text-slate-500">Defina seu plano</p>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-12 pb-48">
                <section className="text-center">
                    <h1 className="text-4xl font-black text-white font-display uppercase tracking-tighter mb-3">
                        ATRAIA MAIS CLIENTES
                    </h1>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                        Anuncie na Home ou nas Categorias e seja visto por clientes prontos para comprar.
                    </p>
                </section>
                
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 flex items-center justify-between shadow-2xl shadow-blue-900/30 border border-blue-500/30">
                    <div className="flex flex-col items-start gap-4">
                        <div className="flex items-center gap-2 text-white font-bold text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20"><Sparkles size={12}/>Sua loja em destaque</div>
                        <div className="flex items-center gap-2 text-white font-bold text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20"><TrendingUp size={12}/>Mais cliques</div>
                        <div className="flex items-center gap-2 text-white font-bold text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20"><Rocket size={12}/>Mais pedidos</div>
                    </div>
                    <Rocket size={64} className="text-white/10 -rotate-12"/>
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
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    value={neighborhoodSearch} 
                                    onChange={e => setNeighborhoodSearch(e.target.value)} 
                                    placeholder="Buscar bairro..." 
                                    className="w-full bg-slate-700 text-white pl-9 p-3 rounded-xl text-sm border border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={handleSelectAll} className="text-xs font-bold text-blue-400 hover:text-blue-300">Marcar Todos</button>
                                <button onClick={handleClearAll} className="text-xs font-bold text-slate-500 hover:text-slate-300">Limpar</button>
                            </div>
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
                            <p className="text-sm text-slate-400 mt-2">Ideal para começar</p>
                        </button>
                        <button onClick={() => setDuration('3m_promo')} className={`p-8 rounded-3xl text-center border-4 relative transition-all ${duration === '3m_promo' ? 'border-amber-400 bg-amber-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg"><Star size={12} className="inline -mt-0.5 mr-1.5 fill-slate-900"/>MAIS VANTAJOSO</div>
                            <p className="font-black text-4xl text-white">3 Meses</p>
                            <p className="text-sm font-bold text-amber-400 mt-2">3x sem juros</p>
                        </button>
                    </div>
                </section>

                <p className="text-center text-xs text-slate-500 font-medium pt-4">Você só paga no final, depois de criar seu banner.</p>
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
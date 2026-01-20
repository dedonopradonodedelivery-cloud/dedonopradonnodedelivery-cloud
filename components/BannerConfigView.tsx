import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, Rocket, Star, Home, LayoutGrid, MapPin, Search, X, Check } from 'lucide-react';
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
    const basePricePerMonth = BANNER_BASE_PRICES_CENTS[placement.toLowerCase() as 'home' | 'categorias'][duration];
    const totalMonths = duration === '1m' ? 1 : 3;

    if (neighborhoodsCount === 0) return 0;

    const factor = 1 + Math.max(0, neighborhoodsCount - 1) * 0.10;
    const effectiveFactor = Math.min(factor, 2.0);
    const totalPrice = basePricePerMonth * totalMonths * effectiveFactor;
    
    return totalPrice;
};

const NeighborhoodModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    selected: string[];
    onConfirm: (selected: string[]) => void;
}> = ({ isOpen, onClose, selected, onConfirm }) => {
    const [localSelected, setLocalSelected] = useState<string[]>(selected);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if(isOpen) setLocalSelected(selected);
    }, [isOpen, selected]);

    if (!isOpen) return null;

    const filteredNeighborhoods = NEIGHBORHOOD_OPTIONS.filter(n => n.name.toLowerCase().includes(search.toLowerCase()));

    const toggleSelection = (id: string) => {
        setLocalSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAll = () => {
        if(localSelected.length === NEIGHBORHOOD_OPTIONS.length) {
            setLocalSelected([]);
        } else {
            setLocalSelected(NEIGHBORHOOD_OPTIONS.map(n => n.id));
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end" onClick={onClose}>
            <div className="bg-slate-800 w-full rounded-t-3xl h-[80vh] flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-lg text-white mb-4">Selecione os Bairros</h3>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar bairro..." className="w-full bg-slate-700 text-white pl-9 p-3 rounded-lg text-sm" />
                </div>
                <button onClick={handleSelectAll} className="w-full text-left p-3 text-sm font-bold text-blue-400 hover:bg-slate-700 rounded-lg">{localSelected.length === NEIGHBORHOOD_OPTIONS.length ? 'Desmarcar Todos' : 'Marcar Todos'}</button>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {filteredNeighborhoods.map(hood => (
                        <div key={hood.id} onClick={() => toggleSelection(hood.id)} className="flex items-center justify-between p-3 hover:bg-slate-700 rounded-lg cursor-pointer">
                            <span className="font-medium text-sm text-slate-200">{hood.name}</span>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 ${localSelected.includes(hood.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                                {localSelected.includes(hood.id) && <Check size={14} className="text-white" />}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => onConfirm(localSelected)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-4">Confirmar ({localSelected.length})</button>
            </div>
        </div>
    );
};

export const BannerConfigView: React.FC<BannerConfigViewProps> = ({ onBack, onConfigure }) => {
    const [placement, setPlacement] = useState<'Home' | 'Categorias'>('Home');
    const [duration, setDuration] = useState<'1m' | '3m_promo'>('3m_promo');
    const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
    const [isNeighborhoodModalOpen, setIsNeighborhoodModalOpen] = useState(false);
    
    const priceCents = useMemo(() => {
        return calculateBannerPrice(placement, duration, selectedNeighborhoods.length);
    }, [placement, duration, selectedNeighborhoods]);

    const isReady = selectedNeighborhoods.length > 0;

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

            <main className="flex-1 overflow-y-auto p-6 space-y-8 pb-40">
                
                {/* 1. Placement */}
                <section>
                    <h3 className="font-bold text-sm text-slate-400 mb-3">1. Onde anunciar?</h3>
                    <div className="bg-slate-800 p-1 rounded-2xl flex gap-1 border border-slate-700">
                        <button onClick={() => setPlacement('Home')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${placement === 'Home' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}><Home size={14}/> Home</button>
                        <button onClick={() => setPlacement('Categorias')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${placement === 'Categorias' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}><LayoutGrid size={14}/> Categorias</button>
                    </div>
                </section>

                {/* 2. Neighborhoods */}
                <section>
                    <h3 className="font-bold text-sm text-slate-400 mb-3">2. Para quais bairros?</h3>
                    <button onClick={() => setIsNeighborhoodModalOpen(true)} className="w-full bg-slate-800 p-4 rounded-2xl border border-slate-700 flex justify-between items-center hover:border-blue-500 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-700 rounded-lg text-slate-400"><MapPin size={16}/></div>
                            <span className="font-semibold text-sm">{selectedNeighborhoods.length === 0 ? 'Selecionar bairros' : `${selectedNeighborhoods.length} bairros selecionados`}</span>
                        </div>
                        <span className="text-xs font-bold text-blue-400">Alterar</span>
                    </button>
                </section>
                
                {/* 3. Duration */}
                <section>
                    <h3 className="font-bold text-sm text-slate-400 mb-3">3. Por quanto tempo?</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setDuration('1m')} className={`p-6 rounded-2xl text-center border-2 transition-all ${duration === '1m' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800'}`}>
                            <p className="font-black text-2xl text-white">1 Mês</p>
                        </button>
                        <button onClick={() => setDuration('3m_promo')} className={`p-6 rounded-2xl text-center border-2 relative transition-all ${duration === '3m_promo' ? 'border-amber-400 bg-amber-500/10' : 'border-slate-700 bg-slate-800'}`}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full"><Star size={12} className="inline -mt-0.5 mr-1"/>PROMO</div>
                            <p className="font-black text-2xl text-white">3 Meses</p>
                            <p className="text-xs font-bold text-amber-400 mt-1">3x sem juros</p>
                        </button>
                    </div>
                </section>

            </main>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent">
                <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl mb-4 border border-slate-700">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-300">Total</span>
                        <span className="text-2xl font-black text-white">{formatCurrency(priceCents)}</span>
                    </div>
                </div>
                <button onClick={handleConfigure} disabled={!isReady} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                    Escolher e criar meu banner
                </button>
            </div>
            
            <NeighborhoodModal 
                isOpen={isNeighborhoodModalOpen}
                onClose={() => setIsNeighborhoodModalOpen(false)}
                selected={selectedNeighborhoods}
                onConfirm={(selection) => {
                    setSelectedNeighborhoods(selection);
                    setIsNeighborhoodModalOpen(false);
                }}
            />
        </div>
    );
};
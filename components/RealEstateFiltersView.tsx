import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, MapPin, DollarSign, BedDouble, Bath, Car, Maximize2 } from 'lucide-react';
import { NEIGHBORHOODS } from '../contexts/NeighborhoodContext';

export interface RealEstateFilters {
  transaction: 'aluguel' | 'venda' | null;
  types: string[];
  locations: string[];
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  condoMin: string;
  condoMax: string;
  isFurnished: boolean | null;
  petsAllowed: boolean | null;
  highCeiling: boolean | null;
  loadingAccess: boolean | null;
  sortBy: 'relevantes' | 'recentes' | 'menor_preco' | 'maior_preco';
}

interface RealEstateFiltersViewProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: RealEstateFilters) => void;
  activeTab: 'Residencial' | 'Comercial';
  initialFilters: RealEstateFilters;
}

const SECTION_TITLE_CLASS = "text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1";

export const RealEstateFiltersView: React.FC<RealEstateFiltersViewProps> = ({ isOpen, onClose, onApply, activeTab, initialFilters }) => {
  const [filters, setFilters] = useState<RealEstateFilters>(initialFilters);

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  const toggleFilter = (field: keyof RealEstateFilters, value: any) => {
    setFilters(prev => {
      const currentValues = prev[field] as any[];
      if (Array.isArray(currentValues)) {
        if (currentValues.includes(value)) {
          return { ...prev, [field]: currentValues.filter(v => v !== value) };
        } else {
          return { ...prev, [field]: [...currentValues, value] };
        }
      }
      return { ...prev, [field]: value };
    });
  };

  const handleReset = () => {
    const defaultFilters: RealEstateFilters = {
      transaction: null, types: [], locations: [], priceMin: '', priceMax: '',
      areaMin: '', areaMax: '', bedrooms: null, bathrooms: null, parkingSpaces: null,
      condoMin: '', condoMax: '', isFurnished: null, petsAllowed: null,
      highCeiling: null, loadingAccess: null, sortBy: 'relevantes'
    };
    setFilters(defaultFilters);
    onApply(defaultFilters);
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 pb-0 flex flex-col shrink-0">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Filtros Comerciais</h2>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto no-scrollbar space-y-8 px-6 pb-10">
            <section><h3 className={SECTION_TITLE_CLASS}>Geral</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button onClick={() => setFilters({...filters, transaction: 'aluguel'})} className={`py-3 rounded-xl font-bold text-sm border transition-all ${filters.transaction === 'aluguel' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500'}`}>Alugar</button>
                  <button onClick={() => setFilters({...filters, transaction: 'venda'})} className={`py-3 rounded-xl font-bold text-sm border transition-all ${filters.transaction === 'venda' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500'}`}>Comprar</button>
                </div>
            </section>
            
            <section><h3 className={SECTION_TITLE_CLASS}>Tipo de Imóvel Comercial</h3>
              <div className="flex flex-wrap gap-2">
                {['Sala comercial', 'Loja', 'Galpão', 'Andar/Conjunto', 'Terreno comercial'].map(type => (
                  <button key={type} onClick={() => toggleFilter('types', type)} className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${filters.types.includes(type) ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500'}`}>{type}</button>
                ))}
              </div>
            </section>

            <section><h3 className={SECTION_TITLE_CLASS}>Faixa de Preço</h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Mínimo (R$)" value={filters.priceMin} onChange={e => setFilters({...filters, priceMin: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20" />
                <input type="number" placeholder="Máximo (R$)" value={filters.priceMax} onChange={e => setFilters({...filters, priceMax: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
            </section>

            <section><h3 className={SECTION_TITLE_CLASS}>Vagas de Estacionamento</h3>
              <div className="flex gap-2">
                {[0,1,2,3].map(v => (<button key={v} onClick={() => setFilters({...filters, parkingSpaces: v})} className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${filters.parkingSpaces === v ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500'}`}>{v === 3 ? '3+' : v}</button>))}
              </div>
            </section>

            <section><h3 className={SECTION_TITLE_CLASS}>Características</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight ml-1">Pé-direito alto?</label>
                      <button onClick={() => setFilters({...filters, highCeiling: !filters.highCeiling})} className={`w-full py-3 rounded-xl text-xs font-bold border transition-all ${filters.highCeiling ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500'}`}>
                        {filters.highCeiling ? 'Sim' : 'Não'}
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight ml-1">Carga/Descarga?</label>
                      <button onClick={() => setFilters({...filters, loadingAccess: !filters.loadingAccess})} className={`w-full py-3 rounded-xl text-xs font-bold border transition-all ${filters.loadingAccess ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500'}`}>
                        {filters.loadingAccess ? 'Sim' : 'Não'}
                      </button>
                    </div>
                </div>
            </section>
        </main>

        <footer className="p-6 pt-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
          <div className="flex gap-4">
            <button onClick={handleReset} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-600 bg-gray-50 dark:bg-gray-800 rounded-2xl transition-colors">Limpar</button>
            <button onClick={() => onApply(filters)} className="flex-[2] py-4 text-xs font-black uppercase tracking-widest bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all">Aplicar Filtros</button>
          </div>
        </footer>
      </div>
    </div>
  );
};
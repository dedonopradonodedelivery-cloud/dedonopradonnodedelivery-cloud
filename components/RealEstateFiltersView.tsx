
import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ChevronLeft, 
  Building2, 
  MapPin, 
  DollarSign, 
  Maximize2, 
  Car, 
  ShieldCheck, 
  User as UserIcon,
  SortAsc,
  // Fix: Add missing CheckCircle2 icon to resolve "Cannot find name 'CheckCircle2'" error
  CheckCircle2
} from 'lucide-react';

export interface RealEstateFilters {
  transaction: 'aluguel' | 'venda' | null;
  types: string[];
  locations: string[];
  priceMin: string;
  priceMax: string;
  iptuMin: string;
  iptuMax: string;
  condoMin: string;
  condoMax: string;
  areaMin: string;
  areaMax: string;
  parkingSpaces: string | null;
  details: string[];
  advertiserType: 'ambos' | 'particular' | 'profissional';
  sortBy: 'relevantes' | 'recentes' | 'menor_preco' | 'maior_preco';
}

interface RealEstateFiltersViewProps {
  initialFilters: RealEstateFilters;
  onApply: (filters: RealEstateFilters) => void;
  onBack: () => void;
}

const SECTION_TITLE_CLASS = "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1";

export const RealEstateFiltersView: React.FC<RealEstateFiltersViewProps> = ({ initialFilters, onApply, onBack }) => {
  const [filters, setFilters] = useState<RealEstateFilters>(initialFilters);
  const [locationSearch, setLocationSearch] = useState('');

  const toggleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type) 
        ? prev.types.filter(t => t !== type) 
        : [...prev.types, type]
    }));
  };

  const toggleDetail = (detail: string) => {
    setFilters(prev => ({
      ...prev,
      details: prev.details.includes(detail) 
        ? prev.details.filter(d => d !== detail) 
        : [...prev.details, detail]
    }));
  };

  const handleReset = () => {
    setFilters({
      transaction: null,
      types: [],
      locations: [],
      priceMin: '',
      priceMax: '',
      iptuMin: '',
      iptuMax: '',
      condoMin: '',
      condoMax: '',
      areaMin: '',
      areaMax: '',
      parkingSpaces: null,
      details: [],
      advertiserType: 'ambos',
      sortBy: 'relevantes'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      {/* HEADER */}
      <header className="px-6 pt-12 pb-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Filtros</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Imóveis Comerciais</p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar">
        
        {/* 1. Transação */}
        <section>
          <h3 className={SECTION_TITLE_CLASS}>Transação</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Aluguel', 'Venda'].map(label => (
              <button 
                key={label}
                onClick={() => setFilters({...filters, transaction: label.toLowerCase() as any})}
                className={`py-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                  filters.transaction === label.toLowerCase() 
                    ? 'bg-[#1E5BFF]/5 border-[#1E5BFF] text-[#1E5BFF]' 
                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* 2. Tipo */}
        <section>
          <h3 className={SECTION_TITLE_CLASS}>Tipo de Imóvel</h3>
          <div className="flex flex-wrap gap-2">
            {['Sala comercial', 'Galpão / Depósito', 'Loja', 'Outros'].map(type => (
              <button 
                key={type}
                onClick={() => toggleType(type)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold border-2 transition-all ${
                  filters.types.includes(type)
                    ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Localização */}
        <section>
          <h3 className={SECTION_TITLE_CLASS}>Local</h3>
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Buscar bairros, ruas ou centros comerciais..."
              className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 shadow-inner dark:text-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
             {/* Mock locations chips */}
             {['Freguesia', 'Pechincha', 'Quality Shopping', 'Araguaia'].map(loc => (
               <div key={loc} className="bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-100">
                 {loc} <X size={12} className="cursor-pointer" />
               </div>
             ))}
          </div>
        </section>

        {/* 4. Faixa de Preço */}
        <section>
          <h3 className={SECTION_TITLE_CLASS}>Faixa de preço</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Mín</span>
              <input 
                type="number" 
                value={filters.priceMin}
                onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                placeholder="R$ 0" 
                className="w-full bg-gray-50 dark:bg-gray-800 border-none py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Máx</span>
              <input 
                type="number" 
                value={filters.priceMax}
                onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                placeholder="R$ s/ limite" 
                className="w-full bg-gray-50 dark:bg-gray-800 border-none py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* 5. IPTU */}
        <section>
          <h3 className={SECTION_TITLE_CLASS}>IPTU</h3>
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="number" 
              value={filters.iptuMin}
              onChange={(e) => setFilters({...filters, iptuMin: e.target.value})}
              placeholder="Mínimo" 
              className="w-full bg-gray-50 dark:bg-gray-800 border-none p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
            />
            <input 
              type="number" 
              value={filters.iptuMax}
              onChange={(e) => setFilters({...filters, iptuMax: e.target.value})}
              placeholder="Máximo" 
              className="w-full bg-gray-50 dark:bg-gray-800 border-none p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
            />
          </div>
        </section>

        {/* 6. Condomínio */}
        <section>
          <h3 className={SECTION_TITLE_CLASS}>Condomínio</h3>
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="number" 
              value={filters.condoMin}
              onChange={(e) => setFilters({...filters, condoMin: e.target.value})}
              placeholder="Mínimo" 
              className="w-full bg-gray-50 dark:bg-gray-800 border-none p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
            />
            <input 
              type="number" 
              value={filters.condoMax}
              onChange={(e) => setFilters({...filters, condoMax: e.target.value})}
              placeholder="Máximo" 
              className="w-full bg-gray-50 dark:bg-gray-800 border-none p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
            />
          </div>
        </section>

        {/* 7. Área */}
        <section>
          <h3 className={SECTION_TITLE_CLASS}>Área (m²)</h3>
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="number" 
              value={filters.areaMin}
              onChange={(e) => setFilters({...filters, areaMin: e.target.value})}
              placeholder="Min m²" 
              className="w-full bg-gray-50 dark:bg-gray-800 border-none p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
            />
            <input 
              type="number" 
              value={filters.areaMax}
              onChange={(e) => setFilters({...filters, areaMax: e.target.value})}
              placeholder="Max m²" 
              className="w-full bg-gray-50 dark:bg-gray-800 border-none p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
            />
          </div>
        </section>

        {/* 8. Vagas na garagem */}
        <section>
          <h3 className={SECTION_TITLE_CLASS}>Vagas na garagem</h3>
          <div className="grid grid-cols-5 gap-2">
            {['01', '02', '03', '04', '+05'].map(num => (
              <button 
                key={num}
                onClick={() => setFilters({...filters, parkingSpaces: num})}
                className={`py-3 rounded-xl font-bold text-xs transition-all ${
                  filters.parkingSpaces === num 
                    ? 'bg-[#1E5BFF] text-white shadow-md' 
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-500'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </section>

        {/* 9. Detalhes */}
        <section>
          <h3 className={SECTION_TITLE_CLASS}>Detalhes</h3>
          <div className="flex flex-wrap gap-2">
            {['Segurança 24h', 'Câmeras de segurança', 'Elevador', 'Portaria', 'Acesso para deficientes'].map(detail => (
              <button 
                key={detail}
                onClick={() => toggleDetail(detail)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold border-2 transition-all ${
                  filters.details.includes(detail)
                    ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-500'
                }`}
              >
                {detail}
              </button>
            ))}
          </div>
        </section>

        {/* 10. Tipo de anunciante */}
        <section>
          <h3 className={SECTION_TITLE_CLASS}>Tipo de anunciante</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              {id: 'ambos', label: 'Ambos'},
              {id: 'particular', label: 'Particular'},
              {id: 'profissional', label: 'Profissional'}
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => setFilters({...filters, advertiserType: opt.id as any})}
                className={`py-3 rounded-xl font-bold text-xs transition-all ${
                  filters.advertiserType === opt.id 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950' 
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* 11. Ordenar por */}
        <section>
          <h3 className={SECTION_TITLE_CLASS}>Ordenar por</h3>
          <div className="space-y-2">
            {[
              {id: 'relevantes', label: 'Mais relevantes'},
              {id: 'recentes', label: 'Mais recentes'},
              {id: 'menor_preco', label: 'Menor preço'},
              {id: 'maior_preco', label: 'Maior preço'}
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => setFilters({...filters, sortBy: opt.id as any})}
                className="w-full p-4 rounded-2xl flex items-center justify-between bg-gray-50 dark:bg-gray-800 group"
              >
                <span className={`text-sm font-bold ${filters.sortBy === opt.id ? 'text-[#1E5BFF]' : 'text-gray-600 dark:text-gray-400'}`}>
                  {opt.label}
                </span>
                {/* Fix: CheckCircle2 icon was not imported from lucide-react */}
                {filters.sortBy === opt.id && <CheckCircle2 size={18} className="text-[#1E5BFF]" />}
              </button>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER ACTIONS */}
      <footer className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-4">
        <button 
          onClick={handleReset}
          className="flex-1 py-4 text-gray-400 font-black uppercase text-xs tracking-widest hover:text-gray-900 transition-colors"
        >
          Limpar
        </button>
        <button 
          onClick={() => onApply(filters)}
          className="flex-[2] bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
        >
          Aplicar Filtros
        </button>
      </footer>
    </div>
  );
};

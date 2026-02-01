import React, { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft, SlidersHorizontal, MapPin, Car, Maximize2, 
  Building2, ArrowRight
} from 'lucide-react';
import { MOCK_REAL_ESTATE_PROPERTIES } from '../constants';
import { RealEstateProperty } from '../types';
import { RealEstateFiltersView, RealEstateFilters } from './RealEstateFiltersView';

interface RealEstateViewProps {
  onBack: () => void;
  user: User | null;
  onRequireLogin: () => void;
}

const PropertyCard: React.FC<{ property: RealEstateProperty }> = ({ property }) => {
  const isForSale = property.transaction === 'venda';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group flex flex-col h-full transition-all hover:shadow-md">
      {/* 1. Imagem com Badge Padronizado */}
      <div className="aspect-[16/10] bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg border border-white/20 text-white ${
            isForSale ? 'bg-indigo-600' : 'bg-blue-600'
          }`}>
            {isForSale ? 'VENDA' : 'ALUGUEL'}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* 2. Título do imóvel */}
        <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1">
          {property.title}
        </h3>

        {/* 3. Bairro */}
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
          {property.neighborhood}
        </p>

        {/* 4. Características (Metragem e Vagas) */}
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-1.5">
            <Maximize2 size={14} className="text-blue-500" />
            <span className="text-xs font-bold">{property.area}m²</span>
          </div>
          {property.parkingSpaces !== undefined && property.parkingSpaces > 0 && (
            <div className="flex items-center gap-1.5">
              <Car size={14} className="text-blue-500" />
              <span className="text-xs font-bold">{property.parkingSpaces} vagas</span>
            </div>
          )}
        </div>

        {/* 5. Preço com Contexto Claro e CTA */}
        <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-700 flex flex-col gap-4">
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
              {isForSale ? 'Valor de venda' : 'Aluguel mensal'}
            </p>
            <p className="text-2xl font-black text-[#1E5BFF] italic leading-none">
              {property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
            </p>
          </div>
          
          <button className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] active:scale-[0.98] transition-all">
            Ver Detalhes
            <ArrowRight size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const RealEstateView: React.FC<RealEstateViewProps> = ({ onBack, user, onRequireLogin }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<RealEstateFilters>({
    transaction: null, types: [], locations: [], priceMin: '', priceMax: '',
    areaMin: '', areaMax: '', bedrooms: null, bathrooms: null, parkingSpaces: null,
    condoMin: '', condoMax: '', isFurnished: null, petsAllowed: null,
    highCeiling: null, loadingAccess: null, sortBy: 'relevantes'
  });

  const filteredProperties = useMemo(() => {
    // REGRA OBRIGATÓRIA: Apenas IMÓVEIS COMERCIAIS
    return MOCK_REAL_ESTATE_PROPERTIES.filter(p => p.type === 'Comercial');
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(v => v !== null && v !== '' && (!Array.isArray(v) || v.length > 0)).length;
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-all active:scale-90 shadow-sm">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Imóveis Comerciais</h1>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Oportunidades Comerciais no Bairro</p>
          </div>
          <button onClick={() => setIsFilterOpen(true)} className="relative p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 shadow-sm active:scale-90 transition-all">
            <SlidersHorizontal size={20}/>
            {activeFiltersCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm animate-in zoom-in">
                {activeFiltersCount}
              </div>
            )}
          </button>
        </div>
      </header>

      <main className="p-5 pb-32 grid grid-cols-1 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(prop => <PropertyCard key={prop.id} property={prop} />)
        ) : (
          <div className="py-24 text-center opacity-40 flex flex-col items-center animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mb-4">
              <Building2 size={40} className="text-gray-400" />
            </div>
            <p className="font-black uppercase tracking-[0.2em] text-[10px]">Nenhum imóvel disponível</p>
            <p className="text-xs mt-1">Tente ajustar seus filtros de busca.</p>
          </div>
        )}
      </main>

      <RealEstateFiltersView 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        onApply={setFilters}
        activeTab="Comercial"
        initialFilters={filters}
      />
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft, SlidersHorizontal, MapPin, BedDouble, Bath, Car, Maximize2, 
  Tag, Building2, Briefcase
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
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
      <div className="aspect-[16/10] bg-gray-100 relative">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-black/50 text-white backdrop-blur-md">
          {isForSale ? 'Venda' : 'Aluguel'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 h-10">{property.title}</h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{property.neighborhood}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400 mt-3">
          <div className="flex items-center gap-1"><Maximize2 size={12} /> {property.area}m²</div>
          {property.bedrooms && <div className="flex items-center gap-1"><BedDouble size={12} /> {property.bedrooms}</div>}
          {property.bathrooms && <div className="flex items-center gap-1"><Bath size={12} /> {property.bathrooms}</div>}
          {property.parkingSpaces !== undefined && <div className="flex items-center gap-1"><Car size={12} /> {property.parkingSpaces}</div>}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-400">{isForSale ? 'Valor de Venda' : 'Aluguel Mensal'}</p>
            <p className="text-xl font-black text-[#1E5BFF]">
              {property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
            </p>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-200">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export const RealEstateView: React.FC<RealEstateViewProps> = ({ onBack, user, onRequireLogin }) => {
  const [activeTab, setActiveTab] = useState<'Residencial' | 'Comercial'>('Residencial');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<RealEstateFilters>({
    transaction: null, types: [], locations: [], priceMin: '', priceMax: '',
    areaMin: '', areaMax: '', bedrooms: null, bathrooms: null, parkingSpaces: null,
    condoMin: '', condoMax: '', isFurnished: null, petsAllowed: null,
    highCeiling: null, loadingAccess: null, sortBy: 'relevantes'
  });

  const filteredProperties = useMemo(() => {
    return MOCK_REAL_ESTATE_PROPERTIES.filter(p => p.type === activeTab);
    // Lógica de filtro real será aplicada aqui
  }, [activeTab, filters]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(v => v !== null && v !== '' && (!Array.isArray(v) || v.length > 0)).length;
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500"><ChevronLeft size={20}/></button>
          <div className="flex-1"><h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Imóveis</h1></div>
          <button onClick={() => setIsFilterOpen(true)} className="relative p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500">
            <SlidersHorizontal size={20}/>
            {activeFiltersCount > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">{activeFiltersCount}</div>}
          </button>
        </div>
        
        <div className="mt-4 flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
          <button onClick={() => setActiveTab('Residencial')} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Residencial' ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>Residencial</button>
          <button onClick={() => setActiveTab('Comercial')} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Comercial' ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>Comercial</button>
        </div>
      </header>

      <main className="p-5 pb-24 space-y-4">
        {filteredProperties.map(prop => <PropertyCard key={prop.id} property={prop} />)}
      </main>

      <RealEstateFiltersView 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        onApply={setFilters}
        activeTab={activeTab}
        initialFilters={filters}
      />
    </div>
  );
};

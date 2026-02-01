import React, { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft, 
  Tag, 
  MapPin, 
  Clock, 
  Plus, 
  Search, 
  X, 
  ChevronRight, 
  ShieldCheck,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Classified } from '../types';
import { MOCK_CLASSIFIEDS } from '../constants';

interface DesapegaViewProps {
  onBack: () => void;
  user: User | null;
  onRequireLogin: () => void;
  onNavigate: (view: string) => void;
}

const DesapegaCard: React.FC<{ item: Classified }> = ({ item }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md">
      <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
        <img 
          src={item.imageUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800"} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-4 right-4">
          <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] bg-indigo-600 text-white shadow-lg border border-white/20">
            VENDA
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-black text-lg text-gray-900 dark:text-white leading-tight mb-2 truncate">
          {item.title}
        </h3>
        
        <div className="flex items-center gap-4 text-gray-400 mb-4">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
            <MapPin size={12} className="text-blue-500" />
            {item.neighborhood}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
            <Clock size={12} className="text-blue-500" />
            {item.timestamp}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-gray-50 dark:border-gray-800 pt-4">
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Preço</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 italic leading-none">
              {item.price || 'A combinar'}
            </p>
          </div>
          <button className="bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-600 dark:text-gray-300 font-black py-3 px-6 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-[9px] transition-all">
            Detalhes
            <ChevronRight size={12} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const DesapegaView: React.FC<DesapegaViewProps> = ({ onBack, user, onRequireLogin, onNavigate }) => {
  const [filterHood, setFilterHood] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<'all' | 'under50' | '50-200' | 'above200'>('all');

  const desapegaItems = useMemo(() => {
    return MOCK_CLASSIFIEDS.filter(item => item.category === 'Desapega JPA');
  }, []);

  const filteredItems = useMemo(() => {
    return desapegaItems.filter(item => {
      const matchHood = !filterHood || item.neighborhood === filterHood;
      
      const priceNum = item.price ? parseFloat(item.price.replace(/[^\d]/g, '')) / 100 : 0;
      let matchPrice = true;
      if (priceRange === 'under50') matchPrice = priceNum < 50;
      else if (priceRange === '50-200') matchPrice = priceNum >= 50 && priceNum <= 200;
      else if (priceRange === 'above200') matchPrice = priceNum > 200;

      return matchHood && matchPrice;
    });
  }, [desapegaItems, filterHood, priceRange]);

  const handleClear = () => {
    setFilterHood(null);
    setPriceRange('all');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-colors active:scale-90">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Desapega</h1>
            <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Venda o que você não usa mais no seu bairro</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
             {[
               { id: 'all', label: 'Tudo' },
               { id: 'under50', label: 'Até R$ 50' },
               { id: '50-200', label: 'R$ 50 - R$ 200' },
               { id: 'above200', label: 'Acima R$ 200' }
             ].map(range => (
                <button 
                  key={range.id}
                  onClick={() => setPriceRange(range.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                    priceRange === range.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800'
                  }`}
                >
                  {range.label}
                </button>
             ))}
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
             <button 
              onClick={() => setFilterHood(null)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                filterHood === null 
                ? 'bg-gray-900 text-white border-gray-900' 
                : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800'
              }`}
            >
              Jacarepaguá (Todos)
            </button>
            {NEIGHBORHOODS.map(hood => (
              <button 
                key={hood}
                onClick={() => setFilterHood(hood)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                  filterHood === hood 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800'
                }`}
              >
                {hood}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Bloco de Segurança */}
        <section className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30 flex gap-4">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold leading-relaxed">
            Negocie diretamente com moradores do bairro.
          </p>
        </section>

        {/* Lista de Itens */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredItems.map(item => (
              <DesapegaCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center mb-6 text-gray-400">
              <Tag size={32} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Nenhum item à venda</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
              Publique algo que você não usa mais e ajude a economia do bairro.
            </p>
            <button 
              onClick={handleClear}
              className="mt-8 text-[10px] font-black text-blue-600 uppercase tracking-widest underline"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* CTA de Publicação */}
        <section className="pt-12 pb-10">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#1E5BFF]">
              <Plus size={24} strokeWidth={3} />
            </div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-6">Quer desapegar de algo hoje?</p>
            <button 
              onClick={() => onRequireLogin()}
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all"
            >
              Publicar anúncio
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
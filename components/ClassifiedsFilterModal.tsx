import React, { useState } from 'react';
import { X, Check, MapPin, SlidersHorizontal, ArrowDownWideNarrow } from 'lucide-react';
import { NEIGHBORHOODS } from '../contexts/NeighborhoodContext';

interface ClassifiedsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export const ClassifiedsFilterModal: React.FC<ClassifiedsFilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [selectedHood, setSelectedHood] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'near' | 'price'>('recent');

  if (!isOpen) return null;

  const handleClear = () => {
    setSelectedHood(null);
    setSortBy('recent');
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Filtros Classificados</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          {/* Bairro */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-blue-500" />
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Bairro</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedHood(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedHood === null ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
              >
                Jacarepaguá (Todos)
              </button>
              {NEIGHBORHOODS.map(hood => (
                <button 
                  key={hood}
                  onClick={() => setSelectedHood(hood)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedHood === hood ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
                >
                  {hood}
                </button>
              ))}
            </div>
          </section>

          {/* Ordenação */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <ArrowDownWideNarrow size={16} className="text-blue-500" />
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Ordenar por</h3>
            </div>
            <div className="space-y-2">
              {[
                { id: 'recent', label: 'Mais recentes' },
                { id: 'near', label: 'Mais próximos' },
                { id: 'price', label: 'Com menor preço' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id as any)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between text-sm font-bold ${sortBy === opt.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  {opt.label}
                  {sortBy === opt.id && <Check size={16} />}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
          <button 
            onClick={handleClear}
            className="flex-1 py-4 text-sm font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-xl active:scale-95 transition-all"
          >
            Limpar
          </button>
          <button 
            onClick={() => onApply({ hood: selectedHood, sortBy })}
            className="flex-[2] py-4 text-sm font-bold bg-[#1E5BFF] text-white rounded-xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};
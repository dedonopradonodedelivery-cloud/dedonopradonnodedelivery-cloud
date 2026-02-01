
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { NEIGHBORHOODS } from '../contexts/NeighborhoodContext';

export interface JobFilters {
  hireTypes: string[];
  neighborhoods: string[];
  shifts: string[];
  sortBy: 'recent' | 'near';
}

interface JobFiltersViewProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: JobFilters) => void;
  initialFilters: JobFilters;
}

export const JobFiltersView: React.FC<JobFiltersViewProps> = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [tempFilters, setTempFilters] = useState<JobFilters>(initialFilters);

  const hireTypes = ['CLT', 'PJ', 'Freelancer', 'Estágio', 'Temporário'];
  const shifts = ['Integral', 'Meio período', 'Escala'];

  const toggleItem = (list: string[], item: string, field: keyof JobFilters) => {
    setTempFilters(prev => {
      const current = prev[field] as string[];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter(i => i !== item) };
      }
      return { ...prev, [field]: [...current, item] };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Filtros de Vagas</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Tipo de Contratação</h3>
            <div className="flex flex-wrap gap-2">
              {hireTypes.map(t => (
                <button 
                  key={t}
                  onClick={() => toggleItem(tempFilters.hireTypes, t, 'hireTypes')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${tempFilters.hireTypes.includes(t) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Bairro</h3>
            <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setTempFilters({...tempFilters, neighborhoods: []})}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${tempFilters.neighborhoods.length === 0 ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
                >
                  Jacarepaguá (Todos)
                </button>
                {NEIGHBORHOODS.map(hood => (
                    <button 
                      key={hood}
                      onClick={() => toggleItem(tempFilters.neighborhoods, hood, 'neighborhoods')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${tempFilters.neighborhoods.includes(hood) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
                    >
                      {hood}
                    </button>
                ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Jornada</h3>
            <div className="flex flex-wrap gap-2">
              {shifts.map(s => (
                <button 
                  key={s}
                  onClick={() => toggleItem(tempFilters.shifts, s, 'shifts')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${tempFilters.shifts.includes(s) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Ordenar por</h3>
            <div className="space-y-2">
              {[
                {id: 'recent', label: 'Mais recentes'},
                {id: 'near', label: 'Mais próximos'}
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => setTempFilters({...tempFilters, sortBy: opt.id as any})}
                  className={`w-full p-4 rounded-xl flex items-center justify-between text-sm font-bold ${tempFilters.sortBy === opt.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  {opt.label}
                  {tempFilters.sortBy === opt.id && <Check size={16} />}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button 
            onClick={() => onApply(tempFilters)}
            className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

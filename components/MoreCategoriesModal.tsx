import React, { useState, useMemo } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { Category } from '@/types';
import { CATEGORIES, SUBCATEGORIES } from '@/constants';

interface MoreCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
}

export const MoreCategoriesModal: React.FC<MoreCategoriesModalProps> = ({ isOpen, onClose, onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return CATEGORIES;
    return CATEGORIES.filter(cat => 
        cat.name.toLowerCase().includes(term) ||
        (SUBCATEGORIES[cat.name] || []).some(sub => sub.name.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md h-[80vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Todas Categorias</h2>
            <button onClick={onClose} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <X size={20} />
            </button>
          </div>
          <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar categoria ou serviço..." 
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 dark:text-white shadow-inner"
              />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
          {filteredCategories.length > 0 ? filteredCategories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => {
                onSelectCategory(cat);
                onClose();
              }}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left"
            >
              <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
                {React.isValidElement(cat.icon) ? React.cloneElement(cat.icon as any, { size: 20, strokeWidth: 3 }) : null}
              </div>
              <span className="font-bold text-gray-800 dark:text-gray-200 flex-1 uppercase text-[11px] tracking-tight">{cat.name}</span>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1E5BFF] transition-colors" />
            </button>
          )) : (
              <div className="py-20 text-center opacity-30 flex flex-col items-center">
                  <Search size={40} className="text-gray-400 mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Nenhuma categoria encontrada</p>
              </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 shrink-0 text-center">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Localizei JPA • Guia de Categorias</p>
        </div>
      </div>
    </div>
  );
};
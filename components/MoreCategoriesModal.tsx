
import React, { useState, useMemo } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { Category } from '@/types';
import { CATEGORIES } from '@/constants';

interface MoreCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
}

export const MoreCategoriesModal: React.FC<MoreCategoriesModalProps> = ({ isOpen, onClose, onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    const term = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!term) return CATEGORIES;
    return CATEGORIES.filter(cat => 
      cat.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(term)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md h-[85vh] rounded-t-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Todas as Categorias</h2>
            <button onClick={onClose} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 active:scale-90 transition-all">
              <X size={20} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por categoria..."
              className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white transition-all shadow-inner"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
          {filteredCategories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => { onSelectCategory(cat); onClose(); }}
              className="w-full p-4 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-[#1E5BFF]/30 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(cat.icon as any, { size: 20, strokeWidth: 2.5 })}
                </div>
                <p className="font-bold text-gray-900 dark:text-white text-base">{cat.name}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#1E5BFF] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

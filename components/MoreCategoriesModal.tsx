
import React, { useState, useMemo } from 'react';
import { X, Search, Hash, Info, ChevronRight } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES, CLASSIFIED_CATEGORIES } from '../constants';

interface MoreCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
}

export const MoreCategoriesModal: React.FC<MoreCategoriesModalProps> = ({ isOpen, onClose, onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGerais = useMemo(() => {
    const term = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!term) return CATEGORIES;
    return CATEGORIES.filter(cat => 
      cat.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(term)
    );
  }, [searchTerm]);

  const filteredClassificados = useMemo(() => {
    const term = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!term) return CLASSIFIED_CATEGORIES;
    return CLASSIFIED_CATEGORIES.filter(item => 
      item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(term)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] bg-white dark:bg-gray-950 flex flex-col animate-in fade-in duration-200">
      {/* Header do Modal */}
      <header className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col gap-6 shrink-0 pt-12">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Categorias</h2>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">Explore o bairro de JPA</p>
            </div>
            <button onClick={onClose} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-500 active:scale-90 transition-all">
              <X size={24} strokeWidth={3} />
            </button>
        </div>

        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="O que você procura hoje?"
              className="w-full bg-gray-50 dark:bg-gray-900 border-none py-4 pl-11 pr-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white transition-all shadow-inner"
            />
        </div>
      </header>

      {/* Lista de Categorias */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 pb-32">
        
        {/* Seção: Lojas e Serviços */}
        {(filteredGerais.length > 0) && (
          <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Comerciais e Serviços
            </h3>
            <div className="grid grid-cols-4 gap-x-2 gap-y-8">
              {filteredGerais.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat);
                    onClose();
                  }}
                  className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
                >
                  <div className={`w-14 h-14 rounded-[20px] bg-[#1E5BFF] flex items-center justify-center text-white shadow-lg border border-white/20 group-hover:brightness-110 transition-all`}>
                    {React.cloneElement(cat.icon as any, { size: 22, strokeWidth: 2.5 })}
                  </div>
                  <span className="text-[9px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-tighter text-center leading-tight">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Seção: Classificados */}
        {(filteredClassificados.length > 0) && (
          <section>
            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-6 ml-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Classificados do Bairro
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filteredClassificados.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => {
                      onSelectCategory(item);
                      onClose();
                  }}
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1E5BFF] flex items-center justify-center text-white shadow-md shrink-0">
                    {React.cloneElement(item.icon as any, { size: 18, strokeWidth: 2.5 })}
                  </div>
                  <span className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-tighter leading-tight text-left">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {(filteredGerais.length === 0 && filteredClassificados.length === 0) && (
          <div className="py-20 flex flex-col items-center text-center opacity-30">
            <Hash size={48} className="text-gray-300 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Nenhuma categoria encontrada</p>
          </div>
        )}
      </div>

      {/* Footer Informativo */}
      <footer className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-start gap-3 opacity-60">
          <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold uppercase tracking-widest">
            Encontre o que você precisa perto de casa. O Localizei JPA conecta você aos melhores negócios de Jacarepaguá.
          </p>
        </div>
      </footer>
    </div>
  );
};

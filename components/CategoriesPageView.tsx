
import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, Hash, Info } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES, CLASSIFIED_CATEGORIES } from '../constants';

interface CategoriesPageViewProps {
  onBack: () => void;
  onSelectCategory: (category: Category) => void;
}

export const CategoriesPageView: React.FC<CategoriesPageViewProps> = ({ onBack, onSelectCategory }) => {
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header Fixo */}
      <header className="px-5 pt-12 pb-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Todas as Categorias</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Navegue por Jacarepaguá</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="O que você procura hoje?"
            className="w-full bg-gray-100 dark:bg-gray-800 border-none py-4 pl-11 pr-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white transition-all shadow-inner"
          />
        </div>
      </header>

      {/* Grid de Conteúdo */}
      <main className="flex-1 p-6 space-y-12 pb-40">
        
        {/* Seção 1: Comerciais e Serviços */}
        {filteredGerais.length > 0 && (
          <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Comerciais e Serviços
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-8">
              {filteredGerais.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => onSelectCategory(cat)}
                  className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
                >
                  <div className={`w-16 h-16 rounded-[22px] bg-[#1E5BFF] flex items-center justify-center text-white shadow-lg border border-white/20 group-hover:brightness-110 transition-all`}>
                    {React.cloneElement(cat.icon as any, { size: 24, strokeWidth: 2.5 })}
                  </div>
                  <span className="text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-tighter text-center leading-tight">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Seção 2: Classificados */}
        {filteredClassificados.length > 0 && (
          <section>
            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-6 ml-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Classificados do Bairro
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {filteredClassificados.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => onSelectCategory(item)}
                  className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#1E5BFF] flex items-center justify-center text-white shadow-md shrink-0">
                    {React.cloneElement(item.icon as any, { size: 20, strokeWidth: 2.5 })}
                  </div>
                  <span className="text-[11px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-tighter leading-tight text-left">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {filteredGerais.length === 0 && filteredClassificados.length === 0 && (
          <div className="py-20 flex flex-col items-center text-center opacity-30">
            <Hash size={48} className="text-gray-300 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Nenhum resultado encontrado</p>
          </div>
        )}

        {/* Info Footer */}
        <div className="pt-8 pb-10 border-t border-gray-50 dark:border-gray-800">
          <div className="flex items-start gap-3 opacity-60 bg-gray-50 dark:bg-gray-900 p-5 rounded-3xl">
            <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold uppercase tracking-widest">
              Localizei JPA: Conectando você ao que importa no Anil, Freguesia, Taquara e toda Jacarepaguá.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

import React from 'react';
import { Star, BadgeCheck, ChevronRight } from 'lucide-react';
import { Store } from '../types';

interface ClassifiedsCategoryHighlightProps {
  store: Store;
  onClick: (store: Store) => void;
}

export const ClassifiedsCategoryHighlight: React.FC<ClassifiedsCategoryHighlightProps> = ({ store, onClick }) => {
  return (
    <section className="mb-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-1.5 mb-3 px-1">
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">⭐ Destaques do bairro</span>
      </div>

      <div 
        onClick={() => onClick(store)}
        className="bg-white dark:bg-gray-900 rounded-[2rem] p-5 border-2 border-amber-400/20 shadow-lg shadow-amber-500/5 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
        
        <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 p-1 shrink-0 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-contain rounded-xl" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
            <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-50 dark:fill-gray-900 shrink-0" />
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-tight line-clamp-1">{store.description}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-lg border border-yellow-100 dark:border-yellow-800/50">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-black text-yellow-700 dark:text-yellow-400">{store.rating}</span>
            </div>
            <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg uppercase tracking-widest border border-blue-100 dark:border-blue-800/50">Verificado</span>
          </div>
        </div>

        <div className="shrink-0 p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-300">
          <ChevronRight size={18} />
        </div>
      </div>
    </section>
  );
};
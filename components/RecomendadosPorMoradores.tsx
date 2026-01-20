import React from 'react';
import { BadgeCheck, Star } from 'lucide-react';

interface RecomendacaoItem {
  id: string;
  nome: string;
  categoria: string;
  texto: string;
  totalRecomendacoes: number;
}

interface RecomendadosPorMoradoresProps {
  items: RecomendacaoItem[];
}

export const RecomendadosPorMoradores: React.FC<RecomendadosPorMoradoresProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x -mx-5 px-5 pb-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="bg-white dark:bg-gray-800 rounded-[24px] p-5 shadow-sm border border-gray-100 dark:border-gray-700 min-w-[250px] max-w-[250px] snap-center flex flex-col justify-between active:scale-[0.98] transition-transform"
        >
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.12em]">
                {item.categoria}
              </span>
              <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">
                <Star className="w-2.5 h-2.5 text-[#1E5BFF] fill-[#1E5BFF]" />
                <span className="text-[10px] font-bold text-[#1E5BFF]">{item.totalRecomendacoes}</span>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight flex items-center gap-1 mb-2">
              {item.nome}
              <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-blue-50 dark:fill-gray-800" />
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed line-clamp-2">
              "{item.texto}"
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">
                Recomendado por
              </p>
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                moradores da freguesia
              </p>
            </div>
            
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${item.id}${i}`} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

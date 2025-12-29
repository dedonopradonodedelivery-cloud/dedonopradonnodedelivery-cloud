
import React from 'react';
import { Users, Quote, BadgeCheck, Star } from 'lucide-react';

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
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
          <span className="text-xl text-gray-400">✨</span> 
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Nenhuma recomendação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-5 px-5 pb-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="bg-white dark:bg-gray-800 rounded-[28px] p-6 shadow-sm border border-gray-100 dark:border-gray-700 min-w-[280px] max-w-[280px] snap-center flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow"
        >
          {/* Background Decorativo Sutil */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors"></div>

          <div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-2xl">
                <Users className="w-5 h-5 text-[#1E5BFF]" />
              </div>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full border border-amber-100 dark:border-amber-800">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black text-amber-700 dark:text-amber-400">{item.totalRecomendacoes}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[10px] font-bold text-[#1E5BFF] uppercase tracking-[0.15em] mb-1">
                {item.categoria}
              </p>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight flex items-center gap-1.5">
                {item.nome}
                <BadgeCheck className="w-4 h-4 text-[#1E5BFF] fill-blue-50 dark:fill-gray-800" />
              </h3>
            </div>

            <div className="relative mb-6">
              <Quote className="w-6 h-6 text-gray-100 dark:text-gray-700 absolute -top-2 -left-2 -z-0" />
              <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed relative z-10 pl-2">
                "{item.texto}"
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 dark:border-gray-700">
            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">
              Recomendado por moradores da freguesia
            </p>
            <div className="flex items-center gap-1.5 mt-1">
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${item.id}${i}`} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    {item.totalRecomendacoes} moradores recomendam
                </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

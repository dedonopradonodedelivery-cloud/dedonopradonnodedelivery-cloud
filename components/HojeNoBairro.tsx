
import React from 'react';
import { CloudSun, Car, Zap, ShieldCheck } from 'lucide-react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

export const HojeNoBairro: React.FC = () => {
  const { currentNeighborhood } = useNeighborhood();
  const neighborhood = currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood;

  return (
    <section className="px-5 pt-8 mb-6">
      <div className="mb-4">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Status Local</h2>
        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Hoje em {neighborhood}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Box Clima */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 transition-all active:scale-95">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
            <CloudSun size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Agora</p>
            <p className="text-lg font-black text-gray-900 dark:text-white leading-none tracking-tighter">28°C</p>
          </div>
        </div>

        {/* Box Trânsito */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 transition-all active:scale-95">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
            <Car size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Trânsito</p>
            <p className="text-sm font-black text-emerald-500 leading-none uppercase tracking-tighter">Fluido</p>
          </div>
        </div>
      </div>

      {/* Alerta de Utilidade sutil */}
      <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex items-center gap-3">
        <Zap size={14} className="text-[#1E5BFF]" fill="currentColor" />
        <p className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide">
          Sinal da Linha Amarela operando sem restrições.
        </p>
      </div>
    </section>
  );
};

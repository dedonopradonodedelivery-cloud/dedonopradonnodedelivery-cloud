
import React from 'react';
import { ChevronLeft, BarChart3 } from 'lucide-react';

interface MerchantPerformanceDashboardProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export const MerchantPerformanceDashboard: React.FC<MerchantPerformanceDashboardProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-gray-950 font-sans animate-in fade-in duration-500 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button 
          onClick={onBack} 
          className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none flex items-center gap-2">
            Desempenho da Minha Loja
            <BarChart3 size={18} className="text-[#1E5BFF]" />
          </h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Análise de Resultados</p>
        </div>
      </header>

      <main className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
          {/* Espaço reservado para conteúdo futuro */}
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 opacity-20">
              <BarChart3 size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-400 font-medium text-sm">
              Esta página está sendo preparada para exibir <br/> as estatísticas da sua loja.
          </p>
      </main>
    </div>
  );
};

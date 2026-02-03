
import React from 'react';
import { 
  Star, 
  CheckCircle2,
  ThumbsUp
} from 'lucide-react';
import { Store } from '../types';

interface TrustBlockProps {
  store: Store;
}

export const TrustBlock: React.FC<TrustBlockProps> = ({ store }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">Confiança no bairro</h3>
        <p className="text-[11px] text-gray-400 mt-1 font-medium leading-relaxed">Sinais de qualidade e recomendação da nossa comunidade.</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/50">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-tight">Muito bem avaliado</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50">
            <CheckCircle2 className="w-5 h-5 text-[#1E5BFF]" />
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-tight">Registro oficial ativo</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50">
            <ThumbsUp className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">Indicação de vizinhos</span>
          </div>
      </div>
    </div>
  );
};

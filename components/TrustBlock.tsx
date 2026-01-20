import React from 'react';
import { 
  Repeat, 
  Star, 
  Zap,
  Quote,
  CheckCircle2,
  ThumbsUp
} from 'lucide-react';
import { Store } from '../types';

interface TrustBlockProps {
  store: Store;
}

export const TrustBlock: React.FC<TrustBlockProps> = ({ store }) => {
  const highRating = store.rating >= 4.5;
  const activeCommunity = (store.reviewsCount || 0) > 50;
  const recentActivity = store.isSponsored;

  const indicators = [
    {
      id: 'rating',
      visible: highRating,
      icon: Star,
      label: 'Muito bem avaliado',
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      id: 'retention',
      visible: activeCommunity,
      icon: Repeat,
      label: 'Clientes voltam',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20'
    }
  ].filter(i => i.visible);

  if (indicators.length === 0 && (!store.recentComments || store.recentComments.length === 0)) return null;

  return (
    <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm animate-in fade-in duration-500">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">Confiança no bairro</h3>
        <p className="text-xs text-gray-500 mt-1">O que os moradores realmente dizem e fazem</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {indicators.map((indicator) => (
          <div key={indicator.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${indicator.bg}`}>
            <indicator.icon className={`w-4 h-4 ${indicator.color}`} />
            <span className={`text-xs font-bold ${indicator.color.split(' ')[0]}`}>{indicator.label}</span>
          </div>
        ))}
        {indicators.length === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50"><ThumbsUp className="w-4 h-4 text-gray-400" /><span className="text-xs font-bold text-gray-500">Recomendado na região</span></div>
        )}
      </div>
      {store.recentComments && store.recentComments.length > 0 && (
        <div className="relative">
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-700"></div>
          <div className="space-y-4">
            {store.recentComments.map((comment, idx) => (
              <div key={idx} className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-100 flex items-center justify-center z-10"><Quote className="w-3 h-3 text-gray-500" /></div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">"{comment}"</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};


import React from 'react';
import { 
  Repeat, 
  Handshake, 
  MessageCircle, 
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
  // Logic to determine signals (Simulated Yuka-like analysis)
  const hasCashback = (store.cashback || 0) > 0;
  const highRating = store.rating >= 4.5;
  const activeCommunity = (store.reviewsCount || 0) > 50;
  const recentActivity = store.isSponsored || hasCashback; // Logic for "Active Store"

  // Only show block if there is enough data
  if (!highRating && !activeCommunity && !hasCashback && (!store.recentComments || store.recentComments.length === 0)) {
    return null;
  }

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
    },
    {
      id: 'cashback',
      visible: hasCashback,
      icon: Handshake,
      label: 'Participa de Cashback',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    }
  ].filter(i => i.visible);

  return (
    <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Confiança no bairro
          {recentActivity && (
            <span className="text-[9px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full flex items-center gap-1 border border-indigo-100 dark:border-indigo-800">
              <Zap className="w-3 h-3 fill-indigo-600 dark:fill-indigo-400" />
              Loja Ativa
            </span>
          )}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          O que os moradores realmente dizem e fazem
        </p>
      </div>

      {/* Part 1: Quick Indicators (Yuka Style) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {indicators.map((indicator) => (
          <div key={indicator.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${indicator.bg}`}>
            <indicator.icon className={`w-4 h-4 ${indicator.color}`} />
            <span className={`text-xs font-bold ${indicator.color.split(' ')[0]}`}>
              {indicator.label}
            </span>
          </div>
        ))}
        {indicators.length === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700">
                <ThumbsUp className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Recomendado na região</span>
            </div>
        )}
      </div>

      {/* Part 2: Community Comments (Amino Style) */}
      {store.recentComments && store.recentComments.length > 0 && (
        <div className="relative">
          {/* Vertical Line Connector */}
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-700"></div>

          <div className="space-y-4">
            {store.recentComments.map((comment, idx) => (
              <div key={idx} className="relative pl-10">
                {/* Avatar / Icon */}
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center z-10">
                   <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                      <Quote className="w-3 h-3 text-gray-500 dark:text-gray-300" />
                   </div>
                </div>

                {/* Bubble */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                  "{comment}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer / Disclaimer */}
      {store.recentComments && store.recentComments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-center gap-1.5 opacity-60">
            <CheckCircle2 className="w-3 h-3 text-gray-400" />
            <p className="text-[10px] text-gray-400 font-medium">Comentários reais de vizinhos verificados</p>
          </div>
      )}

    </section>
  );
};

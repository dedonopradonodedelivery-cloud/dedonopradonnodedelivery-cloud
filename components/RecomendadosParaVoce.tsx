
import React from 'react';
import { Store } from '@/types';
import { Star, Sparkles, ChevronDown } from 'lucide-react';
import { STORES } from '@/constants';

interface RecomendadosParaVoceProps {
    stores: Store[];
    onStoreClick: (store: Store) => void;
    onNavigate: (view: string) => void;
}

const RecommendationCard: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="flex-shrink-0 w-48 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col active:scale-[0.98] transition-all p-3"
        >
            <div className="w-full h-28 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 mb-3">
                <img src={store.logoUrl || store.image} alt={store.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-left min-w-0 flex flex-col">
                <div className="flex items-start justify-between">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight pr-2">{store.name}</h4>
                    <button className="p-1 -mr-1 -mt-1 text-gray-300"><ChevronDown size={16} /></button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{store.rating}</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-400 truncate">
                      • {store.distance.split('•')[0].trim()}
                    </span>
                </div>

                {store.tags?.includes('10% OFF hoje') && (
                    <div className="mt-3 pt-2 border-t border-gray-50 dark:border-gray-800">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                            10% OFF hoje
                        </span>
                    </div>
                )}
            </div>
        </button>
    );
};

export const RecomendadosParaVoce: React.FC<RecomendadosParaVoceProps> = ({ onStoreClick, onNavigate }) => {
    
    const recommendedStores = React.useMemo(() => {
        return STORES
            .filter(s => s.rating >= 4.8 || s.tags?.includes('10% OFF hoje'))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 8);
    }, [STORES]);

    return (
        <section className="bg-white dark:bg-gray-950 pt-4 pb-6">
             <div className="px-5 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>
                    <h2 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Recomendado para você</h2>
                  </div>
                   <div className="relative flex h-2 w-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                </div>
              </div>
            
            <div className="flex overflow-x-auto no-scrollbar -mx-5 px-5 gap-3">
                 <div className="w-1 shrink-0"></div>
                {recommendedStores.map(store => (
                    <RecommendationCard key={store.id} store={store} onClick={() => onStoreClick(store)} />
                ))}
                 <div className="w-1 shrink-0"></div>
            </div>
        </section>
    );
};

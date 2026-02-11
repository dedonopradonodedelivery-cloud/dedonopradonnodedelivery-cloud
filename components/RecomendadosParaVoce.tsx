
import React from 'react';
import { Store } from '@/types';
import { Star, Sparkles } from 'lucide-react';

interface RecomendadosParaVoceProps {
    stores: Store[];
    onStoreClick: (store: Store) => void;
    onNavigate: (view: string) => void;
}

const RecommendationCard: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="w-full bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-all"
        >
            <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                <img src={store.logoUrl || store.image} alt={store.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-left min-w-0">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-lg">
                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-black text-yellow-700 dark:text-yellow-400">{store.rating}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">
                        {store.category} • {store.distance}
                    </span>
                </div>
            </div>
        </button>
    );
};

export const RecomendadosParaVoce: React.FC<RecomendadosParaVoceProps> = ({ stores, onStoreClick, onNavigate }) => {
    
    const recommendedStores = React.useMemo(() => {
        return stores
            .filter(s => s.rating >= 4.7 && s.id !== 'grupo-esquematiza')
            .sort((a,b) => b.rating - a.rating)
            .slice(0, 5);
    }, [stores]);

    return (
        <section className="px-5 py-6 bg-white dark:bg-gray-950">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 shadow-sm">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Recomendado pra você</h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Baseado na sua atividade</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('explore')} 
                  className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
                >
                  Ver todos
                </button>
              </div>
            
            <div className="space-y-3">
                {recommendedStores.map(store => (
                    <RecommendationCard key={store.id} store={store} onClick={() => onStoreClick(store)} />
                ))}
            </div>
        </section>
    );
};

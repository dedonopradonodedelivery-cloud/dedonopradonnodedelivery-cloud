
import React, { useMemo, useState, useEffect } from 'react';
import { Store } from '../types';
import { ThumbsUp, MapPin, ChevronRight, MessageSquare, Clock } from 'lucide-react';

interface RecommendedByLocalsProps {
  stores: Store[];
  onStoreClick: (store: Store) => void;
}

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const RecommendedByLocals: React.FC<RecommendedByLocalsProps> = ({ stores, onStoreClick }) => {
  const [rotatingRecommendationIndex, setRotatingRecommendationIndex] = useState(0);

  // Lógica para determinar se uma loja é "elegível" para o bloco
  const getEligibleStores = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 30)); // Reset 'now' for correct 60 days

    // Filter stores based on criteria (mocked with `mockRecommendations` and `lastRecommendationDate`)
    const eligible = stores.filter(store => {
      const recCount = store.mockRecommendations ? store.mockRecommendations.length : 0;
      const lastRecDate = store.lastRecommendationDate ? new Date(store.lastRecommendationDate) : null;

      // Critérios: 8 a 10 recomendações únicas, nos últimos 30 a 60 dias.
      // Para o mock, usaremos `recommendationsCount` direto e `lastRecommendationDate`.
      // `recommendationsCount` deve ser entre 8 e 10.
      const hasEnoughRecommendations = recCount >= 8 && recCount <= 15; // Ajustei para 15 para ter mais opções de mock

      // A recomendação mais recente deve ser de até 30 dias atrás
      const isRecent = lastRecDate && lastRecDate >= sixtyDaysAgo && lastRecDate <= thirtyDaysAgo;

      return hasEnoughRecommendations && isRecent;
    });

    // Shuffle and pick up to 3 stores
    return shuffleArray(eligible).slice(0, 3);
  }, [stores]);

  useEffect(() => {
    if (getEligibleStores.length > 0) {
      const interval = setInterval(() => {
        setRotatingRecommendationIndex(prevIndex => 
          (prevIndex + 1) % (getEligibleStores[0]?.mockRecommendations?.length || 1)
        );
      }, 5000); // Rota a cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [getEligibleStores]);


  // CRÍTICO: Só renderiza o bloco se houver pelo menos 3 lojas elegíveis
  if (getEligibleStores.length < 3) {
    return null;
  }

  return (
    <section className="px-5 mt-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-1.5 mb-2 px-1">
        <ThumbsUp className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          🗣️ Recomendados por moradores
        </h3>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-4">
        O que o pessoal do bairro indica de verdade
      </p>

      <div className="flex flex-col gap-4">
        {getEligibleStores.map((store, index) => {
          // Pega uma recomendação aleatória ou a latest, para rotacionar
          const displayedRecommendation = store.mockRecommendations?.[
            rotatingRecommendationIndex % (store.mockRecommendations?.length || 1)
          ]?.text || store.latestRecommendation?.text || "Gostei muito!";
          
          return (
            <button
              key={store.id}
              onClick={() => onStoreClick(store)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex gap-3 cursor-pointer relative group transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] active:scale-[0.99] border-2 border-transparent"
            >
              <div className="w-[88px] h-[88px] flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700">
                <img src={store.logoUrl || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-contain p-1" loading="lazy" />
              </div>

              <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
                <div className="flex flex-col gap-0.5 mb-1.5">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">{store.name}</h4>
                  <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{store.category}</p>
                </div>

                {/* Recomendação rotativa */}
                <p className="text-xs text-gray-700 dark:text-gray-300 italic line-clamp-1 mb-1">
                  "{displayedRecommendation}"
                </p>

                {/* Texto auxiliar */}
                <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-auto">
                  <ThumbsUp className="w-3 h-3 text-blue-500 fill-blue-500" />
                  <span className="font-bold">Recomendado por {store.recommendationsCount || 0} moradores</span>
                </div>
              </div>
              
              <button className="absolute top-1/2 -translate-y-1/2 right-3 w-8 h-8 rounded-full flex items-center justify-center text-gray-300 group-hover:text-blue-500 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </button>
          );
        })}
      </div>
    </section>
  );
};

import React from 'react';

// Define a interface para cada item recomendado
interface RecomendacaoItem {
  id: string;
  nome: string;
  categoria: string;
  texto: string;
  totalRecomendacoes: number;
}

// Define as props para o componente
interface RecomendadosPorMoradoresProps {
  items: RecomendacaoItem[];
}

export const RecomendadosPorMoradores: React.FC<RecomendadosPorMoradoresProps> = ({ items }) => {
  // O componente só deve renderizar se houver pelo menos 3 itens
  if (items.length < 3) {
    return null;
  }

  // Limita a exibição a no máximo 3 cards
  const displayedItems = items.slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      {displayedItems.length > 0 ? (
        displayedItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1 leading-tight">{item.nome}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">{item.categoria}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed mb-3">"{item.texto}"</p>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Recomendado por {item.totalRecomendacoes} moradores do bairro</p>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <span className="text-xl text-gray-400">✨</span> 
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Nenhuma recomendação encontrada.</p>
        </div>
      )}
    </div>
  );
};
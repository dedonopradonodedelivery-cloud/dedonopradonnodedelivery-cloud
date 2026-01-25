
import React, { useState } from 'react';
import { ChevronLeft, Store, Clock, ArrowRight, MoreHorizontal, ImageIcon, PlayCircle } from 'lucide-react';
import { Store as StoreType } from '../types';
import { STORES } from '../constants';

interface PostMedia {
  type: 'image' | 'video' | 'carousel';
  urls: string[];
}

interface NeighborhoodPost {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  media: PostMedia;
  text: string;
  timestamp: string;
}

const MOCK_POSTS: NeighborhoodPost[] = [
  {
    id: 'p1',
    storeId: 'grupo-esquematiza',
    storeName: 'Grupo Esquematiza',
    storeLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3dab?q=80&w=200&auto=format&fit=crop',
    media: { type: 'image', urls: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop'] },
    text: 'Nossa equipe de treinamento reunida hoje para alinhar os novos protocolos de segurança e atendimento para os condomínios da Freguesia. Qualidade que vem do preparo!',
    timestamp: 'há 2 horas'
  },
  {
    id: 'p2',
    storeId: 'f-1',
    storeName: 'Bibi Lanches',
    storeLogo: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=200',
    media: { type: 'image', urls: ['https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop'] },
    text: 'Aquele momento em que o suco de manga sai geladinho da centrífuga... 🥭 Frescor total para o seu dia!',
    timestamp: 'há 4 horas'
  },
  {
    id: 'p3',
    storeId: 'f-2',
    storeName: 'Studio Hair Vip',
    storeLogo: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=200',
    media: { type: 'carousel', urls: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800'] },
    text: 'Bastidores de hoje: nossa especialista Cláudia finalizando esse loiro pérola maravilhoso. Arraste para o lado e veja os detalhes do acabamento!',
    timestamp: 'ontem'
  },
  {
    id: 'p4',
    storeId: 'f-8',
    storeName: 'Academia FitBairro',
    storeLogo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200',
    media: { type: 'video', urls: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800'] },
    text: 'Aula de funcional das 7h bombando! Nada como começar o dia com energia e saúde aqui na Taquara.',
    timestamp: 'ontem'
  }
];

export const NeighborhoodPostsView: React.FC<{ onBack: () => void; onStoreClick: (store: StoreType) => void }> = ({ onBack, onStoreClick }) => {
  const [expandedText, setExpandedText] = useState<Record<string, boolean>>({});

  const toggleText = (id: string) => {
    setExpandedText(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVisitStore = (storeId: string) => {
    const store = STORES.find(s => s.id === storeId);
    if (store) onStoreClick(store);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-24 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Posts do Bairro</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Vida Local</p>
        </div>
      </header>

      <main className="max-w-md mx-auto py-4 space-y-6">
        {MOCK_POSTS.map((post) => (
          <article key={post.id} className="bg-white dark:bg-gray-900 border-y sm:border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* TOPO */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5">
                  <img src={post.storeLogo} alt={post.storeName} className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">{post.storeName}</h3>
              </div>
              <button 
                onClick={() => handleVisitStore(post.storeId)}
                className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
              >
                Visitar loja
              </button>
            </div>

            {/* MÍDIA */}
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
              <img 
                src={post.media.urls[0]} 
                alt="Conteúdo do post" 
                className="w-full h-full object-cover"
              />
              {post.media.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/20 backdrop-blur-md p-4 rounded-full">
                    <PlayCircle className="w-12 h-12 text-white opacity-80" />
                  </div>
                </div>
              )}
              {post.media.type === 'carousel' && (
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-white">
                  1/3
                </div>
              )}
            </div>

            {/* TEXTO E TEMPO */}
            <div className="p-4 pt-5">
              <div className="relative">
                <p className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-all ${expandedText[post.id] ? '' : 'line-clamp-2'}`}>
                  {post.text}
                </p>
                {post.text.length > 80 && (
                  <button 
                    onClick={() => toggleText(post.id)}
                    className="text-xs font-bold text-gray-400 mt-2 hover:text-[#1E5BFF]"
                  >
                    {expandedText[post.id] ? 'Ver menos' : 'Ver mais'}
                  </button>
                )}
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                <Clock size={12} />
                {post.timestamp}
              </div>
            </div>
          </article>
        ))}

        <div className="py-10 text-center opacity-30 flex flex-col items-center">
          <Store size={24} className="mb-2" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Você chegou ao fim dos posts de hoje</p>
        </div>
      </main>
    </div>
  );
};


import React from 'react';
import { ChevronLeft, Newspaper, Store as StoreIcon, Clock, ArrowRight, AlertCircle } from 'lucide-react';
// FIX: Import AdType enum
import { BairroPost, Store, AdType } from '@/types';
import { MOCK_BAIRRO_POSTS } from '@/constants';
import { getStoreLogo } from '@/utils/mockLogos';

interface BairroFeedViewProps {
  onBack: () => void;
  onStoreClick: (store: Store) => void;
}

const PostItem: React.FC<{ post: BairroPost; onStoreClick: (store: Store) => void }> = ({ post, onStoreClick }) => {
  // Simula buscar a loja real ou usar um mock para o clique
  const mockStore: Store = { 
    id: post.storeId, 
    name: post.storeName, 
    category: 'Comércio Local', 
    subcategory: 'Geral', 
    rating: 4.5, 
    distance: 'Freguesia • RJ', 
    // FIX: Use AdType enum member instead of string literal
    adType: AdType.ORGANIC, 
    description: post.content, 
    logoUrl: post.storeLogoUrl || getStoreLogo(post.storeId.length),
    image: post.imageUrl
  };

  const timeAgo = (isoDate: string) => {
    const now = new Date();
    const then = new Date(isoDate);
    const seconds = Math.round((now.getTime() - then.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.round(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-5 shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
            <img src={post.storeLogoUrl || getStoreLogo(post.storeId.length)} alt={post.storeName} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{post.storeName}</h4>
            <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
              <Clock size={10} /> {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {post.content}
      </p>

      {post.imageUrl && (
        <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 border border-gray-100 dark:border-gray-700 shadow-inner">
          <img src={post.imageUrl} className="w-full h-full object-cover" alt="Post content" />
        </div>
      )}

      <button
        onClick={() => onStoreClick(mockStore)}
        className="w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-[#1E5BFF] font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        Visitar Loja <ArrowRight size={14} />
      </button>
    </div>
  );
};

export const BairroFeedView: React.FC<BairroFeedViewProps> = ({ onBack, onStoreClick }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-24 animate-in fade-in duration-300">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-purple-600" /> Posts do Bairro
        </h1>
      </header>

      <main className="p-5 space-y-4">
        {MOCK_BAIRRO_POSTS.length > 0 ? (
          MOCK_BAIRRO_POSTS.map(post => (
            <PostItem key={post.id} post={post} onStoreClick={onStoreClick} />
          ))
        ) : (
          <div className="text-center py-20 opacity-30 flex flex-col items-center">
            <Newspaper size={48} className="mb-4 text-gray-400" />
            <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">Nenhum post no bairro ainda.<br/>Seja o primeiro!</p>
          </div>
        )}
      </main>
    </div>
  );
};

import React from 'react';
import { ChevronRight, Newspaper, Store as StoreIcon, AlertCircle } from 'lucide-react';
import { BairroPost, Store } from '@/types';
import { getStoreLogo } from '@/utils/mockLogos';

interface BairroPostsBlockProps {
  posts: BairroPost[];
  onNavigate: (view: string) => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
}

const PostCard: React.FC<{ post: BairroPost; onNavigate: (view: string) => void; onStoreClick: (store: Store) => void; stores: Store[] }> = ({ post, onNavigate, onStoreClick, stores }) => {
  const store = stores.find(s => s.id === post.storeId);
  const displayLogo = store?.logoUrl || post.storeLogoUrl || getStoreLogo(post.storeId.length);

  const handleCardClick = () => {
    // Optionally navigate to a specific post detail or just the main feed
    onNavigate('bairro_feed'); 
  }

  return (
    <div 
      onClick={handleCardClick}
      className="flex-shrink-0 w-[220px] bg-white dark:bg-gray-800 rounded-[2rem] p-4 shadow-sm border border-gray-100 dark:border-gray-700 snap-center cursor-pointer active:scale-[0.98] transition-transform group"
    >
      <div className="relative aspect-[3/2] w-full bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden mb-3">
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.storeName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <StoreIcon size={32} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
          <img src={displayLogo} alt="Store Logo" className="w-full h-full object-contain" />
        </div>
        <h4 className="font-bold text-gray-900 dark:text-white text-xs leading-tight truncate">{post.storeName}</h4>
      </div>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">
        {post.content}
      </p>
    </div>
  );
};

export const BairroPostsBlock: React.FC<BairroPostsBlockProps> = ({ posts, onNavigate, onStoreClick, stores }) => {
  if (posts.length === 0) {
    return (
      <div className="px-5 w-full">
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-5 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">Nenhum post do bairro ainda.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="pb-4">
      <div className="flex items-center justify-between mb-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 shadow-sm">
            <Newspaper size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">Posts do Bairro</h2>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">O que os comércios estão compartilhando</p>
          </div>
        </div>
        <button onClick={() => onNavigate('bairro_feed')} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest hover:underline active:opacity-60">Ver mais</button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-5 px-5">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onNavigate={onNavigate} onStoreClick={onStoreClick} stores={stores} />
        ))}
      </div>
    </section>
  );
};

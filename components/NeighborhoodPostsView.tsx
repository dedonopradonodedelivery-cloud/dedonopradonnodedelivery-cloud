
import React, { useState } from 'react';
import { Store, Clock, MoreHorizontal, Heart, MessageSquare, Share2 } from 'lucide-react';
import { Store as StoreType, CommunityPost } from '../types';
import { STORES, MOCK_COMMUNITY_POSTS } from '../constants';

const MOCK_POSTS: CommunityPost[] = MOCK_COMMUNITY_POSTS;

const PostCard: React.FC<{ post: CommunityPost; onStoreClick: (store: StoreType) => void }> = ({ post, onStoreClick }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleVisitStore = (userName: string) => {
    const store = STORES.find(s => s.name === userName);
    if (store) onStoreClick(store);
  };

  return (
    <article className="bg-white dark:bg-gray-900 sm:border border-gray-100 dark:border-gray-800 sm:rounded-2xl shadow-sm overflow-hidden">
      {/* TOPO */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-blue-500 p-0.5">
            <img src={post.userAvatar} alt={post.userName} className="w-full h-full rounded-full object-cover" />
          </div>
          <button onClick={() => handleVisitStore(post.userName)} className="font-bold text-sm text-gray-900 dark:text-white hover:underline">{post.userName}</button>
        </div>
        <button className="p-2 text-gray-400"><MoreHorizontal size={20} /></button>
      </div>

      {/* MÍDIA */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
        <img src={post.imageUrl} alt="Conteúdo do post" className="w-full h-full object-cover" />
      </div>

      {/* AÇÕES */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${liked ? 'text-rose-500' : 'text-gray-500 dark:text-gray-400 hover:text-rose-500'}`}>
            <Heart size={24} className={liked ? 'fill-current' : ''} />
          </button>
          <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500">
            <MessageSquare size={24} />
          </button>
        </div>
        <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500">
          <Share2 size={24} />
        </button>
      </div>
      
      {/* TEXTO E TEMPO */}
      <div className="px-4 pb-4">
        {likesCount > 0 && <p className="text-sm font-bold mb-2">{likesCount} curtidas</p>}
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <span className="font-bold text-gray-900 dark:text-white mr-1.5">{post.userName}</span>
          {post.content}
        </p>
        <p className="text-xs text-gray-400 mt-2 uppercase font-semibold tracking-wide">{post.timestamp} • {post.neighborhood}</p>
      </div>
    </article>
  );
};


export const NeighborhoodPostsView: React.FC<{ onBack: () => void; onStoreClick: (store: StoreType) => void }> = ({ onBack, onStoreClick }) => {
  return (
    <div className="max-w-md mx-auto py-4 space-y-4">
      {MOCK_POSTS.map((post) => (
        <PostCard key={post.id} post={post} onStoreClick={onStoreClick} />
      ))}
      <div className="py-10 text-center opacity-30 flex flex-col items-center">
        <Store size={24} className="mb-2" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Você chegou ao fim dos posts</p>
      </div>
    </div>
  );
};


import React from 'react';
import { Store, CommunityPost } from '../types';
import { MOCK_COMMUNITY_POSTS, STORIES, STORES } from '../constants';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  MapPin,
  Video,
  PlusCircle,
  Bookmark,
  Send,
  ChevronDown
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface CommunityFeedViewProps {
  onStoreClick: (store: Store) => void;
  user: User | null;
  onRequireLogin: () => void;
}

// Stories Component
const StoriesRail = () => (
  <div className="flex gap-4 overflow-x-auto p-4 border-b border-gray-100 dark:border-gray-800 no-scrollbar">
    {/* My Story */}
    <div className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer">
        <div className="relative">
            <div className="w-[68px] h-[68px] rounded-full p-[2px] border border-gray-200 dark:border-gray-700">
                <img src="https://ui-avatars.com/api/?name=Eu&background=random" className="w-full h-full rounded-full object-cover" alt="Seu story" />
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white dark:border-gray-900">
                <PlusCircle className="w-4 h-4" />
            </div>
        </div>
        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Seu story</span>
    </div>
    
    {STORIES.map((story, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer group">
            <div className="w-[68px] h-[68px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-900 overflow-hidden bg-white dark:bg-gray-800">
                    <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                </div>
            </div>
            <span className="text-[11px] text-gray-900 dark:text-white font-medium truncate w-16 text-center leading-tight">
                {story.name.split(' ')[0]}
            </span>
        </div>
    ))}
  </div>
);

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ onStoreClick, user, onRequireLogin }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans pb-24 animate-in fade-in duration-300">
        
        {/* Instagram-style Header */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-14 px-4 flex items-center justify-between">
            <div className="flex items-center gap-1 cursor-pointer">
                <h1 className="font-display font-bold text-xl text-gray-900 dark:text-white tracking-tight">
                    Feed da Localizei
                </h1>
                <ChevronDown className="w-4 h-4 text-gray-500 mt-1" />
            </div>
            
            <div className="flex items-center gap-5">
                <button className="relative">
                    <Heart className="w-6 h-6 text-gray-800 dark:text-white" />
                    <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="relative">
                    <MessageCircle className="w-6 h-6 text-gray-800 dark:text-white -rotate-12" />
                    <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-gray-900">2</span>
                </button>
            </div>
        </div>

        {/* Stories Rail */}
        <StoriesRail />

        {/* Feed Posts */}
        <div className="flex flex-col">
            {MOCK_COMMUNITY_POSTS.map((post) => (
                <article key={post.id} className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-2">
                    
                    {/* Post Header */}
                    <div className="flex items-center justify-between px-3 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full p-[1px] bg-gradient-to-tr from-yellow-400 to-purple-600 cursor-pointer">
                                <img src={post.userAvatar} className="w-full h-full rounded-full object-cover border border-white dark:border-gray-900" alt={post.userName} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-sm font-bold text-gray-900 dark:text-white leading-none cursor-pointer hover:opacity-80">
                                    {post.userName}
                                </span>
                                {(post.neighborhood || post.relatedStoreName) && (
                                    <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-none mt-0.5 truncate max-w-[200px]">
                                        {post.relatedStoreName ? post.relatedStoreName : post.neighborhood}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Media - Full Width */}
                    {post.imageUrl ? (
                        <div className="w-full bg-gray-100 dark:bg-gray-800 aspect-square overflow-hidden relative">
                            <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" />
                        </div>
                    ) : post.videoUrl ? (
                        <div className="w-full bg-black aspect-[4/5] flex items-center justify-center relative">
                            <Video className="w-16 h-16 text-white/80 opacity-90" />
                            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold text-white uppercase">Vídeo</span>
                            </div>
                        </div>
                    ) : (
                       // Fallback para post apenas texto
                       <div className="px-6 py-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center aspect-square">
                           <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center leading-relaxed max-w-xs font-display">
                               "{post.content}"
                           </p>
                       </div>
                    )}

                    {/* Actions Bar */}
                    <div className="px-3 pt-3 pb-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button className="hover:scale-110 transition-transform active:scale-95">
                                    <Heart className="w-7 h-7 text-gray-900 dark:text-white hover:text-red-500 transition-colors" />
                                </button>
                                <button className="hover:scale-110 transition-transform active:scale-95">
                                    <MessageCircle className="w-7 h-7 text-gray-900 dark:text-white -rotate-90 hover:text-blue-500 transition-colors" />
                                </button>
                                <button className="hover:scale-110 transition-transform active:scale-95">
                                    <Send className="w-7 h-7 text-gray-900 dark:text-white hover:text-green-500 transition-colors" />
                                </button>
                            </div>
                            
                            <button className="hover:scale-110 transition-transform active:scale-95">
                                <Bookmark className="w-7 h-7 text-gray-900 dark:text-white hover:text-yellow-500 transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Caption & Comments */}
                    <div className="px-4 space-y-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {post.likes} curtidas
                        </p>
                        
                        <div className="text-sm text-gray-900 dark:text-white leading-relaxed">
                            <span className="font-bold mr-2">{post.userName}</span>
                            {/* Show caption only if media exists, otherwise the text was already shown in the fallback area */}
                            {(post.imageUrl || post.videoUrl) && (
                                <span className="font-normal text-gray-800 dark:text-gray-300">{post.content}</span>
                            )}
                        </div>
                        
                        {post.comments > 0 && (
                            <button className="text-sm text-gray-500 dark:text-gray-400 pt-1 font-medium hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                                Ver todos os {post.comments} comentários
                            </button>
                        )}
                        
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide pt-1">
                            {post.timestamp}
                        </p>
                    </div>
                </article>
            ))}
        </div>
    </div>
  );
};

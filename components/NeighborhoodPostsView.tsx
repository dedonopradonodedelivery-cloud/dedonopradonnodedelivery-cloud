import React, { useState, useMemo } from 'react';
import { Store, Clock, MoreHorizontal, Heart, MessageSquare, Share2, Flag, CheckCircle2, ChevronLeft, Search } from 'lucide-react';
import { Store as StoreType, CommunityPost, ReportReason } from '../types';
import { STORES, MOCK_COMMUNITY_POSTS } from '../constants';
import { ReportModal } from './ReportModal';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';

const MOCK_POSTS: CommunityPost[] = MOCK_COMMUNITY_POSTS;

const PostCard: React.FC<{ post: CommunityPost; onStoreClick: (store: StoreType) => void }> = ({ post, onStoreClick }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleVisitStore = (userName: string) => {
    const store = STORES.find(s => s.name === userName);
    if (store) onStoreClick(store);
  };

  const handleReportSubmit = (reason: ReportReason) => {
    console.log(`Reporting post ${post.id} by ${post.userName} for reason: ${reason}`);
    setIsReportModalOpen(false);
    setShowReportSuccess(true);
    setTimeout(() => setShowReportSuccess(false), 3000);
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
        <button onClick={() => setIsOptionsOpen(true)} className="p-2 text-gray-400"><MoreHorizontal size={20} /></button>
      </div>

      {/* MÍDIA */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
          <img 
            src={post.imageUrl || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop'} 
            alt="Conteúdo do post" 
            className="w-full h-full object-cover" 
          />
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

      {isOptionsOpen && (
        <div className="fixed inset-0 z-[1001] bg-black/40 flex items-end" onClick={() => setIsOptionsOpen(false)}>
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl p-4 animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <button 
              onClick={() => { setIsOptionsOpen(false); setIsReportModalOpen(true); }}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Flag size={20} />
              <span className="font-bold">Denunciar Publicação</span>
            </button>
            <button 
              onClick={() => setIsOptionsOpen(false)} 
              className="w-full mt-2 p-3 rounded-lg text-gray-500 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />

      {showReportSuccess && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-in fade-in zoom-in-95">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <p className="text-sm font-medium">Denúncia enviada para análise.</p>
        </div>
      )}
    </article>
  );
};

export const NeighborhoodPostsView: React.FC<{ onBack: () => void; onStoreClick: (store: StoreType) => void }> = ({ onBack, onStoreClick }) => {
  const { currentNeighborhood, setNeighborhood } = useNeighborhood();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter(post => {
      const matchNeighborhood = currentNeighborhood === "Jacarepaguá (todos)" || post.neighborhood === currentNeighborhood;
      const matchSearch = !searchTerm || post.content.toLowerCase().includes(searchTerm.toLowerCase()) || post.userName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchNeighborhood && matchSearch;
    });
  }, [currentNeighborhood, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in fade-in duration-500 overflow-x-hidden">
      <header className="bg-white dark:bg-gray-900 px-6 pt-10 pb-6 border-b border-gray-100 dark:border-gray-800 rounded-b-[2.5rem] shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">JPA Conversa</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">O que está acontecendo agora no seu bairro</p>
          </div>
        </div>

        <div className="relative mb-5 mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar no bairro..."
            className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 transition-all shadow-inner dark:text-white"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          <button onClick={() => setNeighborhood("Jacarepaguá (todos)")} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${currentNeighborhood === "Jacarepaguá (todos)" ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'}`}>Todos</button>
          {NEIGHBORHOODS.map(hood => (
            <button key={hood} onClick={() => setNeighborhood(hood)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${currentNeighborhood === hood ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'}`}>{hood}</button>
          ))}
        </div>
      </header>
      
      <main className="max-w-md mx-auto py-4 space-y-4 w-full px-4">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} onStoreClick={onStoreClick} />
        ))}
        <div className="py-10 text-center opacity-30 flex flex-col items-center">
          <Store size={24} className="mb-2" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Você chegou ao fim dos posts</p>
        </div>
      </main>
    </div>
  );
};
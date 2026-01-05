
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  MessageSquare, 
  Heart, 
  Share2, 
  Flag, 
  MapPin, 
  Store as StoreIcon, 
  Send, 
  Image as ImageIcon,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  MoreHorizontal
} from 'lucide-react';
import { CommunityPost, Store } from '../types';
import { MOCK_COMMUNITY_POSTS, STORES } from '../constants';

interface CommunityFeedViewProps {
  onBack: () => void;
  onStoreClick: (store: Store) => void;
}

const CreatePostModal: React.FC<{ onClose: () => void; onSubmit: (data: any) => void }> = ({ onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'tip' | 'recommendation' | 'alert'>('recommendation');
  const [selectedStoreId, setSelectedStoreId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    // Find store name if selected
    const store = STORES.find(s => s.id === selectedStoreId);

    onSubmit({
      content,
      type,
      relatedStoreId: selectedStoreId,
      relatedStoreName: store?.name
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Criar Postagem</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Cancelar</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que está acontecendo no bairro?"
              className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl resize-none outline-none focus:ring-2 focus:ring-[#1E5BFF] dark:text-white"
              autoFocus
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              type="button" 
              onClick={() => setType('recommendation')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${type === 'recommendation' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-500'}`}
            >
              👍 Recomendação
            </button>
            <button 
              type="button" 
              onClick={() => setType('tip')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${type === 'tip' ? 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400' : 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-500'}`}
            >
              💡 Dica
            </button>
            <button 
              type="button" 
              onClick={() => setType('alert')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${type === 'alert' ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-500'}`}
            >
              ⚠️ Alerta
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Vincular Loja (Opcional)</label>
            <select 
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white outline-none"
            >
              <option value="">Nenhuma loja vinculada</option>
              {STORES.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button type="button" className="p-2 text-gray-400 hover:text-[#1E5BFF]">
              <ImageIcon className="w-6 h-6" />
            </button>
            <button 
              type="submit"
              disabled={!content.trim()}
              className="bg-[#1E5BFF] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ onBack, onStoreClick }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreatePost = (data: any) => {
    const newPost: CommunityPost = {
      id: `new-${Date.now()}`,
      userId: 'me',
      userName: 'Você',
      userAvatar: 'https://ui-avatars.com/api/?name=Eu&background=0D8ABC&color=fff',
      content: data.content,
      type: data.type,
      relatedStoreId: data.relatedStoreId,
      relatedStoreName: data.relatedStoreName,
      timestamp: 'Agora',
      likes: 0,
      comments: 0
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked };
      }
      return p;
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'tip': return <Lightbulb className="w-3 h-3 text-yellow-500" />;
      default: return <ThumbsUp className="w-3 h-3 text-blue-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'alert': return 'Alerta';
      case 'tip': return 'Dica';
      default: return 'Recomendação';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">Comunidade</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">O que rola no bairro</p>
          </div>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-[#1E5BFF] text-white p-2 rounded-full shadow-lg shadow-blue-500/20 active:scale-90 transition-transform"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Feed */}
      <div className="p-5 pb-24 space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            
            {/* Header Post */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{post.userName}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400">{post.timestamp}</span>
                    <span className="w-0.5 h-0.5 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500 tracking-wide bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                      {getTypeIcon(post.type)} {getTypeLabel(post.type)}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-gray-300 hover:text-gray-500">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {post.content}
            </p>

            {/* Optional Image */}
            {post.imageUrl && (
              <div className="mb-4 rounded-2xl overflow-hidden">
                <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-[300px]" />
              </div>
            )}

            {/* Related Store Card */}
            {post.relatedStoreId && (
              <div 
                onClick={() => {
                  const store = STORES.find(s => s.id === post.relatedStoreId);
                  if (store) onStoreClick(store);
                }}
                className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center gap-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
              >
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-[#1E5BFF] shadow-sm">
                  <StoreIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide mb-0.5">Loja mencionada</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{post.relatedStoreName}</p>
                </div>
                <ChevronLeft className="w-4 h-4 rotate-180 text-blue-400" />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex gap-4">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#1E5BFF] transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  {post.comments}
                </button>
              </div>
              <button className="text-gray-300 hover:text-gray-500">
                <Flag className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreatePostModal 
          onClose={() => setShowCreateModal(false)} 
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
};

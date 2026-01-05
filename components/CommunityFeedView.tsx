
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  MessageSquare, 
  Heart, 
  Flag, 
  Store as StoreIcon, 
  Send, 
  Image as ImageIcon,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  MoreHorizontal,
  Megaphone,
  User,
  ShoppingBag,
  BadgeCheck
} from 'lucide-react';
import { CommunityPost, Store } from '../types';
import { MOCK_COMMUNITY_POSTS, STORES } from '../constants';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface CommunityFeedViewProps {
  onBack?: () => void;
  onStoreClick: (store: Store) => void;
  user: SupabaseUser | null;
  onRequireLogin: () => void;
}

const CreatePostModal: React.FC<{ 
  onClose: () => void; 
  onSubmit: (data: any) => void;
  userRole: 'cliente' | 'lojista' | null;
}> = ({ onClose, onSubmit, userRole }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'tip' | 'recommendation' | 'alert' | 'news' | 'promo'>('recommendation');
  const [selectedStoreId, setSelectedStoreId] = useState('');

  const isMerchant = userRole === 'lojista';

  // Opções de tipo baseadas no papel
  const postTypes = isMerchant 
    ? [
        { id: 'news', label: 'Novidade', icon: <Megaphone className="w-3 h-3" />, color: 'bg-purple-50 text-purple-600 border-purple-200' },
        { id: 'promo', label: 'Promoção', icon: <ShoppingBag className="w-3 h-3" />, color: 'bg-green-50 text-green-600 border-green-200' },
        { id: 'tip', label: 'Dica', icon: <Lightbulb className="w-3 h-3" />, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
      ]
    : [
        { id: 'recommendation', label: 'Recomendação', icon: <ThumbsUp className="w-3 h-3" />, color: 'bg-blue-50 text-blue-600 border-blue-200' },
        { id: 'tip', label: 'Dica', icon: <Lightbulb className="w-3 h-3" />, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
        { id: 'alert', label: 'Alerta', icon: <AlertTriangle className="w-3 h-3" />, color: 'bg-red-50 text-red-600 border-red-200' },
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    const store = STORES.find(s => s.id === selectedStoreId);

    onSubmit({
      content,
      type: isMerchant && !['news', 'promo', 'tip'].includes(type) ? 'news' : type, // Fallback safe
      relatedStoreId: selectedStoreId,
      relatedStoreName: store?.name,
      authorRole: isMerchant ? 'merchant' : 'resident'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {isMerchant ? 'Publicar como Loja' : 'Criar Postagem'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Cancelar</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isMerchant ? "Conte uma novidade da sua loja..." : "O que está acontecendo no bairro?"}
              className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl resize-none outline-none focus:ring-2 focus:ring-[#1E5BFF] dark:text-white"
              autoFocus
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {postTypes.map((t) => (
                <button 
                  key={t.id}
                  type="button" 
                  onClick={() => setType(t.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${type === t.id ? t.color : 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-500'}`}
                >
                  {t.icon} {t.label}
                </button>
            ))}
          </div>

          {!isMerchant && (
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
          )}

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

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ onBack, onStoreClick, user, onRequireLogin }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'residents' | 'merchants'>('residents');

  // Detect user role from metadata or context (simplified here)
  const userRole = (user?.user_metadata?.role === 'lojista' ? 'lojista' : 'cliente') as 'cliente' | 'lojista';

  // Helper para verificar autenticação antes de ação
  const handleAuthRequired = (action: () => void) => {
    if (!user) {
      onRequireLogin();
    } else {
      action();
    }
  };

  const handleCreatePost = (data: any) => {
    if (!user) return; 

    const newPost: CommunityPost = {
      id: `new-${Date.now()}`,
      userId: user.id,
      userName: userRole === 'lojista' ? (user.user_metadata?.full_name || 'Minha Loja') : (user.user_metadata?.full_name || 'Usuário'),
      userAvatar: user.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random',
      content: data.content,
      type: data.type,
      authorRole: data.authorRole,
      relatedStoreId: data.relatedStoreId,
      relatedStoreName: data.relatedStoreName,
      timestamp: 'Agora',
      likes: 0,
      comments: 0
    };
    
    // Adiciona ao topo
    setPosts([newPost, ...posts]);
    
    // Troca para a aba correspondente ao post criado
    if (newPost.authorRole === 'merchant') setActiveTab('merchants');
    else setActiveTab('residents');
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked };
      }
      return p;
    }));
  };

  const displayedPosts = useMemo(() => {
    return posts.filter(p => {
        if (activeTab === 'residents') return p.authorRole === 'resident';
        return p.authorRole === 'merchant';
    });
  }, [posts, activeTab]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'tip': return <Lightbulb className="w-3 h-3 text-yellow-500" />;
      case 'promo': return <ShoppingBag className="w-3 h-3 text-green-500" />;
      case 'news': return <Megaphone className="w-3 h-3 text-purple-500" />;
      default: return <ThumbsUp className="w-3 h-3 text-blue-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'alert': return 'Alerta';
      case 'tip': return 'Dica';
      case 'promo': return 'Promoção';
      case 'news': return 'Novidade';
      default: return 'Recomendação';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
          )}
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">Feed do Bairro</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Conversas e novidades locais</p>
          </div>
        </div>
        <button 
          onClick={() => handleAuthRequired(() => setShowCreateModal(true))}
          className="bg-[#1E5BFF] text-white p-2 rounded-full shadow-lg shadow-blue-500/20 active:scale-90 transition-transform"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4 pb-2 bg-gray-50 dark:bg-gray-900">
        <div className="flex p-1 bg-gray-200 dark:bg-gray-800 rounded-xl relative">
            {/* Animated Background */}
            <div 
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-all duration-300 ease-out"
                style={{ left: activeTab === 'residents' ? '4px' : 'calc(50%)' }}
            ></div>

            <button 
                onClick={() => setActiveTab('residents')}
                className={`flex-1 relative z-10 py-2 text-xs font-bold text-center transition-colors ${activeTab === 'residents' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}
            >
                Moradores
            </button>
            <button 
                onClick={() => setActiveTab('merchants')}
                className={`flex-1 relative z-10 py-2 text-xs font-bold text-center transition-colors ${activeTab === 'merchants' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}
            >
                Lojistas
            </button>
        </div>
      </div>

      {/* Feed List */}
      <div className="p-5 pb-24 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {displayedPosts.length === 0 ? (
            <div className="text-center py-10 opacity-50">
                <p className="text-sm">Nenhuma postagem nesta categoria ainda.</p>
            </div>
        ) : (
            displayedPosts.map(post => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                
                {/* Header Post */}
                <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full bg-gray-200 object-cover border border-gray-100 dark:border-gray-600" />
                        {post.authorRole === 'merchant' && (
                            <div className="absolute -bottom-1 -right-1 bg-[#1E5BFF] text-white p-0.5 rounded-full border-2 border-white dark:border-gray-800">
                                <StoreIcon className="w-2.5 h-2.5" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                                {post.userName}
                            </h4>
                            {post.authorRole === 'merchant' && (
                                <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-blue-50 dark:fill-transparent" />
                            )}
                        </div>
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
                <div className="mb-4 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
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
                    onClick={() => handleAuthRequired(() => handleLike(post.id))}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                    </button>
                    <button 
                    onClick={() => handleAuthRequired(() => {})}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#1E5BFF] transition-colors"
                    >
                    <MessageSquare className="w-4 h-4" />
                    {post.comments}
                    </button>
                </div>
                <button className="text-gray-300 hover:text-gray-500">
                    <Flag className="w-4 h-4" />
                </button>
                </div>

            </div>
            ))
        )}
      </div>

      {showCreateModal && (
        <CreatePostModal 
          onClose={() => setShowCreateModal(false)} 
          onSubmit={handleCreatePost}
          userRole={userRole}
        />
      )}
    </div>
  );
};

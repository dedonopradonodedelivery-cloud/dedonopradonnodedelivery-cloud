
import React, { useState, useEffect, useRef } from 'react';
import { Search, Store as StoreIcon, MoreHorizontal, Send, Heart, Share2, MessageCircle, ChevronLeft, BadgeCheck, User as UserIcon, Home, Plus, X, Video, Image as ImageIcon, Film, Loader2, Grid, Camera, Play } from 'lucide-react';
import { Store, CommunityPost } from '../types';
import { MOCK_COMMUNITY_POSTS } from '../constants';

interface CommunityFeedViewProps {
  onStoreClick: (store: Store) => void;
  user: any;
  onRequireLogin: () => void;
}

// --- MOCK DATA ---

const MOCK_STORIES = [
  { 
    id: 1, 
    user: 'Padaria Imperial', 
    username: 'padariaimperial',
    avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop', 
    isMerchant: true, 
    hasUnread: true,
    items: [
      { id: 's1', type: 'image', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop', duration: 5000 },
      { id: 's2', type: 'image', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop', duration: 5000 }
    ]
  },
  { 
    id: 2, 
    user: 'Ana Paula', 
    username: 'anapaula',
    avatar: 'https://i.pravatar.cc/150?u=a', 
    isMerchant: false, 
    hasUnread: true,
    items: [
      { id: 's3', type: 'image', url: 'https://images.unsplash.com/photo-1526488807855-3096a6a23732?q=80&w=600&auto=format&fit=crop', duration: 5000 }
    ]
  },
  { 
    id: 3, 
    user: 'Burger Freguesia', 
    username: 'burgerfreguesia',
    avatar: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop', 
    isMerchant: true, 
    hasUnread: false,
    items: [
      { id: 's4', type: 'image', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop', duration: 5000 }
    ]
  },
  { 
    id: 4, 
    user: 'Carlos Silva', 
    username: 'carlos.silva',
    avatar: 'https://i.pravatar.cc/150?u=c', 
    isMerchant: false, 
    hasUnread: false,
    items: [
      { id: 's5', type: 'image', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop', duration: 5000 }
    ]
  }
];

const MOCK_CHATS = [
  { id: 1, user: 'Padaria Imperial', username: 'padariaimperial', avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop', lastMsg: 'Seu pedido saiu para entrega!', time: '10:30', unread: true, isMerchant: true },
  { id: 2, user: 'Suporte Localizei', username: 'suporte', avatar: 'https://ui-avatars.com/api/?name=Suporte&background=0D8ABC&color=fff', lastMsg: 'Como podemos ajudar?', time: 'Ontem', unread: false, isMerchant: false },
];

const MOCK_MESSAGES_HISTORY: Record<number, { id: number; text: string; sender: 'me' | 'them'; time: string }[]> = {
  1: [
    { id: 1, text: "Olá, bom dia! Têm pão de queijo quentinho?", sender: "me", time: "09:00" },
    { id: 2, text: "Bom dia! Sim, acabou de sair do forno 😋", sender: "them", time: "09:05" },
    { id: 3, text: "Ótimo! Vou querer 10 unidades para entrega.", sender: "me", time: "09:10" },
    { id: 4, text: "Perfeito. Já estamos preparando.", sender: "them", time: "09:15" },
    { id: 5, text: "Seu pedido saiu para entrega!", sender: "them", time: "10:30" },
  ],
  2: [
    { id: 1, text: "Olá, estou com dúvida sobre o cashback.", sender: "me", time: "Ontem" },
    { id: 2, text: "Olá! Claro, como podemos ajudar?", sender: "them", time: "Ontem" },
  ]
};

// --- SUB-COMPONENTS ---

// 0. Create Post Modal (Replaces CreatePostWidget)
const CreatePostModal: React.FC<{ isOpen: boolean; onClose: () => void; user: any }> = ({ isOpen, onClose, user }) => {
  const [caption, setCaption] = useState('');
  const [mediaFiles, setMediaFiles] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const remainingSlots = 4 - mediaFiles.length;
      
      if (mediaFiles.some(m => m.type === 'video')) {
        alert('Você não pode misturar fotos e vídeos.');
        return;
      }

      if (remainingSlots <= 0) {
        alert('Máximo de 4 fotos permitido.');
        return;
      }

      const newImages = files.slice(0, remainingSlots).map(file => ({
        url: URL.createObjectURL(file as Blob),
        type: 'image' as const
      }));

      setMediaFiles(prev => [...prev, ...newImages]);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mediaFiles.length > 0) {
        alert('Você não pode misturar fotos e vídeos. Remova as fotos primeiro.');
        return;
      }

      // Check duration (Mock check - in real app needs loadedmetadata)
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          alert("O vídeo deve ter no máximo 30 segundos.");
        } else {
          setMediaFiles([{
            url: URL.createObjectURL(file),
            type: 'video'
          }]);
        }
      }
      video.src = URL.createObjectURL(file);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (mediaFiles.length === 0) {
      alert("Adicione uma foto ou vídeo (até 30s) para publicar no Feed.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setCaption('');
      setMediaFiles([]);
      onClose();
      alert("Publicado com sucesso!");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] sm:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Criar Publicação</h2>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
            </button>
        </div>

        <div className="flex gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <UserIcon className="w-5 h-5" />
                    </div>
                )}
            </div>
            <div className="flex-1">
                <textarea 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="O que está acontecendo no bairro?" 
                    className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 min-h-[80px] resize-none"
                    maxLength={2200}
                />
                <div className={`text-right text-xs mt-1 ${caption.length >= 2200 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                    {caption.length} / 2200
                </div>
            </div>
        </div>

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
            <div className={`mb-6 grid gap-2 ${mediaFiles.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {mediaFiles.map((media, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] group">
                    {media.type === 'image' ? (
                    <img src={media.url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                    <video src={media.url} className="w-full h-full object-cover" controls />
                    )}
                    <button 
                    onClick={() => removeMedia(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                    >
                    <X className="w-3 h-3" />
                    </button>
                </div>
                ))}
            </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-3">
                <button 
                    onClick={() => imageInputRef.current?.click()}
                    className={`p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${mediaFiles.some(m => m.type === 'video') ? 'opacity-50 cursor-not-allowed' : 'text-[#1E5BFF]'}`}
                    disabled={mediaFiles.some(m => m.type === 'video')}
                >
                    <ImageIcon className="w-6 h-6" />
                </button>
                <input 
                    type="file" 
                    ref={imageInputRef} 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handleImageSelect}
                />

                <button 
                    onClick={() => videoInputRef.current?.click()}
                    className={`p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${mediaFiles.length > 0 ? 'opacity-50 cursor-not-allowed' : 'text-red-500'}`}
                    disabled={mediaFiles.length > 0}
                >
                    <Film className="w-6 h-6" />
                </button>
                <input 
                    type="file" 
                    ref={videoInputRef} 
                    accept="video/*" 
                    className="hidden" 
                    onChange={handleVideoSelect}
                />
            </div>

            <button 
                onClick={handleSubmit}
                disabled={isSubmitting || mediaFiles.length === 0}
                className={`py-2.5 px-6 rounded-full text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
                    mediaFiles.length === 0 
                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 shadow-none' 
                    : 'bg-[#1E5BFF] hover:bg-blue-600 active:scale-95 shadow-blue-500/30'
                }`}
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Publicar
            </button>
        </div>
      </div>
    </div>
  );
};

const FeedPost: React.FC<{ post: CommunityPost; onLike: () => void }> = ({ post, onLike }) => {
  const [liked, setLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = () => {
    onLike();
    setLiked(!liked);
  };

  const MAX_PREVIEW_LENGTH = 180;
  const shouldTruncate = post.content.length > MAX_PREVIEW_LENGTH;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover bg-gray-200" />
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1">
              {post.userName}
              {post.authorRole === 'merchant' && <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-white" />}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap inline">
            {shouldTruncate && !isExpanded 
                ? post.content.slice(0, MAX_PREVIEW_LENGTH).trim() + "... " 
                : post.content + " "
            }
        </p>
        {shouldTruncate && (
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
                {isExpanded ? "ver menos" : "ver mais"}
            </button>
        )}
      </div>

      {post.imageUrl && (
        <div className="mb-3 rounded-xl overflow-hidden">
          <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover" />
        </div>
      )}

      {post.videoUrl && (
        <div className="mb-3 rounded-xl overflow-hidden bg-black flex items-center justify-center h-48 relative">
           <Video className="w-12 h-12 text-white opacity-80" />
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-4">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span>{post.likes + (liked ? 1 : 0)}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments}</span>
          </button>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Full Screen Viewer for Explore items
const FullScreenPostViewer: React.FC<{ item: any; onClose: () => void }> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black flex flex-col animate-in fade-in zoom-in-95 duration-200">
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-between items-center px-4">
        <button onClick={onClose} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-white font-bold text-sm drop-shadow-md">Explorar</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-black relative">
        {item.type === 'video' ? (
          <video 
            src={item.url} 
            className="max-h-full max-w-full w-full object-contain" 
            autoPlay 
            loop 
            controls={false}
            playsInline
          />
        ) : (
          <img src={item.url} className="max-h-full max-w-full w-full object-contain" alt="Post" />
        )}
      </div>

      <div className="bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-8 px-5 absolute bottom-0 left-0 right-0 z-20">
        <div className="flex items-center gap-3 mb-3">
          <img src={item.userAvatar} alt={item.userName} className="w-10 h-10 rounded-full border border-white/20 bg-gray-800 object-cover" />
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-1">
              {item.userName}
              {item.isMerchant && <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-white" />}
            </h4>
            <p className="text-white/70 text-xs">Freguesia • Seguir</p>
          </div>
        </div>
        <p className="text-white text-sm leading-relaxed line-clamp-2 mb-4">
          {item.caption}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-6">
            <button className="flex flex-col items-center gap-1 text-white">
              <Heart className="w-7 h-7" />
              <span className="text-xs font-bold">{item.likes}</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-white">
              <MessageCircle className="w-7 h-7" />
              <span className="text-xs font-bold">{item.comments}</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-white">
              <Share2 className="w-7 h-7" />
              <span className="text-xs font-bold">Enviar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommunityExploreScreen: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  // Generate dense mock data for grid
  const exploreItems = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    type: i % 5 === 0 ? 'video' : 'image',
    url: i % 5 === 0 
      ? 'https://videos.pexels.com/video-files/4434246/4434246-sd_540_960_25fps.mp4' 
      : `https://picsum.photos/400/400?random=${i + 100}`,
    userName: i % 3 === 0 ? 'Burger Freguesia' : `Usuario ${i}`,
    userAvatar: `https://i.pravatar.cc/100?u=${i}`,
    isMerchant: i % 3 === 0,
    caption: 'Explorando o melhor da Freguesia! 🌳 #local #gastronomia',
    likes: 120 + i * 5,
    comments: 12 + i
  }));

  const getGridClass = (index: number) => {
    // Pattern: 3 columns. Every 12 items, index 2 spans 2x2.
    // 0 1 2(BIG)
    // 3 4 
    // 5 6 7
    // This creates a mosaic feel using grid-auto-flow: dense
    if (index % 12 === 2) return "col-span-2 row-span-2";
    return "col-span-1 row-span-1";
  };

  return (
    <div className="pb-20 bg-white dark:bg-gray-950 min-h-screen">
      <div className="px-4 pt-2 mb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar pessoas, lojas e posts..." 
            className="w-full bg-gray-100 dark:bg-gray-900 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-[#1E5BFF] dark:text-white border border-transparent focus:border-[#1E5BFF]"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0.5 auto-rows-[120px] sm:auto-rows-[150px] grid-flow-dense">
         {exploreItems.map((item, index) => (
           <div 
             key={item.id} 
             className={`relative bg-gray-200 dark:bg-gray-800 overflow-hidden cursor-pointer group ${getGridClass(index)}`}
             onClick={() => setSelectedPost(item)}
           >
             {item.type === 'video' ? (
                <>
                  <video src={item.url} className="w-full h-full object-cover" muted loop playsInline />
                  <div className="absolute top-2 right-2">
                    <Play className="w-5 h-5 text-white drop-shadow-md fill-white/50" />
                  </div>
                </>
             ) : (
                <img src={item.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
             )}
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
           </div>
         ))}
      </div>

      {selectedPost && (
        <FullScreenPostViewer item={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
};

const UserProfileScreen: React.FC<{ user: any }> = ({ user }) => {
  if (!user) return null;

  const isOwnProfile = true; // Assuming own profile for now in this view
  const postsCount = 0;
  const followersCount = 120;
  const followingCount = 45;
  const bio = "Apaixonado pela Freguesia! 🌳\nComendo bem e vivendo melhor.";

  return (
    <div className="w-full bg-white dark:bg-gray-900 min-h-screen pb-24">
       {/* Header Row */}
       <div className="flex items-center px-4 pt-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600 mr-6 shrink-0">
             <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 overflow-hidden">
                <img 
                    src={user.user_metadata?.avatar_url || "https://i.pravatar.cc/150"} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                />
             </div>
          </div>

          {/* Stats */}
          <div className="flex-1 flex justify-around items-center text-center">
             <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900 dark:text-white">{postsCount}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Posts</span>
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900 dark:text-white">{followersCount}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Seguidores</span>
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900 dark:text-white">{followingCount}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Seguindo</span>
             </div>
          </div>
       </div>

       {/* Bio Section */}
       <div className="px-4 py-3">
          <h1 className="font-bold text-sm text-gray-900 dark:text-white">{user.user_metadata?.full_name || 'Usuário'}</h1>
          <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line mt-1">{bio}</p>
       </div>

       {/* Buttons */}
       <div className="px-4 flex gap-2 mb-6">
          {isOwnProfile ? (
            <>
              <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold py-1.5 rounded-lg border border-transparent active:scale-95 transition-transform">
                Editar perfil
              </button>
              <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold py-1.5 rounded-lg border border-transparent active:scale-95 transition-transform">
                Compartilhar perfil
              </button>
            </>
          ) : (
             <>
              <button className="flex-1 bg-[#1E5BFF] text-white text-sm font-semibold py-1.5 rounded-lg active:scale-95 transition-transform">
                Seguir
              </button>
              <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold py-1.5 rounded-lg active:scale-95 transition-transform">
                Mensagem
              </button>
             </>
          )}
       </div>

       {/* Content Grid */}
       <div className="border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-around border-b border-gray-100 dark:border-gray-800">
             <button className="py-3 border-b-px border-black dark:border-white w-full flex justify-center text-black dark:text-white">
                <Grid className="w-5 h-5" />
             </button>
          </div>

          <div className="grid grid-cols-3 gap-0.5">
             {postsCount === 0 ? (
                <div className="col-span-3 py-20 flex flex-col items-center justify-center text-center px-6">
                   <div className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center mb-4">
                      <Camera className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                   </div>
                   <h3 className="font-bold text-lg text-gray-900 dark:text-white">Você ainda não publicou nada.</h3>
                </div>
             ) : (
                // Map posts here
                null
             )}
          </div>
       </div>
    </div>
  );
};

const ChatScreen: React.FC<{ 
  chatId: number; 
  onBack: () => void; 
  user: any;
}> = ({ chatId, onBack, user }) => {
  const [messages, setMessages] = useState(MOCK_MESSAGES_HISTORY[chatId] || []);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = {
        id: Date.now(),
        text: input,
        sender: 'me' as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setInput('');
    
    // Simulate reply
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: "Obrigado pela mensagem! Responderemos em breve.",
            sender: 'them',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    }, 1000);
  };

  const chatInfo = MOCK_CHATS.find(c => c.id === chatId);

  return (
    <div className="fixed inset-0 z-[200] bg-gray-50 dark:bg-gray-900 flex flex-col w-full h-full animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 shadow-sm">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                <img src={chatInfo?.avatar} alt={chatInfo?.user} className="w-full h-full object-cover" />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                    {chatInfo?.user}
                    {chatInfo?.isMerchant && <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-blue-50 dark:fill-transparent" />}
                </h3>
                <span className="text-xs text-green-500 font-medium">Online</span>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                        msg.sender === 'me' 
                        ? 'bg-[#1E5BFF] text-white rounded-br-none' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
                    }`}>
                        <p>{msg.text}</p>
                        <span className={`text-[10px] block text-right mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {msg.time}
                        </span>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-8 sm:pb-4">
            <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-3"
            >
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escreva uma mensagem..."
                    className="flex-1 bg-gray-100 dark:bg-gray-700/50 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 dark:text-white"
                />
                <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="p-3 bg-[#1E5BFF] rounded-full text-white shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none hover:bg-blue-600 transition-all active:scale-95"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    </div>
  );
};

// 1. Stories Rail
const StoriesRail: React.FC<{ 
  user: any; 
  onRequireLogin: () => void;
  onOpenStory: (index: number) => void;
}> = ({ user, onRequireLogin, onOpenStory }) => {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pt-2 pb-4 border-b border-gray-100 dark:border-gray-800">
      {/* My Story Button */}
      <button 
        onClick={() => user ? alert("Em breve: Postar Story") : onRequireLogin()}
        className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer group"
      >
        <div className="relative w-[68px] h-[68px]">
          <div className="w-full h-full rounded-full p-[2px] bg-transparent border-2 border-gray-200 dark:border-gray-700">
             <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Me" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <UserIcon className="w-8 h-8" />
                  </div>
                )}
             </div>
          </div>
          <div className="absolute bottom-0 right-0 bg-[#1E5BFF] rounded-full p-1 border-2 border-white dark:border-gray-900">
            <Plus className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate max-w-[70px]">Seu story</span>
      </button>

      {/* Stories List */}
      {MOCK_STORIES.map((story, index) => (
        <button 
          key={story.id} 
          onClick={() => onOpenStory(index)}
          className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer group"
        >
          <div className={`w-[68px] h-[68px] rounded-full p-[2px] ${story.hasUnread ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
            <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-950 overflow-hidden relative">
              <img src={story.avatar} alt={story.user} className="w-full h-full object-cover group-active:scale-95 transition-transform" />
            </div>
          </div>
          <div className="flex items-center gap-1 max-w-[74px]">
            <span className={`text-xs ${story.hasUnread ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'} truncate`}>
              {story.user}
            </span>
            {story.isMerchant && <BadgeCheck className="w-3 h-3 text-[#1E5BFF] fill-white dark:fill-gray-900 shrink-0" />}
          </div>
        </button>
      ))}
    </div>
  );
};

// 2. Full Screen Story Viewer
const StoryViewer: React.FC<{
  initialStoryIndex: number;
  onClose: () => void;
}> = ({ initialStoryIndex, onClose }) => {
  const [currentStoryIdx, setCurrentStoryIdx] = useState(initialStoryIndex);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentStory = MOCK_STORIES[currentStoryIdx];
  const currentItem = currentStory.items[currentItemIdx];

  // Auto-advance logic
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // Update every 50ms
    const step = 100 / (currentItem.duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentItemIdx, currentStoryIdx, isPaused]);

  const handleNext = () => {
    if (currentItemIdx < currentStory.items.length - 1) {
      // Next item in same story
      setCurrentItemIdx(prev => prev + 1);
      setProgress(0);
    } else {
      // Next story
      if (currentStoryIdx < MOCK_STORIES.length - 1) {
        setCurrentStoryIdx(prev => prev + 1);
        setCurrentItemIdx(0);
        setProgress(0);
      } else {
        // End of all stories
        onClose();
      }
    }
  };

  const handlePrev = () => {
    if (currentItemIdx > 0) {
      setCurrentItemIdx(prev => prev - 1);
      setProgress(0);
    } else {
      if (currentStoryIdx > 0) {
        setCurrentStoryIdx(prev => prev - 1);
        setCurrentItemIdx(MOCK_STORIES[currentStoryIdx - 1].items.length - 1); // Last item of prev story
        setProgress(0);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col animate-in fade-in duration-200">
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 pt-3">
        {currentStory.items.map((item, idx) => (
          <div key={item.id} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{ 
                width: idx === currentItemIdx ? `${progress}%` : idx < currentItemIdx ? '100%' : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-5 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={currentStory.avatar} alt="" className="w-9 h-9 rounded-full border border-white/20" />
          <div className="flex flex-col">
             <div className="flex items-center gap-1">
                <span className="font-bold text-sm shadow-sm">{currentStory.user}</span>
                {currentStory.isMerchant && <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-white" />}
             </div>
             <span className="text-[10px] opacity-80">2h</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={onClose} className="p-1">
             <X className="w-6 h-6 drop-shadow-md" />
           </button>
        </div>
      </div>

      {/* Content */}
      <div 
        className="flex-1 relative flex items-center justify-center bg-gray-900"
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
      >
        {currentItem.type === 'image' ? (
          <img src={currentItem.url} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
             <Video className="w-12 h-12 text-gray-500" />
             {/* Use HTML5 Video here in production with autoPlay muted playsInline */}
          </div>
        )}

        {/* Tap Areas */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={(e) => { e.stopPropagation(); handlePrev(); }}></div>
        <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={(e) => { e.stopPropagation(); handleNext(); }}></div>
      </div>

      {/* Footer / Reply */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/80 to-transparent pt-10">
         <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Enviar mensagem..." 
              className="flex-1 bg-transparent border border-white/40 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/70 focus:border-white outline-none backdrop-blur-sm"
            />
            <button className="p-2">
               <Heart className="w-7 h-7 text-white" />
            </button>
            <button className="p-2">
               <Send className="w-6 h-6 text-white rotate-[15deg]" />
            </button>
         </div>
      </div>
    </div>
  );
};

// 3. Internal Navigation Bar
const CommunityNavBar: React.FC<{ 
  currentView: string; 
  onChangeView: (view: 'home' | 'direct' | 'explore' | 'profile') => void;
  userAvatar?: string;
  hasUnreadMessages?: boolean;
}> = ({ currentView, onChangeView, userAvatar, hasUnreadMessages }) => (
  <div className="sticky top-[70px] z-20 flex justify-center mb-0 px-3 pointer-events-none w-full">
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-sm border border-gray-100 dark:border-gray-700 w-full flex items-center justify-between px-8 py-2.5 pointer-events-auto transition-all">
      <button 
        onClick={() => onChangeView('home')}
        className={`transition-colors ${currentView === 'home' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Home className={`w-6 h-6 ${currentView === 'home' ? 'fill-black dark:fill-white' : ''}`} strokeWidth={2} />
      </button>

      <button 
        onClick={() => onChangeView('direct')}
        className={`transition-colors relative ${currentView === 'direct' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Send className={`w-6 h-6 ${currentView === 'direct' ? 'fill-black dark:fill-white' : ''}`} strokeWidth={2} transform="rotate(-15)" />
        {hasUnreadMessages && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        )}
      </button>

      <button 
        onClick={() => onChangeView('explore')}
        className={`transition-colors ${currentView === 'explore' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Search className="w-6 h-6" strokeWidth={currentView === 'explore' ? 3 : 2} />
      </button>

      <button 
        onClick={() => onChangeView('profile')}
        className={`transition-all rounded-full overflow-hidden border-2 ${currentView === 'profile' ? 'border-black dark:border-white' : 'border-transparent'}`}
      >
        {userAvatar ? (
          <img src={userAvatar} alt="Profile" className="w-6 h-6 object-cover" />
        ) : (
          <UserIcon className={`w-6 h-6 ${currentView === 'profile' ? 'text-black dark:text-white fill-black dark:fill-white' : 'text-gray-400'}`} />
        )}
      </button>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ onStoreClick, user, onRequireLogin }) => {
  const [internalView, setInternalView] = useState<'home' | 'direct' | 'explore' | 'profile'>('home');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleViewChange = (view: 'home' | 'direct' | 'explore' | 'profile') => {
    if ((view === 'direct' || view === 'profile') && !user) {
      onRequireLogin();
      return;
    }
    setInternalView(view);
    
    // Reset specific states when leaving views
    if (view !== 'direct') setSelectedChatId(null);
  };

  const handleOpenCreatePost = () => {
    if (!user) {
      onRequireLogin();
      return;
    }
    setIsCreatePostOpen(true);
  };

  const getHeaderTitle = () => {
    if (internalView === 'explore') return "Explorar a Freguesia";
    return "Feed da Freguesia";
  };

  const renderContent = () => {
    switch (internalView) {
      case 'home':
        return (
          <div className="pb-20">
            {/* Added visual spacing between nav bar and stories */}
            <div className="pt-6">
              <StoriesRail 
                user={user} 
                onRequireLogin={onRequireLogin} 
                onOpenStory={(idx) => setViewingStoryIndex(idx)}
              />
            </div>

            {/* Posts Feed */}
            <div className="p-5 pt-4">
              {/* Removed inline CreatePostWidget here as requested */}

              {/* Posts */}
              <div className="space-y-4">
                {MOCK_COMMUNITY_POSTS.map(post => (
                  <FeedPost key={post.id} post={post} onLike={() => !user && onRequireLogin()} />
                ))}
              </div>
            </div>

            {/* Floating Action Button for Creating Post */}
            <button
              onClick={handleOpenCreatePost}
              className="fixed bottom-24 right-5 z-40 bg-[#1E5BFF] text-white p-4 rounded-full shadow-lg shadow-blue-500/40 hover:bg-blue-600 transition-transform active:scale-95 flex items-center justify-center"
            >
              <Plus className="w-7 h-7" />
            </button>

            {/* Create Post Modal */}
            <CreatePostModal 
              isOpen={isCreatePostOpen} 
              onClose={() => setIsCreatePostOpen(false)} 
              user={user} 
            />
          </div>
        );

      case 'explore':
        return <CommunityExploreScreen />;

      case 'profile':
        return <UserProfileScreen user={user} />;

      case 'direct':
        if (!user) {
          return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Faça login para ver suas mensagens</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Conecte-se para conversar com lojistas e vizinhos.
                </p>
                <button 
                  onClick={onRequireLogin}
                  className="bg-[#1E5BFF] text-white font-bold py-3 px-8 rounded-full shadow-lg active:scale-95 transition-transform"
                >
                  Entrar na conta
                </button>
            </div>
          );
        }

        if (selectedChatId) {
          return (
            <ChatScreen 
              chatId={selectedChatId} 
              onBack={() => setSelectedChatId(null)} 
              user={user}
            />
          );
        }

        return (
          <div className="w-full min-h-screen bg-white dark:bg-gray-900 flex flex-col animate-in fade-in slide-in-from-right duration-300 pb-24">
            <div className="px-5 pt-4 pb-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Buscar conversa..."
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1E5BFF] dark:text-white transition-all"
                />
              </div>
            </div>

            <div className="px-5 py-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Mensagens</h3>
            </div>
            
            <div className="w-full">
              {MOCK_CHATS.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedChatId(chat.id)}
                  className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors active:bg-gray-100 dark:active:bg-gray-800 border-b border-gray-50 dark:border-gray-800/50 last:border-0 w-full"
                >
                  <div className="relative flex-shrink-0">
                    <img src={chat.avatar} alt={chat.user} className="w-12 h-12 rounded-full object-cover bg-gray-200 border border-gray-100 dark:border-gray-700" />
                    {chat.unread && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className={`text-sm truncate pr-2 flex items-center gap-1 ${chat.unread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                        {chat.user}
                        {chat.isMerchant && <BadgeCheck className="w-3 h-3 text-[#1E5BFF] fill-blue-50 dark:fill-transparent" />}
                      </h4>
                      <span className={`text-[10px] whitespace-nowrap ${chat.unread ? 'font-bold text-[#1E5BFF]' : 'text-gray-400'}`}>{chat.time}</span>
                    </div>
                    <p className={`text-xs truncate ${chat.unread ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {chat.lastMsg}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-24 animate-in slide-in-from-right duration-300 relative">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <h1 className="font-bold text-lg text-gray-900 dark:text-white font-display">{getHeaderTitle()}</h1>
        {/* The old toggle is removed, replaced by the NavBar below */}
        <div className="w-8"></div> {/* Spacer for visual balance if needed */}
      </div>

      {/* Internal Navigation Bar */}
      <CommunityNavBar 
        currentView={internalView} 
        onChangeView={handleViewChange} 
        userAvatar={user?.user_metadata?.avatar_url}
        hasUnreadMessages={true} // Mock state
      />

      <div className="p-0 relative w-full">
        {renderContent()}
      </div>

      {/* Story Viewer Overlay */}
      {viewingStoryIndex !== null && (
        <StoryViewer 
          initialStoryIndex={viewingStoryIndex} 
          onClose={() => setViewingStoryIndex(null)} 
        />
      )}
    </div>
  );
};

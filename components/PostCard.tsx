import React, { useState, useRef, useEffect } from 'react';
import { CommunityPost, Store, ReportReason } from '../types';
import { User } from '@supabase/supabase-js';
import { STORES } from '../constants';
import { 
    Bookmark, 
    Heart, 
    MessageSquare, 
    MoreHorizontal, 
    Share2, 
    Flag, 
    CheckCircle2,
    Volume2,
    VolumeX,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    AlertCircle
} from 'lucide-react';
import { ReportModal } from './ReportModal';

interface PostCardProps {
  post: CommunityPost;
  onStoreClick: (store: Store) => void;
  user: User | null;
  onRequireLogin: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

// Imagens genéricas para posts sem mídia (Bairro, cotidiano, casas, serviços, pessoas, comércio local)
const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800', // Casa/Bairro
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800', // Rua/Comércio
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800', // Pessoas/Comunidade
  'https://images.unsplash.com/photo-1534723452202-428aae1ad99d?q=80&w=800', // Mercado/Loja
  'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800', // Serviço/Trabalho
  'https://images.unsplash.com/photo-1551632432-c735e8399527?q=80&w=800', // Parque/Verde
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800', // Moda/Cotidiano
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800', // Escritório/Pro
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800', // Interior/Casa
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800', // Prédio
];

const getPlaceholder = (id: string) => {
    // Seleção determinística baseada no ID para evitar que a imagem mude ao rolar
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return PLACEHOLDERS[Math.abs(hash) % PLACEHOLDERS.length];
};

export const PostCard: React.FC<PostCardProps> = ({ post, onStoreClick, user, onRequireLogin, isSaved, onToggleSave }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  
  // Media states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasMultipleImages = post.imageUrls && post.imageUrls.length > 1;

  const handleLike = () => {
    if (!user) { onRequireLogin(); return; }
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleSaveClick = () => {
    if (!user) { onRequireLogin(); return; }
    onToggleSave();
  };

  const handleVisitStore = (userName: string) => {
    const store = STORES.find(s => s.name === userName);
    if (store) onStoreClick(store);
  };

  const handleReportSubmit = (reason: ReportReason) => {
    console.log(`Reporting post ${post.id} for reason: ${reason}`);
    setIsReportModalOpen(false);
    setShowReportSuccess(true);
    setTimeout(() => setShowReportSuccess(false), 3000);
  };

  const handleAction = (action: () => void) => {
    if (!user) onRequireLogin(); else action();
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.imageUrls) {
      setCurrentImageIndex(prev => (prev + 1) % post.imageUrls!.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.imageUrls) {
      setCurrentImageIndex(prev => (prev - 1 + post.imageUrls!.length) % post.imageUrls!.length);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (videoRef.current) {
          videoRef.current.muted = !videoRef.current.muted;
          setIsMuted(videoRef.current.muted);
      }
  }

  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setIsTruncated(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [post.content]);

  return (
    <article className="bg-white dark:bg-gray-900 sm:border border-gray-100 dark:border-gray-800 sm:rounded-2xl shadow-sm overflow-hidden">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-blue-500 p-0.5">
            <img src={post.userAvatar} alt={post.userName} className="w-full h-full rounded-full object-cover" />
          </div>
          <button onClick={() => handleVisitStore(post.userName)} className="font-bold text-sm text-gray-900 dark:text-white hover:underline">{post.userName}</button>
        </div>
        <button onClick={() => setIsOptionsOpen(true)} className="p-2 text-gray-400"><MoreHorizontal size={20} /></button>
      </div>

      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 group">
          {post.videoUrl ? (
            <>
              <video 
                ref={videoRef}
                src={post.videoUrl}
                className="w-full h-full object-cover" 
                loop 
                playsInline 
                autoPlay
                muted={isMuted}
              />
              <button onClick={toggleMute} className="absolute bottom-3 right-3 bg-black/50 text-white rounded-full p-2 backdrop-blur-sm">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </>
          ) : post.imageUrls && post.imageUrls.length > 0 ? (
            <>
              <img 
                src={post.imageUrls[currentImageIndex]} 
                alt="Conteúdo do post" 
                className="w-full h-full object-cover" 
              />
              {hasMultipleImages && (
                <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeftIcon size={20}/></button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRightIcon size={20}/></button>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {post.imageUrls.map((_, index) => (
                      <div key={index} className={`h-1.5 rounded-full transition-all ${index === currentImageIndex ? 'w-3 bg-white' : 'w-1.5 bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <img 
              src={post.imageUrl || getPlaceholder(post.id)} 
              alt="Conteúdo do post" 
              className="w-full h-full object-cover" 
            />
          )}
      </div>

      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${liked ? 'text-rose-500' : 'text-gray-500 dark:text-gray-400 hover:text-rose-500'}`}>
            <Heart size={24} className={liked ? 'fill-current' : ''} />
          </button>
          <button onClick={() => handleAction(() => alert('Comentários em breve!'))} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500">
            <MessageSquare size={24} />
          </button>
          <button onClick={() => handleAction(() => alert('Compartilhamento em breve!'))} className="text-gray-500 dark:text-gray-400 hover:text-blue-500">
            <Share2 size={24} />
          </button>
        </div>
        <button onClick={handleSaveClick} className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition-colors">
          <Bookmark size={24} className={isSaved ? 'fill-yellow-400 text-yellow-400' : ''} />
        </button>
      </div>
      
      <div className="px-4 pb-4">
        {likesCount > 0 && <p className="text-sm font-bold mb-2">{likesCount} curtidas</p>}
        
        <p ref={contentRef} className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${!isTextExpanded && 'line-clamp-2'}`}>
          <span className="font-bold text-gray-900 dark:text-white mr-1.5">{post.userName}</span>
          {post.content}
        </p>

        {isTruncated && !isTextExpanded && (
          <button onClick={() => setIsTextExpanded(true)} className="text-sm text-gray-400 font-medium">
            ... mais
          </button>
        )}
        
        <p className="text-xs text-gray-400 mt-2 uppercase font-semibold tracking-wide">{post.timestamp} • {post.neighborhood}</p>
      </div>

      {isOptionsOpen && (
        <div className="fixed inset-0 z-[1001] bg-black/40 flex items-end" onClick={() => setIsOptionsOpen(false)}>
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl p-4 animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <button 
              onClick={() => handleAction(() => { setIsOptionsOpen(false); setIsReportModalOpen(true); })}
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

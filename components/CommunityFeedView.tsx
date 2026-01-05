import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  MessageSquare, 
  Heart, 
  Store as StoreIcon, 
  Send, 
  Image as ImageIcon,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  MoreHorizontal,
  Megaphone,
  Plus,
  Search,
  X,
  CheckCircle2,
  Loader2,
  Video,
  Volume2,
  VolumeX,
  Clock,
  Eye,
  BadgeCheck,
  ShoppingBag,
  User,
  MessageCircle,
  Copy,
  Trash2
} from 'lucide-react';
import { CommunityPost, Store } from '../types';
import { MOCK_COMMUNITY_POSTS, STORES } from '../constants';
import { User as SupabaseUser } from '@supabase/supabase-js';

// --- TYPES FOR STORIES ---
interface StoryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration: number; // in seconds
  timestamp: number; // Date.now()
  viewed: boolean;
}

interface UserStory {
  userId: string;
  userName: string;
  userAvatar: string;
  isMerchant: boolean;
  items: StoryItem[];
}

// --- MOCK STORIES ---
const MOCK_STORIES: UserStory[] = [
  {
    userId: 's1',
    userName: 'Burger Freguesia',
    userAvatar: '/assets/default-logo.png',
    isMerchant: true,
    items: [
      { id: 'st1', type: 'image', url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=400', duration: 5, timestamp: Date.now() - 3600000, viewed: false },
      { id: 'st2', type: 'video', url: 'https://videos.pexels.com/video-files/852395/852395-sd_540_960_30fps.mp4', duration: 15, timestamp: Date.now() - 1800000, viewed: false }
    ]
  },
  {
    userId: 'u1',
    userName: 'Ana Paula',
    userAvatar: 'https://i.pravatar.cc/100?u=a',
    isMerchant: false,
    items: [
      { id: 'st3', type: 'image', url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400', duration: 5, timestamp: Date.now() - 7200000, viewed: false }
    ]
  }
];

interface CommunityFeedViewProps {
  onBack?: () => void;
  onStoreClick: (store: Store) => void;
  user: SupabaseUser | null;
  onRequireLogin: () => void;
}

// --- COMPONENT: FEED VIDEO PLAYER ---
const FeedVideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full aspect-[4/5] bg-black cursor-pointer group" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
             <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
          </div>
        </div>
      )}
      <button 
        onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
        className="absolute bottom-3 right-3 p-2 bg-black/50 rounded-full text-white/80 hover:text-white backdrop-blur-sm"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

// --- COMPONENT: IMAGE CAROUSEL ---
const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const newIndex = Math.round(scrollLeft / clientWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-gray-800">
      <div 
        ref={scrollRef}
        className="w-full h-full overflow-x-auto flex snap-x snap-mandatory no-scrollbar"
        onScroll={handleScroll}
      >
        {images.map((img, idx) => (
          <img 
            key={idx}
            src={img} 
            alt={`Slide ${idx + 1}`} 
            className="w-full h-full object-cover snap-center flex-shrink-0" 
          />
        ))}
      </div>
      
      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-white scale-110' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Index Badge */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: CREATE POST MODAL ---
const CreatePostModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: any) => void;
  userRole: 'cliente' | 'lojista';
}> = ({ onClose, onSubmit, userRole }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState('recommendation');
  const [selectedStoreId, setSelectedStoreId] = useState('');
  
  // Media State
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isMerchant = userRole === 'lojista';

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (mediaType === 'image' && mediaPreviews.length > 0) {
        alert("Não é possível misturar vídeo com imagens.");
        return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = function() {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > 30) {
        alert("O vídeo deve ter no máximo 30 segundos.");
        return;
      }
      setMediaFiles([file]);
      setMediaPreviews([URL.createObjectURL(file)]);
      setMediaType('video');
    }
    video.src = URL.createObjectURL(file);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mediaType === 'video') {
        alert("Não é possível misturar vídeo com imagens.");
        return;
    }

    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const remainingSlots = 4 - mediaPreviews.length;
    if (files.length > remainingSlots) {
        alert(`Você pode adicionar no máximo 4 fotos. Restam ${remainingSlots} vaga(s).`);
        // Slice to fit
        const allowedFiles = files.slice(0, remainingSlots);
        const newPreviews = allowedFiles.map(f => URL.createObjectURL(f));
        setMediaFiles(prev => [...prev, ...allowedFiles]);
        setMediaPreviews(prev => [...prev, ...newPreviews]);
    } else {
        const newPreviews = files.map(f => URL.createObjectURL(f));
        setMediaFiles(prev => [...prev, ...files]);
        setMediaPreviews(prev => [...prev, ...newPreviews]);
    }
    
    setMediaType('image');
    
    // Reset input to allow selecting same file again if deleted
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const removeMedia = (index: number) => {
    const newFiles = [...mediaFiles];
    const newPreviews = [...mediaPreviews];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setMediaFiles(newFiles);
    setMediaPreviews(newPreviews);
    
    if (newFiles.length === 0) {
        setMediaType(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaPreviews.length === 0) return; // Mandatório
    
    const store = STORES.find(s => s.id === selectedStoreId);

    const postData = {
      content,
      type: isMerchant && !['news', 'promo', 'tip'].includes(type) ? 'news' : type,
      relatedStoreId: selectedStoreId,
      relatedStoreName: data => store?.name,
      authorRole: isMerchant ? 'merchant' : 'resident',
      // If it's a video, pass single URL. If images, pass array.
      videoUrl: mediaType === 'video' ? mediaPreviews[0] : undefined,
      imageUrls: mediaType === 'image' ? mediaPreviews : undefined,
      imageUrl: mediaType === 'image' ? mediaPreviews[0] : undefined // Legacy fallback
    };

    onSubmit(postData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {isMerchant ? 'Publicar como Loja' : 'Criar Postagem'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Cancelar</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Media Preview Area */}
          {mediaPreviews.length > 0 ? (
            <div className="w-full">
                {mediaType === 'video' ? (
                    <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-gray-200 dark:border-gray-700 shadow-md">
                        <button 
                            type="button" 
                            onClick={() => removeMedia(0)}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <video src={mediaPreviews[0]} className="w-full h-48 object-cover" controls />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {mediaPreviews.map((preview, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <img src={preview} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                <button 
                                    type="button" 
                                    onClick={() => removeMedia(idx)}
                                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {/* Add More Button if < 4 */}
                        {mediaPreviews.length < 4 && (
                            <button 
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:text-[#1E5BFF] hover:border-[#1E5BFF] transition-colors gap-1"
                            >
                                <Plus className="w-6 h-6" />
                                <span className="text-[10px] font-bold">Adicionar</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
          ) : (
            <div className="w-full h-48 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center gap-3">
               <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">Mídia Obrigatória</p>
               <div className="flex gap-4">
                  <button 
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="flex flex-col items-center gap-2 p-3 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-colors group"
                  >
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-[#1E5BFF] group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-gray-500">Fotos (Até 4)</span>
                  </button>
                  
                  <div className="w-[1px] h-16 bg-gray-200 dark:bg-gray-700 self-center"></div>

                  <button 
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="flex flex-col items-center gap-2 p-3 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-colors group"
                  >
                      <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                          <Video className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-gray-500">Vídeo (30s)</span>
                  </button>
               </div>
            </div>
          )}

          <input 
              type="file" 
              accept="image/*" 
              multiple
              className="hidden" 
              ref={imageInputRef} 
              onChange={handleImageSelect}
          />
          <input 
              type="file" 
              accept="video/*" 
              className="hidden" 
              ref={videoInputRef} 
              onChange={handleVideoSelect}
          />

          <div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva uma legenda..."
              className="w-full h-24 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl resize-none outline-none focus:ring-2 focus:ring-[#1E5BFF] dark:text-white text-sm"
            />
          </div>

          {!isMerchant && (
            <div>
                <select 
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white outline-none"
                >
                <option value="">Vincular Loja (Opcional)</option>
                {STORES.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                ))}
                </select>
            </div>
          )}

          <button 
            type="submit"
            disabled={mediaPreviews.length === 0}
            className="w-full bg-[#1E5BFF] text-white px-6 py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Publicar
          </button>
          
          {mediaPreviews.length === 0 && (
             <div className="flex items-center justify-center gap-2 text-amber-500 text-xs font-bold bg-amber-50 dark:bg-amber-900/10 py-2 rounded-lg">
                <AlertTriangle className="w-3 h-3" />
                Adicione mídia para publicar
             </div>
          )}
        </form>
      </div>
    </div>
  );
};

// --- COMPONENT: SHARE POST MODAL ---
const SharePostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300" onClick={onClose}>
        <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-center mb-8 dark:text-white text-lg">Compartilhar com</h3>
            <div className="grid grid-cols-4 gap-4 mb-8">
                <button className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20 group-active:scale-95 transition-transform"><MessageCircle size={28} /></div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">WhatsApp</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-active:scale-95 transition-transform"><Send size={28} /></div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Telegram</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20 group-active:scale-95 transition-transform"><ImageIcon size={28} /></div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Instagram</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-600 dark:text-white shadow-sm group-active:scale-95 transition-transform"><MoreHorizontal size={28} /></div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Outros</span>
                </button>
            </div>
            <button onClick={onClose} className="w-full py-4 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-gray-600 dark:text-gray-300">Cancelar</button>
        </div>
    </div>
  );
};

// --- COMPONENT: STORY VIEWER (FULLSCREEN) ---
const StoryViewer: React.FC<{
  stories: UserStory[];
  initialStoryIndex: number;
  onClose: () => void;
  onMarkAsViewed: (userId: string, itemId: string) => void;
}> = ({ stories, initialStoryIndex, onClose, onMarkAsViewed }) => {
  const [currentStoryIdx, setCurrentStoryIdx] = useState(initialStoryIndex);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const currentStory = stories[currentStoryIdx];
  const currentItem = currentStory.items[currentItemIdx];
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setProgress(0);
    const duration = currentItem.duration * 1000;
    const intervalTime = 50; // Update every 50ms
    const step = 100 / (duration / intervalTime);

    // Mark as viewed immediately when opening
    onMarkAsViewed(currentStory.userId, currentItem.id);

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + step;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentItem, currentStoryIdx, isPaused]);

  const handleNext = () => {
    if (currentItemIdx < currentStory.items.length - 1) {
      setCurrentItemIdx(prev => prev + 1);
      setProgress(0);
    } else if (currentStoryIdx < stories.length - 1) {
      setCurrentStoryIdx(prev => prev + 1);
      setCurrentItemIdx(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentItemIdx > 0) {
      setCurrentItemIdx(prev => prev - 1);
      setProgress(0);
    } else if (currentStoryIdx > 0) {
      setCurrentStoryIdx(prev => prev - 1);
      setCurrentItemIdx(stories[currentStoryIdx - 1].items.length - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in duration-200">
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 pt-4">
        {currentStory.items.map((item, idx) => (
          <div key={item.id} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{ 
                width: idx < currentItemIdx ? '100%' : idx === currentItemIdx ? `${progress}%` : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-0 right-0 z-20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={currentStory.userAvatar} alt="" className="w-8 h-8 rounded-full border border-white/50" />
          <div className="flex flex-col">
             <div className="flex items-center gap-1">
                <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{currentStory.userName}</span>
                {currentStory.isMerchant && <BadgeCheck className="w-3 h-3 text-blue-400 fill-white" />}
             </div>
             <span className="text-white/80 text-[10px] drop-shadow-md">
                {Math.floor((Date.now() - currentItem.timestamp) / 3600000)}h
             </span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-white/80 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div 
        className="flex-1 relative flex items-center justify-center bg-gray-900"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {currentItem.type === 'video' ? (
          <video 
            src={currentItem.url} 
            className="w-full h-full object-cover" 
            autoPlay 
            playsInline
            // muted // Muted by default for browser policy, user can unmute
            onEnded={handleNext}
          />
        ) : (
          <img src={currentItem.url} alt="Story" className="w-full h-full object-cover" />
        )}

        {/* Tap Areas */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={(e) => { e.stopPropagation(); handlePrev(); }}></div>
        <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={(e) => { e.stopPropagation(); handleNext(); }}></div>
      </div>

      {/* Footer Interactions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4 z-20">
        <div className="flex-1 relative">
            <input 
                type="text" 
                placeholder="Enviar mensagem..." 
                className="w-full bg-transparent border border-white/30 rounded-full py-2.5 px-4 text-white placeholder-white/70 text-sm focus:border-white outline-none"
            />
        </div>
        <button className="p-2 text-white/90 hover:text-red-500 active:scale-110 transition-transform">
            <Heart className="w-7 h-7" />
        </button>
        <button className="p-2 text-white/90 hover:text-blue-400 active:scale-110 transition-transform">
            <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

// --- MAIN FEED VIEW ---

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ onBack, onStoreClick, user, onRequireLogin }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [activeTab, setActiveTab] = useState<'residents' | 'merchants'>('residents');
  
  // Stories State
  const [stories, setStories] = useState<UserStory[]>(MOCK_STORIES);
  const [activeStoryViewer, setActiveStoryViewer] = useState<number | null>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const userRole = (user?.user_metadata?.role === 'lojista' ? 'lojista' : 'cliente') as 'cliente' | 'lojista';

  // --- STORIES LOGIC ---
  
  const handleAddStory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate type
    const isVideo = file.type.startsWith('video/');
    if (!file.type.startsWith('image/') && !isVideo) {
      alert("Apenas imagens ou vídeos são permitidos.");
      return;
    }

    // Create Object URL for immediate preview
    const url = URL.createObjectURL(file);
    const newStoryItem: StoryItem = {
      id: `new-${Date.now()}`,
      type: isVideo ? 'video' : 'image',
      url: url,
      duration: isVideo ? 15 : 5, // Default duration, in real app check video metadata
      timestamp: Date.now(),
      viewed: false
    };

    // Check if user already has a story bucket
    setStories(prev => {
      const myStoryIdx = prev.findIndex(s => s.userId === user.id);
      if (myStoryIdx >= 0) {
        const updated = [...prev];
        updated[myStoryIdx] = {
          ...updated[myStoryIdx],
          items: [...updated[myStoryIdx].items, newStoryItem]
        };
        // Move to front
        return [updated[myStoryIdx], ...updated.filter(s => s.userId !== user.id)];
      } else {
        // Create new bucket
        const newBucket: UserStory = {
          userId: user.id,
          userName: user.user_metadata?.full_name || 'Eu',
          userAvatar: user.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=Eu',
          isMerchant: userRole === 'lojista',
          items: [newStoryItem]
        };
        return [newBucket, ...prev];
      }
    });
  };

  const hasUnseenStories = (story: UserStory) => {
    return story.items.some(item => !item.viewed);
  };

  const handleMarkAsViewed = (userId: string, itemId: string) => {
    setStories(prev => prev.map(story => {
      if (story.userId === userId) {
        return {
          ...story,
          items: story.items.map(item => item.id === itemId ? { ...item, viewed: true } : item)
        };
      }
      return story;
    }));
  };

  // --- POSTS LOGIC ---

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
      userUsername: user.user_metadata?.username || (userRole === 'lojista' ? 'minhaloja' : 'novo_usuario'),
      userAvatar: user.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random',
      content: data.content,
      type: data.type,
      authorRole: data.authorRole,
      relatedStoreId: data.relatedStoreId,
      relatedStoreName: data.relatedStoreName,
      imageUrl: data.imageUrl, // Legacy support
      imageUrls: data.imageUrls, // New support
      videoUrl: data.videoUrl,
      timestamp: 'Agora',
      likes: 0,
      comments: 0
    };
    
    setPosts([newPost, ...posts]);
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

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const myStory = stories.find(s => s.userId === user?.id);
  const otherStories = stories.filter(s => s.userId !== user?.id);

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
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* --- STORIES RAIL --- */}
      <div className="pt-4 pb-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-2">
          
          {/* My Story Button */}
          <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
            <div className="relative">
              <button 
                onClick={() => handleAuthRequired(() => storyInputRef.current?.click())}
                className={`w-[68px] h-[68px] rounded-full p-[2px] ${myStory && hasUnseenStories(myStory) ? 'bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-500' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-900 overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Eu" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  {/* Add Icon Overlay if no story or just to act as add button */}
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center"></div>
                </div>
              </button>
              <div 
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 border-2 border-white dark:border-gray-900 pointer-events-none"
              >
                <Plus className="w-3 h-3" strokeWidth={3} />
              </div>
              <input 
                type="file" 
                accept="image/*,video/*" 
                className="hidden" 
                ref={storyInputRef} 
                onChange={handleAddStory} 
              />
            </div>
            <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium truncate w-full text-center">Seu Story</span>
          </div>

          {/* Other Stories */}
          {otherStories.map((story, index) => {
            const isUnseen = hasUnseenStories(story);
            // We need to adjust index because we filtered out 'myStory'
            // To find the original index in the 'stories' array for the viewer:
            const originalIndex = stories.findIndex(s => s.userId === story.userId);

            return (
              <button 
                key={story.userId}
                onClick={() => setActiveStoryViewer(originalIndex)}
                className="flex flex-col items-center gap-1.5 min-w-[70px] group"
              >
                <div className={`w-[68px] h-[68px] rounded-full p-[2px] ${isUnseen ? 'bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                  <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-900 overflow-hidden bg-white dark:bg-gray-800 relative">
                    <img src={story.userAvatar} alt={story.userName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium truncate max-w-[64px] text-center">{story.userName.split(' ')[0]}</span>
                    {story.isMerchant && <BadgeCheck className="w-3 h-3 text-[#1E5BFF] fill-transparent" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4 pb-2 bg-gray-50 dark:bg-gray-900">
        <div className="flex p-1 bg-gray-200 dark:bg-gray-800 rounded-xl relative">
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
      <div className="p-5 pb-24 space-y-6 flex-1 overflow-y-auto no-scrollbar">
        {displayedPosts.length === 0 ? (
            <div className="text-center py-10 opacity-50">
                <p className="text-sm">Nenhuma postagem nesta categoria ainda.</p>
            </div>
        ) : (
            displayedPosts.map(post => {
              const hasVideo = !!post.videoUrl;
              const hasImages = (post.imageUrls && post.imageUrls.length > 0) || !!post.imageUrl;
              
              // Normalize images to array for carousel
              const images = post.imageUrls || (post.imageUrl ? [post.imageUrl] : []);

              return (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-4">
                    
                    {/* Header Post */}
                    <div className="flex justify-between items-center p-4">
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
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                                        {post.userName}
                                    </h4>
                                    {post.authorRole === 'merchant' && (
                                        <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-blue-50 dark:fill-transparent" />
                                    )}
                                </div>
                                <span className="text-xs text-gray-400 font-medium block">
                                    @{post.userUsername || (post.authorRole === 'merchant' ? 'loja' : 'morador')}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">{post.timestamp}</span>
                            <button className="text-gray-300 hover:text-gray-500">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Media Content (Visual First) */}
                    <div className="w-full bg-black/5 dark:bg-black/20">
                        {hasVideo ? (
                            <FeedVideoPlayer src={post.videoUrl!} />
                        ) : images.length > 1 ? (
                            <ImageCarousel images={images} />
                        ) : images.length === 1 ? (
                            <img src={images[0]} alt="Post media" className="w-full h-auto object-cover max-h-[500px]" />
                        ) : (
                            // Fallback for legacy text-only posts (gradient)
                            <div className="w-full aspect-[4/3] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8 text-center">
                                <p className="text-white font-bold text-xl drop-shadow-md leading-relaxed line-clamp-6">{post.content}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-2">
                        <div className="flex gap-4">
                            <button 
                                onClick={() => handleAuthRequired(() => handleLike(post.id))}
                                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                            >
                                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                {post.likes}
                            </button>
                            <button 
                                onClick={() => handleAuthRequired(() => {})}
                                className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#1E5BFF] transition-colors"
                            >
                                <MessageSquare className="w-5 h-5" />
                                {post.comments}
                            </button>
                            <button 
                                onClick={() => handleAuthRequired(handleShareClick)}
                                className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#1E5BFF] transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {/* Store Link if available */}
                        {post.relatedStoreId && (
                            <button 
                                onClick={() => {
                                    const store = STORES.find(s => s.id === post.relatedStoreId);
                                    if (store) onStoreClick(store);
                                }}
                                className="flex items-center gap-1 text-[10px] font-bold text-[#1E5BFF] bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg"
                            >
                                <StoreIcon className="w-3 h-3" />
                                Visitar Loja
                            </button>
                        )}
                    </div>

                    {/* Caption (Only if there was media, otherwise text was shown in gradient block) */}
                    {(hasVideo || hasImages) && post.content && (
                        <div className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            <span className="font-bold mr-2 text-gray-900 dark:text-white">{post.userName}</span>
                            {post.content}
                        </div>
                    )}
                    
                    {/* Tags or Type */}
                    <div className="px-4 pb-4">
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500 tracking-wide bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                            {getTypeIcon(post.type)} {getTypeLabel(post.type)}
                        </span>
                    </div>

                </div>
              );
            })
        )}
      </div>

      {showCreateModal && (
        <CreatePostModal 
          onClose={() => setShowCreateModal(false)} 
          onSubmit={handleCreatePost}
          userRole={userRole}
        />
      )}

      {showShareModal && (
        <SharePostModal 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {activeStoryViewer !== null && (
        <StoryViewer 
          stories={stories}
          initialStoryIndex={activeStoryViewer}
          onClose={() => setActiveStoryViewer(null)}
          onMarkAsViewed={handleMarkAsViewed}
        />
      )}
    </div>
  );
};
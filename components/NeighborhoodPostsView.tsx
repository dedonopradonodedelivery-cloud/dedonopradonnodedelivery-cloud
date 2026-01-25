
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Clock, 
  MoreHorizontal, 
  Heart, 
  MessageSquare, 
  Share2, 
  Flag, 
  CheckCircle2, 
  ChevronLeft, 
  Search, 
  SlidersHorizontal, 
  X, 
  Plus,
  ArrowRight,
  Image as ImageIcon,
  MapPin,
  AtSign,
  Loader2,
  ChevronRight,
  MessageCircle,
  LayoutGrid,
  HeartHandshake,
  ShieldCheck,
  PlusCircle,
  Hash,
  AlertCircle,
  // FIX: Added Store as StoreIcon to fix usage as component and avoid name conflict
  Store as StoreIcon,
  ChevronDown
} from 'lucide-react';
// FIX: Added Store and ReportReason types
import { NeighborhoodCommunity, CommunityPost, Store, ReportReason } from '../types';
// FIX: Added STORES constant
import { OFFICIAL_COMMUNITIES, MOCK_USER_COMMUNITIES, MOCK_COMMUNITY_POSTS, STORES } from '../constants';
import { ReportModal } from './ReportModal';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { User } from '@supabase/supabase-js';

const MOCK_POSTS: CommunityPost[] = MOCK_COMMUNITY_POSTS;

const THEME_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'utilidade', label: 'Utilidade pública' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'lazer', label: 'Lazer & Eventos' },
  { id: 'dicas', label: 'Dicas do bairro' },
];

const SORT_OPTIONS = [
  { id: 'recent', label: 'Mais recentes' },
  { id: 'comments', label: 'Mais comentados' },
  { id: 'likes', label: 'Mais curtidos' },
];

const CreatePostView: React.FC<{
  user: User;
  onClose: () => void;
  onCreatePost: (post: CommunityPost) => void;
  // Adicionando a prop userRole para verificar se é lojista
  userRole: 'cliente' | 'lojista' | null;
}> = ({ user, onClose, onCreatePost, userRole }) => {
  const [step, setStep] = useState<'media' | 'finalize'>('media');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [showOnStoreProfile, setShowOnStoreProfile] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      mediaPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setMediaFiles(files);
      const previews = files.map(file => URL.createObjectURL(file as Blob));
      mediaPreviews.forEach(url => URL.revokeObjectURL(url));
      setMediaPreviews(previews);
    }
  };

  const removeMedia = (index: number) => {
    const newFiles = [...mediaFiles];
    const newPreviews = [...mediaPreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setMediaFiles(newFiles);
    setMediaPreviews(newPreviews);
    if (newFiles.length === 0 && step === 'finalize') {
      setStep('media');
    }
  };

  const handlePostSubmit = () => {
    setIsPosting(true);
    setTimeout(() => {
      const newPost: CommunityPost = {
        id: `post-new-${Date.now()}`,
        userId: user.id,
        userName: user.user_metadata?.full_name || 'Usuário JPA',
        userAvatar: user.user_metadata?.avatar_url || `https://i.pravatar.cc/100?u=${user.id}`,
        authorRole: userRole === 'lojista' ? 'merchant' : 'resident',
        content: caption,
        type: 'recommendation',
        communityId: 'comm-residents',
        neighborhood: 'Freguesia',
        timestamp: 'Agora',
        likes: 0,
        comments: 0,
        imageUrl: mediaPreviews[0] || undefined,
        showOnStoreProfile: userRole === 'lojista' && showOnStoreProfile,
      };
      onCreatePost(newPost);
      setIsPosting(false);
    }, 1500);
  };

  if (step === 'media') {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-950 flex flex-col animate-in fade-in duration-300">
        <header className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <button onClick={onClose} className="p-2 text-gray-500"><X size={24} /></button>
          <h2 className="font-bold text-lg">Novo post</h2>
          <button 
            onClick={() => setStep('finalize')} 
            disabled={mediaPreviews.length === 0}
            className="font-bold text-blue-600 disabled:text-gray-400"
          >
            Avançar
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            multiple 
            accept="image/*,video/*" 
            onChange={handleFileChange} 
            className="hidden" 
          />
          {mediaPreviews.length > 0 ? (
            <div className="w-full h-full grid grid-cols-2 gap-2">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                   <button onClick={() => removeMedia(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5">
                      <X size={12} />
                   </button>
                </div>
              ))}
               {mediaPreviews.length < 4 && (
                    <button onClick={() => fileInputRef.current?.click()} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center text-gray-400">
                        <Plus size={24} />
                        <span className="text-xs font-bold">Adicionar mais</span>
                    </button>
                )}
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-xl">Selecione suas fotos</h3>
              <p className="text-gray-500 text-sm mt-2">Escolha imagens ou um vídeo do seu rolo da câmera.</p>
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="mt-6 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl"
              >
                Selecionar do celular
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'finalize') {
    return (
       <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-950 flex flex-col animate-in fade-in duration-300">
        <header className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <button onClick={() => setStep('media')} className="p-2 text-gray-500"><ChevronLeft size={24} /></button>
          <h2 className="font-bold text-lg">Finalizar post</h2>
          <button 
            onClick={handlePostSubmit}
            disabled={isPosting}
            className="font-bold text-blue-600 disabled:text-gray-400 flex items-center gap-1"
          >
            {isPosting && <Loader2 size={16} className="animate-spin" />}
            Compartilhar
          </button>
        </header>
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex gap-4">
             <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 relative">
               <img src={mediaPreviews[0]} alt="preview" className="w-full h-full object-cover" />
                <button onClick={() => removeMedia(0)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5">
                    <X size={12} />
                </button>
             </div>
             <textarea 
               value={caption}
               onChange={(e) => setCaption(e.target.value)}
               placeholder="Escreva algo para o bairro..."
               className="flex-1 bg-transparent text-gray-800 dark:text-white outline-none resize-none text-base"
             />
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 my-4"></div>
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
             <div className="flex items-center gap-3">
               <MapPin size={20} className="text-gray-400" />
               <span className="font-medium text-sm">Adicionar localização</span>
             </div>
             <ChevronRight size={20} className="text-gray-400" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
             <div className="flex items-center gap-3">
               <AtSign size={20} className="text-gray-400" />
               <span className="font-medium text-sm">Marcar pessoas</span>
             </div>
             <ChevronRight size={20} className="text-gray-400" />
          </div>

          {userRole === 'lojista' && (
            <div className="mt-auto pt-4">
              <label htmlFor="showOnProfile" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer">
                <input 
                  type="checkbox" 
                  id="showOnProfile"
                  checked={showOnStoreProfile}
                  onChange={(e) => setShowOnStoreProfile(e.target.checked)}
                  className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Mostrar também no perfil da minha loja</span>
              </label>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null;
}

interface PostCardProps {
  post: CommunityPost;
  onStoreClick: (store: Store) => void;
  user: User | null;
  onRequireLogin: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onStoreClick, user, onRequireLogin }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);

  const handleLike = () => {
    if (!user) {
      onRequireLogin();
      return;
    }
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

  const handleAction = (action: () => void) => {
    if (!user) {
      onRequireLogin();
    } else {
      action();
    }
  };

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

      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
          <img 
            src={post.imageUrl || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop'} 
            alt="Conteúdo do post" 
            className="w-full h-full object-cover" 
          />
      </div>

      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${liked ? 'text-rose-500' : 'text-gray-500 dark:text-gray-400 hover:text-rose-500'}`}>
            <Heart size={24} className={liked ? 'fill-current' : ''} />
          </button>
          <button onClick={() => handleAction(() => alert('Comentários em breve!'))} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500">
            <MessageSquare size={24} />
          </button>
        </div>
        <button onClick={() => handleAction(() => alert('Compartilhamento em breve!'))} className="text-gray-500 dark:text-gray-400 hover:text-blue-500">
          <Share2 size={24} />
        </button>
      </div>
      
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

const FilterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { neighborhoods: string[]; theme: string; sortBy: string }) => void;
  onClear: () => void;
  initialFilters: { neighborhoods: string[]; theme: string; sortBy: string };
}> = ({ isOpen, onClose, onApply, onClear, initialFilters }) => {
  const [tempNeighborhoods, setTempNeighborhoods] = useState(initialFilters.neighborhoods);
  const [tempTheme, setTempTheme] = useState(initialFilters.theme);
  const [tempSortBy, setTempSortBy] = useState(initialFilters.sortBy);

  useEffect(() => {
    if (isOpen) {
      setTempNeighborhoods(initialFilters.neighborhoods);
      setTempTheme(initialFilters.theme);
      setTempSortBy(initialFilters.sortBy);
    }
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  const handleNeighborhoodToggle = (hood: string) => {
    if (hood === 'Jacarepaguá (todos)') {
      setTempNeighborhoods([]);
    } else {
      setTempNeighborhoods(prev => {
        const withoutTodos = prev.filter(h => h !== 'Jacarepaguá (todos)');
        if (withoutTodos.includes(hood)) {
          return withoutTodos.filter(h => h !== hood);
        } else {
          return [...withoutTodos, hood];
        }
      });
    }
  };

  const handleApply = () => {
    onApply({
      neighborhoods: tempNeighborhoods,
      theme: tempTheme,
      sortBy: tempSortBy,
    });
    onClose();
  };

  const handleClear = () => {
    onClear();
    onClose();
  };
  
  const isAllNeighborhoodsSelected = tempNeighborhoods.length === 0;

  return (
    <div className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 shrink-0"></div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 shrink-0">Filtrar e Ordenar</h2>

        <main className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-2 -mr-2">
            
            <section><h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Bairro</h3>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => handleNeighborhoodToggle('Jacarepaguá (todos)')} 
                        className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${isAllNeighborhoodsSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
                    >
                        Todos (Jacarepaguá)
                    </button>
                    {NEIGHBORHOODS.map(hood => {
                        const isSelected = tempNeighborhoods.includes(hood);
                        return (
                        <button 
                            key={hood} 
                            onClick={() => handleNeighborhoodToggle(hood)} 
                            className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
                        >
                            {hood}
                        </button>
                        )
                    })}
                </div>
            </section>

            <section>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Tema</h3>
                <div className="flex flex-wrap gap-2">
                {THEME_FILTERS.map(theme => (
                    <button key={theme.id} onClick={() => setTempTheme(theme.id)} className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${tempTheme === theme.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                    {theme.label}
                    </button>
                ))}
                </div>
            </section>

            <section>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Ordenar por</h3>
                <div className="space-y-2">
                {SORT_OPTIONS.map(sort => (
                    <button key={sort.id} onClick={() => setTempSortBy(sort.id)} className={`w-full text-left p-3 rounded-lg transition-colors text-sm font-medium flex justify-between items-center ${tempSortBy === sort.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                    {sort.label} {tempSortBy === sort.id && <CheckCircle2 size={16} />}
                    </button>
                ))}
                </div>
            </section>
        </main>

        <footer className="pt-6 flex gap-4 shrink-0 border-t border-gray-100 dark:border-gray-800">
            <button onClick={handleClear} className="flex-1 py-4 text-sm font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-xl">Limpar filtros</button>
            <button onClick={handleApply} className="flex-1 py-4 text-sm font-bold bg-blue-600 text-white rounded-xl">Aplicar filtros</button>
        </footer>
      </div>
    </div>
  );
};

interface NeighborhoodPostsViewProps {
  onBack: () => void;
  onStoreClick: (store: Store) => void;
  user: User | null;
  onRequireLogin: () => void;
  // Adicionando a prop userRole para CreatePostView
  userRole: 'cliente' | 'lojista' | null;
}

export const NeighborhoodPostsView: React.FC<NeighborhoodPostsViewProps> = ({ onBack, onStoreClick, user, onRequireLogin, userRole }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);
  const { currentNeighborhood: displayNeighborhood } = useNeighborhood();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeTheme, setActiveTheme] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string[]>([]);
  
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const filteredPosts = useMemo(() => {
    let currentPosts = posts.filter(post => {
      const matchNeighborhood = neighborhoodFilter.length === 0 || neighborhoodFilter.includes(post.neighborhood || '');
      const matchSearch = !searchTerm || post.content.toLowerCase().includes(searchTerm.toLowerCase()) || post.userName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTheme = activeTheme === 'all' || post.theme === activeTheme;
      return matchNeighborhood && matchSearch && matchTheme;
    });

    return [...currentPosts].sort((a, b) => {
      if (sortBy === 'comments') return b.comments - a.comments;
      if (sortBy === 'likes') return b.likes - a.likes;
      return 0; // 'recent' is default order
    });
  }, [neighborhoodFilter, searchTerm, activeTheme, sortBy, posts]);
  
  const handleApplyFilters = (filters: { neighborhoods: string[]; theme: string; sortBy: string }) => {
    setNeighborhoodFilter(filters.neighborhoods);
    setActiveTheme(filters.theme);
    setSortBy(filters.sortBy);
  };

  const handleClearFilters = () => {
    setNeighborhoodFilter([]);
    setActiveTheme('all');
    setSortBy('recent');
  };
  
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (neighborhoodFilter.length > 0) {
      count = neighborhoodFilter.length;
    }
    if (activeTheme !== 'all') count++;
    if (sortBy !== 'recent') count++;
    return count;
  }, [neighborhoodFilter, activeTheme, sortBy]);
  
  const handleStartPost = () => {
    if (!user) {
      onRequireLogin();
    } else {
      setIsCreatingPost(true);
    }
  };

  const handleCreatePost = (newPost: CommunityPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setIsCreatingPost(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in fade-in duration-500 overflow-x-hidden">
      <header className="bg-white dark:bg-gray-900 px-6 pt-10 pb-6 border-b border-gray-100 dark:border-gray-800 rounded-b-[2.5rem] shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">JPA Conversa</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">O que está acontecendo agora</p>
            </div>
          </div>
          <button onClick={handleStartPost} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900">
            <Plus size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Buscar em JPA...`}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 transition-all shadow-inner dark:text-white"
                />
            </div>
            <button onClick={() => setFilterModalOpen(true)} className="relative p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-500 hover:text-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm">
                <SlidersHorizontal size={20} />
                {activeFiltersCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                        {activeFiltersCount}
                    </div>
                )}
            </button>
        </div>
      </header>
      
      <main className="max-w-md mx-auto py-4 space-y-4 w-full px-4">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} onStoreClick={onStoreClick} user={user} onRequireLogin={onRequireLogin} />
        ))}
        <div className="py-10 text-center opacity-30 flex flex-col items-center">
          <StoreIcon size={24} className="mb-2" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Você chegou ao fim dos posts</p>
        </div>
      </main>

      {isCreatingPost && user && (
        <CreatePostView 
          user={user} 
          onClose={() => setIsCreatingPost(false)}
          onCreatePost={handleCreatePost}
          userRole={userRole}
        />
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        initialFilters={{
          neighborhoods: neighborhoodFilter,
          theme: activeTheme,
          sortBy: sortBy,
        }}
      />
    </div>
  );
};
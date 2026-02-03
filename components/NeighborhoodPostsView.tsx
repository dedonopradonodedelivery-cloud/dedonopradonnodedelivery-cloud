
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Search, 
  SlidersHorizontal, 
  X, 
  Plus,
  Image as ImageIcon,
  Loader2,
  MapPin,
  AtSign,
  AlertCircle,
  Video,
  ChevronRight,
  CheckCircle2,
  Store as StoreIcon
} from 'lucide-react';
import { NeighborhoodCommunity, CommunityPost, Store, ReportReason } from '../types';
import { OFFICIAL_COMMUNITIES, MOCK_USER_COMMUNITIES, MOCK_COMMUNITY_POSTS, STORES } from '../constants';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { User } from '@supabase/supabase-js';
import { PostCard } from './PostCard';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { MasterSponsorBanner } from './MasterSponsorBanner';

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
  userRole: 'cliente' | 'lojista' | null;
}> = ({ user, onClose, onCreatePost, userRole }) => {
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [showOnStoreProfile, setShowOnStoreProfile] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      mediaPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [mediaPreviews]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (event.target.files) {
      const files: File[] = Array.from(event.target.files);
      const firstFile = files[0];

      if (firstFile.type.startsWith('video/')) {
        if (files.length > 1 || mediaType === 'image') {
          setError('Apenas 1 vídeo é permitido. Remova as imagens primeiro.');
          return;
        }
        setMediaType('video');
        setMediaFiles([firstFile]);
        setMediaPreviews([URL.createObjectURL(firstFile)]);
      } else if (firstFile.type.startsWith('image/')) {
        if (mediaType === 'video') {
          setError('Não é possível misturar vídeos e imagens. Remova o vídeo primeiro.');
          return;
        }
        if (mediaFiles.length + files.length > 6) {
          setError('Você pode adicionar no máximo 6 fotos.');
          return;
        }
        setMediaType('image');
        setMediaFiles(prev => [...prev, ...files]);
        setMediaPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
      }
    }
  };

  useEffect(() => {
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current && videoRef.current.duration > 60) {
          setError('O vídeo deve ter no máximo 60 segundos.');
          removeMedia(0);
        }
      };
    }
  }, [mediaPreviews, mediaType]);

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index]);
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
    if (mediaFiles.length === 1) {
      setMediaType(null);
    }
  };

  const handlePostSubmit = () => {
    if(!caption.trim()){
      setError("Por favor, escreva uma legenda para seu post.");
      return;
    }
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
        imageUrls: mediaType === 'image' ? mediaPreviews : undefined,
        videoUrl: mediaType === 'video' ? mediaPreviews[0] : undefined,
        showOnStoreProfile: userRole === 'lojista' && showOnStoreProfile,
      };
      onCreatePost(newPost);
      setIsPosting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-950 flex flex-col animate-in fade-in duration-300">
      <header className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onClose} className="p-2 text-gray-500"><X size={24} /></button>
        <h2 className="font-bold text-lg">Novo post</h2>
        <button onClick={handlePostSubmit} disabled={isPosting || !caption.trim()} className="font-bold text-blue-600 disabled:text-gray-400 flex items-center gap-1">
          {isPosting && <Loader2 size={16} className="animate-spin" />}
          Compartilhar
        </button>
      </header>
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex gap-4">
           <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 relative">
             {mediaPreviews.length > 0 ? (
                mediaType === 'video' ? (
                    <video ref={videoRef} src={mediaPreviews[0]} className="w-full h-full object-cover" />
                ) : (
                    <img src={mediaPreviews[0]} alt="preview" className="w-full h-full object-cover" />
                )
             ) : <div className="w-full h-full bg-gray-100 dark:bg-gray-800"></div>}
             {mediaType === 'image' && mediaFiles.length > 1 && (
                <div className="absolute top-1 right-1 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {mediaFiles.length}/6
                </div>
             )}
             {mediaPreviews.length > 0 && <button onClick={() => removeMedia(0)} className="absolute bottom-1 right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>}
           </div>
           <textarea 
             value={caption}
             onChange={(e) => {setCaption(e.target.value); setError('')}}
             placeholder="Escreva algo para o bairro..."
             className="flex-1 bg-transparent text-gray-800 dark:text-white outline-none resize-none text-base"
           />
        </div>
        
        {error && <div className="mt-4 text-red-500 text-xs font-bold flex items-center gap-2 p-2 bg-red-50 rounded-lg"><AlertCircle size={14}/> {error}</div>}

        <div className="border-t border-gray-100 dark:border-gray-800 my-4"></div>
        
        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
                <ImageIcon size={20} />
            </div>
            <span className="font-medium text-sm flex-1">Adicionar mídia</span>
            <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
        </label>
        
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
           <div className="flex items-center gap-3"><MapPin size={20} className="text-gray-400" /> <span className="font-medium text-sm">Adicionar localização</span></div>
           <ChevronRight size={20} className="text-gray-400" />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
           <div className="flex items-center gap-3"><AtSign size={20} className="text-gray-400" /> <span className="font-medium text-sm">Marcar pessoas</span></div>
           <ChevronRight size={20} className="text-gray-400" />
        </div>

        {userRole === 'lojista' && (
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Opções de lojista</p>
            <label htmlFor="showOnProfile" className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 cursor-pointer border border-blue-100 dark:border-blue-800/30 transition-colors">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${showOnStoreProfile ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'}`}>
                {showOnStoreProfile && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <input type="checkbox" id="showOnProfile" checked={showOnStoreProfile} onChange={(e) => setShowOnStoreProfile(e.target.checked)} className="hidden" />
              <div className="flex-1">
                 <span className="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-2">
                    <StoreIcon size={14} className="text-blue-500" /> 
                    Publicar também no Feed da Loja
                 </span>
                 <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">O post aparecerá na aba "Feed" do seu perfil.</p>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
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
    } 
    else {
      setTempNeighborhoods(prev => {
        const withoutTodos = prev.filter(h => h !== 'Jacarepaguá (todos)');
        return withoutTodos.includes(hood) ? withoutTodos.filter(h => h !== hood) : [...withoutTodos, hood];
      });
    }
  };

  const handleApply = () => { onApply({ neighborhoods: tempNeighborhoods, theme: tempTheme, sortBy: tempSortBy }); onClose(); };
  const handleClear = () => { onClear(); onClose(); };
  const isAllNeighborhoodsSelected = tempNeighborhoods.length === 0;

  return (
    <div className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 shrink-0 text-center">Filtrar e Ordenar</h2>

        <main className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-2 -mr-2">
            <section><h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Bairro</h3>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleNeighborhoodToggle('Jacarepaguá (todos)')} className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${isAllNeighborhoodsSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}>Todos (Jacarepaguá)</button>
                    {NEIGHBORHOODS.map(hood => (<button key={hood} onClick={() => handleNeighborhoodToggle(hood)} className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${tempNeighborhoods.includes(hood) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}>{hood}</button>))}
                </div>
            </section>
            <section><h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Tema</h3>
                <div className="flex flex-wrap gap-2">{THEME_FILTERS.map(theme => (<button key={theme.id} onClick={() => setTempTheme(theme.id)} className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${tempTheme === theme.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}>{theme.label}</button>))}</div>
            </section>
            <section><h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Ordenar por</h3>
                <div className="space-y-2">{SORT_OPTIONS.map(sort => (<button key={sort.id} onClick={() => setTempSortBy(sort.id)} className={`w-full text-left p-3 rounded-lg transition-colors text-sm font-medium flex justify-between items-center ${tempSortBy === sort.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>{sort.label} {tempSortBy === sort.id && <CheckCircle2 size={16} />}</button>))}</div>
            </section>
        </main>

        <footer className="pt-6 flex gap-4 shrink-0 border-t border-gray-100 dark:border-gray-800">
            <button onClick={handleClear} className="flex-1 py-4 text-sm font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-xl">Limpar</button>
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
  userRole: 'cliente' | 'lojista' | null;
  onNavigate: (view: string) => void;
}

export const NeighborhoodPostsView: React.FC<NeighborhoodPostsViewProps> = ({ onBack, onStoreClick, user, onRequireLogin, userRole, onNavigate }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const { currentNeighborhood: displayNeighborhood } = useNeighborhood();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeTheme, setActiveTheme] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string[]>([]);
  
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const { isPostSaved, toggleSavePost } = useSavedPosts(user);

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
    let count = (neighborhoodFilter.length > 0) ? 1 : 0;
    if (activeTheme !== 'all') count++;
    if (sortBy !== 'recent') count++;
    return count;
  }, [neighborhoodFilter, activeTheme, sortBy]);
  
  const handleStartPost = () => {
    if (!user) onRequireLogin(); else setIsCreatingPost(true);
  };

  const handleCreatePost = (newPost: CommunityPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setIsCreatingPost(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in fade-in duration-500 overflow-x-hidden">
      {/* 
         CABEÇALHO REESTRUTURADO PARA REDUZIR ALTURA E MELHORAR DENSIDADE 
         - Botão de voltar absoluto (economiza 1 linha de grid)
         - Margens e paddings reduzidos
         - Descrição com max-w-90% e line-clamp-2
      */}
      <header className="bg-white dark:bg-gray-900 px-5 pt-5 pb-5 border-b border-gray-100 dark:border-gray-800 rounded-b-[2rem] shadow-sm sticky top-0 z-40 relative">
        
        {/* Botão de voltar absoluto - remove ocupação vertical */}
        <div className="absolute top-5 left-5 z-50">
           <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900 transition-colors shadow-sm active:scale-90">
              <ChevronLeft size={20} />
           </button>
        </div>

        {/* Bloco Central de Título */}
        <div className="flex flex-col items-center text-center mb-3 mt-1">
            <h1 className="font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
              JPA Conversa
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight mt-1.5 max-w-[90%] line-clamp-2 px-8">
              Troque dicas, peça ajuda e saiba o que acontece no bairro em tempo real. O espaço oficial da nossa comunidade.
            </p>
        </div>

        {/* Botão Postar Centralizado e Compacto */}
        <div className="flex justify-center mb-3">
            <button onClick={handleStartPost} className="flex items-center gap-2 px-8 py-3 bg-[#1E5BFF] text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95">
              <Plus size={18} strokeWidth={3} />
              Postar
            </button>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="flex items-center gap-3 mt-2">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={`Buscar em JPA...`} className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 transition-all shadow-inner dark:text-white" />
            </div>
            <button onClick={() => setFilterModalOpen(true)} className="relative p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-500 hover:text-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm">
                <SlidersHorizontal size={20} />
                {activeFiltersCount > 0 && (<div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">{activeFiltersCount}</div>)}
            </button>
        </div>
      </header>
      
      <main className="max-w-md mx-auto py-4 space-y-4 w-full px-0 sm:px-4 pb-40">
        {filteredPosts.length > 0 ? filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} onStoreClick={onStoreClick} user={user} onRequireLogin={onRequireLogin} isSaved={isPostSaved(post.id)} onToggleSave={() => toggleSavePost(post.id)} />
        )) : (
            <div className="text-center py-20 opacity-40 flex flex-col items-center">
                <AlertCircle size={48} className="mb-4" />
                <p className="text-sm font-bold">Nenhuma postagem encontrada</p>
                <p className="text-xs text-gray-500 mt-1">Tente ajustar seus filtros ou seja o primeiro a postar!</p>
            </div>
        )}

        {/* BANNER PATROCINADOR MASTER FINAL */}
        <section className="px-4">
          <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label="Feed do Bairro" />
        </section>
      </main>

      {isCreatingPost && user && (
        <CreatePostView user={user} onClose={() => setIsCreatingPost(false)} onCreatePost={handleCreatePost} userRole={userRole} />
      )}

      <FilterModal isOpen={isFilterModalOpen} onClose={() => setFilterModalOpen(false)} onApply={handleApplyFilters} onClear={handleClearFilters} initialFilters={{ neighborhoods: neighborhoodFilter, theme: activeTheme, sortBy: sortBy }} />
    </div>
  );
};

const ChevronDown = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

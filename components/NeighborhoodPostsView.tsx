import React, { useState, useMemo } from 'react';
import { Store, Clock, MoreHorizontal, Heart, MessageSquare, Share2, Flag, CheckCircle2, ChevronLeft, Search, SlidersHorizontal, X } from 'lucide-react';
import { Store as StoreType, CommunityPost, ReportReason } from '../types';
import { STORES, MOCK_COMMUNITY_POSTS } from '../constants';
import { ReportModal } from './ReportModal';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';

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

const FilterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { neighborhood: string; theme: string; sortBy: string }) => void;
  onClear: () => void;
  initialFilters: { neighborhood: string; theme: string; sortBy: string };
}> = ({ isOpen, onClose, onApply, onClear, initialFilters }) => {
  const [tempNeighborhood, setTempNeighborhood] = useState(initialFilters.neighborhood);
  const [tempTheme, setTempTheme] = useState(initialFilters.theme);
  const [tempSortBy, setTempSortBy] = useState(initialFilters.sortBy);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      neighborhood: tempNeighborhood,
      theme: tempTheme,
      sortBy: tempSortBy,
    });
    onClose();
  };

  const handleClear = () => {
    onClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1001] bg-black/60 flex items-end" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 shrink-0"></div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 shrink-0">Filtrar e Ordenar</h2>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-2 -mr-2">
          {/* SEÇÃO 1 – Filtrar por bairro */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Bairro</h3>
            <div className="space-y-2">
              <button onClick={() => setTempNeighborhood("Jacarepaguá (todos)")} className={`w-full text-left p-3 rounded-lg transition-colors text-sm font-medium flex justify-between items-center ${tempNeighborhood === "Jacarepaguá (todos)" ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                Jacarepaguá (todos) {tempNeighborhood === "Jacarepaguá (todos)" && <CheckCircle2 size={16} />}
              </button>
              {NEIGHBORHOODS.map(hood => (
                <button key={hood} onClick={() => setTempNeighborhood(hood)} className={`w-full text-left p-3 rounded-lg transition-colors text-sm font-medium flex justify-between items-center ${tempNeighborhood === hood ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                  {hood} {tempNeighborhood === hood && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>
          </section>

          {/* SEÇÃO 2 – Filtrar por tema */}
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

          {/* SEÇÃO 3 – Ordenar por */}
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
        </div>

        {/* Ações do painel */}
        <div className="pt-6 flex gap-4 shrink-0 border-t border-gray-100 dark:border-gray-800">
          <button onClick={handleClear} className="flex-1 py-4 text-sm font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-xl">Limpar filtros</button>
          <button onClick={handleApply} className="flex-1 py-4 text-sm font-bold bg-blue-600 text-white rounded-xl">Aplicar filtros</button>
        </div>
      </div>
    </div>
  );
};


export const NeighborhoodPostsView: React.FC<{ onBack: () => void; onStoreClick: (store: StoreType) => void }> = ({ onBack, onStoreClick }) => {
  const { currentNeighborhood, setNeighborhood } = useNeighborhood();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTheme, setActiveTheme] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'comments', 'likes'
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    let posts = MOCK_POSTS.filter(post => {
      const matchNeighborhood = currentNeighborhood === "Jacarepaguá (todos)" || post.neighborhood === currentNeighborhood;
      const matchSearch = !searchTerm || post.content.toLowerCase().includes(searchTerm.toLowerCase()) || post.userName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTheme = activeTheme === 'all' || post.theme === activeTheme;
      return matchNeighborhood && matchSearch && matchTheme;
    });

    // Apply sorting
    return [...posts].sort((a, b) => {
      if (sortBy === 'comments') return b.comments - a.comments;
      if (sortBy === 'likes') return b.likes - a.likes;
      // 'recent' is the default, and the mock data is already sorted by recency.
      return 0;
    });
  }, [currentNeighborhood, searchTerm, activeTheme, sortBy]);
  
  const handleApplyFilters = (filters: { neighborhood: string; theme: string; sortBy: string }) => {
    setNeighborhood(filters.neighborhood);
    setActiveTheme(filters.theme);
    setSortBy(filters.sortBy);
  };

  const handleClearFilters = () => {
    setNeighborhood("Jacarepaguá (todos)");
    setActiveTheme('all');
    setSortBy('recent');
  };
  
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentNeighborhood !== "Jacarepaguá (todos)") count++;
    if (activeTheme !== 'all') count++;
    if (sortBy !== 'recent') count++;
    return count;
  }, [currentNeighborhood, activeTheme, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in fade-in duration-500 overflow-x-hidden">
      <header className="bg-white dark:bg-gray-900 px-6 pt-10 pb-6 border-b border-gray-100 dark:border-gray-800 rounded-b-[2.5rem] shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">JPA Conversa</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">O que está acontecendo agora</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5 mt-4">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Buscar em ${currentNeighborhood === "Jacarepaguá (todos)" ? "JPA" : currentNeighborhood}...`}
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
          <PostCard key={post.id} post={post} onStoreClick={onStoreClick} />
        ))}
        <div className="py-10 text-center opacity-30 flex flex-col items-center">
          <Store size={24} className="mb-2" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Você chegou ao fim dos posts</p>
        </div>
      </main>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        initialFilters={{
          neighborhood: currentNeighborhood,
          theme: activeTheme,
          sortBy: sortBy,
        }}
      />
    </div>
  );
};
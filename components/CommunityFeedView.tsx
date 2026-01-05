
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Store as StoreIcon, MoreHorizontal, Send, Heart, Share2, MessageCircle, ChevronLeft, BadgeCheck, User as UserIcon, Home, Plus, X, Video, Image as ImageIcon, Film, Loader2, Grid, Camera, Play, Check, ChevronRight, Briefcase, MapPin, Clock, DollarSign, ExternalLink, AlertCircle, Building2, Trash2, Flag, Bookmark, ChevronDown, ArrowUp } from 'lucide-react';
import { Store, CommunityPost, Job, ReportReason } from '../types';
import { MOCK_COMMUNITY_POSTS, MOCK_JOBS } from '../constants';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { ReportModal } from './ReportModal';

interface CommunityFeedViewProps {
  onStoreClick: (store: Store) => void;
  user: any;
  onRequireLogin: () => void;
}

// Update Mock Stories with Neighborhood data for filtering
const MOCK_STORIES = [
  { id: 1, user: 'Padaria Imperial', username: 'padariaimperial', avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop', isMerchant: true, hasUnread: true, neighborhood: 'Freguesia', items: [{ id: 's1', type: 'image', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop', duration: 5000 }] },
  { id: 2, user: 'Ana Paula', username: 'anapaula', avatar: 'https://i.pravatar.cc/150?u=a', isMerchant: false, hasUnread: true, neighborhood: 'Taquara', items: [{ id: 's3', type: 'image', url: 'https://images.unsplash.com/photo-1526488807855-3096a6a23732?q=80&w=600&auto=format&fit=crop', duration: 5000 }] },
  { id: 3, user: 'Bistrô Freguesia', username: 'bistrofreguesia', avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200&auto=format&fit=crop', isMerchant: true, hasUnread: false, neighborhood: 'Freguesia', items: [] },
  { id: 4, user: 'Pet Shop Anil', username: 'petanil', avatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200&auto=format&fit=crop', isMerchant: true, hasUnread: true, neighborhood: 'Anil', items: [] }
];

const MOCK_CHATS = [
  { id: 1, user: 'Padaria Imperial', username: 'padariaimperial', avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop', lastMsg: 'Seu pedido saiu para entrega!', time: '10:30', unread: true, isMerchant: true },
  { id: 2, user: 'Suporte Localizei', username: 'suporte', avatar: 'https://ui-avatars.com/api/?name=Suporte&background=0D8ABC&color=fff', lastMsg: 'Como podemos ajudar?', time: 'Ontem', unread: false, isMerchant: false },
];
const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'like', user: 'marcelo.rj', userAvatar: 'https://i.pravatar.cc/150?u=m', content: 'curtiu sua publicação.', time: '2 min', postImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=100&auto=format&fit=crop', isUnread: true },
];

const StoryViewer: React.FC<{ initialStoryIndex: number; onClose: () => void }> = ({ initialStoryIndex, onClose }) => {
   return <div onClick={onClose} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center text-white">Story Viewer Mock (Click to close)</div>;
};

const DeleteConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm">
          <h3 className="font-bold text-lg dark:text-white mb-2">Excluir publicação?</h3>
          <p className="text-gray-500 text-sm mb-6">Essa ação não pode ser desfeita.</p>
          <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg">Cancelar</button>
              <button onClick={onConfirm} className="flex-1 py-3 text-white font-bold bg-red-500 rounded-lg">Excluir</button>
          </div>
      </div>
  </div>
);

const ChatScreen: React.FC<{ chatId: number; onBack: () => void; user: any }> = ({ onBack }) => <div onClick={onBack} className="p-4 bg-white h-full">Chat Mock (Click to back)</div>;

const CreatePostScreen: React.FC<{ onClose: () => void; onSuccess: () => void; user: any }> = ({ onClose, onSuccess }) => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
            <button onClick={onClose}><X className="w-6 h-6 dark:text-white" /></button>
            <h3 className="font-bold dark:text-white">Nova Publicação</h3>
            <button onClick={onSuccess} className="text-[#1E5BFF] font-bold">Publicar</button>
        </div>
        <div className="p-4"><textarea placeholder="Escreva algo..." className="w-full h-32 outline-none dark:bg-gray-900 dark:text-white resize-none" /></div>
    </div>
);

const ActivityScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => <div onClick={onClose} className="p-4 bg-white h-full">Activity Mock (Click to close)</div>;
const UserProfileScreen: React.FC<{ user: any }> = () => <div className="p-4">Profile Mock</div>;
const CommunityExploreScreen: React.FC = () => <div className="p-4">Explore Mock</div>;

// --- MODAL DE DETALHES DA VAGA ---
const FeedJobDetailModal: React.FC<{ job: Job; onClose: () => void }> = ({ job, onClose }) => {
  const handleApply = () => {
    const text = `Olá! Vi a vaga de *${job.role}* no app Localizei JPA e gostaria de me candidatar.`;
    const url = `https://wa.me/${job.contactWhatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-[2rem] sm:rounded-3xl p-6 flex flex-col relative animate-in slide-in-from-bottom duration-300 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 sm:hidden" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto pr-2 pb-20 no-scrollbar">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
              {job.type}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1">
              {job.role}
            </h2>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-sm">
              <Building2 className="w-4 h-4" />
              {job.company}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Local</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{job.neighborhood}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Horário</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{job.schedule}</p>
            </div>
            {job.salary && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 col-span-2">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Salário / Remuneração</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{job.salary}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">Descrição da Vaga</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">Requisitos</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Clock className="w-3 h-3" />
                Publicado em: {job.postedAt}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 rounded-b-[2rem]">
          <button 
            onClick={handleApply}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Candidatar-se via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

const JobsFeedScreen: React.FC<{ user: any; onRequireLogin: () => void }> = ({ user, onRequireLogin }) => {
    const { currentNeighborhood, isAll } = useNeighborhood();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    
    const filteredJobs = useMemo(() => {
        let jobs = [...MOCK_JOBS];
        jobs.sort((a, b) => {
            if (isAll) return 0;
            const aIsLocal = a.neighborhood === currentNeighborhood;
            const bIsLocal = b.neighborhood === currentNeighborhood;
            if (aIsLocal && !bIsLocal) return -1;
            if (!aIsLocal && bIsLocal) return 1;
            return 0;
        });
        
        // Se não for "Todos", filtra estritamente
        if (!isAll) {
            jobs = jobs.filter(j => j.neighborhood === currentNeighborhood);
        }
        
        return jobs;
    }, [currentNeighborhood, isAll]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-full pb-20">
            <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <h2 className="font-bold text-lg dark:text-white">
                    Vagas em {currentNeighborhood === 'Jacarepaguá (todos)' ? 'Jacarepaguá' : currentNeighborhood}
                </h2>
            </div>
            <div className="p-4 space-y-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <div key={job.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{job.role}</h3>
                                    <p className="text-sm text-gray-500">{job.company}</p>
                                </div>
                                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">{job.type}</span>
                            </div>
                            <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {(isAll || job.neighborhood !== currentNeighborhood) && (
                                    <span className="flex items-center gap-1 font-bold text-gray-700 dark:text-gray-300">
                                        <MapPin className="w-3 h-3" /> {job.neighborhood}
                                    </span>
                                )}
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.postedAt}</span>
                            </div>
                            <button 
                                onClick={() => setSelectedJob(job)} 
                                className="mt-3 w-full py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
                            >
                                Ver detalhes
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma vaga encontrada para {currentNeighborhood}.</p>
                    </div>
                )}
            </div>

            {selectedJob && (
                <FeedJobDetailModal 
                    job={selectedJob} 
                    onClose={() => setSelectedJob(null)} 
                />
            )}
        </div>
    );
};

const StoriesRail: React.FC<{ user: any; onRequireLogin: () => void; onOpenStory: (index: number) => void; stories: any[] }> = ({ user, onRequireLogin, onOpenStory, stories }) => (
  <div className="flex gap-4 overflow-x-auto px-4 pt-2 pb-2 no-scrollbar bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
    <div className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0" onClick={() => user ? alert("Câmera de stories (Mock)") : onRequireLogin()}>
      <div className="w-[64px] h-[64px] rounded-full p-[2px] bg-white dark:bg-gray-900 relative">
         <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600">
            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="User Story" /> : <UserIcon className="w-full h-full p-4 text-gray-300" />}
         </div>
         <div className="absolute bottom-0 right-0 bg-[#1E5BFF] rounded-full p-0.5 border-2 border-white dark:border-black text-white"><Plus className="w-3.5 h-3.5" /></div>
      </div>
      <span className="text-[11px] text-gray-900 dark:text-white font-medium">Seu story</span>
    </div>
    {stories.map((story, i) => (
      <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0" onClick={() => onOpenStory(i)}>
        <div className={`w-[66px] h-[66px] rounded-full p-[2px] ${story.hasUnread ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
           <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-black"><img src={story.avatar} alt={story.user} className="w-full h-full object-cover" /></div>
        </div>
        <span className="text-[11px] text-gray-900 dark:text-white truncate w-16 text-center">{story.username}</span>
      </div>
    ))}
  </div>
);

const CommentsModal: React.FC<{ postId: string; onClose: () => void; user: any; }> = ({ onClose }) => <div onClick={onClose} className="fixed inset-0 z-[100] bg-black/50 flex items-end"><div className="bg-white w-full h-1/2 rounded-t-3xl p-4">Comentários</div></div>;

const FeedPost: React.FC<{ 
    post: CommunityPost; 
    onLike: () => void; 
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    currentUserId?: string;
    onDeleteRequest: (postId: string) => void;
    onReport: () => void;
    onOpenComments: () => void;
}> = ({ post, onLike, activeMenuId, setActiveMenuId, currentUserId, onDeleteRequest, onReport, onOpenComments }) => {
  const [liked, setLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMenuOpen = activeMenuId === post.id;
  const isOwner = currentUserId === post.userId;
  const { isAll, currentNeighborhood } = useNeighborhood();

  const handleLike = () => {
    onLike();
    setLiked(!liked);
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(isMenuOpen ? null : post.id);
  };

  const images = post.imageUrls && post.imageUrls.length > 0 
                 ? post.imageUrls 
                 : (post.imageUrl ? [post.imageUrl] : []);

  const MAX_CAPTION_LENGTH = 90;
  const shouldTruncate = post.content.length > MAX_CAPTION_LENGTH;

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pb-1 mb-2 last:border-0 relative">
      
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600">
             <div className="w-full h-full rounded-full border border-white dark:border-black overflow-hidden bg-gray-100">
                <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
             </div>
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1 leading-none">
              {post.userUsername || post.userName.toLowerCase().replace(' ', '')}
              {post.authorRole === 'merchant' && <BadgeCheck className="w-3 h-3 text-[#1E5BFF] fill-white" />}
            </h4>
            <div className="flex items-center gap-1">
                {post.authorRole === 'merchant' && <span className="text-[10px] text-gray-500 dark:text-gray-400">Patrocinado</span>}
                {(isAll || post.neighborhood !== currentNeighborhood) && post.neighborhood && (
                    <>
                        {post.authorRole === 'merchant' && <span className="text-[10px] text-gray-300">•</span>}
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 px-1.5 rounded-full">
                            <MapPin className="w-2.5 h-2.5" />
                            {post.neighborhood}
                        </span>
                    </>
                )}
            </div>
          </div>
        </div>
        
        <div className="relative">
            <button onClick={handleToggleMenu} className="text-gray-900 dark:text-white p-1">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 z-10 cursor-default" onClick={() => setActiveMenuId(null)}></div>
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {isOwner ? (
                            <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); onDeleteRequest(post.id); }} className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700">Excluir</button>
                        ) : (
                            <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); onReport(); }} className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700">Denunciar</button>
                        )}
                    </div>
                </>
            )}
        </div>
      </div>

      <div className={`w-full relative bg-gray-100 dark:bg-gray-800 overflow-hidden ${post.videoUrl ? 'aspect-[9/16]' : 'aspect-square'}`}>
         {post.videoUrl ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
                <video src={post.videoUrl} controls className="w-full h-full object-cover" />
            </div>
         ) : images.length > 0 ? (
            <>
                <img src={images[currentImageIndex]} alt="Post content" className="w-full h-full object-cover" />
                {images.length > 1 && (
                    <>
                        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm font-bold">{currentImageIndex + 1}/{images.length}</div>
                        {currentImageIndex > 0 && <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev - 1); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md text-gray-800"><ChevronLeft className="w-5 h-5" /></button>}
                        {currentImageIndex < images.length - 1 && <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev + 1); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md text-gray-800"><ChevronRight className="w-5 h-5" /></button>}
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                            {images.map((_, idx) => (<div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`} />))}
                        </div>
                    </>
                )}
            </>
         ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400"><span className="text-xs">Sem mídia</span></div>
         )}
      </div>

      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="active:scale-90 transition-transform"><Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-900 dark:text-white'}`} /></button>
          <button onClick={onOpenComments} className="active:scale-90 transition-transform"><MessageCircle className="w-6 h-6 text-gray-900 dark:text-white flip-horizontal" style={{ transform: 'scaleX(-1)' }} /></button>
          <button className="active:scale-90 transition-transform"><Send className="w-6 h-6 text-gray-900 dark:text-white -rotate-12 -mt-1" /></button>
        </div>
        <button className="active:scale-90 transition-transform"><Bookmark className="w-6 h-6 text-gray-900 dark:text-white" /></button>
      </div>

      <div className="px-3 pb-3">
        <div className="font-bold text-sm text-gray-900 dark:text-white mb-1">{post.likes + (liked ? 1 : 0)} curtidas</div>
        <div className="text-sm text-gray-900 dark:text-white leading-tight">
            <span className="font-bold mr-2">{post.userUsername || post.userName.toLowerCase().replace(' ', '')}</span>
            <span className={shouldTruncate && !isExpanded ? "" : "whitespace-pre-wrap"}>{shouldTruncate && !isExpanded ? post.content.slice(0, MAX_CAPTION_LENGTH).trim() + "... " : post.content}</span>
            {shouldTruncate && <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 dark:text-gray-400 text-sm ml-1">{isExpanded ? "" : "mais"}</button>}
        </div>
        <button onClick={onOpenComments} className="text-gray-500 dark:text-gray-400 text-sm mt-1">Ver todos os {post.comments} comentários</button>
        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase">{post.timestamp}</div>
      </div>
    </div>
  );
};

const CommunityNavBar: React.FC<{ currentView: string; onChangeView: (view: 'home' | 'direct' | 'explore' | 'profile' | 'jobs') => void; userAvatar?: string; hasUnreadMessages?: boolean; }> = ({ currentView, onChangeView, userAvatar, hasUnreadMessages }) => (
  <div className="sticky top-[70px] z-20 flex justify-center mb-0 px-4 pointer-events-none w-full">
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full grid grid-cols-5 items-center px-1 py-2 pointer-events-auto transition-all">
      <button onClick={() => onChangeView('home')} className={`flex justify-center py-2 transition-colors ${currentView === 'home' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
        <Home className={`w-6 h-6 ${currentView === 'home' ? 'fill-black dark:fill-white' : ''}`} strokeWidth={2} />
      </button>
      <button onClick={() => onChangeView('direct')} className={`flex justify-center py-2 transition-colors relative ${currentView === 'direct' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
        <Send className={`w-6 h-6 ${currentView === 'direct' ? 'fill-black dark:fill-white' : ''}`} strokeWidth={2} transform="rotate(-15)" />
        {hasUnreadMessages && <span className="absolute top-1.5 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>}
      </button>
      <button onClick={() => onChangeView('explore')} className={`flex justify-center py-2 transition-colors ${currentView === 'explore' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
        <Search className="w-6 h-6" strokeWidth={currentView === 'explore' ? 3 : 2} />
      </button>
      <button onClick={() => onChangeView('profile')} className={`flex justify-center py-2 transition-all`}>
        <div className={`rounded-full overflow-hidden border-2 ${currentView === 'profile' ? 'border-black dark:border-white' : 'border-transparent'}`}>
           {userAvatar ? <img src={userAvatar} alt="Profile" className="w-6 h-6 object-cover" /> : <UserIcon className={`w-6 h-6 ${currentView === 'profile' ? 'text-black dark:text-white fill-black dark:fill-white' : 'text-gray-400'}`} />}
        </div>
      </button>
      <button onClick={() => onChangeView('jobs')} className={`flex justify-center py-2 transition-colors ${currentView === 'jobs' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
        <Briefcase className={`w-6 h-6 ${currentView === 'jobs' ? 'fill-black dark:fill-white' : ''}`} strokeWidth={2} />
      </button>
    </div>
  </div>
);

// Helper function for demo purposes
const generateRandomPost = (currentNeighborhood: string): CommunityPost => {
    return {
        id: `new-post-${Date.now()}`,
        userId: 'u_new',
        userName: 'Visitante Recente',
        userAvatar: 'https://i.pravatar.cc/150?u=new',
        authorRole: 'resident',
        content: 'Acabei de ver uma novidade incrível aqui no bairro! Alguém já conferiu?',
        type: 'news',
        neighborhood: currentNeighborhood,
        timestamp: 'Agora',
        likes: 0,
        comments: 0
    };
};

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ onStoreClick, user, onRequireLogin }) => {
  const [internalView, setInternalView] = useState<'home' | 'direct' | 'explore' | 'profile' | 'create_post' | 'notifications' | 'jobs'>('home');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const { currentNeighborhood, isAll, setNeighborhood, toggleSelector } = useNeighborhood();
  
  // --- INSTAGRAM-STYLE PULL TO REFRESH LOGIC ---
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filteredStories, setFilteredStories] = useState(MOCK_STORIES);
  const [incomingPosts, setIncomingPosts] = useState<CommunityPost[]>([]);
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const touchStart = useRef(0);
  const feedRef = useRef<HTMLDivElement>(null);

  // Initial Data Load & Filter
  useEffect(() => {
    // 1. Filter Posts
    let list = [...MOCK_COMMUNITY_POSTS];
    if (!isAll) {
        list = list.filter(p => p.neighborhood === currentNeighborhood);
    }
    
    // Sort Priority: Local > Others (if All) or just recency
    list.sort((a, b) => {
        if (isAll) return 0;
        return 0; // Maintain order
    });
    setPosts(list);

    // 2. Filter Stories
    let stories = [...MOCK_STORIES];
    if (!isAll) {
        stories = stories.filter(s => s.neighborhood === currentNeighborhood);
    }
    setFilteredStories(stories);

  }, [currentNeighborhood, isAll]);

  // Touch Handlers for Pull-to-Refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull if at the very top of the scrollable area
    if (window.scrollY === 0) {
        touchStart.current = e.touches[0].clientY;
        setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;
    
    const y = e.touches[0].clientY;
    const delta = y - touchStart.current;

    // Only allow pulling down if we started at top and are moving down
    if (delta > 0 && window.scrollY === 0) {
        // Resistance curve
        setPullY(delta * 0.4);
    }
  };

  const handleTouchEnd = async () => {
    setIsPulling(false);
    if (!isRefreshing && pullY > 60) {
        // Trigger Refresh
        setIsRefreshing(true);
        setPullY(60); // Snap to loading height
        
        // Simulate API call
        setTimeout(() => {
            setIsRefreshing(false);
            setPullY(0);
            
            // Logic: 50% chance to find a new post
            if (Math.random() > 0.5) {
                const newPost = generateRandomPost(currentNeighborhood);
                setIncomingPosts(prev => [newPost, ...prev]);
            }
        }, 1500);
    } else {
        // Cancel pull
        setPullY(0);
    }
  };

  const handleShowNewPosts = () => {
      setPosts(prev => [...incomingPosts, ...prev]);
      setIncomingPosts([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- EXISTING LOGIC ---
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [reportedPosts, setReportedPosts] = useState<Set<string>>(new Set());

  const handleViewChange = (view: 'home' | 'direct' | 'explore' | 'profile' | 'jobs') => {
    if ((view === 'direct' || view === 'profile') && !user) { onRequireLogin(); return; }
    setInternalView(view);
    if (view !== 'direct') setSelectedChatId(null);
  };
  const handleCreatePost = () => { if (!user) { onRequireLogin(); return; } setInternalView('create_post'); };
  const handleNotifications = () => { if (!user) { onRequireLogin(); return; } setInternalView('notifications'); };
  const handlePostSuccess = () => { setInternalView('home'); setToastMessage('Publicado com sucesso!'); setShowSuccessToast(true); setTimeout(() => setShowSuccessToast(false), 3000); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleRequestDelete = (postId: string) => { setPostToDelete(postId); };
  const handleConfirmDelete = () => { if (postToDelete) { setPosts(prev => prev.filter(p => p.id !== postToDelete)); setPostToDelete(null); setToastMessage('Post excluído'); setShowSuccessToast(true); setTimeout(() => setShowSuccessToast(false), 2000); } };
  
  const handleReportClick = (postId: string) => {
    if (reportedPosts.has(postId)) { alert("Você já denunciou esta publicação."); return; }
    setReportPostId(postId);
  };

  const handleReportSubmit = (reason: ReportReason) => {
    if (reportPostId) {
      setReportedPosts(prev => new Set(prev).add(reportPostId));
      setReportPostId(null);
      setToastMessage('Denúncia enviada. Obrigado!');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  const renderContent = () => {
    switch (internalView) {
      case 'home':
        return (
          <div 
            ref={feedRef}
            className="pb-20 relative pt-5"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Loading Spinner / Pull Indicator */}
            <div 
                className="absolute left-0 right-0 flex justify-center -top-10 transition-transform duration-200 z-0"
                style={{ transform: `translateY(${pullY}px)` }}
            >
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md border border-gray-100 dark:border-gray-700">
                    <Loader2 className={`w-5 h-5 text-[#1E5BFF] ${isRefreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pullY * 2}deg)` }} />
                </div>
            </div>

            {/* "New Posts" Badge */}
            {incomingPosts.length > 0 && !isRefreshing && (
                <div className="absolute top-4 left-0 right-0 z-20 flex justify-center animate-in fade-in slide-in-from-top-2">
                    <button 
                        onClick={handleShowNewPosts}
                        className="bg-[#1E5BFF] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
                    >
                        <ArrowUp className="w-3 h-3" />
                        Novas publicações
                    </button>
                </div>
            )}

            {/* Content Container with Push Effect */}
            <div 
                className="transition-transform duration-200 ease-out will-change-transform"
                style={{ transform: `translateY(${pullY}px)` }}
            >
                <StoriesRail user={user} onRequireLogin={onRequireLogin} onOpenStory={(idx) => setViewingStoryIndex(idx)} stories={filteredStories} />
                <div className="flex flex-col mt-2">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <FeedPost 
                        key={post.id} post={post} onLike={() => !user && onRequireLogin()} 
                        activeMenuId={activeMenuPostId} setActiveMenuId={setActiveMenuPostId}
                        currentUserId={user?.id} onDeleteRequest={handleRequestDelete}
                        onReport={() => handleReportClick(post.id)} 
                        onOpenComments={() => user ? setCommentPostId(post.id) : onRequireLogin()}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 px-4"><p className="text-gray-400">Nenhum post no momento em {currentNeighborhood === 'Jacarepaguá (todos)' ? 'Jacarepaguá' : currentNeighborhood}.</p></div>
                )}
                </div>
            </div>
          </div>
        );
      case 'explore': return <CommunityExploreScreen />;
      case 'jobs': return <JobsFeedScreen user={user} onRequireLogin={onRequireLogin} />;
      case 'profile': return <UserProfileScreen user={user} />;
      case 'notifications': return <ActivityScreen onClose={() => setInternalView('home')} />;
      case 'create_post': return <CreatePostScreen onClose={() => setInternalView('home')} onSuccess={handlePostSuccess} user={user} />;
      case 'direct':
        if (!user) return <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6"><div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4"><UserIcon className="w-8 h-8 text-gray-400" /></div><h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Faça login</h3><button onClick={onRequireLogin} className="bg-[#1E5BFF] text-white font-bold py-3 px-8 rounded-full shadow-lg">Entrar</button></div>;
        if (selectedChatId) return <ChatScreen chatId={selectedChatId} onBack={() => setSelectedChatId(null)} user={user} />;
        return <div className="w-full bg-white dark:bg-gray-900 pb-24"><div className="px-4 pt-4 pb-2"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Buscar conversa..." className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm" /></div></div><div className="px-4 py-2"><h3 className="font-bold text-gray-900 dark:text-white text-sm">Mensagens</h3></div><div className="w-full flex-1">{MOCK_CHATS.map(chat => (<div key={chat.id} onClick={() => setSelectedChatId(chat.id)} className="w-full flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"><div className="relative flex-shrink-0"><img src={chat.avatar} className="w-12 h-12 rounded-full object-cover" /></div><div className="flex-1 min-w-0"><div className="flex justify-between items-center mb-0.5"><h4 className={`text-sm truncate pr-2 flex items-center gap-1 ${chat.unread ? 'font-bold' : ''}`}>{chat.user}</h4><span className="text-[10px] whitespace-nowrap text-gray-400">{chat.time}</span></div><p className="text-xs truncate">{chat.lastMsg}</p></div></div>))}</div></div>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans pb-24 animate-in slide-in-from-right duration-300 relative">
      {(internalView === 'home' || internalView === 'jobs' || internalView === 'explore') && (
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md h-14 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4">
          <button onClick={handleCreatePost} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><Plus className="w-6 h-6 text-gray-900 dark:text-white" /></button>
          <button onClick={toggleSelector} className="flex flex-col items-center flex-1">
            <h1 className="font-bold text-lg text-gray-900 dark:text-white font-display flex items-center gap-1 text-center">Feed da Localizei JPA</h1>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
                <MapPin className="w-2.5 h-2.5" />
                <span>{currentNeighborhood === 'Jacarepaguá (todos)' ? 'Todo Bairro' : currentNeighborhood}</span>
                <ChevronDown className="w-2.5 h-2.5" />
            </div>
          </button>
          <button onClick={handleNotifications} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"><Heart className="w-6 h-6 text-gray-900 dark:text-white" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span></button>
        </div>
      )}
      {internalView !== 'create_post' && internalView !== 'notifications' && (
        <CommunityNavBar currentView={internalView} onChangeView={handleViewChange} userAvatar={user?.user_metadata?.avatar_url} hasUnreadMessages={true} />
      )}
      <div className="p-0 relative w-full">{renderContent()}</div>
      
      {viewingStoryIndex !== null && <StoryViewer initialStoryIndex={viewingStoryIndex} onClose={() => setViewingStoryIndex(null)} />}
      
      {postToDelete && <DeleteConfirmationModal onConfirm={handleConfirmDelete} onCancel={() => setPostToDelete(null)} />}
      
      {commentPostId && <CommentsModal postId={commentPostId} onClose={() => setCommentPostId(null)} user={user} />}
      
      <ReportModal isOpen={!!reportPostId} onClose={() => setReportPostId(null)} onSubmit={handleReportSubmit} />

      {showSuccessToast && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg z-[100] animate-in fade-in slide-in-from-top-4 flex items-center gap-2"><Check className="w-4 h-4" /><span className="text-sm font-bold">{toastMessage}</span></div>}
    </div>
  );
};

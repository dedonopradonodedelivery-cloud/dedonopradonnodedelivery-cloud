
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
   return <div onClick={onClose} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center text-white p-6 text-center">Story Viewer Mode<br/>(Clique para fechar)</div>;
};

const DeleteConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm shadow-2xl">
          <h3 className="font-bold text-lg dark:text-white mb-2">Excluir publicação?</h3>
          <p className="text-gray-500 text-sm mb-6">Essa ação não pode ser desfeita.</p>
          <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg">Cancelar</button>
              <button onClick={onConfirm} className="flex-1 py-3 text-white font-bold bg-red-500 rounded-lg">Excluir</button>
          </div>
      </div>
  </div>
);

const ChatScreen: React.FC<{ chatId: number; onBack: () => void; user: any }> = ({ onBack }) => <div onClick={onBack} className="p-4 bg-white h-full">Chat Mock (Clique para voltar)</div>;

const CreatePostScreen: React.FC<{ onClose: () => void; onSuccess: () => void; user: any }> = ({ onClose, onSuccess }) => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
            <button onClick={onClose}><X className="w-6 h-6 dark:text-white" /></button>
            <h3 className="font-bold dark:text-white">Nova Publicação</h3>
            <button onClick={onSuccess} className="text-[#1E5BFF] font-bold">Publicar</button>
        </div>
        <div className="p-4"><textarea placeholder="O que está acontecendo no seu bairro?" className="w-full h-32 outline-none dark:bg-gray-900 dark:text-white resize-none" /></div>
    </div>
);

const ActivityScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => <div onClick={onClose} className="p-4 bg-white h-full">Notificações Mock (Clique para fechar)</div>;
const UserProfileScreen: React.FC<{ user: any }> = () => <div className="p-4">Perfil Mock</div>;
const CommunityExploreScreen: React.FC = () => <div className="p-4">Explorar Mock</div>;

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
            <div className="grid grid-cols-2 gap-3 mt-6">
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
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm uppercase tracking-widest">Descrição</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{job.description}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm uppercase tracking-widest">Requisitos</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
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

// --- MAIN COMPONENT ---
/**
 * CommunityFeedView Component
 * Provides a localized social hub for Jacarepaguá, allowing users to interact with posts and browse job opportunities.
 */
export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ onStoreClick, user, onRequireLogin }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'jobs'>('feed');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isReporting, setIsReporting] = useState<string | null>(null);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const { currentNeighborhood, isAll } = useNeighborhood();

  // Optimized filtering based on selected neighborhood context
  const filteredPosts = useMemo(() => {
    return MOCK_COMMUNITY_POSTS.filter(post => isAll || post.neighborhood === currentNeighborhood);
  }, [currentNeighborhood, isAll]);

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => isAll || job.neighborhood === currentNeighborhood);
  }, [currentNeighborhood, isAll]);

  const filteredStories = useMemo(() => {
    return MOCK_STORIES.filter(story => isAll || story.neighborhood === currentNeighborhood);
  }, [currentNeighborhood, isAll]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 font-sans animate-in fade-in duration-500">
      {/* Dynamic Stories Row */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-4 shadow-sm">
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar items-center">
          {/* Creator Entry Point */}
          <button 
            onClick={user ? () => {} : onRequireLogin} 
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group active:scale-95 transition-transform"
          >
            <div className="w-[60px] h-[60px] rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E5BFF] border-2 border-dashed border-[#1E5BFF]/30 group-hover:border-[#1E5BFF] transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">Postar</span>
          </button>

          {/* User & Merchant Stories */}
          {filteredStories.map((story, idx) => (
            <button 
              key={story.id} 
              onClick={() => setStoryIndex(idx)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group active:scale-95 transition-transform"
            >
              <div className={`p-0.5 rounded-full border-2 transition-all duration-300 ${story.hasUnread ? 'border-[#1E5BFF]' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="w-[56px] h-[56px] rounded-full overflow-hidden bg-gray-100 p-0.5 border border-white dark:border-gray-900">
                  <img src={story.avatar} className="w-full h-full rounded-full object-cover" alt={story.user} />
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-400 truncate w-16 text-center tracking-tight">
                {story.user.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Switcher - Visual consistency with app theme */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex shadow-sm">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
            activeTab === 'feed' ? 'text-[#1E5BFF]' : 'text-gray-400'
          }`}
        >
          Feed
          {activeTab === 'feed' && (
            <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-[#1E5BFF] rounded-t-full"></div>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
            activeTab === 'jobs' ? 'text-[#1E5BFF]' : 'text-gray-400'
          }`}
        >
          Empregos
          {activeTab === 'jobs' && (
            <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-[#1E5BFF] rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Content Stream */}
      <div className="p-4 space-y-4 max-w-md mx-auto">
        {activeTab === 'feed' ? (
          filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-[2rem] p-5 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Profile Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={post.userAvatar} className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700" alt="" />
                      {post.authorRole === 'merchant' && (
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm">
                          <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-blue-50 dark:fill-gray-900" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                          {post.userName}
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                        {post.neighborhood} • {post.timestamp}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsReporting(post.id)} 
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors active:scale-90"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Post Content */}
                <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {post.content}
                </p>
                
                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden mb-4 border border-gray-50 dark:border-gray-700 shadow-sm">
                    <img src={post.imageUrl} className="w-full h-auto max-h-80 object-cover" alt="" loading="lazy" />
                  </div>
                )}

                {/* Integrated Store Link */}
                {post.relatedStoreId && (
                  <button 
                    onClick={() => onStoreClick({ id: post.relatedStoreId } as Store)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] rounded-xl text-xs font-bold mb-4 border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 transition-colors w-fit"
                  >
                    <StoreIcon className="w-3.5 h-3.5" />
                    Sobre: {post.relatedStoreName}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}

                {/* Social Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                  <button className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-red-500 transition-all group">
                    <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                      <Heart className="w-4 h-4" />
                    </div>
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#1E5BFF] transition-all group">
                    <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#1E5BFF] transition-all group ml-auto">
                    <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center flex flex-col items-center animate-in fade-in duration-700">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Home className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-bold">Nenhuma publicação por aqui ainda.</p>
              <p className="text-xs text-gray-400 mt-1">Mude o filtro de bairro no topo da tela!</p>
            </div>
          )
        ) : (
          /* Job Board View */
          filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div 
                key={job.id} 
                onClick={() => setSelectedJob(job)}
                className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group hover:border-[#1E5BFF]/30"
              >
                {job.isUrgent && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
                    Urgente
                  </div>
                )}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-[#1E5BFF] mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{job.type}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight group-hover:text-[#1E5BFF] transition-colors">{job.role}</h3>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">{job.company}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase rounded-lg border border-gray-100 dark:border-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.neighborhood}
                  </span>
                  {job.salary && (
                    <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase rounded-lg border border-emerald-100 dark:border-emerald-800 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> {job.salary}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {job.postedAt}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#1E5BFF] group-hover:translate-x-1 transition-transform">
                    Ver Detalhes
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center flex flex-col items-center animate-in fade-in duration-700">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-bold">Nenhuma vaga encontrada no momento.</p>
              <p className="text-xs text-gray-400 mt-1">Tente conferir os empregos em todo o Jacarepaguá.</p>
            </div>
          )
        )}
      </div>

      {/* Layered Overlays */}
      {selectedJob && (
        <FeedJobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
      
      {isReporting && (
        <ReportModal 
          isOpen={!!isReporting} 
          onClose={() => setIsReporting(null)} 
          onSubmit={(reason) => {
            alert(`Sua denúncia por "${reason}" foi enviada. Nossa equipe irá analisar o conteúdo. Obrigado por ajudar a manter o Localizei JPA seguro.`);
            setIsReporting(null);
          }} 
        />
      )}

      {storyIndex !== null && (
        <StoryViewer initialStoryIndex={storyIndex} onClose={() => setStoryIndex(null)} />
      )}
      
      {/* Primary Action FAB */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-28 right-6 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-center text-[#1E5BFF] animate-in fade-in zoom-in duration-300 z-40 active:scale-90 transition-transform"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};


import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronDown, 
  MoreHorizontal, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Users, 
  Plus, 
  Check, 
  BadgeCheck,
  ArrowRight
} from 'lucide-react';
import { NeighborhoodCommunity, CommunityPost } from '../types';
import { NEIGHBORHOOD_COMMUNITIES, MOCK_COMMUNITY_POSTS } from '../constants';

interface CommunityFeedViewProps {
  user: any;
  onRequireLogin: () => void;
}

const CommunityCard: React.FC<{ community: NeighborhoodCommunity; onClick: () => void }> = ({ community, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full relative aspect-[16/10] rounded-[2rem] overflow-hidden shadow-xl shadow-black/5 group active:scale-[0.98] transition-all"
  >
    <img 
      src={community.image} 
      alt={community.name} 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
    />
    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent`}></div>
    
    <div className="absolute inset-0 p-6 flex flex-col justify-end">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${community.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
        {React.cloneElement(community.icon as any, { size: 24 })}
      </div>
      <div>
        <h3 className="font-black text-2xl text-white uppercase leading-tight tracking-tight mb-1">{community.name}</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white/80 flex items-center gap-1 uppercase tracking-widest">
            <Users size={14}/> {community.membersCount} vizinhos
          </span>
          <ArrowRight className="text-[#1E5BFF] w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
        </div>
      </div>
    </div>
  </button>
);

const FeedPost: React.FC<{ post: CommunityPost }> = ({ post }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pb-4 mb-2 w-full">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600">
            <div className="w-full h-full rounded-full border border-white dark:border-black overflow-hidden bg-gray-100">
              <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1">
              {post.userName}
              {post.authorRole === 'merchant' && <BadgeCheck className="w-4 h-4 text-[#1E5BFF] fill-white" />}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{post.neighborhood} • {post.timestamp}</p>
          </div>
        </div>
        <button className="text-gray-400 p-1"><MoreHorizontal size={20} /></button>
      </div>

      {post.imageUrl && (
        <div className="w-full aspect-square bg-gray-50 dark:bg-gray-800">
          <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setLiked(!liked)} className="active:scale-125 transition-transform">
            <Heart size={26} className={liked ? "fill-red-500 text-red-500" : "text-gray-900 dark:text-white"} />
          </button>
          <button><MessageCircle size={26} className="text-gray-900 dark:text-white" /></button>
          <button><Send size={26} className="text-gray-900 dark:text-white -rotate-12" /></button>
        </div>
        <button><Bookmark size={26} className="text-gray-900 dark:text-white" /></button>
      </div>

      <div className="px-4 pt-3 space-y-1.5">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{post.likes + (liked ? 1 : 0)} curtidas</p>
        <p className="text-sm text-gray-800 dark:text-gray-200">
          <span className="font-bold mr-2">{post.userName}</span>
          {post.content}
        </p>
        <button className="text-xs text-gray-400 font-medium mt-1">Ver todos os {post.comments} comentários</button>
      </div>
    </div>
  );
};

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ onRequireLogin }) => {
  const [activeCommunityId, setActiveCommunityId] = useState<string | null>(null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const activeCommunity = useMemo(() => 
    NEIGHBORHOOD_COMMUNITIES.find(c => c.id === activeCommunityId), 
    [activeCommunityId]
  );

  const filteredPosts = useMemo(() => 
    MOCK_COMMUNITY_POSTS.filter(p => p.communityId === activeCommunityId), 
    [activeCommunityId]
  );

  const handleSelectCommunity = (id: string) => {
    setActiveCommunityId(id);
    setIsSwitcherOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- RENDER HUB (Nenhuma comunidade selecionada) ---
  if (!activeCommunityId) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pb-32 animate-in fade-in duration-500">
        <div className="px-5 pt-8 mb-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white font-display leading-tight uppercase tracking-tighter">
            Comunidades <br/>
            <span className="text-[#1E5BFF]">da Freguesia</span>
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-2">Escolha um assunto e participe da conversa.</p>
        </div>

        <div className="px-5 space-y-6">
          {NEIGHBORHOOD_COMMUNITIES.map((comm) => (
            <CommunityCard 
              key={comm.id} 
              community={comm} 
              onClick={() => handleSelectCommunity(comm.id)} 
            />
          ))}
        </div>

        {/* Footer info/cta */}
        <div className="px-5 mt-12 pb-10">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-8 text-center border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users className="text-[#1E5BFF]" size={32} />
            </div>
            <h4 className="font-black text-lg text-gray-900 dark:text-white uppercase leading-tight">Sugerir um grupo</h4>
            <p className="text-sm text-gray-500 mt-2 mb-6">Sente falta de algum assunto específico no bairro? Sugira para a moderação.</p>
            <button className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all">
                Enviar Sugestão
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER EXCLUSIVE FEED ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32 animate-in fade-in duration-300">
      {/* Sticky Header with Switcher */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveCommunityId(null)} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
          </button>
          <button 
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="flex items-center gap-1.5 active:opacity-70 transition-opacity"
          >
            <h2 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tight">
              {activeCommunity?.name}
            </h2>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <button className="bg-[#1E5BFF] text-white p-2 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
          <Plus size={20} strokeWidth={3} />
        </button>
      </header>

      {/* Switcher Modal/Dropdown */}
      {isSwitcherOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={() => setIsSwitcherOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-8" />
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase mb-6 px-2">Trocar Comunidade</h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
              {NEIGHBORHOOD_COMMUNITIES.map(comm => (
                <button 
                  key={comm.id} 
                  onClick={() => handleSelectCommunity(comm.id)}
                  className={`w-full p-5 rounded-[1.5rem] border text-left transition-all flex items-center gap-4 ${
                    activeCommunityId === comm.id 
                      ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white' 
                      : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-900 dark:text-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activeCommunityId === comm.id ? 'bg-white/20' : 'bg-white shadow-sm text-[#1E5BFF]'
                  }`}>
                    {React.cloneElement(comm.icon as any, { size: 20 })}
                  </div>
                  <span className="font-bold uppercase text-sm tracking-tight">{comm.name}</span>
                  {activeCommunityId === comm.id && <Check className="ml-auto w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="flex flex-col">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <FeedPost key={post.id} post={post} />
          ))
        ) : (
          <div className="py-20 text-center px-10">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-gray-300" size={32} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Ainda não há posts aqui</h3>
            <p className="text-sm text-gray-500 mt-2">Seja o primeiro a publicar nesta comunidade!</p>
          </div>
        )}
      </div>
    </div>
  );
};

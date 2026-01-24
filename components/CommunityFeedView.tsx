
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Heart, 
  MessageSquare, 
  Plus, 
  Users,
  ChevronRight,
  MessageCircle,
  LayoutGrid,
  HeartHandshake,
  ShieldCheck,
  X,
  PlusCircle,
  Hash,
  AlertCircle,
  Share2
} from 'lucide-react';
import { NeighborhoodCommunity, CommunityPost } from '../types';
import { OFFICIAL_COMMUNITIES, MOCK_USER_COMMUNITIES, MOCK_COMMUNITY_POSTS } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

interface CommunityFeedViewProps {
  user: any;
  onRequireLogin: () => void;
  onNavigate: (view: string) => void;
  onStoreClick: (store: any) => void;
}

// --- 1. CARD DE COMUNIDADE (REFINADO) ---
const CommunityCard: React.FC<{ 
  community: NeighborhoodCommunity; 
  onOpen: () => void;
}> = ({ community, onOpen }) => (
  <div 
    onClick={onOpen}
    className="flex-shrink-0 w-[142px] bg-white dark:bg-gray-900 rounded-[28px] p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all group"
  >
    <div className={`w-14 h-14 rounded-2xl ${community.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
      <div className="text-[#1E5BFF]">
        {React.cloneElement(community.icon as any, { size: 32, strokeWidth: 2.5 })}
      </div>
    </div>
    
    <div className="flex-1 min-h-[40px] flex flex-col justify-center">
      <h4 className="text-[12px] font-bold text-gray-900 dark:text-white leading-tight uppercase tracking-tight line-clamp-2">
        {community.name}
      </h4>
    </div>

    {community.type === 'official' ? (
      <div className="flex items-center gap-1 mt-2 mb-3 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
        <ShieldCheck size={10} className="text-[#1E5BFF]" />
        <p className="text-[8px] font-black text-[#1E5BFF] uppercase tracking-widest">Oficial</p>
      </div>
    ) : (
      <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-2 mb-3">
        {community.membersCount} membros
      </p>
    )}
    
    <button className="w-full py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-[9px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest group-hover:bg-[#1E5BFF] group-hover:text-white transition-colors">
        Entrar
    </button>
  </div>
);

// --- 2. POST DO FEED (REFINADO) ---
const CommunityPostCard: React.FC<{ post: CommunityPost; communityName: string }> = ({ post, communityName }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm shrink-0">
            <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-bold text-[13px] text-gray-900 dark:text-white leading-none">{post.userName}</h4>
                <span className="text-gray-300 text-xs">em</span>
                <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-tight bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-md truncate max-w-[100px]">{communityName}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-1">há {post.timestamp}</p>
          </div>
        </div>
        <button className="p-2 text-gray-300 hover:text-gray-500 transition-colors">
            <MoreHorizontal size={20} />
        </button>
      </div>

      <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed mb-5 font-medium">
        {post.content}
      </p>

      {post.imageUrl && (
        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-5 border border-gray-50 dark:border-gray-800 shadow-inner">
            <img src={post.imageUrl} className="w-full h-full object-cover" alt="Post content" />
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-6">
            <button 
              onClick={() => setLiked(!liked)} 
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-125 ${liked ? 'text-rose-500' : 'text-gray-400'}`}
            >
                <Heart size={18} className={liked ? 'fill-current' : ''} /> {liked ? post.likes + 1 : post.likes}
            </button>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#1E5BFF]">
                <MessageSquare size={18} /> {post.comments}
            </button>
        </div>
        <button className="text-gray-300 hover:text-[#1E5BFF] transition-colors">
            <Share2 size={16} />
        </button>
      </div>
    </div>
  );
};

// --- 3. MODAL CRIAÇÃO COMUNIDADE (REFINADO) ---
const CreateCommunityModal: React.FC<{ 
  onClose: () => void; 
  onCreate: (name: string, desc: string) => void;
}> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    
    const isOfficialName = OFFICIAL_COMMUNITIES.some(
      comm => comm.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (isOfficialName) {
      setError('Este nome já está em uso por uma comunidade oficial.');
      return;
    }

    onCreate(name.trim(), desc.trim());
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Criar Comunidade</h2>
          <button onClick={onClose} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nome da Comunidade</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="Ex: Vizinhos da Rua Araguaia"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#1E5BFF] p-4 rounded-2xl outline-none transition-all dark:text-white font-bold"
            />
            {error && (
              <div className="flex items-center gap-1.5 text-rose-500 mt-2 ml-1">
                <AlertCircle size={12} />
                <p className="text-[10px] font-bold">{error}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">O que se fala aqui?</label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Descreva brevemente o propósito do grupo..."
              rows={3}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#1E5BFF] p-4 rounded-2xl outline-none transition-all dark:text-white resize-none font-medium"
            />
          </div>

          <div className="pt-4">
            <button 
              onClick={handleCreate}
              disabled={!name.trim()}
              className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              CRIAR COMUNIDADE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ user, onRequireLogin, onNavigate, onStoreClick }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [activeCommunity, setActiveCommunity] = useState<NeighborhoodCommunity | null>(null);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [isViewingAllCommunities, setIsViewingAllCommunities] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [userCreatedComms, setUserCreatedComms] = useState<NeighborhoodCommunity[]>(() => {
    const saved = localStorage.getItem('user_comms_jpa');
    return saved ? JSON.parse(saved).map((c: any) => ({
      ...c,
      icon: <Hash /> 
    })) : MOCK_USER_COMMUNITIES;
  });

  useEffect(() => {
    localStorage.setItem('user_comms_jpa', JSON.stringify(userCreatedComms.map(c => ({...c, icon: 'Hash'}))));
  }, [userCreatedComms]);

  const handleCreateCommunity = (name: string, desc: string) => {
    if (!user) {
      onRequireLogin();
      return;
    }
    const newComm: NeighborhoodCommunity = {
      id: `user-comm-${Date.now()}`,
      name,
      description: desc,
      membersCount: '1',
      color: 'bg-indigo-500',
      icon: <Hash />,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop',
      type: 'user'
    };
    setUserCreatedComms([newComm, ...userCreatedComms]);
    setIsCreating(false);
    setActiveCommunity(newComm);
  };

  const feedPosts = useMemo(() => {
    return showAllPosts ? MOCK_COMMUNITY_POSTS : MOCK_COMMUNITY_POSTS.slice(0, 10);
  }, [showAllPosts]);

  if (isViewingAllCommunities) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-500">
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
            <button onClick={() => setIsViewingAllCommunities(false)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <div className="flex-1">
                <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">Comunidades</h1>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">{currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}</p>
            </div>
        </div>

        <div className="p-6 space-y-10">
            <section>
              <div className="flex items-center gap-2 mb-5 px-1">
                <ShieldCheck size={16} className="text-[#1E5BFF]" />
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Canais Oficiais</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  {OFFICIAL_COMMUNITIES.map((comm) => (
                      <CommunityCard key={comm.id} community={comm} onOpen={() => { setActiveCommunity(comm); setIsViewingAllCommunities(false); }} />
                  ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-5 px-1">
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-emerald-500" />
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Criadas por moradores</h3>
                  </div>
                  <button onClick={() => setIsCreating(true)} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/30 active:scale-95 transition-all">
                    <Plus size={12} strokeWidth={3} /> Criar
                  </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  {userCreatedComms.map((comm) => (
                      <CommunityCard key={comm.id} community={comm} onOpen={() => { setActiveCommunity(comm); setIsViewingAllCommunities(false); }} />
                  ))}
              </div>
            </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500 overflow-x-hidden">
      
      {/* 1. HERO BANNER (REFINADO) */}
      <section className="px-5 pt-6 mb-12">
        <div className="w-full aspect-[16/8.5] bg-gradient-to-br from-[#A5C6FF] via-[#D6E6FF] to-[#F0F5FF] dark:from-blue-900/20 dark:via-blue-800/10 dark:to-gray-950 rounded-[36px] relative overflow-hidden shadow-sm border-2 border-white dark:border-gray-800 p-8 flex items-center justify-between">
            <div className="relative z-10 flex-1">
                <div className="bg-white/40 dark:bg-blue-500/20 backdrop-blur-sm w-fit px-3 py-1 rounded-full mb-4 border border-white/40">
                  <span className="text-[10px] font-black text-blue-800 dark:text-blue-200 uppercase tracking-widest">Conversa Local</span>
                </div>
                <h2 className="text-[26px] font-black text-blue-950 dark:text-white leading-tight font-display tracking-tight uppercase">
                    Onde o bairro <br/> <span className="text-[#1E5BFF]">conversa</span>
                </h2>
                <p className="text-xs text-blue-700/80 dark:text-blue-300 font-bold mt-3 max-w-[200px] leading-snug">
                    Dicas, achados e conexões reais entre vizinhos de Jacarepaguá.
                </p>
            </div>
            
            <div className="relative flex items-center justify-center h-full w-24 shrink-0 animate-float-slow opacity-60 dark:opacity-40">
                <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-800 p-2.5 rounded-2xl shadow-lg border border-blue-50">
                    <MessageCircle className="w-6 h-6 text-[#1E5BFF]" fill="currentColor" />
                </div>
                <div className="absolute top-8 left-0 bg-blue-500 p-2.5 rounded-2xl shadow-lg border border-white">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 right-3 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-blue-50">
                    <HeartHandshake className="w-5 h-5 text-rose-400" />
                </div>
            </div>
        </div>

        {/* PROFILE MINI CARD (GLASSMOPRHISM REFINADO) */}
        <div className="mt-[-32px] px-6 relative z-20">
            <div className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl rounded-[28px] p-3.5 shadow-xl shadow-blue-950/5 border border-white/60 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm shrink-0">
                        <img src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?u=paula"} className="w-full h-full object-cover" alt="User avatar" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-[12px] leading-none">{user?.user_metadata?.full_name || 'Explorador Local'}</h3>
                        <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.15em] mt-1">{currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood} • Online</p>
                    </div>
                </div>
                <button 
                    onClick={() => onNavigate('edit_profile')}
                    className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-[#1E5BFF] transition-all border border-gray-100 dark:border-gray-700 active:scale-95"
                >
                    Perfil
                </button>
            </div>
        </div>
      </section>

      {/* 2. SEÇÃO COMUNIDADES (VISUAL REFINADO) */}
      <section className="mb-14">
        <div className="px-6 mb-6">
            <div className="flex items-center justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.25em] mb-1.5 opacity-80">Comunidades Ativas</p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white font-display tracking-tight uppercase leading-none">O que te interessa?</h3>
                </div>
                <button onClick={() => setIsViewingAllCommunities(true)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1E5BFF] flex items-center gap-1.5 transition-all group pb-1">
                  Ver todas <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4">
            {OFFICIAL_COMMUNITIES.map((comm) => (
                <CommunityCard key={comm.id} community={comm} onOpen={() => setActiveCommunity(comm)} />
            ))}
            <div 
              onClick={() => setIsCreating(true)}
              className="flex-shrink-0 w-[142px] bg-gray-50 dark:bg-gray-800/30 rounded-[28px] p-5 border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-all hover:bg-white dark:hover:bg-gray-800 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-300 group-hover:text-[#1E5BFF] transition-colors shadow-sm">
                <Plus size={24} strokeWidth={3} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">Criar Grupo</p>
            </div>
        </div>
      </section>

      {/* 3. FEED DE CONVERSAS (REFINADO) */}
      <section className="px-5">
        <div className="px-2 mb-6">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.25em] mb-1.5">Acontecendo agora</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white font-display tracking-tight uppercase leading-none">Papo de Vizinho</h3>
        </div>

        <div className="space-y-2">
            {feedPosts.map((post) => {
                const comm = [...OFFICIAL_COMMUNITIES, ...userCreatedComms].find(c => c.id === post.communityId);
                return (
                    <CommunityPostCard 
                        key={post.id} 
                        post={post} 
                        communityName={comm?.name || 'Geral'} 
                    />
                );
            })}
        </div>

        {!showAllPosts && MOCK_COMMUNITY_POSTS.length > 10 && (
            <button 
                onClick={() => setShowAllPosts(true)}
                className="w-full mt-4 py-5 bg-white dark:bg-gray-900 rounded-[24px] border border-gray-100 dark:border-gray-800 text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.99]"
            >
                VER MAIS CONVERSAS
                <ChevronDown size={16} />
            </button>
        )}
      </section>

      {/* RODAPÉ (REFINADO) */}
      <div className="mt-24 mb-16 px-10 text-center opacity-30">
          <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] leading-relaxed">
            Jacarepaguá Conectada <br/> Localizei JPA v1.5.0
          </p>
      </div>

      {isCreating && (
        <CreateCommunityModal 
          onClose={() => setIsCreating(false)} 
          onCreate={handleCreateCommunity}
        />
      )}

      {activeCommunity && (
        <CommunityDetailView 
          community={activeCommunity} 
          onBack={() => setActiveCommunity(null)}
          onStoreClick={onStoreClick}
        />
      )}
    </div>
  );
};

// --- VIEW AUXILIAR: DETALHE DA COMUNIDADE (REFINADA) ---
const CommunityDetailView: React.FC<{ 
  community: NeighborhoodCommunity; 
  onBack: () => void;
  onStoreClick: (store: any) => void;
}> = ({ community, onBack, onStoreClick }) => {
  const posts = useMemo(() => MOCK_COMMUNITY_POSTS.filter(p => p.communityId === community.id), [community.id]);

  return (
    <div className="fixed inset-0 z-[120] bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-500">
      <div className="relative h-56 shrink-0 overflow-hidden">
        <img src={community.image} className="w-full h-full object-cover" alt={community.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FC] dark:from-gray-950 via-black/40 to-black/20"></div>
        
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-10">
          <button onClick={onBack} className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 active:scale-90 transition-transform">
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <button className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 active:scale-90 transition-transform">
            <MoreHorizontal size={24} />
          </button>
        </div>
        
        <div className="absolute bottom-8 left-8 right-8 flex items-end gap-5">
          <div className={`w-20 h-20 rounded-[32px] ${community.color} border-4 border-white dark:border-gray-900 flex items-center justify-center text-white shadow-2xl shrink-0`}>
            {React.cloneElement(community.icon as any, { size: 42, strokeWidth: 2.5 })}
          </div>
          <div className="mb-1 flex-1 min-w-0">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2 truncate">{community.name}</h2>
            <div className="flex items-center gap-2">
              {community.type === 'official' && (
                <div className="flex items-center gap-1.5 bg-[#1E5BFF] px-2.5 py-1 rounded-full shadow-lg">
                  <ShieldCheck size={12} className="text-white" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Oficial</span>
                </div>
              )}
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{community.membersCount} participantes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-2 pb-32">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-[24px] border border-gray-100 dark:border-gray-800 mb-8 shadow-sm">
           <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Descrição do Grupo</h5>
           <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed px-1">
             {community.description}
           </p>
        </div>

        {posts.length > 0 ? (
          posts.map(post => (
            <CommunityPostCard key={post.id} post={post} communityName={community.name} />
          ))
        ) : (
          <div className="py-24 flex flex-col items-center opacity-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-6">
              <MessageCircle size={40} className="text-gray-400" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] leading-relaxed">O papo ainda não começou.<br/>Inicie a conversa!</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-10 left-0 right-0 px-6 z-50 flex justify-center max-w-md mx-auto">
          <button className="w-full py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 border-4 border-white dark:border-gray-900 active:scale-95 transition-all uppercase tracking-widest text-sm">
              <PlusCircle size={24} strokeWidth={2.5} />
              Nova Publicação
          </button>
      </div>
    </div>
  );
};

const ChevronDown = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

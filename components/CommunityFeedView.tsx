
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Users, 
  Plus, 
  Check, 
  BadgeCheck,
  ArrowRight,
  Vote,
  Crown,
  PlusCircle,
  Camera,
  MapPin,
  Clock
} from 'lucide-react';
import { NeighborhoodCommunity, CommunityPost, CommunitySuggestion } from '../types';
import { NEIGHBORHOOD_COMMUNITIES, MOCK_COMMUNITY_POSTS } from '../constants';

interface CommunityFeedViewProps {
  user: any;
  onRequireLogin: () => void;
  onStoreClick?: (store: any) => void;
  onNavigate: (view: string) => void;
}

const CommunityCard: React.FC<{ 
  community: NeighborhoodCommunity; 
  isJoined: boolean; 
  onAction: () => void;
}> = ({ community, isJoined, onAction }) => (
  <div className="w-full bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-gray-100 dark:border-gray-800 transition-all mb-6">
    <button 
      onClick={onAction}
      className="w-full relative aspect-[16/9] overflow-hidden group active:scale-[0.99] transition-transform"
    >
      <img 
        src={community.image} 
        alt={community.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      
      <div className="absolute inset-0 p-6 flex flex-col justify-end text-left">
        <div className={`w-10 h-10 rounded-2xl ${community.color} flex items-center justify-center text-white mb-3 shadow-lg`}>
          {React.cloneElement(community.icon as any, { size: 20 })}
        </div>
        <div>
          <h3 className="font-black text-2xl text-white uppercase leading-tight tracking-tighter mb-1">{community.name}</h3>
          <span className="text-[10px] font-bold text-white/70 flex items-center gap-1 uppercase tracking-widest">
            <Users size={12}/> {community.membersCount} vizinhos
          </span>
        </div>
      </div>
    </button>
    
    <div className="px-6 py-5 bg-white dark:bg-gray-900 flex items-center justify-between">
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1 max-w-[55%]">
        {community.description}
      </p>
      <button 
        onClick={(e) => { e.stopPropagation(); onAction(); }}
        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
          isJoined 
            ? 'bg-blue-50 dark:bg-blue-900/30 text-[#1E5BFF] border border-blue-100 dark:border-blue-800' 
            : 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20'
        }`}
      >
        {isJoined ? <><Check size={12} strokeWidth={3} /> Ver Feed</> : <><Plus size={12} strokeWidth={3} /> Participar</>}
      </button>
    </div>
  </div>
);

const FeedPost: React.FC<{ post: CommunityPost }> = ({ post }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 pb-6 w-full animate-in fade-in duration-500">
      {/* Header do Post */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600">
            <div className="w-full h-full rounded-full border-2 border-white dark:border-black overflow-hidden bg-gray-100">
              <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1">
              {post.userName}
              {post.authorRole === 'merchant' && <BadgeCheck className="w-4 h-4 text-[#1E5BFF] fill-white" />}
            </h4>
            <div className="flex items-center gap-1.5">
              <p className="text-[9px] text-[#1E5BFF] font-black uppercase tracking-widest">{post.neighborhood || 'Freguesia'}</p>
              <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{post.timestamp}</p>
            </div>
          </div>
        </div>
        <button className="text-gray-400 p-2"><MoreHorizontal size={20} /></button>
      </div>

      {/* Imagem Obrigatória */}
      <div className="w-full aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <img 
          src={post.imageUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop'} 
          alt="Post content" 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Ações */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button onClick={() => setLiked(!liked)} className="active:scale-125 transition-transform outline-none">
            <Heart size={28} className={liked ? "fill-red-500 text-red-500" : "text-gray-900 dark:text-white"} />
          </button>
          <button className="outline-none"><MessageCircle size={28} className="text-gray-900 dark:text-white" /></button>
          <button className="outline-none"><Send size={28} className="text-gray-900 dark:text-white -rotate-12 translate-y-[-2px]" /></button>
        </div>
        <button className="outline-none"><Bookmark size={28} className="text-gray-900 dark:text-white" /></button>
      </div>

      {/* Info de Engajamento e Texto */}
      <div className="px-4 pt-4 space-y-2">
        <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight">
          {post.likes + (liked ? 1 : 0)} vizinhos curtiram
        </p>
        <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
          <span className="font-black mr-2 tracking-tight">{post.userName}</span>
          {post.content}
        </div>
        <button className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 block">
          Ver todos os {post.comments} comentários
        </button>
      </div>
    </div>
  );
};

const CommunityDetailFeed: React.FC<{ 
  community: NeighborhoodCommunity; 
  onBack: () => void;
}> = ({ community, onBack }) => {
  // Filtrar posts específicos desta comunidade
  const posts = useMemo(() => {
    return MOCK_COMMUNITY_POSTS.filter(p => p.communityId === community.id);
  }, [community.id]);

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header do Feed da Comunidade */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 h-16 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg ${community.color} flex items-center justify-center text-white shadow-sm`}>
                {React.cloneElement(community.icon as any, { size: 16, strokeWidth: 3 })}
            </div>
            <div>
              <h2 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight leading-none">{community.name}</h2>
              <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1">Online agora</p>
            </div>
          </div>
        </div>
        <button className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400">
          <Camera size={20} />
        </button>
      </div>

      {/* Feed Vertical */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Banner do Topo */}
        <div className="relative w-full h-32 overflow-hidden shrink-0">
           <img src={community.image} className="w-full h-full object-cover brightness-50" />
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <p className="text-[10px] text-white/70 font-black uppercase tracking-[0.2em] mb-1">Membro da Comunidade</p>
              <h3 className="text-white font-black text-xl uppercase tracking-tighter">{community.name}</h3>
           </div>
        </div>

        {posts.length > 0 ? (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {posts.map(post => <FeedPost key={post.id} post={post} />)}
            {/* Mock extra posts if the community is empty just for visual */}
            {posts.length < 2 && MOCK_COMMUNITY_POSTS.slice(0, 3).map((p, i) => (
               <FeedPost key={`extra-${i}`} post={{...p, communityId: community.id, id: `ext-${i}`}} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-10 text-center">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] flex items-center justify-center mb-6 text-[#1E5BFF]">
                <PlusCircle size={32} />
            </div>
            <h3 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tight">Comece a conversa!</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed mt-2">
              Seja o primeiro a postar algo legal aqui na comunidade de {community.name}.
            </p>
            <button className="mt-8 bg-[#1E5BFF] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                Nova Publicação
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ user, onRequireLogin, onNavigate }) => {
  const [activeCommunity, setActiveCommunity] = useState<NeighborhoodCommunity | null>(null);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  
  // Lista de IDs das comunidades que o usuário participa
  const [joinedIds, setJoinedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('joined_communities_jpa');
    return saved ? JSON.parse(saved) : [];
  });

  const [suggestions, setSuggestions] = useState<CommunitySuggestion[]>(() => {
    const saved = localStorage.getItem('neighborhood_suggestions');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Aluguel & Imóveis', votes: 142, status: 'approved', creatorId: 'sys', voterIds: [] },
      { id: '2', name: 'Brechós da Freguesia', votes: 89, status: 'approved', creatorId: 'sys', voterIds: [] },
      { id: '3', name: 'Segurança & Alertas', votes: 256, status: 'approved', creatorId: 'sys', voterIds: [] }
    ];
  });

  useEffect(() => {
    localStorage.setItem('joined_communities_jpa', JSON.stringify(joinedIds));
  }, [joinedIds]);

  useEffect(() => {
    localStorage.setItem('neighborhood_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  // Filtro: Somente comunidades com imagem e que existem no cadastro
  const visibleCommunities = useMemo(() => 
    NEIGHBORHOOD_COMMUNITIES.filter(c => c.image && c.image.trim() !== ''),
    []
  );

  const handleActionCommunity = (comm: NeighborhoodCommunity) => {
    if (!user) { onRequireLogin(); return; }
    
    // Entrar na comunidade (se não for membro, torna-se membro automaticamente)
    if (!joinedIds.includes(comm.id)) {
        setJoinedIds(prev => [...prev, comm.id]);
    }
    
    // Navegar para o Feed Independente da Comunidade
    setActiveCommunity(comm);
  };

  const handleSendSuggestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) { onRequireLogin(); return; }

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    if (!name || name.trim().length < 3) return;

    const newSuggestion: CommunitySuggestion = {
        id: Date.now().toString(),
        name: name.trim(),
        votes: 0,
        status: 'pending', 
        creatorId: user.id,
        voterIds: []
    };

    setSuggestions(prev => [...prev, newSuggestion]);
    setIsSuggestModalOpen(false);
    alert("Sua sugestão foi enviada!");
  };

  const handleVote = (id: string) => {
    if (!user) { onRequireLogin(); return; }
    setSuggestions(prev => prev.map(s => 
        s.id === id && !s.voterIds.includes(user.id)
            ? { ...s, votes: s.votes + 1, voterIds: [...s.voterIds, user.id] } 
            : s
    ));
  };

  if (activeCommunity) {
    return <CommunityDetailFeed community={activeCommunity} onBack={() => setActiveCommunity(null)} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-32 animate-in fade-in duration-500">
      
      {/* HEADER PRINCIPAL CENTRALIZADO */}
      <div className="px-5 pt-12 mb-10 flex flex-col items-center text-center">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white font-display leading-tight uppercase tracking-tighter whitespace-nowrap">
          COMUNIDADES <span className="text-[#1E5BFF]">JPA</span>
        </h2>
        <div className="space-y-1 mt-6 max-w-[340px]">
          <p className="text-[14px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Aqui o bairro conversa por assuntos.
          </p>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Cada tema tem seu próprio espaço para trocar ideias, pedir ajuda e indicar serviços.
          </p>
          <p className="text-[14px] text-gray-700 dark:text-gray-200 font-bold leading-relaxed">
            Quando todo mundo participa, o bairro cresce junto.
          </p>
        </div>
      </div>

      {/* DESCOBERTA DE COMUNIDADES */}
      <div className="px-5 space-y-2 mb-12">
        <div className="flex items-center justify-between px-1 mb-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Descobrir Temas</h3>
          <span className="text-[10px] font-bold text-gray-400">{visibleCommunities.length} disponíveis</span>
        </div>
        <div>
          {visibleCommunities.map((comm) => (
            <CommunityCard 
              key={comm.id} 
              community={comm} 
              isJoined={joinedIds.includes(comm.id)}
              onAction={() => handleActionCommunity(comm)}
            />
          ))}
        </div>
      </div>

      {/* BLOCO DE SUGESTÕES */}
      <div className="px-5 mt-12">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-black/5">
              <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                      <PlusCircle size={22} />
                  </div>
                  <div>
                      <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider leading-none">Sugerir Novo Tema</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Próximos temas do bairro</p>
                  </div>
              </div>
              
              <div className="space-y-4">
                  {suggestions.filter(s => s.status === 'approved').map((sug) => {
                      const totalVotes = suggestions.reduce((acc, curr) => acc + curr.votes, 0);
                      const percentage = totalVotes > 0 ? Math.round((sug.votes / totalVotes) * 100) : 0;
                      const hasVoted = user && sug.voterIds.includes(user.id);
                      
                      return (
                          <button 
                              key={sug.id}
                              onClick={() => handleVote(sug.id)}
                              className={`w-full relative h-14 rounded-2xl overflow-hidden border transition-all text-left px-5 flex items-center justify-between group
                                  ${hasVoted ? 'border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700 active:scale-[0.99]'}`}
                          >
                              <div 
                                  className={`absolute left-0 top-0 bottom-0 transition-all duration-700 bg-[#1E5BFF]/10`}
                                  style={{ width: `${percentage}%` }}
                              />
                              <span className={`relative z-10 text-xs font-bold ${hasVoted ? 'text-[#1E5BFF]' : 'text-gray-500'}`}>
                                  {sug.name}
                              </span>
                              <span className="relative z-10 text-[10px] font-black text-[#1E5BFF] uppercase">
                                  {percentage}%
                              </span>
                          </button>
                      );
                  })}
                  
                  <button 
                      onClick={() => user ? setIsSuggestModalOpen(true) : onRequireLogin()}
                      className={`w-full h-14 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all text-gray-400 hover:border-[#1E5BFF] hover:text-[#1E5BFF]`}
                  >
                      <Plus size={16} />
                      Quero sugerir
                  </button>
              </div>
          </div>
      </div>

      <div className="px-5 mt-12 pb-10">
          <button 
              onClick={() => onNavigate('patrocinador_master')}
              className="w-full text-left bg-gray-50 dark:bg-gray-900/40 rounded-[2rem] p-6 flex items-center justify-between gap-4 border border-gray-100 dark:border-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all active:scale-[0.98]"
          >
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500">
                      <Crown size={20} />
                  </div>
                  <div>
                      <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-0.5">Patrocinador Master</p>
                      <h4 className="font-bold text-gray-800 dark:text-white text-base">Grupo Esquematiza</h4>
                  </div>
              </div>
              <div className="text-gray-300 dark:text-gray-700">
                  <ArrowRight size={18} strokeWidth={3} />
              </div>
          </button>
      </div>

      {isSuggestModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsSuggestModalOpen(false)}>
              <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-8" />
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase mb-2">Sugerir Comunidade</h3>
                  <p className="text-sm text-gray-500 mb-8 font-medium">Sua ideia será analisada pelo ADM.</p>
                  
                  <form onSubmit={handleSendSuggestion} className="space-y-6">
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tema</label>
                          <input 
                              name="name"
                              required
                              maxLength={30}
                              placeholder="Ex: Corrida, Brechó, Dicas do Anil..."
                              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white font-bold outline-none focus:border-[#1E5BFF] transition-all"
                          />
                      </div>
                      <button 
                          type="submit"
                          className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                      >
                          ENVIAR SUGESTÃO
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

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
  AlertCircle
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

// --- 1. CARD DE COMUNIDADE (Ajustado para o novo modelo híbrido) ---
const CommunityCard: React.FC<{ 
  community: NeighborhoodCommunity; 
  onOpen: () => void;
}> = ({ community, onOpen }) => (
  <div 
    onClick={onOpen}
    className="flex-shrink-0 w-36 bg-white dark:bg-gray-800 rounded-[2rem] p-5 shadow-lg shadow-blue-900/5 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all group"
  >
    <div className={`w-16 h-16 rounded-2xl ${community.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <div className="text-[#1E5BFF]">
        {React.cloneElement(community.icon as any, { size: 38, strokeWidth: 2.5 })}
      </div>
    </div>
    <h4 className="text-[12px] font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter mb-1 line-clamp-2 h-8">
      {community.name}
    </h4>
    {community.type === 'official' ? (
      <div className="flex items-center gap-1 mb-3">
        <ShieldCheck size={8} className="text-[#1E5BFF]" />
        <p className="text-[8px] font-bold text-[#1E5BFF] uppercase tracking-widest">Oficial</p>
      </div>
    ) : (
      <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
        {community.membersCount} membros
      </p>
    )}
    <button className="w-full py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest">
        Entrar
    </button>
  </div>
);

// --- 2. POST DO FEED ---
const CommunityPostCard: React.FC<{ post: CommunityPost; communityName: string }> = ({ post, communityName }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-600 shadow-sm shrink-0">
            <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{post.userName}</h4>
                <span className="text-gray-300">•</span>
                <span className="text-[10px] font-bold text-[#1E5BFF] truncate max-w-[120px]">{communityName}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">há {post.timestamp}</p>
          </div>
        </div>
        <button className="p-1 text-gray-300">
            <MoreHorizontal size={18} />
        </button>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {post.content}
      </p>

      {post.imageUrl && (
        <div className="w-full aspect-video rounded-3xl overflow-hidden mb-4 border border-gray-100 dark:border-gray-700 shadow-inner">
            <img src={post.imageUrl} className="w-full h-full object-cover" alt="Post content" />
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50 mt-2">
        <div className="flex items-center gap-5">
            <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${liked ? 'text-red-500' : 'text-gray-400'}`}>
                <Heart size={16} className={liked ? 'fill-current' : ''} /> {liked ? post.likes + 1 : post.likes}
            </button>
            <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#1E5BFF]">
                <MessageSquare size={16} /> Responder
            </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. MODAL CRIAÇÃO COMUNIDADE ---
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
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Criar Comunidade</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nome da Comunidade</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="Ex: Vizinhos da Rua Araguaia"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl outline-none focus:border-[#1E5BFF] transition-all dark:text-white"
            />
            {error && (
              <div className="flex items-center gap-1.5 text-red-500 mt-2 ml-1">
                <AlertCircle size={12} />
                <p className="text-[10px] font-bold">{error}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Descrição</label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Do que se trata este grupo?"
              rows={3}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl outline-none focus:border-[#1E5BFF] transition-all dark:text-white resize-none"
            />
          </div>

          <div className="pt-2">
            <button 
              onClick={handleCreate}
              disabled={!name.trim()}
              className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
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
  
  // Sincroniza comunidades criadas pelo usuário (simulação MVP via localStorage)
  const [userCreatedComms, setUserCreatedComms] = useState<NeighborhoodCommunity[]>(() => {
    const saved = localStorage.getItem('user_comms_jpa');
    return saved ? JSON.parse(saved).map((c: any) => ({
      ...c,
      icon: <Hash /> // Restaurando ícone perdido no JSON
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
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
            <button onClick={() => setIsViewingAllCommunities(false)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <div className="flex-1">
                <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">Explorar Comunidades</h1>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">{currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}</p>
            </div>
        </div>

        <div className="p-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Comunidades do Bairro</h3>
            <div className="grid grid-cols-2 gap-4 mb-10">
                {OFFICIAL_COMMUNITIES.map((comm) => (
                    <CommunityCard key={comm.id} community={comm} onOpen={() => { setActiveCommunity(comm); setIsViewingAllCommunities(false); }} />
                ))}
            </div>

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Criadas por moradores</h3>
                <button onClick={() => setIsCreating(true)} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1">
                  <Plus size={10} /> Criar nova
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {userCreatedComms.map((comm) => (
                    <CommunityCard key={comm.id} community={comm} onOpen={() => { setActiveCommunity(comm); setIsViewingAllCommunities(false); }} />
                ))}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500 overflow-x-hidden">
      
      {/* 1. HERO BANNER */}
      <section className="px-5 pt-6 mb-10">
        <div className="w-full aspect-[16/8] bg-gradient-to-br from-[#A5C6FF] via-[#D6E6FF] to-[#F0F5FF] rounded-[2.5rem] relative overflow-hidden shadow-sm border border-white p-8 flex items-center justify-between">
            <div className="relative z-10 flex-1">
                <h2 className="text-2xl font-black text-blue-900 leading-tight font-display tracking-tight uppercase">
                    Onde o bairro <br/> <span className="text-[#1E5BFF]">conversa</span>
                </h2>
                <p className="text-xs text-blue-600 font-bold mt-3 max-w-[200px] leading-tight">
                    Conecte-se com vizinhos, compartilhe dicas e descubra o que acontece em JPA.
                </p>
            </div>
            
            <div className="relative flex items-center justify-center h-full w-24 shrink-0 animate-float-slow opacity-80">
                <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg border border-blue-100">
                    <MessageCircle className="w-6 h-6 text-[#1E5BFF]" fill="currentColor" />
                </div>
                <div className="absolute top-8 left-0 bg-blue-500 p-2 rounded-2xl shadow-lg border border-white">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-2 right-4 bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-lg border border-blue-50">
                    <HeartHandshake className="w-5 h-5 text-pink-500" />
                </div>
            </div>
        </div>

        {/* PROFILE MINI CARD */}
        <div className="mt-[-28px] px-6 relative z-20">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-[2rem] p-3 shadow-md border border-white/50 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm shrink-0">
                        <img src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?u=paula"} className="w-full h-full object-cover" alt="User avatar" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 text-[11px] leading-none">{user?.user_metadata?.full_name || 'Paula Castro'}</h3>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood} • Ativo agora</p>
                    </div>
                </div>
                <button 
                    onClick={() => onNavigate('edit_profile')}
                    className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-3 py-1.5 hover:text-[#1E5BFF] active:opacity-70 transition-all"
                >
                    Perfil
                </button>
            </div>
        </div>
      </section>

      {/* 2. SEÇÃO COMUNIDADES DO BAIRRO (Oficiais) */}
      <section className="mb-8">
        <div className="px-6 mb-5">
            <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.2em] mb-1">Canais essenciais do Localizei</p>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 dark:text-white font-display tracking-tight uppercase leading-none">Comunidades do Bairro</h3>
                <button onClick={() => setIsViewingAllCommunities(true)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1E5BFF] flex items-center gap-1.5 transition-all">
                  Explorar todas <ChevronRight size={12} />
                </button>
            </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2">
            {OFFICIAL_COMMUNITIES.map((comm) => (
                <CommunityCard key={comm.id} community={comm} onOpen={() => setActiveCommunity(comm)} />
            ))}
        </div>
      </section>

      {/* 3. SEÇÃO COMUNIDADES LIVRES (Moradores) */}
      <section className="mb-12">
        <div className="px-6 mb-5">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Criadas pelos vizinhos</p>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 dark:text-white font-display tracking-tight uppercase leading-none">Pela Freguesia</h3>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-emerald-100 transition-all"
                >
                    <PlusCircle size={12} />
                    Criar comunidade
                </button>
            </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2">
            {userCreatedComms.map((comm) => (
                <CommunityCard key={comm.id} community={comm} onOpen={() => setActiveCommunity(comm)} />
            ))}
        </div>
      </section>

      {/* 4. FEED DE CONVERSAS */}
      <section className="px-5">
        <div className="px-1 mb-5">
            <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.2em] mb-1">O que o bairro está falando agora</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white font-display tracking-tight uppercase leading-none">Conversas Recentes</h3>
        </div>

        <div className="space-y-4">
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
                className="w-full mt-6 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-sm"
            >
                Ver mais conversas
                <ChevronRight size={14} className="rotate-90" />
            </button>
        )}
      </section>

      {/* RODAPÉ */}
      <div className="mt-20 mb-24 px-10 text-center opacity-30">
          <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] leading-relaxed">
            Localizei JPA <br/> Onde o bairro conversa
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

// --- VIEW AUXILIAR: DETALHE DA COMUNIDADE ---
const CommunityDetailView: React.FC<{ 
  community: NeighborhoodCommunity; 
  onBack: () => void;
  onStoreClick: (store: any) => void;
}> = ({ community, onBack, onStoreClick }) => {
  const posts = useMemo(() => MOCK_COMMUNITY_POSTS.filter(p => p.communityId === community.id), [community.id]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="relative h-48 shrink-0 overflow-hidden">
        <img src={community.image} className="w-full h-full object-cover brightness-50" alt={community.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FC] dark:from-gray-950 to-transparent"></div>
        <button onClick={onBack} className="absolute top-6 left-6 p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 active:scale-90 transition-transform">
          <ChevronLeft size={24} />
        </button>
        
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-3xl ${community.color} border-4 border-white dark:border-gray-900 flex items-center justify-center text-white shadow-2xl`}>
              {React.cloneElement(community.icon as any, { size: 32, strokeWidth: 2.5 })}
            </div>
            <div className="mb-1">
              <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{community.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                {community.type === 'official' && (
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                    <ShieldCheck size={10} className="text-white" />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Canal Oficial</span>
                  </div>
                )}
                <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{community.membersCount} participantes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 pb-24">
        {posts.length > 0 ? (
          posts.map(post => (
            <CommunityPostCard key={post.id} post={post} communityName={community.name} />
          ))
        ) : (
          <div className="py-20 flex flex-col items-center opacity-30 text-center">
            <MessageCircle size={48} className="mb-4 text-gray-400" />
            <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">Ninguém postou aqui ainda.<br/>Seja o primeiro!</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
          <button className="w-14 h-14 bg-[#1E5BFF] text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-900 active:scale-90 transition-all">
              <Plus size={28} strokeWidth={3} />
          </button>
      </div>
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Heart, 
  MessageSquare, 
  Plus, 
  Check, 
  ArrowRight,
  Users,
  MapPin,
  Clock,
  Megaphone,
  Share2,
  MessageCircle,
  ArrowDown,
  ChevronRight
} from 'lucide-react';
import { NeighborhoodCommunity, CommunityPost } from '../types';
import { NEIGHBORHOOD_COMMUNITIES, MOCK_COMMUNITY_POSTS } from '../constants';

interface CommunityFeedViewProps {
  user: any;
  onRequireLogin: () => void;
  onNavigate: (view: string) => void;
  onStoreClick: (store: any) => void;
}

// --- 1. CARD DE CATEGORIA (AJUSTADO: Ícone maior, nome com peso, membros sutis) ---
const CategoryInterestCard: React.FC<{ community: NeighborhoodCommunity; onOpen: () => void }> = ({ community, onOpen }) => (
  <div 
    onClick={onOpen}
    className="flex-shrink-0 w-36 bg-white dark:bg-gray-800 rounded-[2rem] p-5 shadow-lg shadow-blue-900/5 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all"
  >
    <div className={`w-16 h-16 rounded-2xl ${community.color} bg-opacity-10 flex items-center justify-center mb-4`}>
      <div className="text-[#1E5BFF]">
        {React.cloneElement(community.icon as any, { size: 36, strokeWidth: 2.5 })}
      </div>
    </div>
    <h4 className="text-[12px] font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter mb-1 line-clamp-2 h-8">
      {community.name}
    </h4>
    <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
        {community.membersCount} membros
    </p>
    <button className="mt-3 w-full py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest">
        Entrar
    </button>
  </div>
);

// --- 2. POST DO FEED (AJUSTADO: Botão de anúncio menos dominante) ---
const CommunityPostCard: React.FC<{ post: CommunityPost; communityName: string }> = ({ post, communityName }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4 animate-in fade-in slide-in-from-bottom-2">
      {/* Header do Post */}
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

      {/* Conteúdo */}
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {post.content}
      </p>

      {post.imageUrl && (
        <div className="w-full aspect-video rounded-3xl overflow-hidden mb-4 border border-gray-100 dark:border-gray-700 shadow-inner">
            <img src={post.imageUrl} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Footer Ações */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50 mt-2">
        <div className="flex items-center gap-5">
            <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${liked ? 'text-red-500' : 'text-gray-400'}`}>
                <Heart size={16} className={liked ? 'fill-current' : ''} /> {liked ? 9 : 8}
            </button>
            <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#1E5BFF]">
                <MessageSquare size={16} /> Responder
            </button>
        </div>

        {post.communityId === 'comm-pro' && (
            <button className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest active:scale-95 transition-transform border border-transparent hover:border-gray-200">
                Anunciar no bairro
            </button>
        )}
      </div>
    </div>
  );
};

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ user, onRequireLogin, onNavigate, onStoreClick }) => {
  const [activeCommunity, setActiveCommunity] = useState<NeighborhoodCommunity | null>(null);
  const [showAllPosts, setShowAllPosts] = useState(false);
  
  // Regra 5: Limitar feed a 3 posts
  const feedPosts = useMemo(() => {
    return showAllPosts ? MOCK_COMMUNITY_POSTS : MOCK_COMMUNITY_POSTS.slice(0, 3);
  }, [showAllPosts]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500 overflow-x-hidden">
      
      {/* 1. HERO BANNER (Ajustado com subtítulo e CTA discreto) */}
      <section className="px-5 pt-6 mb-10">
        <div className="w-full aspect-[16/8] bg-gradient-to-br from-[#A5C6FF] via-[#D6E6FF] to-[#F0F5FF] rounded-[2.5rem] relative overflow-hidden shadow-sm border border-white p-7 flex flex-col justify-center">
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-40">
                 <img src="https://cdni.iconscout.com/illustration/premium/thumb/group-discussion-illustration-download-in-svg-png-gif-file-formats--meeting-man-woman-talking-business-pack-illustrations-5211993.png" className="w-full h-full object-contain object-bottom" alt="" />
            </div>
            <div className="relative z-10">
                <h2 className="text-xl font-black text-blue-900 leading-tight font-display tracking-tight uppercase">
                    Onde o bairro <br/> <span className="text-[#1E5BFF]">conversa</span>
                </h2>
                <p className="text-[10px] text-blue-600 font-bold mt-2 max-w-[150px] leading-tight">
                    Participe das conversas e descubra o que acontece no seu bairro.
                </p>
                <button 
                  onClick={() => {
                    const el = document.getElementById('comunidades-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest hover:underline"
                >
                  Ver comunidades <ArrowDown size={10} strokeWidth={3} />
                </button>
            </div>
        </div>

        {/* 2. PROFILE MINI CARD (Reduzido visualmente, secundário) */}
        <div className="mt-[-30px] px-4 relative z-20">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-[2rem] p-3 shadow-md border border-white/50 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-white shadow-sm shrink-0">
                        <img src="https://i.pravatar.cc/150?u=paula" className="w-full h-full object-cover" alt="User" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 text-xs">Paula Castro</h3>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Freguesia • 3 comunidades</p>
                    </div>
                </div>
                <button 
                    onClick={() => onRequireLogin()}
                    className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3 py-1.5 hover:text-[#1E5BFF] transition-colors"
                >
                    Meu Perfil
                </button>
            </div>
        </div>
      </section>

      {/* 3. SEÇÃO COMUNIDADES (Foco Principal) */}
      <section id="comunidades-section" className="mb-12">
        <div className="px-6 mb-5">
            <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.2em] mb-1">Participe das comunidades do seu bairro</p>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 dark:text-white font-display tracking-tight uppercase leading-none">Comunidades</h3>
                <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1E5BFF]">Explorar comunidades</button>
            </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2 snap-x">
            {NEIGHBORHOOD_COMMUNITIES.map((comm) => (
                <CategoryInterestCard 
                    key={comm.id} 
                    community={comm} 
                    onOpen={() => setActiveCommunity(comm)} 
                />
            ))}
        </div>
      </section>

      {/* 4. FEED DE CONVERSAS (Microcopy ajustado) */}
      <section className="px-5">
        <div className="px-1 mb-5">
            <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.2em] mb-1 text-center sm:text-left">O que o bairro está falando agora</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white font-display tracking-tight uppercase leading-none text-center sm:text-left">Conversas Recentes</h3>
        </div>

        <div className="space-y-4">
            {feedPosts.map((post) => {
                const comm = NEIGHBORHOOD_COMMUNITIES.find(c => c.id === post.communityId);
                return (
                    <CommunityPostCard 
                        key={post.id} 
                        post={post} 
                        communityName={comm?.name || 'Geral'} 
                    />
                );
            })}
        </div>

        {/* Botão Ver Mais */}
        {!showAllPosts && MOCK_COMMUNITY_POSTS.length > 3 && (
            <button 
                onClick={() => setShowAllPosts(true)}
                className="w-full mt-6 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
            >
                Ver mais conversas
                <ChevronRight size={14} className="rotate-90" />
            </button>
        )}
      </section>

      {/* RODAPÉ INSTITUCIONAL */}
      <div className="mt-20 mb-24 px-10 text-center opacity-30">
          <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] leading-relaxed">
            Localizei JPA <br/> Onde o bairro conversa
          </p>
      </div>

      {/* MODAL DETALHE (SE ATIVO) */}
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

// --- VIEW AUXILIAR: DETALHE DA COMUNIDADE (POPUP COMPACTO) ---
const CommunityDetailView: React.FC<{ 
  community: NeighborhoodCommunity; 
  onBack: () => void;
  onStoreClick: (store: any) => void;
}> = ({ community, onBack, onStoreClick }) => {
  const posts = useMemo(() => MOCK_COMMUNITY_POSTS.filter(p => p.communityId === community.id), [community.id]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="relative h-48 shrink-0 overflow-hidden">
        <img src={community.image} className="w-full h-full object-cover brightness-50" />
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
              <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{community.name}</h2>
              <p className="text-[10px] font-bold text-blue-50 uppercase tracking-widest mt-1">{community.membersCount} participantes</p>
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

      {/* FAB FIXO NO DETALHE */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
          <button className="w-14 h-14 bg-[#1E5BFF] text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-900 active:scale-90 transition-all">
              <Plus size={28} strokeWidth={3} />
          </button>
      </div>
    </div>
  );
};

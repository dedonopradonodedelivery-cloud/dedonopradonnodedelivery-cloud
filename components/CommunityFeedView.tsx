
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
  Key,
  Megaphone,
  Share2,
  Image as ImageIcon
} from 'lucide-react';
import { NeighborhoodCommunity, CommunityPost } from '../types';
import { NEIGHBORHOOD_COMMUNITIES, MOCK_COMMUNITY_POSTS } from '../constants';

interface CommunityFeedViewProps {
  user: any;
  onRequireLogin: () => void;
  onNavigate: (view: string) => void;
  onStoreClick: (store: any) => void;
}

// --- SUB-COMPONENTE: CARD DE CATEGORIA (CARROSSEL "PERFIL") ---
const CategoryInterestCard: React.FC<{ community: NeighborhoodCommunity; onOpen: () => void }> = ({ community, onOpen }) => (
  <div 
    onClick={onOpen}
    className="flex-shrink-0 w-36 bg-white dark:bg-gray-800 rounded-[2rem] p-4 shadow-lg shadow-blue-900/5 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all"
  >
    <div className={`w-16 h-16 rounded-2xl ${community.color} bg-opacity-10 flex items-center justify-center mb-3`}>
      <div className="text-[#1E5BFF]">
        {React.cloneElement(community.icon as any, { size: 32, strokeWidth: 2 })}
      </div>
    </div>
    <h4 className="text-[11px] font-black text-gray-800 dark:text-white leading-tight uppercase tracking-tighter mb-1 line-clamp-2 h-7">
      {community.name}
    </h4>
    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
      {community.membersCount} membros
    </p>
  </div>
);

// --- SUB-COMPONENTE: POST DO FEED (ESTILO REFERÊNCIA) ---
const CommunityPostCard: React.FC<{ post: CommunityPost; communityName: string }> = ({ post, communityName }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4 animate-in fade-in slide-in-from-bottom-2">
      {/* Header do Post */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-100 dark:border-gray-600 shadow-sm">
            <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{post.userName}</h4>
                <span className="text-gray-300">•</span>
                <span className="text-[10px] font-bold text-[#1E5BFF] truncate max-w-[120px]">{communityName}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                <span>há {post.timestamp}</span>
                <span>|</span>
                <Users size={10} />
            </div>
          </div>
        </div>
        <button className="p-1 text-gray-300">
            <MoreHorizontal size={20} />
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
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
            <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${liked ? 'text-red-500' : 'text-gray-400'}`}>
                <Heart size={18} className={liked ? 'fill-current' : ''} /> 8
            </button>
            <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                <MessageSquare size={18} /> 16
            </button>
        </div>

        {post.communityId === 'comm-pro' && (
            <button className="bg-[#1E5BFF] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
                <Key size={12} /> Quero anunciar
            </button>
        )}
      </div>
    </div>
  );
};

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ user, onRequireLogin, onNavigate, onStoreClick }) => {
  const [activeCommunity, setActiveCommunity] = useState<NeighborhoodCommunity | null>(null);
  
  // Filtramos os posts para exibição no feed principal (Mix de categorias)
  const feedPosts = useMemo(() => MOCK_COMMUNITY_POSTS, []);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500">
      
      {/* 1. HERO BANNER (ESTILO REFERÊNCIA) */}
      <section className="px-5 pt-6 mb-8">
        <div className="w-full aspect-[16/8] bg-gradient-to-br from-[#A5C6FF] via-[#D6E6FF] to-[#F0F5FF] rounded-[2.5rem] relative overflow-hidden shadow-sm border border-white p-6 flex flex-col justify-center">
            {/* Ilustração Mock (Pessoas conversando) */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-60">
                 <img src="https://cdni.iconscout.com/illustration/premium/thumb/group-discussion-illustration-download-in-svg-png-gif-file-formats--meeting-man-woman-talking-business-pack-illustrations-5211993.png" className="w-full h-full object-contain object-bottom" alt="" />
            </div>
            
            <div className="relative z-10 max-w-[65%]">
                <h2 className="text-2xl font-black text-blue-900 leading-tight font-display tracking-tight mb-2">
                    Entre e participe <br/> das conversas <br/> <span className="text-blue-600">no seu bairro</span>
                </h2>
            </div>
            
            {/* Ícones flutuantes decorativos */}
            <div className="absolute top-6 left-6 p-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50">
                <MessageSquare className="text-blue-600 w-6 h-6" />
            </div>
        </div>

        {/* 2. PROFILE MINI CARD (PAULA CASTRO STYLE) */}
        <div className="mt-[-40px] px-2 relative z-20">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-4 shadow-2xl shadow-blue-900/10 border border-white dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                        <img src="https://i.pravatar.cc/150?u=paula" className="w-full h-full object-cover" alt="User" />
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900 dark:text-white text-base leading-tight">Paula Castro</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Freguesia</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                                <Users size={10} /> 270
                            </div>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                                <Users size={10} /> 3
                            </div>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => onRequireLogin()}
                    className="bg-[#1E5BFF] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
                >
                    ENTRAR
                </button>
            </div>
        </div>
      </section>

      {/* 3. SEÇÃO "PERFIL" (CARROSSEL DE DESCOBERTA) */}
      <section className="mb-10">
        <div className="flex items-center justify-between px-6 mb-5">
            <h3 className="text-xl font-black text-gray-900 dark:text-white font-display tracking-tight uppercase">Perfil</h3>
            <button className="text-xs font-black text-[#1E5BFF] uppercase tracking-widest hover:underline">Ver todas</button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2 snap-x">
            {NEIGHBORHOOD_COMMUNITIES.slice(0, 5).map((comm) => (
                <CategoryInterestCard 
                    key={comm.id} 
                    community={comm} 
                    onOpen={() => setActiveCommunity(comm)} 
                />
            ))}
        </div>
      </section>

      {/* 4. SEÇÃO "COMUNIDADES" (FEED) */}
      <section className="px-5">
        <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-xl font-black text-gray-900 dark:text-white font-display tracking-tight uppercase">Comunidades</h3>
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
      </section>

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
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">{community.membersCount} participantes</p>
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
            <MessageSquare size={48} className="mb-4 text-gray-400" />
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

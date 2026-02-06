
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Store, Category, CommunityPost, ServiceRequest, ServiceUrgency, Classified, NeighborhoodTalent, HappeningNowPost, LostFoundItem } from '@/types';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Ticket,
  CheckCircle2, 
  Lock, 
  Zap, 
  Loader2, 
  Hammer, 
  Plus, 
  Heart, 
  Bookmark, 
  Home as HomeIcon,
  MessageSquare, 
  MapPin, 
  Camera, 
  X, 
  Send, 
  ChevronRight,
  MessageCircle,
  Clock,
  Megaphone,
  Calendar,
  Tag,
  Search,
  Bell
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_COMMUNITY_POSTS, MOCK_CLASSIFIEDS, MOCK_TALENTS, MOCK_HAPPENING_NOW, MOCK_LOST_FOUND } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { LaunchOfferBanner } from '@/components/LaunchOfferBanner';
import { HomeBannerCarousel } from '@/components/HomeBannerCarousel';
import { FifaBanner } from '@/components/FifaBanner';
import { useFeatures } from '@/contexts/FeatureContext';
import { MoreCategoriesModal } from '@/components/MoreCategoriesModal';

// Imagens de fallback realistas e variadas
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800', // Bairro/Rua
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800', // Comércio
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800', // Pessoas
  'https://images.unsplash.com/photo-1534723452202-428aae1ad99d?q=80&w=800', // Mercado
  'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800', // Serviço
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800', // Casa/Interior
  'https://images.unsplash.com/photo-1605218427368-35b019b85c11?q=80&w=800', // Urbano
  'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800'  // Pet
];

const getFallbackImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
};

const HappeningNowCard: React.FC<{ item: HappeningNowPost; onNavigate: (v: string) => void }> = ({ item, onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const diff = new Date(item.expiresAt).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft('Expirado');
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`ativo por mais ${hours > 0 ? `${hours}h ` : ''}${mins}min`);
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [item.expiresAt]);

  const typeConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    promo: { label: 'Promoção', icon: Tag, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    event: { label: 'Evento', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    notice: { label: 'Aviso', icon: Megaphone, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' }
  };

  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <div className="flex-shrink-0 w-64 snap-center p-1.5">
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-full active:scale-[0.98] transition-transform">
        {item.imageUrl && (
          <div className="h-24 w-full overflow-hidden">
            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-4 flex flex-col flex-1">
          <div className={`w-fit px-2 py-0.5 rounded-lg ${config.bg} flex items-center gap-1 mb-2`}>
            <Icon size={10} className={config.color} />
            <span className={`text-[8px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>
          </div>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-2 flex-1">
            {item.title}
          </h3>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-gray-700">
            <div className="flex items-center gap-1 text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
              <Clock size={10} />
              {timeLeft}
            </div>
            <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
              Conferir <ChevronRight size={10} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TalentCard: React.FC<{ talent: NeighborhoodTalent }> = ({ talent }) => {
  const handleContact = () => {
    const message = encodeURIComponent("Oi, vi seu anúncio no app do bairro e fiquei interessado 😊");
    window.open(`https://wa.me/${talent.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden snap-center flex flex-col group active:scale-[0.98] transition-transform">
      <div className="relative h-32 bg-gray-100 dark:bg-gray-700">
        <img src={talent.imageUrl} alt={talent.name} className="w-full h-full object-cover" />
        {talent.availability && (
            <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-sm border border-white/20">
                {talent.availability}
            </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{talent.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-tight">{talent.description}</p>
        
        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-blue-500 uppercase tracking-wide">
            <MapPin size={10} />
            {talent.distance}
        </div>

        <button 
            onClick={handleContact}
            className="mt-4 w-full py-2.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
            <MessageCircle size={14} />
            Chamar no WhatsApp
        </button>
      </div>
    </div>
  );
};

const LostFoundCard: React.FC<{ item: LostFoundItem }> = ({ item }) => {
  const [showModal, setShowModal] = useState(false);

  const isLost = item.type === 'lost_pet';
  const badgeColor = isLost ? 'bg-red-500' : 'bg-emerald-500';
  const badgeText = isLost ? 'Animal Perdido' : 'Item Encontrado';

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="flex-shrink-0 w-64 snap-center bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="relative h-32 bg-gray-200">
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          <div className={`absolute top-3 right-3 ${badgeColor} text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-sm`}>
            {badgeText}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{item.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{item.description}</p>
          <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            <MapPin size={10} /> {item.location}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            <Clock size={10} /> {item.timestamp}
          </div>
          <button className="mt-4 w-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
            Ver detalhes
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => { e.stopPropagation(); setShowModal(false); }}>
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="relative h-48 bg-gray-200">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full"><X size={20}/></button>
            </div>
            <div className="p-6">
              <div className={`inline-block ${badgeColor} text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3`}>
                {badgeText}
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">{item.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{item.description}</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin size={16} /> 
                  <span className="font-medium">{item.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Clock size={16} /> 
                  <span className="font-medium">Postado {item.timestamp}</span>
                </div>
              </div>

              <button 
                onClick={() => window.open(`https://wa.me/${item.contactPhone}`, '_blank')}
                className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                <MessageCircle size={18} />
                Entrar em contato
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MiniPostCard: React.FC<{ post: CommunityPost; onNavigate: (view: string) => void; }> = ({ post, onNavigate }) => {
  // Garante que SEMPRE haja uma imagem, usando fallback determinístico se necessário
  const postImage = post.imageUrl || (post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : getFallbackImage(post.id));
  
  return (
    <div className="flex-shrink-0 w-28 snap-center p-1">
      <div 
        onClick={() => onNavigate('neighborhood_posts')}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer h-full"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <img src={postImage} alt={post.content} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-1 left-1.5 right-1">
            <p className="text-[9px] font-bold text-white drop-shadow-md truncate">{post.userName}</p>
          </div>
        </div>
        <div className="p-2 pt-1.5 flex-1">
            <p className="text-[9px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2 font-medium">
                {post.content}
            </p>
        </div>
      </div>
    </div>
  );
};

interface HomeFeedProps {
  onNavigate: (view: string, data?: any) => void;
  onSelectCategory: (category: Category) => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onStoreClick, 
  stores, 
  user, 
  userRole 
}) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');
  const { isFeatureActive } = useFeatures();
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);

  // Lógica de Categorias Paginadas (2 linhas de 4 itens = 8 por página)
  const itemsPerPage = 8;
  const categoryPages = useMemo(() => {
    const pages = [];
    const displayList = CATEGORIES.slice(0, 15);
    for (let i = 0; i < displayList.length; i += itemsPerPage) {
      pages.push(displayList.slice(i, i + itemsPerPage));
    }
    return pages;
  }, []);

  const [wizardStep, setWizardStep] = useState(0);

  const handleCategoryScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, clientWidth } = categoryScrollRef.current;
      setCurrentCategoryPage(Math.round(scrollLeft / clientWidth));
    }
  };
  
  // Lógica de filtragem para Acontecendo Agora (Expiração)
  const activeHappenings = useMemo(() => {
    return MOCK_HAPPENING_NOW.filter(h => new Date(h.expiresAt).getTime() > Date.now() && h.status === 'active');
  }, []);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      {userRole === 'lojista' && isFeatureActive('banner_highlights') && <section className="px-4 py-4 bg-white dark:bg-gray-950"><LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} /></section>}
      
      {isFeatureActive('explore_guide') && (
        <section className="w-full bg-white dark:bg-gray-950 pt-4 pb-0 relative z-10">
            <div 
              ref={categoryScrollRef}
              onScroll={handleCategoryScroll}
              className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
            >
                {categoryPages.map((pageCategories, pageIndex) => (
                    <div key={pageIndex} className="min-w-full px-4 pb-2 snap-center">
                        <div className="grid grid-cols-4 grid-rows-2 gap-1.5">
                            {pageCategories.map((cat) => (
                                <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all w-full">
                                    <div className={`w-full aspect-square rounded-[22px] shadow-sm flex flex-col items-center justify-center p-3 ${cat.color || 'bg-blue-600'} border border-white/20`}>
                                      <div className="flex-1 flex items-center justify-center w-full mb-1">
                                        {React.cloneElement(cat.icon as any, { className: "w-9 h-9 text-white drop-shadow-md", strokeWidth: 2.5 })}
                                      </div>
                                      <span className="block w-full text-[8.5px] font-black text-white text-center uppercase tracking-tighter leading-none truncate">
                                        {cat.name}
                                      </span>
                                    </div>
                                </button>
                            ))}
                            
                            {pageIndex === categoryPages.length - 1 && (
                                <button 
                                  onClick={() => setIsMoreCategoriesOpen(true)}
                                  className="flex flex-col items-center group active:scale-95 transition-all w-full"
                                >
                                    <div className="w-full aspect-square rounded-[22px] shadow-sm flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                      <div className="flex-1 flex items-center justify-center w-full mb-1">
                                        <Plus className="w-9 h-9 text-gray-400 group-hover:text-blue-600 transition-colors" strokeWidth={3} />
                                      </div>
                                      <span className="block w-full text-[8.5px] font-black text-gray-400 dark:text-gray-500 text-center uppercase tracking-tighter leading-none truncate">
                                        Mais
                                      </span>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-center gap-1.5 pb-6 pt-2">
                {categoryPages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`rounded-full transition-all duration-300 ${
                        idx === currentCategoryPage 
                          ? 'bg-gray-800 dark:bg-white w-1.5 h-1.5' 
                          : 'bg-gray-300 dark:bg-gray-700 w-1.5 h-1.5'
                      }`} 
                    />
                ))}
            </div>
        </section>
      )}

      {isFeatureActive('banner_highlights') && (
        <section className="bg-white dark:bg-gray-950 w-full"><HomeBannerCarousel onStoreClick={onStoreClick} onNavigate={onNavigate} /></section>
      )}
      
      {/* ACONTECENDO AGORA */}
      {activeHappenings.length > 0 && (
        <section className="bg-white dark:bg-gray-950 pt-2 pb-8 relative px-5 animate-in slide-in-from-bottom duration-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 leading-tight">
                Acontecendo agora
                <div className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </div>
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Promoções e eventos em tempo real</p>
            </div>
            <button 
              onClick={() => onNavigate('happening_now_form')}
              className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-blue-600 active:scale-90 transition-all"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar snap-x -mx-1.5">
            {activeHappenings.map(item => (
              <HappeningNowCard key={item.id} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {/* TALENTOS DO BAIRRO */}
      <section className="bg-white dark:bg-gray-950 pt-6 pb-6 relative px-5">
        <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Talentos do Bairro <Heart size={16} className="text-rose-500 fill-rose-500" />
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Gente do bairro criando e fazendo perto de você.</p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-5 px-5 pb-2">
            {MOCK_TALENTS.map(talent => (
                <TalentCard key={talent.id} talent={talent} />
            ))}
        </div>
      </section>

      {/* ACHADOS E PERDIDOS (NOVO BLOCO) */}
      <section className="bg-white dark:bg-gray-950 pt-2 pb-8 relative px-5">
        <div className="mb-4">
          <div className="flex items-center justify-between">
             <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Achados e Perdidos
                <Bell size={16} className="text-amber-500" />
             </h2>
             <button className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-xl">Anunciar</button>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Animais e itens que alguém do bairro está procurando.</p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-5 px-5 pb-2">
           {MOCK_LOST_FOUND.map(item => (
             <LostFoundCard key={item.id} item={item} />
           ))}
        </div>
      </section>

      {isFeatureActive('community_feed') && (
        <section className="bg-white dark:bg-gray-950 pt-2 pb-6 relative px-5">
            <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">JPA Conversa<div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div></h2><button onClick={() => onNavigate('neighborhood_posts')} className="text-xs font-bold text-blue-500">Ver tudo</button></div>
            <div className="relative group"><div className="flex overflow-x-auto no-scrollbar snap-x -mx-1 pb-2">{MOCK_COMMUNITY_POSTS.slice(0, 5).map((post) => <MiniPostCard key={post.id} post={post} onNavigate={onNavigate} />)}</div></div>
        </section>
      )}

      {isFeatureActive('service_chat') && (
        <section className="px-5 mb-8 bg-white dark:bg-gray-950"><FifaBanner onClick={() => setWizardStep(1)} /></section>
      )}

      {isFeatureActive('explore_guide') && (
        <div className="w-full bg-white dark:bg-gray-900 pt-1 pb-10">
            <div className="px-5">
            <SectionHeader icon={Compass} title="Explorar Bairro" subtitle="Tudo o que você precisa" onSeeMore={() => onNavigate('explore')} />
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-4">
                {['all', 'top_rated'].map((f) => <button key={f} onClick={() => setListFilter(f as any)} className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>{f === 'all' ? 'Tudo' : 'Top'}</button>)}
            </div>
            <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter as any} user={user} onNavigate={onNavigate} premiumOnly={false} />
            </div>
        </div>
      )}
      
      {wizardStep > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 -mt-4 mx-5 mb-10 animate-in slide-in-from-bottom duration-500 border border-gray-100 dark:border-slate-800 shadow-2xl relative overflow-hidden z-50">
          <button onClick={() => setWizardStep(0)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-slate-800 rounded-full"><X size={20} /></button>
          {wizardStep === 1 && (
            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">Que tipo de serviço?</h3>
              <div className="grid grid-cols-2 gap-4">
                {[{l: 'Obras', i: Hammer}, {l: 'Reparos', i: Zap}, {l: 'Casa', i: HomeIcon}, {l: 'Outros', i: Sparkles}].map(s => (
                  <button key={s.l} onClick={() => setWizardStep(2)} className="p-6 bg-gray-50 dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3 transition-all hover:border-blue-600 active:scale-95">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-blue-600"><s.i size={24} /></div>
                    <p className="text-[10px] font-black text-gray-800 dark:text-slate-200 uppercase tracking-tighter">{s.l}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {wizardStep === 4 && (
            <div className="text-center py-8 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-xl"><CheckCircle2 size={40} /></div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Tudo pronto!</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-10 font-medium">Profissionais notificados.</p>
                <button onClick={() => setWizardStep(0)} className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs active:scale-[0.98] transition-all">Ver propostas</button>
            </div>
          )}
        </section>
      )}

      {/* MODAL DE MAIS CATEGORIAS */}
      <MoreCategoriesModal 
        isOpen={isMoreCategoriesOpen} 
        onClose={() => setIsMoreCategoriesOpen(false)} 
        onSelectCategory={(cat) => {
            onSelectCategory(cat);
            setIsMoreCategoriesOpen(false);
        }} 
      />
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void }> = ({ icon: Icon, title, subtitle, onSeeMore }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white shadow-sm"><Icon size={18} strokeWidth={2.5} /></div><div><h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">{title}</h2><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{subtitle}</p></div></div>
    <button onClick={onSeeMore} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline active:opacity-60">Ver mais</button>
  </div>
);

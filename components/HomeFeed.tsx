import React, { useState, useMemo, useRef } from 'react';
import { Store, Category, CommunityPost, ServiceRequest, ServiceUrgency, Classified } from '@/types';
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
  Wrench,
  ShoppingBag,
  Package
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_COMMUNITY_POSTS, MOCK_CLASSIFIEDS } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { LaunchOfferBanner } from '@/components/LaunchOfferBanner';
import { HomeBannerCarousel } from '@/components/HomeBannerCarousel';
import { FifaBanner } from '@/components/FifaBanner';
import { useFeatures } from '@/contexts/FeatureContext';
import { MoreCategoriesModal } from '@/components/MoreCategoriesModal';

// Imagens de fallback realistas e variadas
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800',
  'https://images.unsplash.com/photo-1534723452202-428aae1ad99d?q=80&w=800',
  'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800',
  'https://images.unsplash.com/photo-1605218427368-35b019b85c11?q=80&w=800',
  'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800'
];

const getFallbackImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
};

const QuickActionBlock: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => (
  <section className="px-5 mb-10">
    <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
      <div className="mb-8">
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight mb-2">
          Resolve isso agora, sem complicação.
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[280px] mx-auto">
          Serviços, ofertas e oportunidades do seu bairro — do jeito mais rápido.
        </p>
      </div>

      <button 
        onClick={() => onNavigate('services_landing')}
        className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all mb-10"
      >
        <Wrench size={20} strokeWidth={3} />
        Pedir orçamento agora
      </button>

      <div className="flex flex-wrap justify-center gap-2">
        <button 
          onClick={() => onNavigate('coupon_landing')}
          className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-full text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-[#1E5BFF] dark:hover:text-white transition-colors border border-transparent hover:border-blue-500/10"
        >
          Ver ofertas
        </button>
        <button 
          onClick={() => onNavigate('classifieds')}
          className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-full text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-[#1E5BFF] dark:hover:text-white transition-colors border border-transparent hover:border-blue-500/10"
        >
          Ver classificados
        </button>
        <button 
          onClick={() => onNavigate('explore')}
          className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-full text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-[#1E5BFF] dark:hover:text-white transition-colors border border-transparent hover:border-blue-500/10"
        >
          Encontrar perto de mim
        </button>
      </div>
    </div>
  </section>
);

const MiniPostCard: React.FC<{ post: CommunityPost; onNavigate: (view: string) => void; }> = ({ post, onNavigate }) => {
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

const MiniClassifiedCard: React.FC<{ item: Classified; onNavigate: (view: string) => void; }> = ({ item, onNavigate }) => {
  const itemImage = item.imageUrl || getFallbackImage(item.id);

  return (
    <div className="flex-shrink-0 w-40 snap-center p-1.5">
      <div 
        onClick={() => onNavigate('classifieds')}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer h-full"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <img src={itemImage} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          {item.price && (
             <div className="absolute bottom-2 right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                {item.price}
             </div>
          )}
          <div className="absolute top-2 left-2">
             <span className="text-[8px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">{item.category.split(' ')[0]}</span>
          </div>
        </div>
        <div className="p-3 flex flex-col flex-1 justify-between">
            <h3 className="text-xs font-bold text-gray-800 dark:text-white leading-tight line-clamp-2 mb-1">
                {item.title}
            </h3>
            <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wide truncate flex items-center gap-1">
                <MapPin size={8} /> {item.neighborhood}
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

  // Lógica de Categorias Fixas
  const block1Categories = useMemo(() => CATEGORIES.slice(0, 8), []);
  const block2Categories = useMemo(() => CATEGORIES.slice(8, 15), []);

  const [wizardStep, setWizardStep] = useState(0);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      {userRole === 'lojista' && isFeatureActive('banner_highlights') && <section className="px-4 py-4 bg-white dark:bg-gray-950"><LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} /></section>}
      
      {isFeatureActive('explore_guide') && (
        <section className="w-full bg-white dark:bg-gray-950 pt-4 pb-6 px-4 flex flex-col gap-1.5 relative z-10">
            {/* BLOCO 1 - 8 CATEGORIAS PRINCIPAIS */}
            <div className="grid grid-cols-4 gap-1.5">
                {block1Categories.map((cat) => (
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
            </div>

            {/* BLOCO 2 - 7 CATEGORIAS + BOTÃO MAIS */}
            <div className="grid grid-cols-4 gap-1.5">
                {block2Categories.map((cat) => (
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
                
                {/* BOTÃO MAIS (+) */}
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
            </div>
        </section>
      )}

      {/* BLOCO DE AÇÃO IMEDIATA REFORMULADO */}
      <QuickActionBlock onNavigate={onNavigate} />

      {isFeatureActive('banner_highlights') && (
        <section className="bg-white dark:bg-gray-950 w-full"><HomeBannerCarousel onStoreClick={onStoreClick} onNavigate={onNavigate} /></section>
      )}

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
                <button onClick={() => setWizardStep(0)} className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs active:scale-95 transition-all">Ver propostas</button>
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

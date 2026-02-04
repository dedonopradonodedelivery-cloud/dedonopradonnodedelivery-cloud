
import React, { useState, useMemo, useRef } from 'react';
import { Store, Category, CommunityPost, ServiceRequest, ServiceUrgency, Classified } from '@/types';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Ticket,
  CheckCircle2, 
  Zap, 
  Loader2, 
  Hammer, 
  Plus, 
  Home as HomeIcon,
  MessageSquare, 
  MapPin, 
  Camera, 
  X, 
  Send, 
  ChevronRight,
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_COMMUNITY_POSTS, MOCK_CLASSIFIEDS } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { LaunchOfferBanner } from '@/components/LaunchOfferBanner';
import { HomeBannerCarousel } from '@/components/HomeBannerCarousel';
import { FifaBanner } from '@/components/FifaBanner';
import { MoreCategoriesModal } from '@/components/MoreCategoriesModal';

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
  const { currentNeighborhood } = useNeighborhood();
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);

  // 1️⃣ ORDEM DAS CATEGORIAS (8 POR TELA)
  const categoryPages = useMemo(() => {
    const page1Ids = [
      'cat-saude',     // Saúde
      'cat-fashion',   // Moda
      'cat-pets',      // Pets
      'cat-pro',       // Profissionais
      'cat-beauty',    // Beleza
      'cat-autos',     // Autos
      'cat-sports',    // Esportes
      'cat-edu'        // Educação
    ];

    const p1 = page1Ids.map(id => CATEGORIES.find(c => c.id === id)).filter(Boolean) as Category[];
    const remaining = CATEGORIES.filter(c => !page1Ids.includes(c.id));
    
    // Página 2 (7 categorias + Botão Mais)
    return [p1, remaining.slice(0, 7)];
  }, []);

  const handleCategoryScroll = () => {
    if (!categoryScrollRef.current) return;
    const scrollLeft = categoryScrollRef.current.scrollLeft;
    const width = categoryScrollRef.current.clientWidth;
    const page = Math.round(scrollLeft / width);
    if (page !== currentCategoryPage) setCurrentCategoryPage(page);
  };

  const [wizardStep, setWizardStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [lastCreatedRequestId, setLastCreatedRequestId] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && images.length < 3) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleWizardSubmit = () => {
    if (!user) {
        localStorage.setItem('pending_wizard_state', JSON.stringify({ selectedService, selectedUrgency, description, images }));
        onNavigate('profile');
        return;
    }
    setIsSubmittingLead(true);
    const requestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead: ServiceRequest = {
        id: requestId,
        userId: user.id,
        userName: user.user_metadata?.full_name || 'Morador Local',
        serviceType: selectedService || 'Geral',
        description,
        neighborhood: currentNeighborhood,
        urgency: (selectedUrgency as ServiceUrgency) || 'Não tenho pressa',
        images,
        status: 'open',
        createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem('service_requests_mock') || '[]');
    localStorage.setItem('service_requests_mock', JSON.stringify([newLead, ...existing]));
    setLastCreatedRequestId(requestId);
    setTimeout(() => {
      setIsSubmittingLead(false);
      setWizardStep(4);
    }, 1500);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      
      {userRole === 'lojista' && (
        <section className="px-4 py-4 bg-white dark:bg-gray-950">
           <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}

      {/* 2️⃣ CATEGORIAS (Grid 4x2 com Swipe - PADRÃO IMAGEM 2) */}
      <section className="w-full bg-[#FFFFFF] dark:bg-gray-950 pt-4 relative z-10">
        <div 
          ref={categoryScrollRef}
          onScroll={handleCategoryScroll}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {categoryPages.map((page, pageIdx) => (
            <div key={pageIdx} className="min-w-full px-4 grid grid-cols-4 gap-x-2 gap-y-4 snap-center pb-2">
              {page.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => onSelectCategory(cat)}
                  className={`flex flex-col items-center justify-between p-2 rounded-[25px] border border-white/20 shadow-sm active:scale-95 transition-all w-full aspect-square ${cat.color}`}
                >
                  <div className="flex-1 flex items-center justify-center">
                    {React.cloneElement(cat.icon as any, { className: "w-6 h-6 text-white", strokeWidth: 3 })}
                  </div>
                  <span className="w-full text-[8px] font-black text-white text-center uppercase tracking-tighter leading-tight pb-1 truncate">
                    {cat.name}
                  </span>
                </button>
              ))}

              {/* Inserção do Botão "Mais" se for a última página */}
              {pageIdx === categoryPages.length - 1 && (
                <button 
                  onClick={() => setIsMoreModalOpen(true)}
                  className="flex flex-col items-center justify-between p-2 rounded-[25px] border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-sm active:scale-95 transition-all w-full aspect-square"
                >
                  <div className="flex-1 flex items-center justify-center">
                    <Plus size={24} className="text-gray-600 dark:text-gray-400" strokeWidth={4} />
                  </div>
                  <span className="w-full text-[8px] font-black text-gray-600 dark:text-gray-400 text-center uppercase tracking-tighter leading-tight pb-1">
                    Mais
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Indicadores de Página (Dots) */}
        <div className="flex justify-center gap-1.5 mt-4 mb-6">
          {categoryPages.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentCategoryPage ? 'w-4 bg-blue-600 shadow-sm' : 'w-1.5 bg-gray-300'}`} 
            />
          ))}
        </div>
      </section>

      {/* 3️⃣ CARROSSEL PRINCIPAL */}
      <section className="bg-white dark:bg-gray-950 w-full">
        <HomeBannerCarousel onStoreClick={onStoreClick} onNavigate={onNavigate} />
      </section>

      {/* 4️⃣ JPA CONVERSA */}
      <section className="bg-white dark:bg-gray-950 pt-2 pb-6 relative px-5">
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                JPA Conversa
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </h2>
            <button onClick={() => onNavigate('neighborhood_posts')} className="text-xs font-bold text-blue-500">Ver tudo</button>
        </div>
        <div className="relative group">
            <div className="flex overflow-x-auto no-scrollbar snap-x -mx-1 pb-2">
                {MOCK_COMMUNITY_POSTS.slice(0, 5).map((post) => (
                    <MiniPostCard key={post.id} post={post} onNavigate={onNavigate} />
                ))}
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full flex items-center justify-end bg-gradient-to-l from-white/90 dark:from-gray-950/90 to-transparent w-12 pointer-events-none">
                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 opacity-80" />
            </div>
        </div>
      </section>

      {/* 5️⃣ CUPONS */}
      <section className="px-5 mb-6">
        <button 
          onClick={() => onNavigate('weekly_reward_page')}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all border border-white/10"
        >
           <div className="flex items-center gap-3">
               <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                 <Ticket className="text-white" size={20} />
               </div>
               <div className="text-left">
                 <p className="text-white font-black text-sm uppercase tracking-wide">Cupons Disponíveis</p>
                 <p className="text-emerald-100 text-[10px] font-medium opacity-90">Resgate descontos exclusivos no bairro</p>
               </div>
           </div>
           <ChevronRight className="text-white" size={16} />
        </button>
      </section>

      {/* 6️⃣ SERVIÇOS */}
      <section className="px-5 mb-8 bg-white dark:bg-gray-950">
        <FifaBanner onClick={() => setWizardStep(1)} />
      </section>

      {/* 7️⃣ CLASSIFICADOS */}
      <section className="bg-white dark:bg-gray-950 pb-8">
        <div className="px-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Classificados</h2>
                <button onClick={() => onNavigate('classifieds')} className="text-xs font-bold text-blue-500">Ver todos</button>
            </div>
        </div>
        <div className="flex overflow-x-auto no-scrollbar snap-x -mx-3.5 px-3.5">
            {MOCK_CLASSIFIEDS.slice(0, 5).map((item) => (
                <MiniClassifiedCard key={item.id} item={item} onNavigate={onNavigate} />
            ))}
        </div>
      </section>

      {/* 8️⃣ EXPLORAR BAIRRO */}
      <div className="w-full bg-white dark:bg-gray-900 pt-1 pb-10">
        <div className="px-5">
          <SectionHeader icon={Compass} title="Explorar Bairro" subtitle="Tudo o que você precisa" onSeeMore={() => onNavigate('explore')} />
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-4">
            {['all', 'top_rated'].map((f) => (
              <button key={f} onClick={() => setListFilter(f as any)} className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>
                {f === 'all' ? 'Tudo' : 'Top'}
              </button>
            ))}
          </div>
          <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter as any} user={user} onNavigate={onNavigate} premiumOnly={false} />
        </div>
      </div>

      <MoreCategoriesModal 
        isOpen={isMoreModalOpen}
        onClose={() => setIsMoreModalOpen(false)}
        onSelectCategory={onSelectCategory}
      />
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void }> = ({ icon: Icon, title, subtitle, onSeeMore }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white shadow-sm">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div>
        <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">{title}</h2>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{subtitle}</p>
      </div>
    </div>
    <button onClick={onSeeMore} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest hover:underline active:opacity-60">Ver mais</button>
  </div>
);

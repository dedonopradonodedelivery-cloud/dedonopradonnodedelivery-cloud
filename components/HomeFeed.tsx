
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Store, Category, CommunityPost, ServiceRequest, ServiceUrgency, Classified, AdType } from '@/types';
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
  ChevronLeft,
  Clock,
  AlertTriangle,
  Megaphone,
  Calendar,
  MessageCircle,
  Dog,
  Key,
  Phone,
  Star,
  Scissors,
  BookOpen,
  Lightbulb,
  User as UserIcon,
  ShoppingBag,
  Search,
  Briefcase
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_COMMUNITY_POSTS, MOCK_CLASSIFIEDS, STORES } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { LaunchOfferBanner } from '@/components/LaunchOfferBanner';
import { HomeBannerCarousel } from '@/components/HomeBannerCarousel';
import { FifaBanner } from '@/components/FifaBanner';
import { useFeatures } from '@/contexts/FeatureContext';
import { MoreCategoriesModal } from './MoreCategoriesModal';

// Imagens de fallback realistas e variadas (Bairro, Pessoas, Comércio, Objetos)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800', // Bairro/Rua
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800', // Rua/Comércio
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000', // Pessoas/Comunidade
  'https://images.unsplash.com/photo-1534723452202-428aae1ad99d?q=80&w=800', // Mercado/Loja
  'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800', // Serviço/Trabalho
  'https://images.unsplash.com/photo-1551632432-c735e8399527?q=80&w=800', // Parque/Verde
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800', // Moda/Cotidiano
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800', // Escritório/Pro
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800', // Interior/Casa
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800', // Prédio
];

const getFallbackImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
};

const HAPPENING_NOW_MOCK = [
  {
    id: 'hn-1',
    type: 'promotion',
    title: 'Rodízio de Pizza 25% OFF',
    subtitle: 'Pizzaria do Zé',
    timeRemaining: 'Até as 23h',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop',
    color: 'from-orange-600 to-red-700'
  },
  {
    id: 'hn-2',
    type: 'event',
    title: 'Feira Gastronômica Regional',
    subtitle: 'Praça da Freguesia',
    timeRemaining: 'Termina em 1h',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=200&auto=format&fit=crop',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'hn-3',
    type: 'alert',
    title: 'Obra na Est. dos Três Rios',
    subtitle: 'Trânsito lento sentido Centro',
    timeRemaining: 'Reportado agora',
    image: null,
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'hn-4',
    type: 'promotion',
    title: 'Happy Hour Double Drink',
    subtitle: 'Bar do Zé',
    timeRemaining: 'Inicia às 18h',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=200&auto=format&fit=crop',
    color: 'from-purple-600 to-pink-700'
  },
  {
    id: 'hn-5',
    type: 'availability',
    title: 'Diarista para amanhã',
    subtitle: 'Disponível na região',
    timeRemaining: 'Apenas 1 vaga',
    image: 'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800',
    color: 'from-emerald-600 to-teal-700'
  }
];

const COUPONS_MOCK = [
  {
    id: 'cp-1',
    storeName: 'Bibi Lanches',
    logo: 'https://ui-avatars.com/api/?name=Bibi+Lanches&background=FF6B00&color=fff',
    initials: 'BL',
    discount: '15% OFF',
    storeId: 'f-1'
  },
  {
    id: 'cp-2',
    storeName: 'Studio Hair',
    logo: 'https://ui-avatars.com/api/?name=Studio+Hair&background=BC1F66&color=fff',
    initials: 'SH',
    discount: 'R$ 20,00',
    storeId: 'f-2'
  },
  {
    id: 'cp-3',
    storeName: 'Pizzaria do Zé',
    logo: 'https://ui-avatars.com/api/?name=Pizzaria+Ze&background=22C55E&color=fff',
    initials: 'PZ',
    discount: 'Entrega Grátis',
    storeId: 'f-5'
  },
  {
    id: 'cp-4',
    storeName: 'Pet Shop Alegria',
    logo: 'https://ui-avatars.com/api/?name=Pet+Alegria&background=0EA5E9&color=fff',
    initials: 'PA',
    discount: '10% OFF',
    storeId: 'f-3'
  },
  {
    id: 'cp-5',
    storeName: 'Academia Fit',
    logo: 'https://ui-avatars.com/api/?name=Academia+Fit&background=4F46E5&color=fff',
    initials: 'AF',
    discount: '1ª Mês Grátis',
    storeId: 'f-8'
  }
];

const LOST_AND_FOUND_MOCK = [
  {
    id: 'lf1',
    type: 'lost_pet',
    title: 'Pinscher Totó',
    description: 'Fugiu perto da Praça Seca. Coleira azul. Atende pelo nome de Totó.',
    location: 'Praça Seca',
    time: 'Há 2h',
    image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=200&auto=format&fit=crop',
    contact: '5521999999999'
  },
  {
    id: 'lf2',
    type: 'found_item',
    title: 'Chaves de Carro',
    description: 'Encontradas na calçada da Padaria Imperial. Chaveiro do Flamengo.',
    location: 'Freguesia',
    time: 'Há 5h',
    image: 'https://images.unsplash.com/photo-1583574883377-2f3b9220556b?q=80&w=200&auto=format&fit=crop',
    contact: '5521999999999'
  },
  {
    id: 'lf3',
    type: 'lost_pet',
    title: 'Gato Siamês Mimi',
    description: 'Visto pela última vez no telhado na Rua Araguaia. Tem uma mancha branca no nariz.',
    location: 'Freguesia',
    time: 'Ontem',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=200&auto=format&fit=crop',
    contact: '5521999999999'
  },
  {
    id: 'lf4',
    type: 'found_item',
    title: 'Carteira Couro',
    description: 'Encontrada no Center Shopping. Documentos em nome de João Paulo.',
    location: 'Pechincha',
    time: 'Hoje',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=200&auto=format&fit=crop',
    contact: '5521999999999'
  }
];

const LostAndFoundDetailModal: React.FC<{ item: typeof LOST_AND_FOUND_MOCK[0] | null, onClose: () => void }> = ({ item, onClose }) => {
    if (!item) return null;
    const isLost = item.type === 'lost_pet';
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-t-[2rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/20 text-white rounded-full backdrop-blur-md">
                    <X size={20} />
                </button>
                <div className="relative aspect-square w-full">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 ${isLost ? 'bg-orange-50' : 'bg-emerald-50'}`}>
                            {isLost ? 'Perdido' : 'Encontrado'}
                        </span>
                        <h2 className="text-2xl font-bold leading-tight">{item.title}</h2>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-[#1E5BFF]" />
                            {item.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-[#1E5BFF]" />
                            {item.time}
                        </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium mb-8">
                        {item.description}
                    </p>
                    <button 
                        onClick={() => window.open(`https://wa.me/${item.contact}`, '_blank')}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold uppercase tracking-widest text-xs shadow-lg active:scale-[0.98] transition-all ${isLost ? 'bg-orange-500 shadow-orange-500/30' : 'bg-emerald-500 shadow-emerald-500/30'}`}
                    >
                        <Phone size={16} /> Entrar em Contato
                    </button>
                </div>
            </div>
        </div>
    );
};

const LostAndFoundSection: React.FC<{ onItemClick: (item: typeof LOST_AND_FOUND_MOCK[0]) => void }> = ({ onItemClick }) => {
    return (
        <section className="py-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
            {/* 1. MINI-BANNER DE CONTEXTO */}
            <div className="px-5 mb-5">
                <div className="relative aspect-[16/4] w-full rounded-3xl overflow-hidden shadow-sm flex items-center p-5 bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 border border-white/5">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                             <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                                <Search size={14} className="text-white" />
                             </div>
                             <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Achados e Perdidos</h2>
                        </div>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest leading-none">Pets e objetos encontrados ou perdidos no bairro</p>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x px-5 pb-2">
                {LOST_AND_FOUND_MOCK.map((item) => {
                    const isLost = item.type === 'lost_pet';
                    const Icon = isLost ? Dog : Key;
                    
                    return (
                        <div 
                            key={item.id}
                            onClick={() => onItemClick(item)}
                            className="flex-shrink-0 w-36 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex flex-col cursor-pointer active:scale-95 transition-all group snap-center overflow-hidden shadow-sm"
                        >
                            <div className="h-32 bg-gray-100 dark:bg-gray-800 relative">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider text-white shadow-md ${isLost ? 'bg-orange-500' : 'bg-emerald-500'}`}>
                                    {isLost ? 'Perdido' : 'Achado'}
                                </div>
                            </div>

                            <div className="p-3 flex flex-col gap-1 flex-1">
                                <div className="flex items-center gap-1 text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                    <Icon size={10} className="text-[#1E5BFF]" />
                                    {isLost ? 'Animal' : 'Objeto'}
                                </div>
                                <h3 className="font-bold text-[11px] text-gray-900 dark:text-white leading-tight truncate-2-lines h-8">
                                    {item.title}
                                </h3>
                                <div className="flex flex-col gap-0.5 mt-auto pt-2 border-t border-gray-50 dark:border-gray-800">
                                    <div className="flex items-center gap-1 text-[9px] text-gray-500 dark:text-gray-400 font-bold truncate">
                                        <MapPin size={8} className="shrink-0 text-blue-500" /> {item.location}
                                    </div>
                                    <div className="flex items-center gap-1 text-[8px] text-gray-400 dark:text-gray-500 font-medium">
                                        <Clock size={8} className="shrink-0" /> {item.time}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const CouponsBlock: React.FC<{ onNavigate: (view: string) => void; user: User | null; userRole: string | null }> = ({ onNavigate, user, userRole }) => {
  
  const handleCouponClick = () => {
    if (user) {
        onNavigate(userRole === 'lojista' ? 'merchant_coupons' : 'user_coupons');
    } else {
        onNavigate('coupon_landing');
    }
  };

  return (
    <div className="py-6 border-b border-gray-100 dark:border-gray-800">
       <div className="flex items-center justify-between mb-1 px-5">
         <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-1">Cupons</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Para você economizar</p>
         </div>
         <button onClick={handleCouponClick} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline active:opacity-60">Ver todos</button>
       </div>
       
       <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x px-5 pt-6 pb-2">
          {COUPONS_MOCK.map((coupon) => (
            <div 
              key={coupon.id} 
              onClick={handleCouponClick}
              className="relative flex-shrink-0 w-36 snap-center cursor-pointer group"
            >
               <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 p-0.5 shadow-md border border-gray-100 dark:border-gray-700">
                     <img src={coupon.logo} alt="" className="w-full h-full rounded-full object-cover" />
                  </div>
               </div>

               <div className="w-full h-44 bg-[#1E5BFF] rounded-3xl shadow-lg relative overflow-hidden active:scale-95 transition-transform flex flex-col">
                  <div className="absolute top-[74px] -left-2 w-4 h-4 rounded-full bg-white dark:bg-gray-950 z-10"></div>
                  <div className="absolute top-[74px] -right-2 w-4 h-4 rounded-full bg-white dark:bg-gray-950 z-10"></div>
                  <div className="flex flex-col items-center justify-center h-[82px] pt-4 px-3 text-center">
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">CUPOM</span>
                      <span className="text-xl font-black text-white leading-none tracking-tight">{coupon.discount}</span>
                  </div>
                  <div className="w-full px-0">
                    <div className="w-full h-px border-t-2 border-dashed border-white/30"></div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center p-3 pb-6">
                     <button className="w-full bg-white text-[#1E5BFF] text-[10px] font-black uppercase tracking-widest py-3 rounded-xl shadow-sm transition-colors">
                         Pegar cupom
                     </button>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

const HappeningNowSection: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="px-5 pt-6 pb-8 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
            Acontecendo Agora 
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            </h2>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest leading-none">Tempo real no bairro</p>
        </div>
      </div>
      
      <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-5 px-5">
        {HAPPENING_NOW_MOCK.map((item) => (
            <div 
                key={item.id} 
                className="snap-start shrink-0 w-[90%] md:w-[360px]"
                onClick={() => alert(`Explorar ${item.title}`)}
            >
                <div className={`relative aspect-[16/4] w-full rounded-[2rem] overflow-hidden shadow-sm flex items-center p-4 group cursor-pointer bg-gradient-to-r ${item.type === 'promotion' ? 'from-orange-600 to-red-700' : item.type === 'event' ? 'from-blue-600 to-indigo-700' : 'from-amber-500 to-orange-600'}`}>
                    {item.image && (
                        <img src={item.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
                    )}
                    <div className="relative z-10 flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="bg-white/20 backdrop-blur-md text-white text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-white/10">
                                {item.type === 'promotion' ? 'Promoção' : item.type === 'event' ? 'Evento' : 'Aviso'}
                            </span>
                            <div className="flex items-center gap-1 text-[8px] font-bold text-white/90 uppercase tracking-tighter">
                                <Clock size={10} /> {item.timeRemaining}
                            </div>
                        </div>
                        <h3 className="text-sm font-black text-white leading-none uppercase tracking-tighter truncate max-w-[240px]">{item.title}</h3>
                        <p className="text-[9px] text-white/70 font-medium truncate max-w-[240px] mt-0.5 uppercase tracking-wide">{item.subtitle}</p>
                    </div>
                    <div className="relative z-10 shrink-0 ml-2">
                         <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform">
                            <ChevronRight size={18} />
                         </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
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
  const { isFeatureActive } = useFeatures();
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);
  const itemsPerPage = 8; 
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [selectedLostItem, setSelectedLostItem] = useState<typeof LOST_AND_FOUND_MOCK[0] | null>(null);

  const orderedCategories = useMemo(() => {
    const firstPageIds = ['cat-servicos', 'cat-alimentacao', 'cat-restaurantes', 'cat-mercados', 'cat-farmacias', 'cat-autos', 'cat-moda', 'cat-beleza'];
    const firstPage = firstPageIds.map(id => CATEGORIES.find(c => c.id === id)).filter((c): c is Category => !!c);
    const remaining = CATEGORIES.filter(c => !firstPageIds.includes(c.id));
    return [...firstPage, ...remaining];
  }, []);

  const categoryPages = useMemo(() => {
    const visibleCategories = orderedCategories.slice(0, 15);
    const moreItem: Category = { id: 'more-trigger', name: 'Mais', slug: 'more', icon: <Plus />, color: 'bg-gray-100 dark:bg-gray-800' };
    const allItems = [...visibleCategories, moreItem];
    const pages = [];
    for (let i = 0; i < allItems.length; i += itemsPerPage) { pages.push(allItems.slice(i, i + itemsPerPage)); }
    return pages;
  }, [orderedCategories]);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      
      {/* 1) BUSCA + CATEGORIAS RÁPIDAS */}
      {isFeatureActive('explore_guide') && (
        <section className="w-full bg-white dark:bg-gray-950 pt-4 pb-0 relative z-10 border-b border-gray-50 dark:border-gray-900">
            <div ref={categoryScrollRef} className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth" onScroll={() => { if (categoryScrollRef.current) setCurrentCategoryPage(Math.round(categoryScrollRef.current.scrollLeft / categoryScrollRef.current.clientWidth)); }}>
            {categoryPages.map((pageCategories, pageIndex) => (
                <div key={pageIndex} className="min-w-full px-4 pb-2 snap-center">
                <div className="grid grid-cols-4 gap-1.5">
                    {pageCategories.map((cat, index) => {
                        if (cat.id === 'more-trigger') {
                            return (
                                <button key={cat.id} onClick={() => setIsMoreCategoriesOpen(true)} className="flex flex-col items-center group active:scale-95 transition-all w-full">
                                    <div className={`w-full aspect-square rounded-[22px] shadow-sm flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700`}> 
                                       <div className="flex-1 flex items-center justify-center w-full mb-1">
                                         <Plus className="w-9 h-9 text-gray-400 dark:text-gray-500" strokeWidth={2.5} />
                                       </div>
                                       <span className="block w-full text-[8.5px] font-black text-gray-500 dark:text-gray-400 text-center uppercase tracking-tighter leading-none truncate">Mais</span>
                                    </div>
                                </button>
                            );
                        }
                        return (
                        <button key={`${cat.id}-${pageIndex}-${index}`} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all w-full">
                            <div className={`w-full aspect-square rounded-[22px] shadow-sm flex flex-col items-center justify-center p-3 ${cat.color || 'bg-blue-600'} border border-white/20`}>
                              <div className="flex-1 flex items-center justify-center w-full mb-1">
                                {React.cloneElement(cat.icon as any, { className: "w-9 h-9 text-white drop-shadow-md", strokeWidth: 2.5 })}
                              </div>
                              <span className="block w-full text-[8.5px] font-black text-white text-center uppercase tracking-tighter leading-none truncate">{cat.name}</span>
                            </div>
                        </button>
                        );
                    })}
                </div>
                </div>
            ))}
            </div>
            <div className="flex justify-center gap-1.5 pb-4 pt-2">
            {categoryPages.map((_, idx) => <div key={idx} className={`rounded-full transition-all duration-300 ${idx === currentCategoryPage ? 'bg-gray-800 dark:bg-white w-1.5 h-1.5' : 'bg-gray-300 dark:bg-gray-700 w-1.5 h-1.5'}`} />)}
            </div>
        </section>
      )}

      {/* 2) BLOCO PRINCIPAL: SERVIÇOS PROFISSIONAIS */}
      {isFeatureActive('service_chat') && (
        <section className="py-8 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
          <div className="px-5">
            <FifaBanner onClick={() => setWizardStep(1)} />
          </div>
        </section>
      )}

      {/* NOVO POSICIONAMENTO: CARROSSEL DE BANNERS (ABAIXO DE SERVIÇOS) */}
      {isFeatureActive('banner_highlights') && (
        <section className="bg-white dark:bg-gray-950 w-full">
          <HomeBannerCarousel onStoreClick={onStoreClick} onNavigate={onNavigate} />
        </section>
      )}

      {/* 3) CUPONS */}
      <CouponsBlock onNavigate={onNavigate} user={user} userRole={userRole} />

      {/* 4) ACONTECENDO AGORA */}
      <HappeningNowSection onNavigate={onNavigate} />

      {/* 5) ACHADOS E PERDIDOS */}
      <LostAndFoundSection onItemClick={setSelectedLostItem} />

      {/* 6) EXPLORAR BAIRRO (LIMITADO) */}
      {isFeatureActive('explore_guide') && (
        <div className="w-full bg-white dark:bg-gray-900 pt-8 pb-12">
            <div className="px-5">
            <SectionHeader icon={Compass} title="Explorar Bairro" subtitle="Descubra novos lugares próximos" onSeeMore={() => onNavigate('explore')} />
            <div className="mt-4">
                <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter="all" user={user} onNavigate={onNavigate} premiumOnly={false} limit={3} />
            </div>
            <button onClick={() => onNavigate('explore')} className="w-full mt-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-sm font-black text-[#1E5BFF] uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Explorar todos os locais <ChevronRight size={16} strokeWidth={3} />
            </button>
            </div>
        </div>
      )}

      {/* MODALS E WIZARDS (CONDICIONAL) */}
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
        </section>
      )}

      <LostAndFoundDetailModal item={selectedLostItem} onClose={() => setSelectedLostItem(null)} />
      <MoreCategoriesModal isOpen={isMoreCategoriesOpen} onClose={() => setIsMoreCategoriesOpen(false)} onSelectCategory={(category: Category) => { setIsMoreCategoriesOpen(false); onSelectCategory(category); }} />
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void }> = ({ icon: Icon, title, subtitle, onSeeMore }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white shadow-sm"><Icon size={18} strokeWidth={2.5} /></div><div><h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">{title}</h2><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{subtitle}</p></div></div>
    <button onClick={onSeeMore} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline active:opacity-60">Ver todos</button>
  </div>
);

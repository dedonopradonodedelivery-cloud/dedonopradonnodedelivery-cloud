
import React, { useState, useMemo, useEffect } from 'react';
import { Store, Category, Job, CompatibilityResult } from '@/types';
import { 
  Compass, 
  MapPin, 
  Sun,
  Plus,
  Heart,
  Wrench,
  PawPrint,
  Shirt,
  Scissors,
  CarFront,
  Ticket,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Flame,
  Music,
  Construction,
  AlertTriangle,
  Clock,
  ShieldCheck,
  BadgeCheck,
  Zap,
  Info,
  Search,
  Package,
  Key,
  Camera,
  Briefcase,
  Building2,
  TrendingUp,
  Repeat,
  Settings,
  X,
  FileText,
  CloudLightning,
  Sparkle,
  Cpu,
  Repeat2
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { LaunchOfferBanner } from '@/components/LaunchOfferBanner';
import { useFeatures } from '@/contexts/FeatureContext';
import { MoreCategoriesModal } from './MoreCategoriesModal';
import { calculateCompatibility, MOCK_JOBS_FOR_TESTING, MOCK_CANDIDATE_PROFILES } from '@/utils/compatibilityEngine';
import { MerchantJob } from './MerchantJobsModule';
import { StoryViewer } from './StoryViewer';

const QUICK_CATEGORIES: { name: string, icon: React.ElementType, slug: string }[] = [
  { name: 'Saúde', icon: Heart, slug: 'saude' },
  { name: 'Serviços', icon: Wrench, slug: 'servicos' },
  { name: 'Pet', icon: PawPrint, slug: 'pets' },
  { name: 'Moda', icon: Shirt, slug: 'moda' },
  { name: 'Beleza', icon: Scissors, slug: 'beleza' },
  { name: 'Auto', icon: CarFront, slug: 'autos' },
];

const MOCK_COUPONS = [
  { id: 1, store: 'Bibi Lanches', discount: '20% OFF', category: 'Comida', color: 'from-orange-500 to-rose-500' },
  { id: 2, store: 'Studio Hair', discount: 'R$ 15 OFF', category: 'Beleza', color: 'from-blue-600 to-indigo-700' },
  { id: 3, store: 'Pet Alegria', discount: '10% OFF', category: 'Pets', color: 'from-emerald-500 to-teal-600' },
  { id: 4, store: 'Mecânica 24h', discount: '5% OFF', category: 'Auto', color: 'from-slate-600 to-slate-800' },
];

const ACONTECENDO_AGORA_FEED = [
  { 
    id: 1, 
    type: 'EVENTOS',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800',
    authorName: 'Bar do Zé',
    authorAvatar: 'https://i.pravatar.cc/150?u=ze',
    timestamp: 'há 2h'
  },
  { 
    id: 2, 
    type: 'TRÂNSITO',
    image: 'https://images.unsplash.com/photo-1581094371996-518296a8f15b?q=80&w=800',
    videoUrl: 'https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4',
    authorName: 'JPA Alertas',
    authorAvatar: 'https://i.pravatar.cc/150?u=alerts',
    timestamp: 'agora'
  },
  { 
    id: 3, 
    type: 'PET PERDIDO',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=400&auto=format&fit=crop',
    authorName: 'Mariana Silva',
    authorAvatar: 'https://i.pravatar.cc/150?u=mariana',
    timestamp: 'há 1h'
  },
  { 
    id: 4, 
    type: 'ALERTA CLIMA',
    image: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?q=80&w=800',
    authorName: 'Defesa Civil',
    authorAvatar: 'https://i.pravatar.cc/150?u=defesa',
    timestamp: 'há 3h'
  },
  { 
    id: 5, 
    type: 'UTILIDADE',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800',
    authorName: 'Prefeitura Rio',
    authorAvatar: 'https://i.pravatar.cc/150?u=pref',
    timestamp: 'há 5h'
  }
];

const SectionHeader: React.FC<{ 
  icon: React.ElementType; 
  title: string; 
  subtitle?: string; 
  onSeeMore?: () => void; 
  iconColor?: string; 
  iconBg?: string; 
  titleClassName?: string; 
  subtitleClassName?: string; 
  seeMoreClassName?: string; 
 }> = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onSeeMore, 
  iconColor = "text-blue-600", 
  iconBg = "bg-gray-50 dark:bg-gray-900", 
  titleClassName = "text-gray-900 dark:text-white", 
  subtitleClassName = "text-gray-400", 
  seeMoreClassName = "text-blue-600" 
}) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center ${iconColor} shadow-sm border border-black/10 dark:border-white/5`}>
            <Icon size={20} strokeWidth={2.5} />
        </div>
        <div>
            <h2 className={`text-[12px] font-black uppercase tracking-[0.15em] mb-1 ${titleClassName}`}>{title}</h2>
            {subtitle && <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${subtitleClassName}`}>{subtitle}</p>}
        </div>
    </div>
    {onSeeMore && <button onClick={onSeeMore} className={`text-[10px] font-black uppercase tracking-widest ${seeMoreClassName}`}>Ver mais</button>}
  </div>
);

const HappeningNowCard: React.FC<{ item: typeof ACONTECENDO_AGORA_FEED[0], onClick: () => void }> = ({ item, onClick }) => (
    <div
      onClick={onClick}
      className="relative flex-shrink-0 w-36 aspect-[9/16] rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all active:scale-[0.97] bg-slate-900 snap-start"
    >
        {/* Background Image */}
        <img 
          src={item.image} 
          alt={item.type} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        
        {/* Subtle Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        
        {/* Top Tag Label */}
        <div className="absolute top-3 left-3 right-3">
            <div className="inline-flex bg-black/40 backdrop-blur-md border border-white/20 px-2 py-1 rounded-full">
                <span className="text-[7px] font-black text-white uppercase tracking-[0.15em] whitespace-nowrap">
                    {item.type}
                </span>
            </div>
        </div>
    </div>
);


const InstitutionalBanner: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <section className="px-6 py-6">
    <div 
      onClick={onClick}
      className="relative bg-gradient-to-br from-[#1E5BFF] via-[#1E5BFF] to-[#0A3BBF] rounded-2xl py-5 px-6 shadow-[0_10px_30px_rgba(30,91,255,0.15)] overflow-hidden group border border-white/10 transition-all active:scale-[0.99] cursor-pointer"
    >
        
        {/* Camada de Micro-Motion / Glow Suave */}
        <div className="absolute top-[-50%] right-[-10%] w-[200px] h-[200px] bg-white/5 rounded-full blur-[60px] animate-premium-glow pointer-events-none"></div>
        
        {/* Flare de luz passando suavemente */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-flare pointer-events-none"></div>

        <div className="relative z-10 flex items-center justify-center gap-4">
            {/* Logo Compacto com Glassmorphism */}
            <div className="w-10 h-10 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center shrink-0 border border-white/20 shadow-sm transition-transform group-hover:scale-105 duration-700">
                <MapPin size={20} className="text-white fill-white/20" strokeWidth={2.5} />
            </div>

            {/* Texto Manifesto - Alinhado ao meio */}
            <p className="text-sm font-display font-black text-white leading-tight tracking-tight text-center">
                Acreditamos que a vida acontece perto. 💙
            </p>
        </div>
    </div>
  </section>
);

export const HomeFeed: React.FC<{
  onNavigate: (view: string, data?: any) => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
  onSelectCategory: (category: Category) => void;
}> = ({ onNavigate, onStoreClick, user, userRole, onSelectCategory }) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated'>('all');
  const { currentNeighborhood } = useNeighborhood();
  const { isFeatureActive } = useFeatures();
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState<any | null>(null);
  
  // Controle do Visualizador de Stories
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    setCandidateProfile(MOCK_CANDIDATE_PROFILES[0]);
  }, []);

  const STORY_THEMES = ['Eventos', 'Trânsito', 'Utilidade', 'Achados e Perdidos', 'Pets Perdidos', 'Alertas'];

  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-full">
      
      {/* 
        ============================================================
        A MÁGICA VISUAL: z-40 e -mt-12
        O container branco agora tem um z-index maior que o Header (z-30),
        permitindo que a borda arredondada sobreponha o azul.
        ============================================================
      */}
      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-12 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden">
        
        {/* 1. UTILITY ROW - Ajustado padding para compensar a subida */}
        <section className="px-8 pt-10 pb-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#1E5BFF]" strokeWidth={2.5} />
                    <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                        {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
                    </span>
                </div>
                
                <div className="w-[1px] h-3 bg-gray-100 dark:bg-gray-800"></div>
                
                <div className="flex items-center gap-1.5">
                    <Sun size={14} className="text-amber-500" strokeWidth={2.5} />
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tabular-nums lowercase">
                        sol <span className="mx-0.5 opacity-30">•</span> 28°C
                    </span>
                </div>
                
                <div className="w-[1px] h-3 bg-gray-100 dark:bg-gray-800"></div>
                
                <div className="flex items-center gap-2">
                    <div className="relative flex">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping absolute opacity-40"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative"></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 lowercase leading-none">
                        trânsito livre
                    </span>
                </div>
            </div>
        </section>

        {/* 2. ICON CATEGORY GRID */}
        <section className="w-full overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex items-center gap-5 px-6 py-6">
            {QUICK_CATEGORIES.map(cat => {
                const fullCat = CATEGORIES.find(c => c.slug === cat.slug);
                if (!fullCat) return null;
                return (
                <button 
                    key={cat.slug} 
                    onClick={() => onSelectCategory(fullCat)} 
                    className="flex flex-col items-center gap-3 flex-shrink-0 group active:scale-95 transition-all"
                >
                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 shadow-sm flex items-center justify-center text-blue-600 group-hover:brightness-110 transition-all">
                    <cat.icon size={26} strokeWidth={2} />
                    </div>
                    <span className="text-[9px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">{cat.name}</span>
                </button>
                )
            })}
            <button 
                onClick={() => setIsMoreCategoriesOpen(true)} 
                className="flex flex-col items-center gap-3 flex-shrink-0 active:scale-95 transition-all"
            >
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-gray-900 border-2 border-dashed border-slate-200 dark:border-gray-800 flex items-center justify-center text-slate-300">
                <Plus size={26} strokeWidth={3} />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mais</span>
            </button>
            </div>
        </section>

        {/* 3. ACONTECENDO AGORA - STORIES PREMIUM LAYOUT */}
        <section className="py-4 space-y-4">
            <div className="px-6">
                <SectionHeader 
                    icon={Flame} 
                    title="Acontecendo agora" 
                    subtitle="Stories do seu bairro" 
                    iconColor="text-amber-500" 
                />
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 snap-x pb-2">
                {ACONTECENDO_AGORA_FEED.map((item, index) => (
                    <HappeningNowCard 
                        key={item.id}
                        item={item} 
                        onClick={() => setSelectedStoryIndex(index)}
                    />
                ))}
            </div>

            {/* Information Scent: Theme Indicators - Moved Below Cards */}
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-6 items-center pt-2">
                {STORY_THEMES.map((theme, i) => (
                    <React.Fragment key={theme}>
                        <span className="flex-shrink-0 text-[8px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 py-1 transition-colors hover:text-blue-500">
                            {theme}
                        </span>
                        {i < STORY_THEMES.length - 1 && (
                            <div className="w-0.5 h-0.5 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </section>

        {/* 4. CUPOM DO DIA */}
        {isFeatureActive('coupons') && (
            <section className="space-y-6 py-12 bg-slate-50/50 dark:bg-white/5 border-y border-gray-100 dark:border-white/5">
            <div className="px-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                    <Ticket size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-[12px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest leading-none mb-1">Cupons do dia</h2>
                    <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 leading-none">Ofertas exclusivas no bairro</p>
                </div>
                </div>
                <button onClick={() => onNavigate('user_coupons')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ver todos</button>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar px-6 pb-2 snap-x">
                {MOCK_COUPONS.map(coupon => (
                <button 
                    key={coupon.id}
                    onClick={() => onNavigate('coupon_landing')}
                    className="flex-shrink-0 w-[185px] relative bg-white dark:bg-gray-900 rounded-2xl border border-slate-200/60 dark:border-gray-800 flex items-center shadow-sm active:scale-[0.98] transition-all snap-start group overflow-hidden h-32"
                >
                    <div className="absolute left-[46px] -top-2 w-3 h-3 bg-slate-50 dark:bg-gray-950 border border-slate-200/60 dark:border-gray-800 rounded-full z-10"></div>
                    <div className="absolute left-[46px] -bottom-2 w-3 h-3 bg-slate-50 dark:bg-gray-950 border border-slate-200/60 dark:border-gray-800 rounded-full z-10"></div>
                    <div className="absolute left(52px] top-4 bottom-4 w-px border-l border-dashed border-gray-200 dark:border-gray-700"></div>

                    <div className={`w-[52px] h-full bg-gradient-to-br ${coupon.color} flex flex-col items-center justify-center text-white shrink-0 relative`}>
                    <Sparkles size={12} className="mb-1 opacity-60" />
                    <span className="text-[7px] font-black leading-none uppercase tracking-tighter vertical-text transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>Ticket</span>
                    </div>

                    <div className="text-left min-w-0 flex-1 pl-4 pr-3">
                    <p className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter truncate mb-1">{coupon.category}</p>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1.5">{coupon.discount}</h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter truncate">{coupon.store}</p>
                    </div>
                </button>
                ))}
            </div>
            </section>
        )}

        {/* 5. VAGAS PERTO DE VOCÊ - BLOCO REDESENHADO PREMIUM */}
        <section className="px-6 py-10 space-y-6">
            <SectionHeader 
                icon={Briefcase} 
                title="💼 Oportunidades no Bairro" 
                subtitle="IA conectando talentos e empresas locais" 
                iconColor="text-emerald-500" 
                subtitleClassName="text-[9px] font-black text-emerald-600/60"
            />
            
            <div 
            onClick={() => onNavigate('jobs')}
            className="w-full bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(16,185,129,0.25)] border border-white/20 cursor-pointer group active:scale-[0.99] transition-all relative overflow-hidden animate-ai-pulse"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 animate-premium-glow"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-flare pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg">
                        <Cpu size={14} className="text-white fill-emerald-200" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">IA-Driven Match</span>
                    </div>
                    
                    <h3 className="text-2xl font-display font-black text-white leading-tight mb-2 tracking-tighter uppercase">
                        Oportunidades <br/> Reais Perto de Você
                    </h3>
                    
                    <p className="text-xs font-bold text-emerald-50 mb-10 leading-relaxed max-w-[240px] opacity-90">
                        Nossa inteligência encontrou vagas compatíveis com seu perfil na região.
                    </p>
                    
                    <div className="w-full bg-white text-emerald-700 font-black py-5 px-8 rounded-2xl shadow-2xl active:scale-95 transition-all text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 group-hover:bg-emerald-50">
                        Explorar Agora
                        <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </section>

        {/* 6. LANÇAMENTO / ADS SECTION */}
        {userRole === 'lojista' && isFeatureActive('sponsored_ads') && (
            <section className="px-6 py-6 animate-in slide-in-from-bottom-4 duration-700">
            <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
            </section>
        )}

        <InstitutionalBanner onClick={() => onNavigate('patrocinador_master')} />
        
        {/* 7. EXPLORE GUIDE SECTION */}
        {isFeatureActive('explore_guide') && (
            <div className="w-full pt-8 pb-10">
                <div className="px-6">
                <SectionHeader icon={Compass} title="Explorar Bairro" subtitle="O melhor perto de você" onSeeMore={() => onNavigate('explore')} />
                <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit mb-6">
                    {['all', 'top_rated'].map((f) => (
                        <button 
                        key={f} 
                        onClick={() => setListFilter(f as any)} 
                        className={`text-[9px] font-black uppercase px-5 py-2 rounded-xl transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-md' : 'text-gray-400'}`}
                        >
                        {f === 'all' ? 'Ver Tudo' : 'Top Avaliados'}
                        </button>
                    ))}
                </div>
                <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter as any} user={user} onNavigate={onNavigate} premiumOnly={false} />
                </div>
            </div>
        )}

        <div className="mt-8 px-6">
             <div className="bg-slate-900 rounded-3xl p-6 shadow-xl flex items-center justify-between group cursor-pointer border border-white/5" onClick={() => onNavigate('patrocinador_master')}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#FF6501]/20 rounded-xl flex items-center justify-center text-[#FF6501] shadow-inner"><Sparkles size={20} /></div>
                    <div>
                        <p className="text-[9px] font-black text-[#FF6501] uppercase tracking-widest mb-0.5 opacity-80">Clube de Vantagens</p>
                        <p className="text-xs font-bold text-white uppercase tracking-tight">Conheça o Atual Clube</p>
                    </div>
                </div>
                <ChevronRight size={18} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
        </div>

      </div>

      <MoreCategoriesModal 
          isOpen={isMoreCategoriesOpen}
          onClose={() => setIsMoreCategoriesOpen(false)}
          onSelectCategory={onSelectCategory}
      />

      {/* Story Viewer Overlay */}
      {selectedStoryIndex !== null && (
        <StoryViewer 
          stories={ACONTECENDO_AGORA_FEED} 
          initialIndex={selectedStoryIndex} 
          onClose={() => setSelectedStoryIndex(null)} 
        />
      )}
    </div>
  );
};

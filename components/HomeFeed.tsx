
import React, { useState } from 'react';
import { Store, Category, Job } from '@/types';
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
  TrendingUp
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_JOBS } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { LaunchOfferBanner } from '@/components/LaunchOfferBanner';
import { useFeatures } from '@/contexts/FeatureContext';
import { MoreCategoriesModal } from './MoreCategoriesModal';

const QUICK_CATEGORIES: { name: string, icon: React.ElementType, slug: string }[] = [
  { name: 'Saúde', icon: Heart, slug: 'saude' },
  { name: 'Serviços', icon: Wrench, slug: 'servicos' },
  { name: 'Pet', icon: PawPrint, slug: 'pets' },
  { name: 'Moda', icon: Shirt, slug: 'moda' },
  { name: 'Beleza', icon: Scissors, slug: 'beleza' },
  { name: 'Auto', icon: CarFront, slug: 'autos' },
];

const MOCK_COUPONS = [
  { id: 1, store: 'Bibi Lanches', discount: '20% OFF', category: 'Alimentação', color: 'from-orange-500 to-rose-500' },
  { id: 2, store: 'Studio Hair', discount: 'R$ 15 OFF', category: 'Beleza', color: 'from-blue-600 to-indigo-700' },
  { id: 3, store: 'Pet Alegria', discount: '10% OFF', category: 'Pets', color: 'from-emerald-500 to-teal-600' },
];

const ACONTECENDO_AGORA_FEED = [
  { 
    id: 1, 
    type: 'EVENTO',
    title: 'Música ao vivo hoje', 
    subtitle: 'Noite de Jazz no Bar do Zeca', 
    time: '20 min', 
    icon: Music, 
    color: 'text-indigo-600', 
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    source: 'Lojista Parceiro',
    isVerified: true
  },
  { 
    id: 2, 
    type: 'TRÂNSITO',
    title: 'Obra na Geremário', 
    subtitle: 'Interdição parcial na altura do Bananal', 
    time: 'Agora', 
    icon: Construction, 
    color: 'text-amber-600', 
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    source: 'Fonte Oficial',
    isVerified: true
  },
  { 
    id: 3, 
    type: 'UTILIDADE',
    title: 'Feira Livre Freguesia', 
    subtitle: 'Barracas montadas na Praça', 
    time: '2h', 
    icon: Zap, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    source: 'Morador Verificado',
    isVerified: true
  }
];

const ACHADOS_PERDIDOS_MOCK = [
  {
    id: 1,
    status: 'ACHADO',
    item: 'Cachorro Beagle',
    location: 'Próximo à Praça da Freguesia',
    time: 'Há 1h',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=400&auto=format&fit=crop',
    color: 'text-emerald-600',
    bg: 'bg-emerald-500'
  },
  {
    id: 2,
    status: 'PERDIDO',
    item: 'Chaves de Carro (BMW)',
    location: 'Estrada do Pau-Ferro',
    time: 'Há 3h',
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400&auto=format&fit=crop',
    color: 'text-amber-600',
    bg: 'bg-amber-500'
  },
  {
    id: 3,
    status: 'ACHADO',
    item: 'Carteira de Couro',
    location: 'Condomínio Rio Shopping',
    time: 'Ontem',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop',
    color: 'text-blue-600',
    bg: 'bg-blue-500'
  }
];

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void; iconColor?: string }> = ({ icon: Icon, title, subtitle, onSeeMore, iconColor = "text-blue-600" }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center ${iconColor} shadow-sm border border-gray-100/50 dark:border-white/5`}>
            <Icon size={20} strokeWidth={2.5} />
        </div>
        <div>
            <h2 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">{title}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{subtitle}</p>
        </div>
    </div>
    <button onClick={onSeeMore} className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ver mais</button>
  </div>
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

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-700 overflow-hidden pb-32 rounded-t-[3.5rem] mt-[215px] relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
      
      {/* 1. UTILITY ROW */}
      <section className="px-8 pt-6 pb-2">
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
                <div className="w-16 h-16 rounded-full bg-brand-blue shadow-[0_10px_25px_rgba(30,91,255,0.25)] flex items-center justify-center text-white border border-white/10 group-hover:brightness-110 transition-all">
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

      {/* 3. ACONTECENDO AGORA */}
      <section className="px-6 py-8 space-y-5">
        <SectionHeader 
            icon={Flame} 
            title="Acontecendo agora" 
            subtitle="Informação verificada no bairro" 
            iconColor="text-amber-500" 
            onSeeMore={() => onNavigate('neighborhood_posts')}
        />

        <div className="space-y-4">
          {ACONTECENDO_AGORA_FEED.map(item => (
            <div 
              key={item.id}
              className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-5 flex items-start gap-5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] group hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              onClick={() => onNavigate('neighborhood_posts')}
            >
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shrink-0 shadow-inner`}>
                <item.icon size={22} strokeWidth={2.5} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${item.color} bg-opacity-10 border border-current border-opacity-20`}>
                        {item.type}
                      </span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-lg">
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{item.time}</span>
                  </div>
                </div>

                <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight mb-1 truncate">
                    {item.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3 line-clamp-1">{item.subtitle}</p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.source === 'Fonte Oficial' ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'}`}>
                            {item.isVerified ? (
                                <BadgeCheck size={10} className={item.source === 'Fonte Oficial' ? 'text-white' : 'text-blue-500'} />
                            ) : (
                                <Info size={10} className="text-gray-400" />
                            )}
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            {item.source}
                        </span>
                    </div>
                    <ChevronRight size={14} className="text-gray-200 group-hover:text-blue-500 transition-colors" strokeWidth={3} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CUPOM DO DIA */}
      {isFeatureActive('coupons') && (
        <section className="space-y-4 py-4">
          <div className="px-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                <Ticket size={16} strokeWidth={2.5} />
              </div>
              <h2 className="text-[12px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Cupons do dia</h2>
            </div>
            <button onClick={() => onNavigate('user_coupons')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ver todos</button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4 snap-x">
            {MOCK_COUPONS.map(coupon => (
              <button 
                key={coupon.id}
                onClick={() => onNavigate('coupon_landing')}
                className="flex-shrink-0 w-[240px] relative bg-slate-50 dark:bg-gray-900 rounded-3xl border border-slate-200/50 dark:border-gray-800 flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all snap-center group overflow-hidden"
              >
                <div className="absolute left-[64px] -top-2 w-4 h-4 bg-white dark:bg-gray-950 border border-slate-200/50 dark:border-gray-800 rounded-full z-10"></div>
                <div className="absolute left-[64px] -bottom-2 w-4 h-4 bg-white dark:bg-gray-950 border border-slate-200/50 dark:border-gray-800 rounded-full z-10"></div>
                <div className="absolute left-[72px] top-4 bottom-4 w-px border-l border-dashed border-gray-200 dark:border-gray-700"></div>

                <div className={`w-[72px] h-24 bg-gradient-to-br ${coupon.color} flex flex-col items-center justify-center text-white shrink-0 relative`}>
                  <Sparkles size={14} className="mb-0.5 opacity-60" />
                  <span className="text-[8px] font-black leading-none uppercase tracking-tighter">Ticket</span>
                </div>

                <div className="text-left min-w-0 flex-1 pl-6 pr-4">
                  <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter truncate">{coupon.category}</p>
                  <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5">{coupon.discount}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{coupon.store}</p>
                </div>

                <ChevronRight size={14} className="text-gray-200 group-hover:text-blue-500 transition-colors mr-3" strokeWidth={3} />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 5. ACHADOS & PERDIDOS */}
      <section className="px-6 py-4 space-y-5">
        <SectionHeader 
            icon={Search} 
            title="Achados & Perdidos" 
            subtitle="Identificação visual imediata" 
            iconColor="text-[#1E5BFF]" 
            onSeeMore={() => onNavigate('classifieds')}
        />

        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-4 snap-x">
          {ACHADOS_PERDIDOS_MOCK.map(item => (
            <div 
              key={item.id}
              onClick={() => onNavigate('classifieds')}
              className="bg-white dark:bg-gray-900 rounded-[2.2rem] border border-gray-100 dark:border-gray-800 w-[220px] shadow-sm flex flex-col snap-center active:scale-[0.98] transition-all overflow-hidden cursor-pointer group"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                    src={item.image} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                    alt={item.item}
                />
                <div className="absolute top-3 left-3">
                    <span className={`text-[8px] font-black px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20 text-white shadow-lg ${item.bg}`}>
                    {item.status}
                    </span>
                </div>
              </div>
              
              <div className="p-4 flex flex-col gap-1">
                <h4 className="text-[13px] font-black text-gray-900 dark:text-white leading-tight truncate">{item.item}</h4>
                <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                  <MapPin size={10} className="text-[#1E5BFF]" />
                  <span className="text-[9px] font-bold uppercase tracking-tight truncate flex-1">{item.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300 mt-1">
                  <Clock size={10} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TRABALHE PERTO DE VOCÊ */}
      {isFeatureActive('classifieds') && (
        <section className="px-6 py-8 space-y-5">
            <SectionHeader 
                icon={Briefcase} 
                title="Trabalhe perto de você" 
                subtitle="Vagas e oportunidades locais" 
                iconColor="text-emerald-500" 
                onSeeMore={() => onNavigate('jobs')}
            />

            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-4 snap-x">
                {MOCK_JOBS.slice(0, 5).map((job: Job) => (
                    <div 
                        key={job.id}
                        onClick={() => onNavigate('job_detail', { job })}
                        className="bg-white dark:bg-gray-900 rounded-[2.2rem] border border-gray-100 dark:border-gray-800 w-[260px] shadow-sm p-6 flex flex-col snap-center active:scale-[0.98] transition-all relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all">
                            <Building2 size={80} />
                        </div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E5BFF] border border-blue-100 dark:border-blue-800/50">
                                <Briefcase size={22} />
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
                                {job.type}
                            </span>
                        </div>

                        <h4 className="text-[15px] font-black text-gray-900 dark:text-white leading-tight mb-1 truncate pr-2 relative z-10">
                            {job.role}
                        </h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 relative z-10">
                            {job.company}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800 relative z-10">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <MapPin size={10} className="text-emerald-500" />
                                    <span className="text-[9px] font-black uppercase tracking-tight">{job.neighborhood}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-300">
                                    <TrendingUp size={10} className="text-blue-400" />
                                    <span className="text-[9px] font-black uppercase tracking-tight">Oportunidade real</span>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[#1E5BFF] group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <ChevronRight size={16} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      )}

      {/* 7. LANÇAMENTO / ADS SECTION */}
      {userRole === 'lojista' && isFeatureActive('sponsored_ads') && (
        <section className="px-6 py-6 animate-in slide-in-from-bottom-4 duration-700">
          <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}
      
      {/* 8. EXPLORE GUIDE SECTION */}
      {isFeatureActive('explore_guide') && (
        <div className="w-full pt-10 pb-10">
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

      <MoreCategoriesModal 
          isOpen={isMoreCategoriesOpen}
          onClose={() => setIsMoreCategoriesOpen(false)}
          onSelectCategory={onSelectCategory}
      />
    </div>
  );
};

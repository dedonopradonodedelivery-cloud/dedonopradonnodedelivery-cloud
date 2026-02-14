
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
  Sparkles,
  Flame,
  Music,
  Construction,
  AlertTriangle,
  Clock,
  BadgeCheck,
  Zap,
  Info,
  Search,
  Package,
  Key,
  Briefcase,
  Repeat,
  X,
  FileText
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
    title: 'Música ao vivo no Bar do Zeca', 
    subtitle: 'Noite de Jazz', 
    time: '20 min', 
    icon: Music, 
    color: 'text-indigo-400', 
    bg: 'bg-indigo-500',
    source: 'Lojista Parceiro',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800'
  },
  { 
    id: 2, 
    type: 'TRÂNSITO',
    title: 'Obra na Geremário Dantas', 
    subtitle: 'Interdição parcial', 
    time: 'Agora', 
    icon: Construction, 
    color: 'text-amber-400', 
    bg: 'bg-amber-500',
    source: 'Fonte Oficial',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1581094371996-518296a8f15b?q=80&w=800'
  },
  { 
    id: 3, 
    type: 'UTILIDADE',
    title: 'Feira Livre na Praça', 
    subtitle: 'Produtos frescos', 
    time: '2h', 
    icon: Zap, 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500',
    source: 'Morador Verificado',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800'
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
            <h2 className={`text-[12px] font-black uppercase tracking-[0.15em] leading-none mb-1 ${titleClassName}`}>{title}</h2>
            {subtitle && <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${subtitleClassName}`}>{subtitle}</p>}
        </div>
    </div>
    {onSeeMore && <button onClick={onSeeMore} className={`text-[10px] font-black uppercase tracking-widest ${seeMoreClassName}`}>Ver mais</button>}
  </div>
);

const HappeningNowCard: React.FC<{ item: typeof ACONTECENDO_AGORA_FEED[0], className?: string, onClick: () => void }> = ({ item, className = '', onClick }) => (
    <div
      onClick={onClick}
      className={`relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer transition-all active:scale-[0.98] bg-slate-900 ${className}`}
    >
        <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="relative z-10 p-5 flex flex-col justify-between h-full">
            <div>
                <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${item.bg} text-white`}>
                    {item.type}
                </span>
            </div>

            <div>
                <h3 className="font-black text-white text-lg leading-tight uppercase tracking-tight drop-shadow-md">
                    {item.title}
                </h3>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center bg-black/30">
                            <BadgeCheck size={10} className="text-blue-400" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                            {item.source}
                        </span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-white transition-colors" strokeWidth={3} />
                </div>
            </div>
        </div>
    </div>
);


const InstitutionalBanner: React.FC = () => (
  <section className="px-6 pt-8 pb-2">
    <div className="bg-brand-blue rounded-xl p-5 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20">
      <Sparkles size={16} className="text-white" />
      <p className="text-sm font-black text-white uppercase tracking-widest">
        Acreditamos que a vida acontece perto.
      </p>
    </div>
  </section>
);

const JobCard: React.FC<{ job: Job, compatibility: CompatibilityResult, onClick: () => void }> = ({ job, compatibility, onClick }) => (
    <div onClick={onClick} className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 group hover:border-blue-500 transition-colors cursor-pointer shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{job.role}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{job.company}</p>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-lg font-black text-emerald-500">{compatibility.score_total}%</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase">Compatível</span>
            </div>
        </div>
        <div className="flex items-center gap-2 mt-3 mb-4">
            {compatibility.motivos.slice(0,2).map((motivo, i) => (
                <span key={i} className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full border border-blue-100 dark:border-blue-800/50">
                    {motivo.length > 25 ? motivo.substring(0, 22) + '...' : motivo}
                </span>
            ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={12} />
            <span>{job.neighborhood}</span>
        </div>
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
  const [candidateProfile, setCandidateProfile] = useState<any | null>(null);
  const [jobRecommendations, setJobRecommendations] = useState<{ job: Job; compatibility: CompatibilityResult }[]>([]);

  useEffect(() => {
    // Para teste, sempre carrega o perfil de Juliana Costa (ID 1)
    setCandidateProfile(MOCK_CANDIDATE_PROFILES[0]);
  }, []);
  
  useEffect(() => {
    if (candidateProfile) {
      const recommendations = MOCK_JOBS_FOR_TESTING.map(merchantJob => {
        const compatibility = calculateCompatibility(candidateProfile, merchantJob as unknown as MerchantJob);
        
        const job: Job = {
            id: merchantJob.id,
            role: merchantJob.titulo_cargo,
            company: merchantJob.empresa_nome,
            neighborhood: merchantJob.bairro,
            type: merchantJob.tipo === 'Freela' ? 'Freelancer' : merchantJob.tipo,
            salary: merchantJob.salario,
            description: merchantJob.descricao_curta,
            requirements: merchantJob.requisitos_obrigatorios,
            postedAt: 'Há 1 dia',
            experiencia_minima: merchantJob.experiencia_minima,
            schedule_type: merchantJob.turno === 'Manhã' || merchantJob.turno === 'Tarde' || merchantJob.turno === 'Noite' ? 'Meio período' : merchantJob.turno === '12x36' ? 'Escala' : 'Integral',
            category: 'Vagas',
            isVerified: true
        };
        return { job, compatibility };
      }).sort((a, b) => b.compatibility.score_total - a.compatibility.score_total)
        .slice(0, 3);
      setJobRecommendations(recommendations);
    }
  }, [candidateProfile]);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-700 overflow-hidden pb-32 relative z-20">
      
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

      {/* 3. ACONTECENDO AGORA - MOVIDO PARA CÁ (POSIÇÃO SOLICITADA) */}
      <section className="px-6 py-8 space-y-5">
        <SectionHeader 
            icon={Flame} 
            title="Acontecendo agora" 
            subtitle="Informação verificada no bairro" 
            iconColor="text-amber-500" 
            onSeeMore={() => onNavigate('neighborhood_posts')}
        />
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[200px]">
            <HappeningNowCard 
                item={ACONTECENDO_AGORA_FEED[0]} 
                className="col-span-2"
                onClick={() => onNavigate('neighborhood_posts')}
            />
            <HappeningNowCard 
                item={ACONTECENDO_AGORA_FEED[1]} 
                onClick={() => onNavigate('neighborhood_posts')}
            />
            <HappeningNowCard 
                item={ACONTECENDO_AGORA_FEED[2]} 
                onClick={() => onNavigate('neighborhood_posts')}
            />
        </div>
      </section>

      {/* 4. TROCA-TROCA DO BAIRRO - Hero Card */}
      <section className="px-6 py-8 space-y-5">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-purple-500 shadow-sm border border-black/10 dark:border-white/5">
                    <Repeat size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-[12px] font-black uppercase tracking-[0.15em] leading-none text-gray-900 dark:text-white mt-1">
                        Troca-Troca do Bairro
                    </h2>
                </div>
            </div>
        </div>
        <button
          onClick={() => onNavigate('troca_troca_swipe')}
          className="w-full bg-slate-900 rounded-[2.5rem] p-6 text-center group transition-all active:scale-[0.98] border border-slate-800 shadow-2xl shadow-black/10"
        >
          <div className="relative mb-4">
            <div className="flex justify-between items-center gap-4">
              <div className="w-[48%] aspect-square rounded-3xl overflow-hidden bg-slate-800 border border-slate-700">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Tênis" />
              </div>
              <div className="w-[48%] aspect-square rounded-3xl overflow-hidden bg-slate-800 border border-slate-700">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Headphone" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg group-hover:scale-110 transition-transform">
              <Repeat className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
              <p className="text-slate-400 text-sm whitespace-nowrap">
                Deslize para trocar com vizinhos do seu bairro.
              </p>

              <div className="flex items-center justify-center gap-5 my-4">
                  <div className="w-14 h-14 bg-slate-800/60 rounded-full border border-slate-700 text-slate-400 flex items-center justify-center active:scale-95 transition-all hover:bg-slate-700/60 hover:text-white">
                    <X size={28} strokeWidth={2.5} />
                  </div>
                  <div className="w-10 h-10 bg-slate-800/60 rounded-full border border-slate-700 text-blue-400 flex items-center justify-center active:scale-95 transition-all hover:bg-slate-700/60">
                    <Repeat size={20} strokeWidth={2.5} />
                  </div>
                  <div className="w-14 h-14 bg-rose-500/80 rounded-full border border-rose-400 text-white flex items-center justify-center active:scale-95 transition-all shadow-lg shadow-rose-500/20 hover:bg-rose-600">
                    <Heart size={28} fill="currentColor" />
                  </div>
              </div>
              
              <div className="w-full max-w-xs">
                <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-purple-500/40 group-hover:brightness-125 transition-all">
                    🔥 Começar a trocar
                </div>
              </div>
          </div>
        </button>
      </section>
      
      {/* 5. VAGAS PERTO DE VOCÊ */}
      <section className="px-6 py-8 space-y-5">
        <SectionHeader 
            icon={Briefcase} 
            title="Vagas perto de você" 
            subtitle={candidateProfile ? "Recomendadas pela IA" : "Conectando talentos locais"} 
            iconColor="text-emerald-500" 
            onSeeMore={() => onNavigate('jobs')}
        />
        {candidateProfile ? (
            <div className="space-y-4">
              {jobRecommendations.map(({ job, compatibility }) => (
                <JobCard key={job.id} job={job} compatibility={compatibility} onClick={() => onNavigate('job_detail', { job, compatibility })} />
              ))}
            </div>
        ) : (
          <div onClick={() => onNavigate('user_resume')} className="w-full bg-slate-900 rounded-[2.5rem] p-8 text-center group transition-all active:scale-[0.98] border border-slate-800 shadow-2xl shadow-black/10 cursor-pointer">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-500/20 text-blue-500">
                <FileText size={28} />
              </div>
              <h3 className="font-black text-white text-lg uppercase mb-2">Receba vagas personalizadas</h3>
              <p className="text-sm text-slate-400 mb-6">Envie seu currículo e deixe nossa IA encontrar a vaga perfeita para você no bairro.</p>
              <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 rounded-full text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/30">
                Enviar currículo agora
              </div>
          </div>
        )}
      </section>

      {/* 6. CUPOM DO DIA */}
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

      {/* 7. ACHADOS & PERDIDOS */}
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

      {/* 8. LANÇAMENTO / ADS SECTION */}
      {userRole === 'lojista' && isFeatureActive('sponsored_ads') && (
        <section className="px-6 py-6 animate-in slide-in-from-bottom-4 duration-700">
          <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}

      <InstitutionalBanner />
      
      {/* 9. EXPLORE GUIDE SECTION */}
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

      <MoreCategoriesModal 
          isOpen={isMoreCategoriesOpen}
          onClose={() => setIsMoreCategoriesOpen(false)}
          onSelectCategory={onSelectCategory}
      />
    </div>
  );
};

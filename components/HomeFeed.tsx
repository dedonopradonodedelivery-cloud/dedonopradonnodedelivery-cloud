
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Compass, MapPin, Sun, Plus, Heart, Wrench, PawPrint, Shirt, Scissors, CarFront, Ticket, ChevronRight, ArrowRight, Sparkles, Flame, Music, Construction, AlertTriangle, Clock, ShieldCheck, BadgeCheck, Zap, Info, Search, Package, Key, Camera, Briefcase, Building2, TrendingUp, Repeat, Settings, X, FileText, CloudLightning, Sparkle, Cpu, Repeat2, LayoutGrid
} from 'lucide-react';
// FIX: Explicitly importing types from '@/types.ts' to ensure correct type resolution.
import { Store, Category } from '@/types.ts';
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
import { MasterSponsorBanner } from './MasterSponsorBanner';

const QUICK_CATEGORIES: { name: string, icon: React.ElementType, slug: string }[] = [
  { name: 'Saúde', icon: Heart, slug: 'saude' },
  { name: 'Serviços', icon: Wrench, slug: 'servicos' },
  { name: 'Pet', icon: PawPrint, slug: 'pets' },
  { name: 'Moda', icon: Shirt, slug: 'moda' },
  { name: 'Beleza', icon: Scissors, slug: 'beleza' },
];

const MOCK_COUPONS_BASE = [
  { id: 1, store: 'Bibi Lanches', title: 'Hambúrguer Gourmet', description: 'Válido para consumo no local', discount: '20% OFF', category: 'Comida', color: 'from-orange-500 to-rose-500', neighborhood: 'Freguesia', rules: 'Pedido mín. R$ 50', validity: '30/11' },
  { id: 2, store: 'Studio Hair', title: 'Corte + Hidratação', description: 'Somente com agendamento', discount: 'R$ 15 OFF', category: 'Beleza', color: 'from-blue-600 to-indigo-700', neighborhood: 'Taquara', rules: 'Válido Terça a Quinta', validity: '15/12' },
  { id: 3, store: 'Pet Alegria', title: 'Banho e Tosa Completo', description: 'Ganhe tosa higiênica', discount: '10% OFF', category: 'Pets', color: 'from-emerald-500 to-teal-600', neighborhood: 'Pechincha', rules: 'Cães até 15kg', validity: '20/11' },
  { id: 4, store: 'Mecânica 24h', title: 'Troca de Óleo', description: 'Filtro incluso no pacote', discount: '5% OFF', category: 'Auto', color: 'from-slate-600 to-slate-800', neighborhood: 'Anil', rules: 'Somente óleo sintético', validity: '10/12' },
];

const ACONTECENDO_AGORA_BASE = [
  { id: 1, type: 'Alerta', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=400&auto=format&fit=crop', authorName: 'Ricardo Souza', authorAvatar: 'https://i.pravatar.cc/100?u=ricardo', timestamp: '2h', neighborhood: 'Freguesia' },
  { id: 2, type: 'Evento', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400&auto=format&fit=crop', authorName: 'Felipe Costa', authorAvatar: 'https://i.pravatar.cc/100?u=felipe', timestamp: '4h', neighborhood: 'Taquara' },
  { id: 3, type: 'Dica', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400&auto=format&fit=crop', authorName: 'Tiago Santos', authorAvatar: 'https://i.pravatar.cc/100?u=tiago', timestamp: '5h', neighborhood: 'Anil' },
  { id: 4, type: 'Utilidade', image: 'https://images.unsplash.com/photo-1585659722982-789600c7690a?q=80&w=400&auto=format&fit=crop', authorName: 'Luciana Melo', authorAvatar: 'https://i.pravatar.cc/100?u=luciana', timestamp: '8h', neighborhood: 'Freguesia' },
];

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle?: string; onSeeMore?: () => void; iconColor?: string; iconBg?: string; titleClassName?: string; subtitleClassName?: string; seeMoreClassName?: string; }> = ({ icon: Icon, title, subtitle, onSeeMore, iconColor = "text-blue-600", iconBg = "bg-gray-50 dark:bg-gray-900", titleClassName = "text-gray-900 dark:text-white", subtitleClassName = "text-gray-400", seeMoreClassName = "text-blue-600" }) => (
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

const HappeningNowCard: React.FC<{ item: any, onClick: () => void }> = ({ item, onClick }) => (
    <div onClick={onClick} className="relative flex-shrink-0 w-36 aspect-[9/16] rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all active:scale-[0.97] bg-slate-900 snap-start animate-in fade-in duration-500">
        <img src={item.image} alt={item.type} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        <div className="absolute top-3 left-3 right-3">
            <div className="inline-flex bg-black/40 backdrop-blur-md border border-white/20 px-2 py-1 rounded-full"><span className="text-[7px] font-black text-white uppercase tracking-[0.15em] whitespace-nowrap">{item.type}</span></div>
        </div>
    </div>
);

export const HomeFeed: React.FC<{ onNavigate: (view: string, data?: any) => void; onStoreClick: (store: Store) => void; stores: Store[]; user: User | null; userRole: 'cliente' | 'lojista' | null; onSelectCategory: (category: Category) => void; }> = ({ onNavigate, onStoreClick, user, userRole, onSelectCategory }) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated'>('all');
  const { currentNeighborhood } = useNeighborhood();
  const { isFeatureActive } = useFeatures();
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const filteredStories = useMemo(() => {
    if (currentNeighborhood === "Jacarepaguá (todos)") return ACONTECENDO_AGORA_BASE;
    return ACONTECENDO_AGORA_BASE.filter(item => item.neighborhood === currentNeighborhood);
  }, [currentNeighborhood]);

  const filteredCoupons = useMemo(() => {
    if (currentNeighborhood === "Jacarepaguá (todos)") return MOCK_COUPONS_BASE;
    return MOCK_COUPONS_BASE.filter(item => item.neighborhood === currentNeighborhood);
  }, [currentNeighborhood]);

  const STORY_THEMES = ['Eventos', 'Trânsito', 'Utilidade', 'Achados e Perdidos', 'Pets Perdidos', 'Alertas'];

  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-full">
      <div className="flex-1 bg-[#F8F9FC] dark:bg-gray-950 rounded-t-[3.5rem] -mt-6 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        
        {/* 1. ICON CATEGORY GRID (6 ITENS FIXOS - SEM SCROLL) */}
        <section className="w-full">
            <div className="flex items-start justify-between px-5 pt-2 pb-8">
            {QUICK_CATEGORIES.map(cat => {
                const fullCat = CATEGORIES.find(c => c.slug === cat.slug);
                if (!fullCat) return null;
                return (
                <button key={cat.slug} onClick={() => onSelectCategory(fullCat)} className="flex flex-col items-center gap-2 group active:scale-95 transition-all flex-1">
                    <div className="w-[52px] h-[52px] rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 shadow-sm flex items-center justify-center text-blue-600 group-hover:brightness-110 transition-all">
                        <cat.icon size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-[9px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-tight text-center leading-none">
                        {cat.name}
                    </span>
                </button>
                )
            })}
            <button onClick={() => setIsMoreCategoriesOpen(true)} className="flex flex-col items-center gap-2 group active:scale-95 transition-all flex-1">
                <div className="w-[52px] h-[52px] rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 shadow-sm flex items-center justify-center text-blue-600">
                    <Plus size={22} strokeWidth={3} />
                </div>
                <span className="text-[9px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-tight text-center leading-none">
                    + Mais
                </span>
            </button>
            </div>
        </section>

        {/* 2. ACONTECENDO AGORA */}
        <section className="py-4 space-y-4">
            <div className="px-6">
                <SectionHeader icon={Flame} title="Acontecendo agora" subtitle={currentNeighborhood === "Jacarepaguá (todos)" ? "Toda Jacarepaguá" : `Em ${currentNeighborhood}`} iconColor="text-amber-500" />
            </div>
            {filteredStories.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 snap-x pb-2">
                    {filteredStories.map((item, index) => (<HappeningNowCard key={item.id} item={item} onClick={() => setSelectedStoryIndex(index)} />))}
                </div>
            ) : (
                <div className="px-6 py-10 text-center opacity-30"><p className="text-[10px] font-black uppercase tracking-widest">Nenhum story no bairro hoje.</p></div>
            )}
        </section>

        {/* 3. CUPOM DO DIA */}
        {isFeatureActive('coupons') && (
            <section className="space-y-6 py-12 bg-slate-50/30 dark:bg-white/5 border-y border-gray-100 dark:border-white/5">
            <div className="px-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600"><Ticket size={16} strokeWidth={2.5} /></div>
                    <div className="flex flex-col">
                        <h2 className="text-[12px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest leading-none mb-1">Cupons do dia</h2>
                        <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 leading-none">{currentNeighborhood === "Jacarepaguá (todos)" ? "Ofertas em Jacarepaguá" : `Ofertas em ${currentNeighborhood}`}</p>
                    </div>
                </div>
                <button onClick={() => onNavigate('user_coupons')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ver todos</button>
            </div>

            {filteredCoupons.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2 snap-x">
                    {filteredCoupons.map(coupon => (
                    <button key={coupon.id} onClick={() => onNavigate('coupon_landing')} className="flex-shrink-0 w-[350px] h-[130px] relative flex bg-slate-50/80 dark:bg-gray-900/60 rounded-3xl shadow-xl shadow-blue-900/5 active:scale-[0.98] transition-all snap-start overflow-hidden group border border-gray-100 dark:border-gray-800">
                        <div className={`w-[35%] bg-gradient-to-br ${coupon.color} p-4 flex flex-col justify-center items-center text-center relative`}>
                            <p className="text-[8px] font-black text-white/70 uppercase tracking-widest mb-1">{coupon.category}</p>
                            <h4 className="text-2xl font-black text-white leading-none drop-shadow-md">{coupon.discount}</h4>
                            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#F8F9FC] dark:bg-gray-950 z-10"></div>
                            <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-[#F8F9FC] dark:bg-gray-950 z-10"></div>
                        </div>
                        <div className="h-full border-l-2 border-dashed border-gray-100 dark:border-gray-800 relative z-10"></div>
                        <div className="flex-1 p-4 flex flex-col justify-between text-left">
                            <div>
                                <h5 className="text-[11px] font-black text-slate-800 dark:text-white uppercase truncate tracking-tight mb-1">{coupon.title}</h5>
                                <p className="text-[10px] font-bold text-[#1E5BFF] uppercase tracking-tighter truncate">{coupon.store}</p>
                                <p className="text-[8px] text-gray-400 font-medium line-clamp-1 mt-1">{coupon.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex flex-col"><p className="text-[7px] font-black text-gray-400 uppercase">Validade</p><p className="text-[9px] font-bold text-gray-600 dark:text-gray-300">{coupon.validity}</p></div>
                                <div className="bg-white dark:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <span className="text-[8px] font-black uppercase tracking-widest">Resgatar Cupom</span>
                                </div>
                            </div>
                        </div>
                    </button>
                    ))}
                </div>
            ) : (
                <div className="px-6 py-10 text-center opacity-30"><p className="text-[10px] font-black uppercase tracking-widest">Sem cupons ativos hoje.</p></div>
            )}
            </section>
        )}

        {/* 4. VAGAS DE EMPREGO */}
        <section className="px-6 py-10 space-y-6">
            <SectionHeader icon={Briefcase} title="💼 Empregos no Bairro" subtitle={currentNeighborhood === "Jacarepaguá (todos)" ? "Oportunidades em JPA" : `Trabalhe em ${currentNeighborhood}`} iconColor="text-emerald-500" />
            <div onClick={() => onNavigate('jobs')} className="w-full bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(16,185,129,0.25)] border border-white/20 cursor-pointer group active:scale-[0.99] transition-all relative overflow-hidden animate-ai-pulse">
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg"><Cpu size={14} className="text-white" /><span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">IA-Driven Match</span></div>
                    <h3 className="text-2xl font-display font-black text-white leading-tight mb-2 tracking-tighter uppercase">Vagas Perto <br/> de Você</h3>
                    <p className="text-xs font-bold text-emerald-50 mb-10 leading-relaxed max-w-[240px] opacity-90">{currentNeighborhood === "Jacarepaguá (todos)" ? "Vagas abertas em Jacarepaguá." : `Novas vagas encontradas em ${currentNeighborhood}.`}</p>
                    <div className="w-full bg-white text-emerald-700 font-black py-5 rounded-2xl text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3">Explorar Agora <ArrowRight size={18} strokeWidth={3} /></div>
                </div>
            </div>
        </section>

        {/* 5. EXPLORAR GUIA */}
        {isFeatureActive('explore_guide') && (
            <div className="w-full pt-8 pb-10">
                <div className="px-6">
                    <SectionHeader icon={Compass} title="Explorar Bairro" subtitle="O melhor perto de você" onSeeMore={() => onNavigate('explore')} />
                    <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit mb-6">
                        {['all', 'top_rated'].map((f) => (
                            <button key={f} onClick={() => setListFilter(f as any)} className={`text-[9px] font-black uppercase px-5 py-2 rounded-xl transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-md' : 'text-gray-400'}`}>{f === 'all' ? 'Ver Tudo' : 'Top Avaliados'}</button>
                        ))}
                    </div>
                    <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter as any} user={user} onNavigate={onNavigate} premiumOnly={false} />
                    
                    {/* PATROCINADOR MASTER OBRIGATÓRIO */}
                    <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label="Jacarepaguá" />
                </div>
            </div>
        )}
      </div>

      <MoreCategoriesModal isOpen={isMoreCategoriesOpen} onClose={() => setIsMoreCategoriesOpen(false)} onSelectCategory={onSelectCategory} />
      {selectedStoryIndex !== null && (<StoryViewer stories={filteredStories} initialIndex={selectedStoryIndex} onClose={() => setSelectedStoryIndex(null)} />)}
    </div>
  );
};

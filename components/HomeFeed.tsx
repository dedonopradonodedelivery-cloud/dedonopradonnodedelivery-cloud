
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Compass, Plus, Ticket, ArrowRight, Sparkles, Flame, Briefcase, ChevronRight, Sparkle, Heart, Wrench, PawPrint, Shirt, Scissors
} from 'lucide-react';
import { Store, Category } from '@/types.ts';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, ACONTECENDO_AGORA_DATA } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { useFeatures } from '@/contexts/FeatureContext';
import { MoreCategoriesModal } from './MoreCategoriesModal';
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
  { id: 5, store: 'Pizza Prime', title: 'Pizza Grande', description: 'Qualquer sabor tradicional', discount: '15% OFF', category: 'Comida', color: 'from-red-500 to-orange-600', neighborhood: 'Freguesia', rules: 'Apenas delivery', validity: '05/12' },
  { id: 6, store: 'Drogaria Vida', title: 'Medicamentos', description: 'Em compras acima de R$ 100', discount: 'R$ 20 OFF', category: 'Saúde', color: 'from-teal-500 to-emerald-600', neighborhood: 'Taquara', rules: 'Exceto perfumaria', validity: '12/12' },
  { id: 7, store: 'Studio Fit', title: 'Treino Experimental', description: 'Conheça nossa estrutura', discount: '1ª aula grátis', category: 'Esporte', color: 'from-purple-500 to-pink-600', neighborhood: 'Pechincha', rules: 'Agendamento prévio', validity: '30/11' },
  { id: 8, store: 'Pet Center JPA', title: 'Rações Premium', description: 'Qualquer marca', discount: '10% OFF', category: 'Pets', color: 'from-amber-500 to-orange-500', neighborhood: 'Anil', rules: 'Pacotes acima de 10kg', validity: '08/12' },
  { id: 9, store: 'Lava Jato Express', title: 'Lavagem Completa', description: 'Ducha + Cera', discount: '20% OFF', category: 'Auto', color: 'from-cyan-500 to-blue-600', neighborhood: 'Freguesia', rules: 'Veículos de passeio', validity: '15/12' },
  { id: 10, store: 'Café & Cia', title: 'Café + Salgado', description: 'Para começar bem o dia', discount: 'Combo promocional', category: 'Comida', color: 'from-stone-500 to-stone-700', neighborhood: 'Taquara', rules: 'Até as 10h', validity: '20/12' },
];

const MOCK_NEIGHBORHOOD_PROMOS = [
  { id: 1, store: 'Supermercado Mundial', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400', title: 'Ofertas da Semana', price: 'A partir de R$ 9,90', neighborhood: 'Freguesia' },
  { id: 2, store: 'Drogaria Venancio', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400', title: 'Leve 3 Pague 2', price: 'Descontos de até 50%', neighborhood: 'Taquara' },
  { id: 3, store: 'Hortifruti Natural', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400', title: 'Feirinha de Orgânicos', price: 'Tudo fresquinho', neighborhood: 'Pechincha' },
  { id: 4, store: 'American Pet', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400', title: 'Ração Premium', price: 'R$ 129,90', neighborhood: 'Anil' },
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

const StoryCard: React.FC<{ item: any, onClick: () => void }> = ({ item, onClick }) => (
    <div onClick={onClick} className="relative flex-shrink-0 w-36 aspect-[9/16] rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all active:scale-[0.97] bg-slate-900 snap-start animate-in fade-in duration-500">
        <img src={item.image} alt={item.type} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
        <div className="absolute top-3 left-3 right-3">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg inline-flex items-center justify-center">
                <item.icon size={14} className="text-white" strokeWidth={2.5} />
            </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
            <h4 className="text-[10px] font-black text-white leading-tight drop-shadow-md line-clamp-2 uppercase tracking-tight">
                {item.type}
            </h4>
        </div>
    </div>
);

export const HomeFeed: React.FC<{ onNavigate: (view: string, data?: any) => void; onStoreClick: (store: Store) => void; stores: Store[]; user: User | null; onSelectCategory: (category: Category) => void; }> = ({ onNavigate, onStoreClick, user, onSelectCategory }) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated'>('all');
  const { currentNeighborhood } = useNeighborhood();
  const { isFeatureActive } = useFeatures();
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [currentCouponIndex, setCurrentCouponIndex] = useState(0);

  const filteredStories = useMemo(() => {
    return ACONTECENDO_AGORA_DATA;
  }, []);

  const availableCoupons = useMemo(() => {
    return currentNeighborhood === "Jacarepaguá (todos)" 
      ? MOCK_COUPONS_BASE 
      : MOCK_COUPONS_BASE.filter(item => item.neighborhood === currentNeighborhood);
  }, [currentNeighborhood]);

  useEffect(() => {
    if (availableCoupons.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentCouponIndex((prevIndex) => (prevIndex + 1) % availableCoupons.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [availableCoupons.length]);

  const featuredCoupon = availableCoupons[currentCouponIndex] || MOCK_COUPONS_BASE[0];

  const storyLabels = ['Trânsito', 'Achados', 'Pets Perdidos', 'Utilidades', 'Promoções'];

  return (
    <div className="flex flex-col bg-brand-blue w-full min-h-full">
      <div className="flex-1 bg-[#F8F9FC] dark:bg-gray-950 rounded-t-[3.5rem] -mt-6 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        
        {/* 1. ICON CATEGORY GRID */}
        <section className="w-full">
            <div className="flex items-start justify-between px-6 pt-5 pb-8">
            {QUICK_CATEGORIES.map(cat => {
                const fullCat = CATEGORIES.find(c => c.slug === cat.slug);
                if (!fullCat) return null;
                return (
                <button key={cat.slug} onClick={() => onSelectCategory(fullCat)} className="flex flex-col items-center gap-2 group active:scale-95 transition-all flex-1">
                    <div className="w-[56px] h-[56px] rounded-full bg-gradient-to-b from-white via-white to-gray-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-950 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15),inset_0_6px_12px_rgba(255,255,255,1),inset_0_-6px_12px_rgba(0,0,0,0.08)] border border-white/80 dark:border-white/5 flex items-center justify-center text-blue-600 group-hover:brightness-105 transition-all">
                        <cat.icon size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-[9px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-tight text-center leading-none">
                        {cat.name}
                    </span>
                </button>
                )
            })}
            <button onClick={() => setIsMoreCategoriesOpen(true)} className="flex flex-col items-center gap-2 group active:scale-95 transition-all flex-1">
                <div className="w-[56px] h-[56px] rounded-full bg-gradient-to-b from-white via-white to-gray-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-950 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15),inset_0_6px_12px_rgba(255,255,255,1),inset_0_-6px_12px_rgba(0,0,0,0.08)] border border-white/80 dark:border-white/5 flex items-center justify-center text-blue-600">
                    <Plus size={22} strokeWidth={3} />
                </div>
                <span className="text-[9px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-tight text-center leading-none">
                    Ver mais
                </span>
            </button>
            </div>
        </section>

        {/* 2. ACONTECENDO AGORA - ALIGNMENT FIXED */}
        <section className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
                <SectionHeader icon={Flame} title="Aconteceu Agora no seu Bairro" subtitle={currentNeighborhood === "Jacarepaguá (todos)" ? "Toda Jacarepaguá" : `Em ${currentNeighborhood}`} iconColor="text-amber-500" />
            </div>

            <div className="relative">
                {filteredStories.length > 0 ? (
                    <>
                        {/* -mx-6 px-6 allows full width scroll while keeping first item aligned */}
                        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x pb-2 -mr-6">
                            {filteredStories.map((item, index) => (
                                <StoryCard key={item.id} item={item} onClick={() => setSelectedStoryIndex(index)} />
                            ))}
                        </div>
                        {/* THEME LABELS BELOW CARDS */}
                        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 mt-2 opacity-60">
                            {storyLabels.map((label, i) => (
                                <span key={i} className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                    {label} {i < storyLabels.length - 1 && "•"}
                                </span>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="py-10 text-center opacity-30 flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Sparkle size={24} className="text-gray-400" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Nenhum story no bairro hoje.</p>
                    </div>
                )}
            </div>
        </section>

        {/* 3. CUPONS DO DIA - ALIGNMENT FIXED */}
        {isFeatureActive('coupons') && featuredCoupon && (
            <section className="px-6 py-6 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E5BFF]"><Ticket size={16} strokeWidth={2.5} /></div>
                        <div className="flex flex-col">
                            <h2 className="text-[12px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest leading-none mb-1">Cupons do dia</h2>
                            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 leading-none">Destaque exclusivo no bairro</p>
                        </div>
                    </div>
                    <button onClick={() => onNavigate('user_coupons')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ver todos</button>
                </div>

                <div className="relative">
                    <button 
                        onClick={() => onNavigate('coupon_landing')} 
                        className="w-full h-[180px] relative flex bg-slate-50 dark:bg-gray-900 shadow-xl shadow-blue-900/5 active:scale-[0.99] transition-all overflow-hidden rounded-[2.5rem] group"
                    >
                        {/* Lado Esquerdo: Valor */}
                        <div className={`w-[35%] bg-gradient-to-br ${featuredCoupon.color} p-6 flex flex-col justify-center items-center text-center relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-700"></div>
                            
                            <p className="text-[9px] font-black text-white/70 uppercase tracking-widest mb-1 drop-shadow-sm">{featuredCoupon.category}</p>
                            <h4 className="text-4xl font-black text-white leading-none drop-shadow-2xl italic tracking-tighter">{featuredCoupon.discount}</h4>
                            
                            {/* Decorative Edge Cutouts */}
                            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-slate-50 dark:bg-gray-900 z-20 shadow-inner"></div>
                            <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-slate-50 dark:bg-gray-900 z-20 shadow-inner"></div>
                        </div>

                        {/* Dashed Separator */}
                        <div className="h-full border-l-2 border-dashed border-gray-100 dark:border-gray-800 relative z-10"></div>

                        {/* Lado Direito: Info */}
                        <div className="flex-1 p-6 flex flex-col justify-between text-left bg-slate-50 dark:bg-gray-900">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[8px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/50 uppercase tracking-widest">Oferta Ativa</span>
                                </div>
                                <h5 className="text-xl font-black text-slate-900 dark:text-white uppercase leading-none tracking-tighter mb-2 group-hover:text-blue-600 transition-colors">{featuredCoupon.title}</h5>
                                <p className="text-xs font-bold text-[#1E5BFF] uppercase tracking-tighter">{featuredCoupon.store}</p>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex flex-col">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Validade</p>
                                    <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase">{featuredCoupon.validity}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-900 dark:bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-xl transform group-hover:translate-x-1 transition-all">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Resgatar</span>
                                    <ArrowRight size={14} strokeWidth={3} />
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </section>
        )}

        {/* 4. PROMOÇÕES NO BAIRRO */}
        <section className="px-6 py-6 space-y-4">
          <SectionHeader icon={Sparkles} title="Promoções no Bairro" subtitle="Ofertas imperdíveis" iconColor="text-rose-500" />
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x pb-4 -mr-6 pr-6">
            {MOCK_NEIGHBORHOOD_PROMOS.map((promo) => (
              <div key={promo.id} className="min-w-[200px] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 snap-start group cursor-pointer active:scale-[0.98] transition-all">
                <div className="h-28 overflow-hidden relative">
                    <img src={promo.image} alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">{promo.store}</span>
                </div>
                <div className="p-3">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1">{promo.title}</h4>
                    <p className="text-xs font-medium text-rose-500">{promo.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. PATROCINADOR MASTER */}
        <section className="px-6 pb-8 pt-2">
          <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label="Patrocinador Master" />
        </section>

        {/* 6. VAGAS DE EMPREGO (DISCREET SHORTCUT) */}
        <section className="px-6 py-2 space-y-4">
            <button onClick={() => onNavigate('jobs')} className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Briefcase size={20} strokeWidth={2.5} />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">Empregos no Bairro</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vagas perto de você</p>
                    </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </button>
        </section>

        {/* 7. EXPLORAR GUIA */}
        {isFeatureActive('explore_guide') && (
            <div className="w-full pt-4 pb-10">
                <div className="px-6">
                    <SectionHeader icon={Compass} title="Explorar Bairro" subtitle="O melhor perto de você" onSeeMore={() => onNavigate('explore')} />
                    <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit mb-6">
                        {['all', 'top_rated'].map((f) => (
                            <button key={f} onClick={() => setListFilter(f as any)} className={`text-[9px] font-black uppercase px-5 py-2 rounded-xl transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-md' : 'text-gray-400'}`}>{f === 'all' ? 'Ver Tudo' : 'Top Avaliados'}</button>
                        ))}
                    </div>
                    <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter as any} user={user} onNavigate={onNavigate} premiumOnly={false} />
                    

                </div>
            </div>
        )}
      </div>

      <MoreCategoriesModal isOpen={isMoreCategoriesOpen} onClose={() => setIsMoreCategoriesOpen(false)} onSelectCategory={onSelectCategory} />
      {selectedStoryIndex !== null && (<StoryViewer stories={filteredStories} initialIndex={selectedStoryIndex} onClose={() => setSelectedStoryIndex(null)} />)}
    </div>
  );
};

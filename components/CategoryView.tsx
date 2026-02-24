
import React, { useMemo } from 'react';
import { AlertCircle, Crown, Info, Star, CheckCircle2, ArrowRight, ChevronLeft } from 'lucide-react';
import { Category, Store, AdType } from '@/types';
import { MasterSponsorBanner } from '@/components/MasterSponsorBanner';
import { StoreCard } from '@/components/LojasEServicosList';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

// --- DADOS FAKE PARA CONCEITO COMERCIAL (DESTAQUES) ---
const MOCK_HIGHLIGHTS = [
  {
    id: 'hl-1',
    name: 'Dra. Juliana Mendes',
    role: 'Harmonização Facial',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800',
    description: 'Especialista em realçar sua beleza natural com procedimentos minimamente invasivos.',
    rating: 5.0
  },
  {
    id: 'hl-2',
    name: 'Studio Arquitetura',
    role: 'Projetos e Interiores',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800',
    description: 'Transformamos espaços em experiências únicas. Projetos residenciais e comerciais.',
    rating: 4.9
  },
  {
    id: 'hl-3',
    name: 'Tech Solutions',
    role: 'Assistência Apple',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=800',
    description: 'Reparos especializados em iPhone e Mac com peças originais e garantia.',
    rating: 4.8
  }
];

interface CategoryViewProps {
  category: Category;
  onBack: () => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  userRole: 'cliente' | 'lojista' | 'admin' | null;
  onAdvertiseInCategory: (categoryName: string | null) => void;
  onNavigate: (view: string) => void;
  onSubcategoryClick?: (subName: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ 
  category, 
  onBack,
  onStoreClick, 
  stores, 
  userRole, 
  onAdvertiseInCategory, 
  onNavigate
}) => {

  const filteredStores = useMemo(() => {
    return stores.filter(s => s.category === category.name || s.subcategory === category.name);
  }, [stores, category.name]);

  const handleOpportunityBannerClick = () => {
    const demoStore: Partial<Store> = {
      id: 'demo-destaque',
      name: 'Seu Negócio Aqui',
      category: category.name,
      subcategory: 'Espaço Publicitário',
      description: `Este é um exemplo de como seu perfil será exibido para milhares de moradores. Ocupar o topo de ${category.name} garante autoridade imediata no bairro.`,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200',
      rating: 5.0,
      verified: true,
      isOpenNow: true,
      adType: AdType.PREMIUM
    };
    onStoreClick(demoStore as Store);
  };

  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen">
      
      {/* 
        ============================================================
        HEADER PADRÃO OBRIGATÓRIO (Slide In)
        ============================================================
      */}
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{category.name}</h1>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      {/* Overlap Card System */}
      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-6 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        
        <main className="p-6 pt-12 space-y-10">
            
            {/* 1️⃣ BANNER COMERCIAL */}
            <section 
            onClick={handleOpportunityBannerClick}
            className="relative w-full aspect-[3/2] rounded-[2rem] overflow-hidden cursor-pointer group shadow-2xl shadow-blue-900/10"
            >
            <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" 
                alt="Espaço Publicitário"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent mix-blend-multiply opacity-90"></div>
            
            <div className="absolute inset-0 p-6 flex flex-col justify-center">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 border border-white/20">
                    <Crown className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                    Sua marca aqui
                </h2>
                
                <div className="space-y-0.5 opacity-90">
                    <p className="text-xs font-bold text-blue-100 flex items-center gap-1.5">
                        Espaço publicitário <Info size={10} />
                    </p>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest font-medium">
                        Disponível para especialistas por bairro
                    </p>
                </div>
            </div>

            <div className="absolute bottom-5 right-5 bg-white text-slate-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                Ver Exemplo <ArrowRight size={10} />
            </div>
            </section>

            {/* 2️⃣ SEÇÃO DESTAQUES */}
            <section>
            <div className="flex items-center gap-2 mb-5 px-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Destaques em {category.name}
                </h2>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x -mx-5 px-5">
                {MOCK_HIGHLIGHTS.map((highlight) => (
                <div 
                    key={highlight.id}
                    onClick={() => onStoreClick({
                      id: highlight.id,
                      name: highlight.name,
                      category: category.name,
                      subcategory: highlight.role,
                      description: highlight.description,
                      image: highlight.image,
                      rating: highlight.rating,
                      adType: AdType.PREMIUM,
                      verified: true,
                      isOpenNow: true,
                      distance: 'Freguesia • RJ'
                    } as Store)}
                    className="min-w-[280px] max-w-[280px] bg-white dark:bg-gray-900 rounded-[2rem] p-4 shadow-md border border-gray-100 dark:border-gray-800 snap-center relative group active:scale-[0.98] transition-transform cursor-pointer"
                >
                    <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shadow-sm shrink-0 border border-gray-100 dark:border-gray-700">
                        <img src={highlight.image} alt={highlight.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                        <h3 className="font-black text-gray-900 dark:text-white text-sm leading-tight truncate">
                        {highlight.name}
                        </h3>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5 mb-1">
                        {highlight.role}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg w-fit">
                        <Star size={8} fill="currentColor" /> {highlight.rating.toFixed(1)}
                        </div>
                    </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3 h-8">
                    {highlight.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        <CheckCircle2 size={10} className="text-emerald-500" /> Verificado
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300">
                        <ArrowRight size={12} strokeWidth={3} />
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </section>

            {/* 3️⃣ LISTA DE LOJAS */}
            <section>
                <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                    Todos em {category.name}
                </h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {filteredStores.length} opções
                </span>
                </div>
                
                {filteredStores.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {filteredStores.map(store => (
                            <StoreCard key={store.id} store={store} onClick={() => onStoreClick(store)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                        <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nenhuma loja encontrada.</p>
                    </div>
                )}
            </section>

            {/* 4️⃣ PATROCINADOR MASTER */}
            <section className="pt-4">
                <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label={category.name} />
            </section>
        </main>
      </div>
    </div>
  );
};


import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
  Star, 
  MapPin, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  Heart, 
  Award,
  Navigation,
  ThumbsUp,
  ArrowUpRight,
  Crown,
  ShieldCheck,
  Coins,
  Wrench,
  Users,
  Zap
} from 'lucide-react';
import { Store } from '../types';

interface ExploreViewProps {
  stores: Store[];
  searchQuery: string;
  onStoreClick: (store: Store) => void;
  onLocationClick: () => void;
  onFilterClick: () => void;
  onOpenPlans: () => void;
  onViewAllVerified?: () => void;
  onViewMasterSponsor?: () => void;
}

// --- CONFIGURAÇÃO DO CARROSSEL EDUCACIONAL ---

const AD_DURATION = 3000; // 3 segundos por banner

const PREMIUM_MOCK_STORES = [
  { name: 'Terraço Gastronomia', category: 'Restaurante', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600' },
  { name: 'Clínica Sorriso', category: 'Saúde', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600' },
  { name: 'Espaço VIP Beleza', category: 'Beleza', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600' }
];

const EDUCATIONAL_BANNERS = [
  {
    id: 'cashback',
    title: 'Cashback Localizei',
    subtitle: 'Ganhe parte do seu dinheiro de volta comprando no bairro.',
    cta: 'Entender',
    icon: <Coins className="w-6 h-6 text-emerald-400" />,
    gradient: 'from-emerald-900 via-emerald-800 to-teal-900',
    image: 'https://images.unsplash.com/photo-1556742049-139422cb096c?q=80&w=600'
  },
  {
    id: 'services',
    title: 'Serviços & Reparos',
    subtitle: 'De eletricistas a diaristas. Encontre profissionais qualificados.',
    cta: 'Explorar',
    icon: <Wrench className="w-6 h-6 text-blue-400" />,
    gradient: 'from-blue-900 via-indigo-800 to-blue-900',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600'
  },
  {
    id: 'connect',
    title: 'Freguesia Connect',
    subtitle: 'A maior rede de networking e negócios da nossa região.',
    cta: 'Ver mais',
    icon: <Users className="w-6 h-6 text-indigo-400" />,
    gradient: 'from-indigo-900 via-purple-900 to-indigo-950',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600'
  },
  {
    id: 'premium_ads',
    title: 'Destaque Premium',
    subtitle: 'Conheça os estabelecimentos que estão bombando hoje.',
    cta: 'Ver loja',
    isSponsored: true,
    icon: <Crown className="w-6 h-6 text-amber-400" />,
    gradient: 'from-slate-900 via-slate-800 to-slate-950',
    image: '' // Definido dinamicamente
  }
];

const EducationalCarousel: React.FC<{ onStoreClick: (store: Store) => void }> = ({ onStoreClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [premiumStoreIndex, setPremiumStoreIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lógica de Autoplay e Progresso
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / AD_DURATION) * 100;
      
      if (newProgress >= 100) {
        const nextIndex = (currentIndex + 1) % EDUCATIONAL_BANNERS.length;
        setCurrentIndex(nextIndex);
        setProgress(0);
        // Se for para o banner de ads, rotaciona a loja premium
        if (nextIndex === 3) {
          setPremiumStoreIndex(prev => (prev + 1) % PREMIUM_MOCK_STORES.length);
        }
        clearInterval(interval);
      } else {
        setProgress(newProgress);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const currentBanner = EDUCATIONAL_BANNERS[currentIndex];
  const premiumStore = PREMIUM_MOCK_STORES[premiumStoreIndex];
  
  // Imagem final (educacional ou patrocinada)
  const displayImage = currentIndex === 3 ? premiumStore.image : currentBanner.image;
  const displayTitle = currentIndex === 3 ? premiumStore.name : currentBanner.title;

  return (
    <div className="px-4 mb-10">
      <div className="w-full relative aspect-[21/10] rounded-[32px] overflow-hidden shadow-2xl shadow-blue-900/10 border border-gray-100 dark:border-gray-800 animate-in fade-in duration-500">
        
        {/* Background Image com Fade Transition */}
        <div className="absolute inset-0 bg-slate-900">
          <img 
            key={displayImage}
            src={displayImage} 
            className="w-full h-full object-cover opacity-60 animate-in fade-in duration-700"
            alt={displayTitle}
          />
        </div>

        {/* Overlay Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t ${currentBanner.gradient} opacity-40 mix-blend-multiply`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

        {/* INDICADOR DE PROGRESSO SEGMENTADO (Estilo Stories) */}
        <div className="absolute top-4 left-6 right-6 flex gap-2 z-30">
          {EDUCATIONAL_BANNERS.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-100 ease-linear ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }}
              />
              {/* Mantém a barra cheia para os anteriores */}
              {idx < currentIndex && <div className="absolute inset-0 bg-white opacity-40" />}
            </div>
          ))}
        </div>

        {/* Selo Tipo de Conteúdo */}
        <div className="absolute top-8 right-6 z-20 flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
          {currentBanner.isSponsored ? (
            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Patrocinado</span>
          ) : (
            <span className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Guia Rápido</span>
          )}
        </div>

        {/* Conteúdo do Banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end z-20">
          <div className="flex-1 pr-4 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                {currentBanner.icon}
              </div>
              <h3 className="text-xl font-black text-white leading-tight font-display tracking-tight">
                {displayTitle}
              </h3>
            </div>
            <p className="text-xs text-gray-300 font-medium line-clamp-2 max-w-[280px]">
              {currentBanner.subtitle}
            </p>
          </div>
          
          <button className="bg-white text-slate-900 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center gap-2 shadow-xl active:scale-95 transition-all hover:bg-primary-500 hover:text-white">
            {currentBanner.cta} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Swipe zones (Invisible) */}
        <div 
          className="absolute inset-y-0 left-0 w-1/4 z-40 cursor-pointer" 
          onClick={() => {
            setCurrentIndex(prev => prev === 0 ? EDUCATIONAL_BANNERS.length - 1 : prev - 1);
            setProgress(0);
          }}
        />
        <div 
          className="absolute inset-y-0 right-0 w-1/4 z-40 cursor-pointer" 
          onClick={() => {
            setCurrentIndex(prev => (prev + 1) % EDUCATIONAL_BANNERS.length);
            setProgress(0);
          }}
        />
      </div>
    </div>
  );
};

// --- RESTO DOS COMPONENTES ---

const MasterSponsorExploreBanner: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="px-4 mb-10">
    <button 
      onClick={onClick}
      className="w-full relative aspect-[21/10] rounded-[32px] overflow-hidden shadow-2xl shadow-blue-900/10 group active:scale-[0.98] transition-all border border-gray-100 dark:border-gray-800 bg-slate-900"
    >
      <img 
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60"
        alt="Grupo Esquematiza"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
      <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-md border border-amber-400 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 animate-badge-pop">
        <Crown className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
        <span className="text-[10px] font-black text-slate-950 uppercase tracking-[0.1em]">Patrocinador Master</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-left flex justify-between items-end">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Segurança & Serviços</span>
            <div className="w-1 h-1 rounded-full bg-white/40"></div>
            <div className="flex items-center gap-1">
               <ShieldCheck className="w-3 h-3 text-blue-400" />
               <span className="text-[10px] font-bold text-white">Líder no Bairro</span>
            </div>
          </div>
          <h3 className="text-2xl font-black text-white leading-tight font-display tracking-tight mb-1">
            Grupo Esquematiza
          </h3>
          <p className="text-xs text-slate-300 font-medium line-clamp-1 max-w-[240px]">
            Referência em excelência e confiança na Freguesia.
          </p>
        </div>
        <div className="bg-white text-slate-950 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center gap-2 shadow-xl group-hover:bg-amber-400 transition-colors">
          Ver serviços <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </button>
  </div>
);

const BlockHeader: React.FC<{ title: string; icon: React.ElementType }> = ({ title, icon: Icon }) => (
  <div className="flex items-center justify-between mb-4 px-1">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
      </div>
      <h2 className="text-[17px] font-black text-gray-900 dark:text-white tracking-tight">
        {title}
      </h2>
    </div>
    <button className="text-[11px] font-black text-primary-500 uppercase tracking-wider">
      Ver mais
    </button>
  </div>
);

const ExploreCard: React.FC<{ 
  store: Partial<Store> & { mockImage?: string; customBadge?: string; customBadgeColor?: string; subText?: string; animType?: string; glowColor?: string }; 
  onClick: () => void;
  showStatus?: boolean;
}> = ({ store, onClick, showStatus }) => (
  <button 
    onClick={onClick}
    className="min-w-[200px] max-w-[200px] snap-center bg-white dark:bg-gray-800 rounded-[28px] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col group active:scale-[0.98] transition-all"
  >
    <div className="h-32 relative overflow-hidden bg-gray-100 dark:bg-gray-700">
      <img 
        src={store.mockImage || store.logoUrl || store.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400&auto=format&fit=crop"} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        alt={store.name} 
      />
      {store.customBadge && (
        <div className={`absolute top-3 left-3 ${store.customBadgeColor || 'bg-[#1E5BFF]'} text-white text-[9px] font-black px-2 py-1 rounded-lg ${store.glowColor || 'shadow-[0_4px_12px_rgba(0,0,0,0.2)]'} uppercase ${store.animType} border border-white/20`}>
          {store.customBadge}
        </div>
      )}
      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
        <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
        <span className="text-[10px] font-bold text-gray-900">{store.rating?.toFixed(1) || '4.5'}</span>
      </div>
    </div>
    <div className="p-4 flex flex-col items-start text-left">
      <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate w-full mb-0.5">{store.name}</h4>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate w-full mb-2">{store.category}</p>
      
      {store.subText && (
        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
          {store.subText}
        </p>
      )}

      {showStatus && (
        <div className="mt-2 flex items-center gap-1.5 animate-badge-float-up">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">ABERTO AGORA</span>
        </div>
      )}
    </div>
  </button>
);

export const ExploreView: React.FC<ExploreViewProps> = ({
  stores,
  onStoreClick,
  onViewMasterSponsor,
}) => {
  
  const sections = useMemo(() => [
    {
      id: 'perto',
      title: 'Perto de Você',
      icon: Navigation,
      items: [
        { ...stores[0], name: 'Pet Shop Araguaia', category: 'Pets', subText: 'A 200m de você', mockImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop', customBadge: 'Muito Perto', animType: 'animate-badge-pop', customBadgeColor: 'bg-gradient-to-r from-blue-600 to-blue-500', glowColor: 'shadow-[0_4px_12px_rgba(30,91,255,0.4)]' },
        { ...stores[1], name: 'Mercado Freguesia', category: 'Mercado', subText: 'A 450m de você', mockImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=400&auto=format&fit=crop', customBadge: 'Muito Perto', animType: 'animate-badge-pop', customBadgeColor: 'bg-gradient-to-r from-blue-600 to-blue-500' },
        { ...stores[0], name: 'Banca do Nelson', category: 'Serviços', subText: 'A 600m de você', mockImage: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=400&auto=format&fit=crop', customBadge: 'Muito Perto', animType: 'animate-badge-pop', customBadgeColor: 'bg-gradient-to-r from-blue-600 to-blue-500' }
      ]
    },
    {
      id: 'avaliados',
      title: 'Mais Bem Avaliados',
      icon: ThumbsUp,
      items: [
        { ...stores[1], name: 'Espaço VIP Beleza', category: 'Beleza', subText: '1.2k avaliações 5★', mockImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop', customBadge: 'Favorito', customBadgeColor: 'bg-gradient-to-r from-amber-600 to-orange-500', animType: 'animate-badge-glow', glowColor: 'shadow-[0_4px_12px_rgba(245,158,11,0.5)]' },
        { ...stores[0], name: 'Clínica Sorriso', category: 'Saúde', subText: '850 avaliações 5★', mockImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400&auto=format&fit=crop', customBadge: 'Excelência', customBadgeColor: 'bg-gradient-to-r from-amber-600 to-orange-500', animType: 'animate-badge-glow' },
        { ...stores[1], name: 'Auto Center Pro', category: 'Serviços', subText: '500 avaliações 5★', mockImage: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop', customBadge: 'Top Rated', customBadgeColor: 'bg-gradient-to-r from-amber-600 to-orange-500', animType: 'animate-badge-glow' }
      ]
    },
    {
      id: 'visita',
      title: 'Vale a Visita Hoje',
      icon: Award,
      items: [
        { ...stores[0], name: 'Terraço Gastrô', category: 'Restaurante', subText: 'Ambiente externo incrível', mockImage: 'https://images.unsplash.com/photo-1550966842-2849a224ef52?q=80&w=400&auto=format&fit=crop', customBadge: 'Curadoria', animType: 'animate-badge-float-up', customBadgeColor: 'bg-gradient-to-r from-violet-600 to-indigo-500', glowColor: 'shadow-[0_4px_12px_rgba(124,58,237,0.4)]' },
        { ...stores[1], name: 'Café com Arte', category: 'Cafeteria', subText: 'O melhor grão da região', mockImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=400&auto=format&fit=crop', customBadge: 'Curadoria', animType: 'animate-badge-float-up', customBadgeColor: 'bg-gradient-to-r from-violet-600 to-indigo-500' },
        { ...stores[0], name: 'Vinhos & Cia', category: 'Boutique', subText: 'Degustação exclusiva', mockImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=400&auto=format&fit=crop', customBadge: 'Curadoria', animType: 'animate-badge-float-up', customBadgeColor: 'bg-gradient-to-r from-violet-600 to-indigo-500' }
      ]
    },
    {
      id: 'agora',
      title: 'Agora na Freguesia',
      icon: Clock,
      items: [
        { ...stores[1], name: 'Padaria 24h', category: 'Padaria', subText: 'Sempre aberta para você', mockImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop', showStatus: true },
        { ...stores[0], name: 'Farmácia Total', category: 'Saúde', subText: 'Plantão noturno ativo', mockImage: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=400&auto=format&fit=crop', showStatus: true },
        { ...stores[1], name: 'Conveniência Posto', category: 'Lojas', subText: 'Snacks e bebidas agora', mockImage: 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?q=80&w=400&auto=format&fit=crop', showStatus: true }
      ]
    },
    {
      id: 'novidades',
      title: 'Novidades da Semana',
      icon: Sparkles,
      items: [
        { ...stores[0], name: 'Loja Geek Freguesia', category: 'Lazer', subText: 'Inaugurado há 2 dias', mockImage: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=400&auto=format&fit=crop', customBadge: 'Estreia', customBadgeColor: 'bg-gradient-to-r from-emerald-600 to-teal-500', animType: 'animate-badge-pop', glowColor: 'shadow-[0_4px_12px_rgba(16,185,129,0.4)]' },
        { ...stores[1], name: 'CrossFit Vila', category: 'Fitness', subText: 'Novo espaço de treino', mockImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop', customBadge: 'Estreia', customBadgeColor: 'bg-gradient-to-r from-emerald-600 to-teal-500', animType: 'animate-badge-pop' },
        { ...stores[0], name: 'Burger & Beer', category: 'Lanches', subText: 'Novo cardápio artesanal', mockImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop', customBadge: 'Estreia', customBadgeColor: 'bg-gradient-to-r from-emerald-600 to-teal-500', animType: 'animate-badge-pop' }
      ]
    },
    {
      id: 'recomendado',
      title: 'Recomendado Pra Você',
      icon: Heart,
      items: [
        { ...stores[1], name: 'Floricultura Primavera', category: 'Casa', subText: 'Baseado no seu interesse', mockImage: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?q=80&w=400&auto=format&fit=crop' },
        { ...stores[0], name: 'Papelaria & Co', category: 'Varejo', subText: 'Sugestão do Localizei', mockImage: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=400&auto=format&fit=crop' },
        { ...stores[1], name: 'Escola de Música', category: 'Educação', subText: 'Próximo a locais que você ama', mockImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400&auto=format&fit=crop' }
      ]
    }
  ], [stores]);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 min-h-screen animate-in fade-in duration-500">
      
      {/* Header do Hub de Descoberta */}
      <div className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-tight">
          Explorar <br/> <span className="text-primary-500">a Freguesia</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          Curadoria exclusiva do que há de melhor no bairro.
        </p>
      </div>

      {/* CARROSSEL EDUCACIONAL (ONBOARDING LEVE) */}
      <EducationalCarousel onStoreClick={(store) => onStoreClick(store)} />

      {/* POSIÇÃO DE DESTAQUE: PATROCINADOR MASTER EXCLUSIVO */}
      <MasterSponsorExploreBanner 
        onClick={() => onViewMasterSponsor?.()} 
      />

      <div className="flex flex-col gap-10 pb-32">
        {sections.map((section) => (
          <section key={section.id} className="px-4">
            <BlockHeader title={section.title} icon={section.icon} />
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 snap-x">
              {section.items.map((store, idx) => (
                <ExploreCard 
                  key={`${section.id}-${idx}`} 
                  store={store} 
                  onClick={() => onStoreClick(store as Store)}
                  showStatus={store.showStatus}
                />
              ))}
              
              <button className="min-w-[140px] snap-center bg-gray-50 dark:bg-gray-800/50 rounded-[28px] border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-3 group active:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-primary-500 transition-colors">
                    <ChevronRight className="w-5 h-5" strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ver todos</span>
              </button>
            </div>
          </section>
        ))}

        <div className="px-4 mt-4">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2 font-display">Sua loja não está aqui?</h3>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                        Faça parte do maior guia do bairro e seja descoberto por milhares de vizinhos todos os dias.
                    </p>
                    <button className="bg-primary-500 text-white font-bold py-3 px-6 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-primary-500/20">
                        Cadastrar meu negócio
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

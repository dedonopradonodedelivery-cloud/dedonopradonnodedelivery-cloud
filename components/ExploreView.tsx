
import React, { useMemo } from 'react';
import { 
  Star, 
  MapPin, 
  ChevronRight, 
  Flame, 
  Zap, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Tag,
  Heart,
  Store as StoreIcon,
  BadgeCheck,
  Play,
  Award
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

// Componente de Título de Bloco Padronizado
const BlockHeader: React.FC<{ title: string; icon: React.ElementType }> = ({ title, icon: Icon }) => (
  <div className="flex items-center justify-between mb-4 px-1">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
      </div>
      <h2 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 tracking-tight">
        {title}
      </h2>
    </div>
    <button className="text-[11px] font-black text-primary-500 uppercase tracking-wider">
      Ver mais
    </button>
  </div>
);

// Card de Exploração Padrão
const ExploreCard: React.FC<{ 
  store: Partial<Store> & { mockImage?: string }; 
  onClick: () => void;
  badge?: string;
  badgeColor?: string;
  showStatus?: boolean;
}> = ({ store, onClick, badge, badgeColor = "bg-[#1E5BFF]", showStatus }) => (
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
      {badge && (
        <div className={`absolute top-3 left-3 ${badgeColor} text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg`}>
          {badge}
        </div>
      )}
      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1">
        <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
        <span className="text-[10px] font-bold text-gray-900">{store.rating?.toFixed(1) || '4.5'}</span>
      </div>
    </div>
    <div className="p-4 flex flex-col items-start text-left">
      <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate w-full mb-0.5">{store.name}</h4>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate w-full">{store.category}</p>
      
      {showStatus && (
        <div className="mt-3 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">ABERTO AGORA</span>
        </div>
      )}
    </div>
  </button>
);

export const ExploreView: React.FC<ExploreViewProps> = ({
  stores,
  onStoreClick,
}) => {
  
  // Banco de Imagens Fictícias curado por categoria para prototipagem
  const sections = useMemo(() => [
    {
      id: 'visita',
      title: 'Vale a Visita Hoje',
      icon: Award,
      items: [
        { ...stores[0], name: 'Bistrô do Vale', category: 'Restaurante', mockImage: 'https://images.unsplash.com/photo-1550966842-2849a224ef52?q=80&w=400&auto=format&fit=crop', badge: 'Destaque' },
        { ...stores[1], name: 'Artisan Café', category: 'Cafeteria', mockImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=400&auto=format&fit=crop', badge: 'Destaque' },
        { ...stores[0], name: 'Vila Gastrô', category: 'Gourmet', mockImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400&auto=format&fit=crop', badge: 'Destaque' }
      ]
    },
    {
      id: 'agora',
      title: 'Agora na Freguesia',
      icon: Clock,
      items: [
        { ...stores[1], name: 'Panificadora Central', category: 'Padaria', mockImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop', showStatus: true },
        { ...stores[0], name: 'Mercado do Bairro', category: 'Mercado', mockImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=400&auto=format&fit=crop', showStatus: true },
        { ...stores[1], name: 'Drogaria Freguesia', category: 'Farmácia', mockImage: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=400&auto=format&fit=crop', showStatus: true }
      ]
    },
    {
      id: 'promo',
      title: 'Promoção da Semana',
      icon: Tag,
      items: [
        { ...stores[0], name: 'Burger Station', category: 'Lanches', mockImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop', badge: '30% OFF', badgeColor: 'bg-rose-500' },
        { ...stores[1], name: 'Pizza & Cia', category: 'Pizzaria', mockImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop', badge: '2x1 HOJE', badgeColor: 'bg-rose-500' },
        { ...stores[0], name: 'Açaí do Porto', category: 'Sobremesas', mockImage: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=400&auto=format&fit=crop', badge: 'GANHE BRINDE', badgeColor: 'bg-rose-500' }
      ]
    },
    {
      id: 'on',
      title: 'O Bairro Tá On',
      icon: Flame,
      items: [
        { ...stores[1], name: 'CrossFit Freguesia', category: 'Fitness', mockImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop', badge: 'Bombando', badgeColor: 'bg-orange-500' },
        { ...stores[0], name: 'Barber Shop Club', category: 'Beleza', mockImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop', badge: 'Muitos vizinhos', badgeColor: 'bg-orange-500' },
        { ...stores[1], name: 'Churrascaria Gaúcha', category: 'Restaurante', mockImage: 'https://images.unsplash.com/photo-1544022613-e879a7998d0f?q=80&w=400&auto=format&fit=crop', badge: 'Fila de espera', badgeColor: 'bg-orange-500' }
      ]
    },
    {
      id: 'novidades',
      title: 'Novidades da Semana',
      icon: Sparkles,
      items: [
        { ...stores[0], name: 'Estúdio de Pilates', category: 'Saúde', mockImage: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?q=80&w=400&auto=format&fit=crop', badge: 'Inauguração' },
        { ...stores[1], name: 'Loja de Pets Amigo', category: 'Pet Shop', mockImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop', badge: 'Novo no bairro' },
        { ...stores[0], name: 'Moda Intima Shop', category: 'Moda', mockImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop', badge: 'Aberta recentemente' }
      ]
    },
    {
      id: 'recomendado',
      title: 'Recomendado Pra Você',
      icon: Heart,
      items: [
        { ...stores[1], name: 'Floricultura Jardim', category: 'Casa', mockImage: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?q=80&w=400&auto=format&fit=crop' },
        { ...stores[0], name: 'Auto Center Freguesia', category: 'Serviços', mockImage: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop' },
        { ...stores[1], name: 'Escola de Idiomas', category: 'Educação', mockImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop' }
      ]
    }
  ], [stores]);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 min-h-screen animate-in fade-in duration-500">
      
      {/* Header do Hub de Descoberta */}
      <div className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-tight">
          Descobrir <br/> <span className="text-primary-500">na Freguesia</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          Curadoria exclusiva do que há de melhor no bairro.
        </p>
      </div>

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
                  badge={store.badge}
                  badgeColor={store.badgeColor}
                  showStatus={store.showStatus}
                />
              ))}
              
              {/* Card de "Ver Todos" no final de cada scroll horizontal */}
              <button className="min-w-[140px] snap-center bg-gray-50 dark:bg-gray-800/50 rounded-[28px] border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-3 group active:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-primary-500 transition-colors">
                    <ChevronRight className="w-5 h-5" strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ver todos</span>
              </button>
            </div>
          </section>
        ))}

        {/* Call-to-Action Institucional ao final da navegação de descoberta */}
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

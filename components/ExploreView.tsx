
import React from 'react';
import { 
  Star, 
  MapPin, 
  ChevronRight, 
  Navigation,
  Percent,
  Filter,
  Clock,
  Zap,
  TrendingUp,
  Crown,
  Heart,
  Flame,
  CheckCircle2,
  Sparkles,
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
  onNavigate: (view: string) => void;
}

// --- MOCK DATA PARA VARIEDADE VISUAL ---

const TOP_RATED = [
  { id: 'tr1', name: 'Le Botteghe di Leonardo', cat: 'Gelateria', n: 4.9, img: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?q=80&w=800&auto=format&fit=crop' },
  { id: 'tr2', name: 'Padaria Colonial', cat: 'Padaria', n: 4.8, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop' },
  { id: 'tr3', name: 'Studio Glow Beauty', cat: 'Estética', n: 5.0, img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop' },
  { id: 'tr4', name: 'Pet Care Freguesia', cat: 'Veterinária', n: 4.9, img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400&auto=format&fit=crop' },
  { id: 'tr5', name: 'Trattoria da Luigi', cat: 'Italiana', n: 4.7, img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=400&auto=format&fit=crop' },
  { id: 'tr6', name: 'Crossfit Taquara', cat: 'Fitness', n: 4.8, img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop' },
];

const NEW_STORES = [
  { id: 'nw1', name: 'Burger Lab Freguesia', cat: 'Hamburgueria', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500&auto=format&fit=crop' },
  { id: 'nw2', name: 'Café do Parque', cat: 'Cafeteria', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=500&auto=format&fit=crop' },
  { id: 'nw3', name: 'Livraria Dom Casmurro', cat: 'Cultura', img: 'https://images.unsplash.com/photo-1507733108721-446ad0313c41?q=80&w=500&auto=format&fit=crop' },
  { id: 'nw4', name: 'Sushi Way Premium', cat: 'Japonês', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop' },
  { id: 'nw5', name: 'Açaí da Orla', cat: 'Açaí', img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=500&auto=format&fit=crop' },
  { id: 'nw6', name: 'Wine & Cheese Bar', cat: 'Adega', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=500&auto=format&fit=crop' },
];

const NOW_IN_JPA = [
  { id: 'nj1', name: 'Supermercado Mundial', status: 'Movimentado', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop' },
  { id: 'nj2', name: 'Posto Shell Pechincha', status: 'Preço atualizado', img: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=600&auto=format&fit=crop' },
  { id: 'nj3', name: 'Drogaria Raia 24h', status: 'Aberto agora', img: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=600&auto=format&fit=crop' },
  { id: 'nj4', name: 'Hortifruti JPA', status: 'Frutas frescas', img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600&auto=format&fit=crop' },
  { id: 'nj5', name: 'Oficina Central', status: 'Vagas para hoje', img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop' },
  { id: 'nj6', name: 'Gráfica Express', status: 'Atendimento rápido', img: 'https://images.unsplash.com/photo-1562564025-51dc11516a0b?q=80&w=600&auto=format&fit=crop' },
];

const SUGGESTIONS = [
  { id: 'sg1', name: 'Dentista Dr. Silva', cat: 'Odontologia', b: 'Freguesia', img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400&auto=format&fit=crop' },
  { id: 'sg2', name: 'Escola de Música Tom', cat: 'Educação', b: 'Taquara', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400&auto=format&fit=crop' },
  { id: 'sg3', name: 'Loja de Tintas JPA', cat: 'Construção', b: 'Anil', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400&auto=format&fit=crop' },
  { id: 'sg4', name: 'Moda Praia Freguesia', cat: 'Moda', b: 'Freguesia', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop' },
  { id: 'sg5', name: 'Veterinária Vida', cat: 'Pets', b: 'Pechincha', img: 'https://images.unsplash.com/photo-1512067678162-db098b03cb52?q=80&w=400&auto=format&fit=crop' },
  { id: 'sg6', name: 'Ótica Visual', cat: 'Saúde', b: 'Taquara', img: 'https://images.unsplash.com/photo-1511732351157-1865efcb7?q=80&w=400&auto=format&fit=crop' },
];

const TRENDING = [
  { id: 'tr1', name: 'Gelateria Mio', color: 'bg-orange-50', text: 'Melhor gelato do bairro', img: 'https://images.unsplash.com/photo-1501443762994-82bd5dabb892?q=80&w=400&auto=format&fit=crop' },
  { id: 'tr2', name: 'Yoga Studio', color: 'bg-emerald-50', text: 'Meditação e Vibe', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop' },
  { id: 'tr3', name: 'Barber Shop', color: 'bg-slate-100', text: 'Corte e Cerveja', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop' },
  { id: 'tr4', name: 'Pizza Night', color: 'bg-red-50', text: 'Forno a Lenha', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
  { id: 'tr5', name: 'Vinhos JPA', color: 'bg-purple-50', text: 'Adega Boutique', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=400&auto=format&fit=crop' },
  { id: 'tr6', name: 'Iron Gym', color: 'bg-blue-50', text: 'Alta Performance', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop' },
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  onStoreClick,
  onFilterClick,
}) => {
  
  const filters = [
    { id: 'nearby', label: 'Perto de mim', icon: Navigation },
    { id: 'top_rated', label: 'Melhores avaliados', icon: Star },
    { id: 'open_now', label: 'Aberto agora', icon: Clock },
    { id: 'cashback', label: 'Cupom', icon: Percent },
  ];

  // Logic for Editorial Top Rated (Ranked layout)
  const featuredStore = TOP_RATED[0];
  const sideStores = TOP_RATED.slice(1, 3); // Apenas 2 lojas abaixo do destaque
  const remainingStores = TOP_RATED.slice(3, 5); // Mais 2 lojas na lista curta

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 min-h-screen animate-in fade-in duration-500">
      
      {/* Barra de Filtros Superior */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex gap-2 overflow-x-auto no-scrollbar items-center">
          <button 
            onClick={onFilterClick}
            className="flex items-center gap-1.5 bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-xs font-bold shrink-0 shadow-lg"
          >
            <Filter className="w-3.5 h-3.5" /> Filtros
          </button>
          {filters.map((f) => (
            <button key={f.id} className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-2 rounded-full text-xs font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap active:bg-gray-100">
              <f.icon className="w-3.5 h-3.5 opacity-60" /> {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-12 pb-32 pt-6">
        
        {/* BLOCO 1: Mais bem avaliados (Layout Editorial Premium) */}
        <section className="px-5">
          <div className="mb-6">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Mais bem avaliados</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Os favoritos da nossa comunidade</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {/* Card Destaque #1 (16:9) */}
            <button 
              key={featuredStore.id}
              className="w-full aspect-video relative group overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 transition-all active:scale-[0.99] rounded-none"
            >
              <img src={featuredStore.img} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-1.5 bg-yellow-400 text-black text-xs font-black px-3 py-1.5 shadow-2xl rounded-none">
                  <Star className="w-4 h-4 fill-black" /> {featuredStore.n.toFixed(1)}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-left">
                <span className="text-[9px] font-black text-yellow-400 uppercase tracking-[0.2em] mb-1 block">Favorito da comunidade</span>
                <h3 className="text-white text-2xl font-black leading-none tracking-tight uppercase drop-shadow-lg">{featuredStore.name}</h3>
              </div>
            </button>

            {/* Sub-cards #2 e #3 (Lado a Lado 1:1) */}
            <div className="grid grid-cols-2 gap-4">
              {sideStores.map((item) => (
                <button 
                  key={item.id}
                  className="flex flex-col text-left group active:opacity-80 transition-all"
                >
                  <div className="aspect-square w-full relative overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 mb-3 rounded-none">
                    <img src={item.img} className="w-full h-full object-cover" alt="" />
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 text-black dark:text-white text-[9px] font-black px-2 py-1 flex items-center gap-0.5 rounded-none border border-gray-100 dark:border-gray-700">
                       <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" /> {item.n.toFixed(1)}
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-xs leading-tight uppercase tracking-tight truncate">{item.name}</h4>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{item.cat}</span>
                </button>
              ))}
            </div>

            {/* Ver Mais / Lista Curta minimalista */}
            {remainingStores.length > 0 && (
               <div className="mt-2 space-y-1">
                 {remainingStores.map((item, idx) => (
                   <button key={item.id} className="w-full flex items-center justify-between py-4 border-t border-gray-100 dark:border-gray-800 group active:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-gray-300 dark:text-gray-700 group-hover:text-yellow-500 transition-colors">#0{idx + 4}</span>
                        <h4 className="font-bold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-tight group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.name}</h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-black text-gray-900 dark:text-white">{item.n.toFixed(1)}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-1" />
                      </div>
                   </button>
                 ))}
                 <button className="w-full py-4 text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.2em] border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                    Ver ranking completo <ChevronRight className="w-3 h-3" />
                 </button>
               </div>
            )}
          </div>
        </section>

        {/* BLOCO 2: Novidades da semana (Horizontal 9:16) */}
        <section>
          <div className="px-5 mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Novidades da semana</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Recém chegados no bairro</p>
            </div>
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-4 snap-x">
            {NEW_STORES.map(item => (
              <button key={item.id} className="snap-center min-w-[150px] aspect-[9/16] bg-gray-900 rounded-[28px] overflow-hidden relative group active:scale-[0.98] transition-transform shadow-xl">
                <img src={item.img} className="absolute inset-0 w-full h-[80%] object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
                <div className="absolute bottom-5 left-4 right-4 text-left">
                  <span className="text-[8px] font-black text-[#1E5BFF] uppercase tracking-widest bg-blue-50/10 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10 mb-2 block w-fit">Novo</span>
                  <h4 className="text-white text-xs font-bold leading-tight mb-1">{item.name}</h4>
                  <p className="text-[9px] text-gray-400 font-medium">{item.cat}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* BLOCO 3: Agora em JPA (16:9 Horizontal) */}
        <section>
          <div className="px-5 mb-5">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Agora em JPA</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">O pulso da cidade em tempo real</p>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-4 snap-x">
            {NOW_IN_JPA.map(item => (
              <button key={item.id} className="snap-center min-w-[280px] aspect-video bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 relative group active:opacity-90 transition-all">
                <img src={item.img} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-sm uppercase tracking-wider shadow-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div> Agora
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-5 right-5 text-left">
                  <h4 className="text-white font-bold text-base mb-0.5">{item.name}</h4>
                  <p className="text-white/70 text-[10px] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {item.status}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* BLOCO 4: Vale a visita hoje (Mosaico) */}
        <section className="px-5">
          <div className="mb-5">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Vale a visita hoje</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Sugestões baseadas no seu perfil</p>
          </div>
          <div className="grid grid-cols-2 grid-rows-3 gap-3 h-[450px]">
            <button className="row-span-2 col-span-2 bg-gray-100 dark:bg-gray-800 rounded-[32px] overflow-hidden relative group active:scale-[0.99] transition-all">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <div className="bg-[#1E5BFF] text-white text-[9px] font-black px-3 py-1 rounded-full w-fit mb-3 uppercase tracking-widest">Destaque do Dia</div>
                <h3 className="text-white text-2xl font-black leading-tight drop-shadow-xl">Bistrô Freguesia</h3>
                <p className="text-white/80 text-xs mt-2 font-medium">O melhor da culinária francesa no coração de Jacarepaguá.</p>
              </div>
            </button>
            <button className="bg-orange-500 rounded-[24px] p-4 flex flex-col justify-between text-left active:scale-[0.98] transition-all">
              <Zap className="text-white/40 w-6 h-6" />
              <span className="text-white font-black text-[10px] uppercase tracking-wider leading-tight">Café Colonial <br/> Taquara</span>
            </button>
            <button className="bg-emerald-500 rounded-[24px] p-4 flex flex-col justify-between text-left active:scale-[0.98] transition-all">
              <Heart className="text-white/40 w-6 h-6" />
              <span className="text-white font-black text-[10px] uppercase tracking-wider leading-tight">Yoga & <br/> Bem-estar</span>
            </button>
          </div>
        </section>

        {/* BLOCO 5: Sugestões para você (Carrossel Horizontal 16:9) */}
        <section>
          <div className="px-5 mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Sugestões para você</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Baseado nas suas últimas buscas</p>
            </div>
            <Sparkles className="w-4 h-4 text-[#1E5BFF]" />
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-6 snap-x">
            {SUGGESTIONS.map(item => (
              <button key={item.id} className="snap-start min-w-[260px] bg-white dark:bg-gray-900 rounded-[28px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col active:scale-[0.98] transition-all group">
                <div className="aspect-video relative overflow-hidden">
                  <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/40 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-wider border border-white/10">Para você</span>
                  </div>
                </div>
                <div className="p-4 text-left">
                  <span className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest">{item.cat}</span>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mt-1 truncate">{item.name}</h4>
                  <div className="flex items-center gap-1.5 mt-2 text-gray-400 font-medium text-[9px]">
                    <MapPin className="w-2.5 h-2.5" /> {item.b}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* BLOCO 6: Em alta na cidade (Trend Carousel) */}
        <section>
          <div className="px-5 mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Em alta na cidade</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-6 snap-x">
            {TRENDING.map(item => (
              <button key={item.id} className={`snap-center min-w-[220px] ${item.color} rounded-[32px] p-6 shadow-sm flex flex-col gap-4 active:scale-[0.98] transition-all relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="w-24 h-24 rounded-full bg-white shadow-xl mx-auto overflow-hidden border-4 border-white/50 group-hover:scale-110 transition-transform duration-500">
                  <img src={item.img} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="text-center relative z-10">
                  <h4 className="font-black text-gray-900 text-sm">{item.name}</h4>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{item.text}</p>
                </div>
                <div className="bg-gray-900 text-white rounded-full py-2 px-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider shadow-lg">
                  Explorar <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* BLOCO FINAL: PATROCINADOR MASTER */}
        <section className="px-5 pb-10">
          <div className="w-full aspect-video bg-slate-900 rounded-[32px] overflow-hidden relative shadow-2xl border border-white/5 group cursor-pointer active:scale-[0.99] transition-all">
            <img src="https://images.unsplash.com/photo-1582408921715-18e7806365c1?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" alt="Master Sponsor" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-start text-left">
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl mb-4 backdrop-blur-md">
                 <IssueCrown className="w-4 h-4 text-amber-500 fill-amber-500" />
                 <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.15em]">Patrocinador Master</span>
              </div>
              <h3 className="text-white text-3xl font-black leading-none mb-3 font-display">Grupo Esquematiza</h3>
              <p className="text-slate-300 text-sm font-medium max-w-[220px] mb-6 leading-relaxed">
                Segurança e facilities com a excelência que seu bairro merece.
              </p>
              <button className="bg-[#1E5BFF] text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-lg shadow-blue-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2 group-hover:bg-blue-600">
                Conhecer ofertas <ChevronRight className="w-3.5 h-3.5" strokeWidth={3} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

// Helper for the missing icon (Crown was used in code but might have different name or import)
const IssueCrown = Crown;


import React, { useMemo, useState } from "react";
import { 
  Search, 
  Sparkles, 
  Star, 
  MapPin, 
  BadgeCheck, 
  ChevronRight, 
  Pill, 
  PawPrint, 
  Utensils, 
  Wrench,
  SearchX
} from "lucide-react";
import { Store } from "@/types";
import { STORES } from "@/constants";

export interface ExploreViewProps {
  stores: Store[];
  searchQuery: string;
  onStoreClick: (store: Store) => void;
  onNavigate: (view: string, data?: any) => void;
  onLocationClick: () => void;
  onFilterClick: () => void;
  onOpenPlans: () => void;
  onViewAllVerified?: () => void;
}

const ESSENTIAL_SERVICES = [
  { id: 'pharmacy', label: 'Farmácias', icon: Pill, color: 'bg-rose-500', category: 'Farmácia' },
  { id: 'pets', label: 'Pet Shops', icon: PawPrint, color: 'bg-amber-500', category: 'Pets' },
  { id: 'food', label: 'Restaurantes', icon: Utensils, color: 'bg-emerald-500', category: 'Alimentação' },
  { id: 'maintenance', label: 'Manutenção', icon: Wrench, color: 'bg-blue-500', category: 'Serviços' },
];

export const ExploreView: React.FC<ExploreViewProps> = ({ stores, searchQuery, onStoreClick, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState(searchQuery || "");

  const novidades = useMemo(() => {
    // Simulando novidades pegando as últimas lojas do array (que não são o patrocinador master)
    return stores.filter(s => s.id !== 'grupo-esquematiza').slice(-6).reverse();
  }, [stores]);

  const populares = useMemo(() => {
    return stores.filter(s => s.rating >= 4.5 && s.id !== 'grupo-esquematiza').sort((a, b) => b.rating - a.rating);
  }, [stores]);

  const handleCategoryClick = (categoryName: string) => {
    // Redireciona para a busca geral ou categoria específica
    onNavigate('all_categories');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500">
      
      {/* HEADER BUSCA */}
      <div className="bg-[#1E5BFF] rounded-b-[3rem] px-6 pt-12 pb-10 shadow-lg">
        <h2 className="text-white font-black text-2xl uppercase tracking-tighter mb-6 leading-tight">
          O que você quer <br/>descobrir hoje?
        </h2>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar lojas, pratos, serviços..."
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/50 outline-none focus:ring-4 focus:ring-white/10 transition-all shadow-xl"
          />
        </div>
      </div>

      <div className="px-5 mt-8 space-y-10">
        
        {/* SEÇÃO 1: NOVIDADES (Carrossel Horizontal) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
              <Sparkles size={16} fill="currentColor" />
            </div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Novidades no Bairro</h3>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-5 px-5 pb-2">
            {novidades.map(store => (
              <button 
                key={store.id} 
                onClick={() => onStoreClick(store)}
                className="flex-shrink-0 w-40 snap-center group"
              >
                <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-[2rem] overflow-hidden mb-3 shadow-md relative border border-gray-100 dark:border-gray-800">
                  <img src={store.image || store.logoUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt={store.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <p className="text-[10px] font-black text-white uppercase tracking-tighter line-clamp-1">{store.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SEÇÃO 2: SERVIÇOS ESSENCIAIS (Grid) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
              <Star size={16} fill="currentColor" />
            </div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Serviços Essenciais</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {ESSENTIAL_SERVICES.map(service => (
              <button 
                key={service.id}
                onClick={() => handleCategoryClick(service.category)}
                className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 active:scale-95 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${service.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                  <service.icon size={20} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-tighter">{service.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* SEÇÃO 3: MAIS POPULARES (Lista Vertical) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
               <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                <Star size={16} fill="currentColor" />
              </div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Mais Populares</h3>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{populares.length} locais</span>
          </div>

          <div className="space-y-3">
            {populares.map(store => (
              <button 
                key={store.id} 
                onClick={() => onStoreClick(store)}
                className="w-full bg-white dark:bg-gray-900 p-4 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700 shadow-inner">
                  <img src={store.logoUrl || store.image} className="w-full h-full object-cover" alt={store.name} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                    {store.verified && <BadgeCheck size={14} className="text-[#1E5BFF] fill-blue-50 dark:fill-gray-900" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-lg border border-yellow-100 dark:border-yellow-800/50">
                      <Star size={10} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-[10px] font-black text-yellow-700 dark:text-yellow-400">{store.rating}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">
                      {store.category} • {store.neighborhood}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-full text-gray-200 group-hover:text-[#1E5BFF] transition-colors">
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

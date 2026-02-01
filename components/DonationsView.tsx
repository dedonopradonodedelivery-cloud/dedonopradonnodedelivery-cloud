import React, { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft, 
  Heart, 
  MapPin, 
  Clock, 
  Plus, 
  Search, 
  X, 
  ChevronRight, 
  Info,
  Package,
  BookOpen,
  Shirt,
  Armchair
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Classified } from '../types';
import { MOCK_CLASSIFIEDS } from '../constants';

interface DonationsViewProps {
  onBack: () => void;
  user: User | null;
  onRequireLogin: () => void;
  onNavigate: (view: string) => void;
}

const DONATION_ITEM_CATEGORIES = [
  { id: 'Roupas', icon: Shirt },
  { id: 'Livros', icon: BookOpen },
  { id: 'Móveis', icon: Armchair },
  { id: 'Outros', icon: Package }
];

const DonationCard: React.FC<{ item: Classified }> = ({ item }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md">
      <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
        <img 
          src={item.imageUrl || "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800"} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-4 right-4">
          <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] bg-emerald-500 text-white shadow-lg border border-white/20">
            DOAÇÃO
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-black text-lg text-gray-900 dark:text-white leading-tight mb-2 truncate">
          {item.title}
        </h3>
        
        <div className="flex items-center gap-4 text-gray-400 mb-6">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
            <MapPin size={12} className="text-blue-500" />
            {item.neighborhood}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
            <Clock size={12} className="text-blue-500" />
            {item.timestamp}
          </div>
        </div>

        <button className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-600 dark:text-gray-300 font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] transition-all">
          Ver detalhes
          <ChevronRight size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export const DonationsView: React.FC<DonationsViewProps> = ({ onBack, user, onRequireLogin, onNavigate }) => {
  const [filterHood, setFilterHood] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const donations = useMemo(() => {
    return MOCK_CLASSIFIEDS.filter(item => item.category === 'Doações em geral');
  }, []);

  const filteredDonations = useMemo(() => {
    return donations.filter(item => {
      const matchHood = !filterHood || item.neighborhood === filterHood;
      const content = (item.title + item.description).toLowerCase();
      const matchCategory = !filterCategory || 
        (filterCategory === 'Roupas' && (content.includes('roupa') || content.includes('casaco') || content.includes('camisa') || content.includes('calçado'))) ||
        (filterCategory === 'Livros' && (content.includes('livro') || content.includes('didático') || content.includes('revista'))) ||
        (filterCategory === 'Móveis' && (content.includes('sofá') || content.includes('mesa') || content.includes('cadeira') || content.includes('cama'))) ||
        (filterCategory === 'Outros' && !content.includes('roupa') && !content.includes('livro') && !content.includes('sofá') && !content.includes('mesa'));
      
      return matchHood && matchCategory;
    });
  }, [donations, filterHood, filterCategory]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-colors active:scale-90">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Doações</h1>
            <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Doe e ajude alguém do bairro</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {DONATION_ITEM_CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setFilterCategory(filterCategory === cat.id ? null : cat.id)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                  filterCategory === cat.id 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800'
                }`}
              >
                <cat.icon size={12} />
                {cat.id}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
             <button 
              onClick={() => setFilterHood(null)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                filterHood === null 
                ? 'bg-gray-900 text-white border-gray-900' 
                : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800'
              }`}
            >
              Todos os bairros
            </button>
            {NEIGHBORHOODS.map(hood => (
              <button 
                key={hood}
                onClick={() => setFilterHood(hood)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                  filterHood === hood 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800'
                }`}
              >
                {hood}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Bloco de Contexto */}
        <section className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30 flex gap-4">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold leading-relaxed">
            Doações ajudam a circular recursos dentro do bairro e fortalecer a comunidade.
          </p>
        </section>

        {/* Lista de Anúncios */}
        {filteredDonations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredDonations.map(item => (
              <DonationCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center mb-6 text-gray-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Nenhuma doação disponível agora</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
              Você pode ser o primeiro a ajudar alguém do seu bairro.
            </p>
            <button 
              onClick={() => {setFilterHood(null); setFilterCategory(null);}}
              className="mt-8 text-[10px] font-black text-blue-600 uppercase tracking-widest underline"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* CTA de Publicação */}
        <section className="pt-12 pb-10">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#1E5BFF]">
              <Heart size={24} strokeWidth={3} fill="currentColor" />
            </div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-6">Tem algo parado que pode ajudar alguém?</p>
            <button 
              onClick={() => onRequireLogin()}
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all"
            >
              Publicar doação
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
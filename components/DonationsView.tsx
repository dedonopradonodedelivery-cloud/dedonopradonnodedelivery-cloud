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
  Armchair,
  SlidersHorizontal,
  Check,
  Camera,
  Loader2
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

  const donations = useMemo(() => {
    return MOCK_CLASSIFIEDS.filter(item => item.category === 'Doações em geral');
  }, []);

  const filteredDonations = useMemo(() => {
    let list = donations.filter(item => {
      const matchHood = !filterHood || item.neighborhood === filterHood;
      const content = (item.title + item.description).toLowerCase();
      const matchCategory = !filterCategory || 
        (filterCategory === 'Roupas' && (content.includes('roupa') || content.includes('casaco') || content.includes('camisa') || content.includes('calçado'))) ||
        (filterCategory === 'Livros' && (content.includes('livro') || content.includes('didático') || content.includes('revista'))) ||
        (filterCategory === 'Móveis' && (content.includes('sofá') || content.includes('mesa') || content.includes('cadeira') || content.includes('cama'))) ||
        (filterCategory === 'Outros' && !content.includes('roupa') && !content.includes('livro') && !content.includes('sofá') && !content.includes('mesa'));
      
      return matchHood && matchCategory;
    });

    if (sortBy === 'oldest') return [...list].reverse();
    return list;
  }, [donations, filterHood, filterCategory, sortBy]);

  const handleAnunciar = () => {
    if (!user) onRequireLogin();
    else setIsCreateModalOpen(true);
  };

  const handleClear = () => {
    setFilterHood(null);
    setFilterCategory(null);
    setSortBy('recent');
  };

  const handleNeighborhoodSelect = (hood: string | null) => {
    if (hood === filterHood) {
      setFilterHood(null);
    } else {
      setFilterHood(hood);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-40 animate-in slide-in-from-right duration-300 relative">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-colors active:scale-90">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Doações</h1>
            <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Doe e ajude alguém do bairro</p>
          </div>
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all shadow-sm"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

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
        </div>
      </header>

      <main className="p-6 space-y-8">
        <section className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30 flex gap-4">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold leading-relaxed">
            Doações ajudam a circular recursos dentro do bairro e fortalecer a comunidade.
          </p>
        </section>

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
              onClick={handleClear}
              className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-[280px] px-4">
        <button 
            onClick={handleAnunciar}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] border border-white/20 active:scale-95 transition-all"
        >
            <Plus size={18} strokeWidth={3} />
            Anunciar doação
        </button>
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsFilterModalOpen(false)}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] sm:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 pb-0 flex flex-col shrink-0">
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 sm:hidden"></div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Filtros Avançados</h2>
                    <button onClick={() => setIsFilterModalOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 p-6 pt-0">
                    <section>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Bairro em Jacarepaguá</h4>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => handleNeighborhoodSelect(null)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filterHood === null ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
                            >
                                Jacarepaguá (Todos)
                            </button>
                            {NEIGHBORHOODS.map(hood => (
                                <button 
                                    key={hood}
                                    onClick={() => handleNeighborhoodSelect(hood)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filterHood === hood ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
                                >
                                    {hood}
                                </button>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Categoria do Item</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {DONATION_ITEM_CATEGORIES.map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={() => setFilterCategory(filterCategory === cat.id ? null : cat.id)}
                                    className={`p-4 rounded-2xl text-sm font-bold border-2 transition-all flex items-center gap-3 ${filterCategory === cat.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 dark:border-gray-800 text-gray-500'}`}
                                >
                                    <cat.icon size={16} />
                                    {cat.id}
                                    {filterCategory === cat.id && <Check className="ml-auto" size={16} />}
                                </button>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Ordenar por</h4>
                        <div className="space-y-2">
                            <button onClick={() => setSortBy('recent')} className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${sortBy === 'recent' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF]' : 'border-gray-100 dark:border-gray-800 text-gray-500'}`}>
                                <span className="text-sm font-bold">Mais recentes primeiro</span>
                                {sortBy === 'recent' && <Check size={18} />}
                            </button>
                            <button onClick={() => setSortBy('oldest')} className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${sortBy === 'oldest' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF]' : 'border-gray-100 dark:border-gray-800 text-gray-500'}`}>
                                <span className="text-sm font-bold">Mais antigos primeiro</span>
                                {sortBy === 'oldest' && <Check size={18} />}
                            </button>
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
                    <div className="flex gap-4">
                      <button onClick={handleClear} className="flex-1 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 rounded-2xl transition-colors">Limpar</button>
                      <button onClick={() => setIsFilterModalOpen(false)} className="flex-[2] py-4 text-xs font-black text-white uppercase tracking-widest bg-[#1E5BFF] rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">Aplicar Filtros</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsCreateModalOpen(false)}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] sm:rounded-3xl p-8 shadow-2xl flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-8 shrink-0 sm:hidden"></div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600"><Heart size={24} fill="currentColor" /></div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Nova Doação</h2>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Categoria: Doações em geral</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="w-full aspect-video rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 cursor-pointer">
                        <Camera size={32} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase">Adicionar Fotos</span>
                    </div>
                    <input placeholder="O que você está doando?" className="w-full p-5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/30" />
                    <select className="w-full p-5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/30">
                        <option value="">Categoria do Item</option>
                        {DONATION_ITEM_CATEGORIES.map(c => <option key={c.id} value={c.id.toLowerCase()}>{c.id}</option>)}
                    </select>
                    <textarea placeholder="Descrição do item e como retirar..." rows={3} className="w-full p-5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-medium dark:text-white resize-none outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <button 
                    onClick={() => { setIsCreateModalOpen(false); alert("Doação enviada para aprovação!"); }}
                    className="w-full mt-8 py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    Publicar Doação
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

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
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Classified, Store } from '../types';
import { MOCK_CLASSIFIEDS, STORES } from '../constants';
import { ClassifiedsCategoryHighlight } from './ClassifiedsCategoryHighlight';

interface DonationsViewProps {
  onBack: () => void;
  user: User | null;
  onRequireLogin: () => void;
  onNavigate: (view: string, data?: any) => void;
}

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
  const [viewState, setViewState] = useState<'list' | 'form' | 'success'>('list');
  const [filterHood, setFilterHood] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    itemCategory: 'Roupas',
    neighborhood: '',
    description: '',
    condition: 'Usado - em bom estado',
    whatsapp: '',
    images: [] as string[]
  });

  const donations = useMemo(() => {
    return MOCK_CLASSIFIEDS.filter(item => item.category === 'Doações em geral');
  }, []);

  const filteredDonations = useMemo(() => {
    return donations.filter(item => !filterHood || item.neighborhood === filterHood);
  }, [donations, filterHood]);

  const categoryHighlight = useMemo(() => {
    return STORES.find(s => s.isSponsored) || STORES[0];
  }, []);

  const handleAnunciar = () => {
    if (!user) {
      onRequireLogin();
      return;
    }
    setViewState('form');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && formData.images.length < 3) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setViewState('success');
    }, 1500);
  };

  if (viewState === 'form') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans animate-in slide-in-from-right duration-300">
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <button onClick={() => setViewState('list')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Publicar doação</h1>
        </header>
        <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Fotos (Obrigatório)*</label>
              <div className="flex gap-3">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-100">
                    <img src={img} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData({...formData, images: formData.images.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full"><X size={10}/></button>
                  </div>
                ))}
                {formData.images.length < 3 && (
                  <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-300 cursor-pointer">
                    <Camera size={24} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Categoria*</label>
                <select value={formData.itemCategory} onChange={e => setFormData({...formData, itemCategory: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold">
                  <option value="Roupas">Roupas</option>
                  <option value="Móveis">Móveis</option>
                  <option value="Livros">Livros</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Bairro*</label>
                <select value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold">
                  <option value="">Selecione</option>
                  {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Condição do item*</label>
              <select value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold">
                <option value="Novo">Novo</option>
                <option value="Usado - em bom estado">Usado - em bom estado</option>
                <option value="Usado - marcas de uso">Usado - marcas de uso</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">WhatsApp de contato*</label>
              <input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} placeholder="(21) 99999-9999" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold" />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Descrição*</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descreva o item e como será a retirada..." rows={4} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-medium resize-none" />
            </div>

            <button type="submit" disabled={isSubmitting || !formData.whatsapp || formData.images.length === 0} className="w-full bg-emerald-600 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Publicar doação'}
            </button>
          </form>
        </main>
      </div>
    );
  }

  if (viewState === 'success') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600 shadow-xl">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">Doação Publicada!</h2>
        <p className="text-gray-500 text-sm mb-12">Obrigado por ajudar a nossa comunidade!</p>
        <button onClick={() => setViewState('list')} className="w-full bg-emerald-600 text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs">Voltar para a lista</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-40 animate-in slide-in-from-right duration-300 relative">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-colors active:scale-90">
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Doações</h1>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">Fazer o bem no Bairro</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAnunciar}
              className="px-3 py-1.5 bg-[#1E5BFF] hover:bg-blue-600 text-white font-black rounded-full shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 uppercase tracking-widest text-[9px] border border-white/10 active:scale-95 transition-all h-9"
            >
              <Plus size={12} strokeWidth={4} />
              Anunciar
            </button>
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all shadow-sm"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        <ClassifiedsCategoryHighlight 
          store={categoryHighlight} 
          onClick={(store) => onNavigate?.('store_detail', { store })} 
        />

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
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Nenhuma doação disponível</h3>
          </div>
        )}
      </main>

      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsFilterModalOpen(false)}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] sm:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 pb-0 flex flex-col shrink-0">
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 sm:hidden"></div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Filtros Doações</h2>
                    <button onClick={() => setIsFilterModalOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 p-6 pt-0">
                    <section>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Bairro em Jacarepaguá</h4>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => setFilterHood(null)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filterHood === null ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
                            >
                                Jacarepaguá (Todos)
                            </button>
                            {NEIGHBORHOODS.map(hood => (
                                <button 
                                    key={hood}
                                    onClick={() => setFilterHood(hood)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filterHood === hood ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
                                >
                                    {hood}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
                    <button onClick={() => setIsFilterModalOpen(false)} className="w-full py-4 text-xs font-black text-white uppercase tracking-widest bg-[#1E5BFF] rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">Aplicar Filtros</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

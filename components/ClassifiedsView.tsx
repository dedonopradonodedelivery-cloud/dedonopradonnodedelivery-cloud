import React, { useState, useMemo, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft,
  Plus, 
  MessageSquare, 
  Briefcase, 
  Building2, 
  Wrench, 
  PawPrint, 
  Tag, 
  Heart,
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  X,
  Camera,
  Loader2,
  AlertCircle,
  Megaphone
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Classified } from '../types';
import { MOCK_CLASSIFIEDS } from '../constants';
import { MasterSponsorBanner } from './MasterSponsorBanner';

const CLASSIFIED_CATEGORIES = [
  { id: 'servicos', name: 'Orçamento de Serviços', slug: 'servicos', icon: <Wrench />, color: 'bg-brand-blue' },
  { id: 'imoveis', name: 'Imóveis Comerciais', slug: 'imoveis', icon: <Building2 />, color: 'bg-brand-blue' },
  { id: 'emprego', name: 'Vaga de emprego', slug: 'emprego', icon: <Briefcase />, color: 'bg-brand-blue' },
  { id: 'adocao', name: 'Adoção', slug: 'adocao', icon: <PawPrint />, color: 'bg-brand-blue' },
  { id: 'doacoes', name: 'Doações', slug: 'doacoes', icon: <Heart />, color: 'bg-brand-blue' },
  { id: 'desapega', name: 'Desapega', slug: 'desapega', icon: <Tag />, color: 'bg-brand-blue' },
];

const ClassifiedCategoryButton: React.FC<{ category: any; onClick: () => void }> = ({ category, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center group active:scale-95 transition-all">
    <div className={`w-full aspect-square rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 ${category.color} border border-white/20`}>
      <div className="flex-1 flex items-center justify-center w-full">
        {React.cloneElement(category.icon as any, { className: "w-8 h-8 text-white drop-shadow-md", strokeWidth: 2.5 })}
      </div>
      <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2">
        <span className="block w-full text-[10px] font-black text-white text-center uppercase tracking-tight leading-tight">{category.name}</span>
      </div>
    </div>
  </button>
);

const ClassifiedCard: React.FC<{ item: Classified; onClick: () => void }> = ({ item, onClick }) => {
    const isDonation = item.category === 'Doações em geral';
    const isAdoption = item.category === 'Adoção de pets';
    const isJob = item.category === 'Empregos';
    const hasPrice = !!item.price && !isDonation && !isAdoption && !isJob;

    return (
        <div 
            onClick={onClick} 
            className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden"
        >
            <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                <img 
                    src={item.imageUrl || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop"} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    {isDonation && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white shadow-lg border border-white/20">
                            DOAÇÃO
                        </span>
                    )}
                    {isAdoption && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500 text-white shadow-lg border border-white/20">
                            ADOÇÃO
                        </span>
                    )}
                    {isJob && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg border border-white/10">
                            VAGA
                        </span>
                    )}
                    <div className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-black/50 text-white backdrop-blur-md">
                        {item.neighborhood}
                    </div>
                </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest">{item.category}</span>
                </div>
                <h3 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-2 h-10 leading-tight mb-2">
                    {item.title}
                </h3>
                <div className="mt-auto pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                        <Clock size={10} />
                        <span>{item.timestamp}</span>
                    </div>
                    {hasPrice && <span className="text-emerald-600 dark:text-emerald-400 text-base font-black italic">{item.price}</span>}
                </div>
            </div>
        </div>
    );
};

const CategorySection: React.FC<{
  category: typeof CLASSIFIED_CATEGORIES[0],
  items: Classified[],
  onItemClick: (item: Classified) => void,
  onAnunciar: () => void,
  scrollRef: (el: HTMLDivElement | null) => void
}> = ({ category, items, onItemClick, onAnunciar, scrollRef }) => {
  const Icon = category.icon;
  return (
    <section ref={scrollRef} className="py-6 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${category.color} flex items-center justify-center text-white shadow-md`}>
            {React.cloneElement(Icon, { size: 18, strokeWidth: 2.5 })}
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{category.name}</h2>
          </div>
        </div>
        <button className="text-[11px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1 hover:underline">
          Ver tudo <ArrowRight size={12} strokeWidth={3} />
        </button>
      </div>

      {items.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2 snap-x snap-center">
          {items.map(item => <ClassifiedCard key={item.id} item={item} onClick={() => onItemClick(item)} />)}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-10 text-center border border-dashed border-gray-200 dark:border-gray-800 animate-in fade-in duration-500">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Search size={32} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">Ainda não tem anúncios aqui</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-6">Seja o primeiro a publicar no seu bairro.</p>
          <button 
            onClick={onAnunciar}
            className="px-6 py-3 bg-[#1E5BFF] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            Anunciar agora
          </button>
        </div>
      )}
    </section>
  )
};

const CreateClassifiedModal: React.FC<{ isOpen: boolean; onClose: () => void; user: User | null }> = ({ isOpen, onClose, user }) => {
    const [step, setStep] = useState(1);
    const [selectedCat, setSelectedCat] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handlePublish = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Anúncio enviado para análise! Em breve ele estará no ar.");
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-8 shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 shrink-0"></div>
                
                {step === 1 ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Escolha a Categoria</h2>
                            <p className="text-sm text-gray-500 mt-1">Onde seu anúncio terá mais resultado?</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {CLASSIFIED_CATEGORIES.map(cat => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => { setSelectedCat(cat.name); setStep(2); }}
                                    className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-blue-500 transition-all text-left flex flex-col gap-3 group"
                                >
                                    <div className="text-blue-500 group-hover:scale-110 transition-transform">{cat.icon}</div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-200">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <button onClick={() => setStep(1)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500"><ChevronLeft size={16}/></button>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Dados do Anúncio</h2>
                                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">{selectedCat}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 cursor-pointer">
                                <Camera size={32} className="mb-2" />
                                <span className="text-[10px] font-bold uppercase">Adicionar Fotos</span>
                            </div>
                            <input placeholder="Título do anúncio" className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold dark:text-white" />
                            <textarea placeholder="Descrição completa..." rows={3} className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-medium dark:text-white resize-none" />
                            <input placeholder="Valor (opcional)" className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold dark:text-white" />
                        </div>

                        <button 
                            onClick={handlePublish}
                            disabled={isSubmitting}
                            className="w-full py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Publicar Anúncio'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export interface ClassifiedsViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  user: User | null;
  onRequireLogin: () => void;
}

export const ClassifiedsView: React.FC<ClassifiedsViewProps> = ({ onBack, onNavigate, user, onRequireLogin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<Classified | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState<'recent' | 'nearby' | 'price'>('recent');
  
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleNeighborhood = (hood: string) => {
    if (hood === 'Jacarepaguá (todos)') {
      setSelectedNeighborhoods([]);
      return;
    }
    setSelectedNeighborhoods(prev => 
      prev.includes(hood) 
        ? prev.filter(h => h !== hood) 
        : [...prev, hood]
    );
  };
  
  const scrollToCategory = (categoryId: string) => {
    sectionRefs.current[categoryId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleAnunciarClick = () => {
    if (!user) {
        onRequireLogin();
    } else {
        setIsCreateModalOpen(true);
    }
  };

  const classifiedsByCat = useMemo(() => {
    let filtered = MOCK_CLASSIFIEDS.filter(item => {
        const matchSearch = searchTerm ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        const matchHood = selectedNeighborhoods.length === 0 ? true : selectedNeighborhoods.includes(item.neighborhood);
        return matchSearch && matchHood;
    });

    if (quickFilter === 'price') {
        filtered = filtered.filter(item => !!item.price);
    }

    const mapping: Record<string, string> = {
      'servicos': 'Orçamento de Serviços',
      'imoveis': 'Imóveis Comerciais',
      'emprego': 'Empregos',
      'adocao': 'Adoção de pets',
      'doacoes': 'Doações em geral',
      'desapega': 'Desapega JPA',
    };
    
    return CLASSIFIED_CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = filtered.filter(item => item.category === mapping[cat.id]);
      return acc;
    }, {} as Record<string, Classified[]>);

  }, [searchTerm, selectedNeighborhoods, quickFilter]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in fade-in duration-500 relative">
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-[280px] px-4">
        <button 
            onClick={handleAnunciarClick}
            className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] border border-white/20 active:scale-95 transition-all"
        >
            <Plus size={18} strokeWidth={3} />
            Anunciar nos Classificados
        </button>
      </div>

      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-5">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-all active:scale-90 shadow-sm"><ChevronLeft size={20}/></button>
          <div className="text-center flex-1">
            <h1 className="text-xl font-black text-gray-900 dark:text-white font-display uppercase tracking-tighter">Classificados JPA</h1>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Conectando o bairro</p>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="O que você procura no bairro?"
            className="w-full bg-gray-100 dark:bg-gray-800 border-none py-4 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white shadow-inner"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
                { id: 'recent', label: 'Mais recentes' },
                { id: 'nearby', label: 'Mais próximos' },
                { id: 'price', label: 'Com preço' },
            ].map(f => (
                <button 
                    key={f.id}
                    onClick={() => setQuickFilter(f.id as any)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        quickFilter === f.id 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800'
                    }`}
                >
                    {f.label}
                </button>
            ))}
        </div>
      </header>
      
      <main className="p-5 pb-48">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-8">
          <button 
            onClick={() => toggleNeighborhood('Jacarepaguá (todos)')}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${selectedNeighborhoods.length === 0 ? 'bg-gray-900 text-white border-gray-900' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800'}`}
          >
            Jacarepaguá (Todos)
          </button>
          {NEIGHBORHOODS.map(hood => (
            <button 
              key={hood}
              onClick={() => toggleNeighborhood(hood)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${selectedNeighborhoods.includes(hood) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800'}`}
            >
              {hood}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-10">
            {CLASSIFIED_CATEGORIES.map(cat => (
                <ClassifiedCategoryButton 
                    key={cat.id} 
                    category={cat} 
                    onClick={() => {
                        // REGRA: Orçamentos de Serviços leva diretamente ao formulário sem landing de banners
                        if (cat.id === 'servicos') onNavigate('services');
                        else if (cat.id === 'imoveis') onNavigate('real_estate');
                        else if (cat.id === 'emprego') onNavigate('jobs');
                        else if (cat.id === 'adocao') onNavigate('adoption');
                        else if (cat.id === 'doacoes') onNavigate('donations');
                        else if (cat.id === 'desapega') onNavigate('desapega');
                        else scrollToCategory(cat.id);
                    }} 
                />
            ))}
        </div>
        
        <div className="space-y-4">
          {CLASSIFIED_CATEGORIES.filter(c => !['imoveis', 'emprego', 'servicos', 'adocao', 'doacoes', 'desapega'].includes(c.id)).map(cat => (
            <CategorySection 
              key={cat.id}
              category={cat}
              items={classifiedsByCat[cat.id] || []}
              onItemClick={setSelectedItem}
              onAnunciar={handleAnunciarClick}
              scrollRef={el => (sectionRefs.current[cat.id] = el)}
            />
          ))}
        </div>

        <section className="mt-16">
          <MasterSponsorBanner 
            onClick={() => onNavigate('patrocinador_master')} 
            label="Classificados JPA" 
            sponsor={{ name: 'Grupo Esquematiza', subtitle: 'Apoiando os classificados do bairro' }}
          />
        </section>
      </main>

      <CreateClassifiedModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        user={user} 
      />

      {selectedItem && (
        <div className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm flex items-end" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-white dark:bg-gray-900 w-full rounded-t-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 shrink-0"></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.2em]">{selectedItem.category} • {selectedItem.neighborhood}</span>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-1 leading-tight uppercase tracking-tighter">{selectedItem.title}</h2>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-1">
                <div className="aspect-video w-full rounded-3xl overflow-hidden bg-gray-100">
                    <img src={selectedItem.imageUrl} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{selectedItem.description}</p>
                </div>
                {selectedItem.price && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Valor solicitado</span>
                        <p className="text-2xl font-black text-emerald-600 italic">{selectedItem.price}</p>
                    </div>
                )}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs uppercase">
                        {selectedItem.advertiser.charAt(0)}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-tight">Publicado por {selectedItem.advertiser}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedItem.timestamp}</p>
                    </div>
                </div>
            </div>
            
            <div className="pt-8">
                <button 
                  onClick={() => {
                    if (!user) onRequireLogin();
                    else window.open(`https://wa.me/${selectedItem.contactWhatsapp}`, '_blank');
                  }}
                  className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <MessageSquare size={20} fill="white" /> Chamar no WhatsApp
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
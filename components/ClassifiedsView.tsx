
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
  ArrowRight
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Classified } from '../types';
import { MOCK_CLASSIFIEDS } from '../constants';

const CLASSIFIED_CATEGORIES = [
  { id: 'servicos', name: 'Serviços', slug: 'servicos', icon: <Wrench />, color: 'bg-brand-blue' },
  { id: 'imoveis', name: 'Imóveis', slug: 'imoveis', icon: <Building2 />, color: 'bg-brand-blue' },
  { id: 'emprego', name: 'Emprego', slug: 'emprego', icon: <Briefcase />, color: 'bg-brand-blue' },
  { id: 'adocao', name: 'Adoção', slug: 'adocao', icon: <PawPrint />, color: 'bg-brand-blue' },
  { id: 'doacoes', name: 'Doações', slug: 'doacoes', icon: <Heart />, color: 'bg-brand-blue' },
  { id: 'desapega', name: 'Desapega', slug: 'desapega', icon: <Tag />, color: 'bg-brand-blue' },
];

const ClassifiedCategoryButton: React.FC<{ category: any; onClick: () => void }> = ({ category, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center group active:scale-95 transition-all">
    <div className={`w-full aspect-square rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 ${category.color} border border-white/20`}>
      <div className="flex-1 flex items-center justify-center w-full">
        {React.cloneElement(category.icon as any, { className: "w-7 h-7 text-white drop-shadow-md", strokeWidth: 2.5 })}
      </div>
      <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2">
        <span className="block w-full text-[9px] font-black text-white text-center uppercase tracking-tight">{category.name}</span>
      </div>
    </div>
  </button>
);

const ClassifiedCard: React.FC<{ item: Classified; onClick: () => void }> = ({ item, onClick }) => (
    <div 
        onClick={onClick} 
        className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
        <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
            <img 
                src={item.imageUrl || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop"} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
        </div>
        <div className="p-4 flex-1 flex flex-col">
            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-[9px] font-bold px-2 py-1 rounded-full w-fit mb-2 uppercase tracking-wider">{item.neighborhood}</span>
            <h3 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-2 h-10 leading-tight">
                {item.title}
            </h3>
            <div className="mt-auto pt-2 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span>{item.timestamp}</span>
                {item.price && <span className="text-emerald-600 dark:text-emerald-400 text-sm font-black">{item.price}</span>}
            </div>
        </div>
    </div>
);

const CategorySection: React.FC<{
  category: typeof CLASSIFIED_CATEGORIES[0],
  items: Classified[],
  onItemClick: (item: Classified) => void,
  scrollRef: (el: HTMLDivElement | null) => void
}> = ({ category, items, onItemClick, scrollRef }) => {
  const Icon = category.icon;
  return (
    <section ref={scrollRef} className="py-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${category.color} flex items-center justify-center text-white shadow-md`}>
            {React.cloneElement(Icon, { size: 18, strokeWidth: 2.5 })}
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{category.name}</h2>
          </div>
        </div>
        <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
          Ver tudo <ArrowRight size={12} />
        </button>
      </div>

      {items.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2 snap-x">
          {items.map(item => <ClassifiedCard key={item.id} item={item} onClick={() => onItemClick(item)} />)}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ainda não há anúncios aqui.</p>
        </div>
      )}
    </section>
  )
};

export interface ClassifiedsViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  onRequireLogin: () => void;
}

export const ClassifiedsView: React.FC<ClassifiedsViewProps> = ({ onBack, onNavigate, user, onRequireLogin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<Classified | null>(null);
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

  const classifiedsByCat = useMemo(() => {
    const filteredByGlobal = MOCK_CLASSIFIEDS.filter(item => {
        const matchSearch = searchTerm ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        const matchHood = selectedNeighborhoods.length === 0 ? true : selectedNeighborhoods.includes(item.neighborhood);
        return matchSearch && matchHood;
    });

    const mapping: Record<string, string> = {
      'servicos': 'Serviços',
      'imoveis': 'Imóveis',
      'emprego': 'Empregos',
      'adocao': 'Adoção de pets',
      'doacoes': 'Doações em geral',
      'desapega': 'Desapega JPA',
    };
    
    return CLASSIFIED_CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = filteredByGlobal.filter(item => item.category === mapping[cat.id]);
      return acc;
    }, {} as Record<string, Classified[]>);

  }, [searchTerm, selectedNeighborhoods]);

  const handlePublish = () => {
    if (!user) onRequireLogin();
    else alert('Tela de publicação em breve!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in fade-in duration-500 relative">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-all active:scale-90"><ChevronLeft size={20}/></button>
          <div className="text-center flex-1">
            <h1 className="text-xl font-black text-gray-900 dark:text-white font-display uppercase tracking-tighter">Classificados JPA</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium -mt-1">Resolva o que você precisa perto de casa</p>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="O que você procura?"
            className="w-full bg-gray-100 dark:bg-gray-800 border-none py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-white shadow-inner"
          />
        </div>
      </header>
      
      <main className="p-5 pb-32">
        {/* Filtro de Bairro */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6">
          <button 
            onClick={() => toggleNeighborhood('Jacarepaguá (todos)')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedNeighborhoods.length === 0 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'}`}
          >
            Jacarepaguá (Todos)
          </button>
          {NEIGHBORHOODS.map(hood => (
            <button 
              key={hood}
              onClick={() => toggleNeighborhood(hood)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedNeighborhoods.includes(hood) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'}`}
            >
              {hood}
            </button>
          ))}
        </div>

        {/* Categorias (Estilo Home) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
            {CLASSIFIED_CATEGORIES.map(cat => (
                <ClassifiedCategoryButton 
                    key={cat.id} 
                    category={cat} 
                    onClick={() => scrollToCategory(cat.id)} 
                />
            ))}
        </div>
        
        {/* Blocos de Conteúdo */}
        <div className="space-y-8">
          {CLASSIFIED_CATEGORIES.map(cat => (
            <CategorySection 
              key={cat.id}
              category={cat}
              items={classifiedsByCat[cat.id] || []}
              onItemClick={setSelectedItem}
              scrollRef={el => (sectionRefs.current[cat.id] = el)}
            />
          ))}
        </div>
      </main>

      <div className="fixed bottom-24 right-5 z-50">
        <button 
          onClick={handlePublish}
          className="w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus size={32} />
        </button>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[1001] bg-black/60 flex items-end" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-white dark:bg-gray-900 w-full rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 shrink-0"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{selectedItem.category} • {selectedItem.neighborhood}</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{selectedItem.title}</h2>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2 -mr-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{selectedItem.description}</p>
                {selectedItem.price && <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedItem.price}</p>}
                <p className="text-xs text-gray-400">Publicado {selectedItem.timestamp} por <strong>{selectedItem.advertiser}</strong></p>
            </div>
            
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => {
                    if (!user) onRequireLogin();
                    else window.open(`https://wa.me/${selectedItem.contactWhatsapp}`, '_blank');
                  }}
                  className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  <MessageSquare size={20} /> Entrar em contato
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

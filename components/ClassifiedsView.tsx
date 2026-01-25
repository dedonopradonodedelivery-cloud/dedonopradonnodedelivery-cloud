
import React, { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft, 
  Plus, 
  X, 
  MessageSquare, 
  Briefcase, 
  Building2, 
  Wrench, 
  PawPrint, 
  Tag, 
  LayoutGrid,
  Info
} from 'lucide-react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { Classified } from '../types';
import { MOCK_CLASSIFIEDS } from '../constants';

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: LayoutGrid },
  { id: 'empregos', label: 'Empregos', icon: Briefcase },
  { id: 'serviços', label: 'Serviços', icon: Wrench },
  { id: 'imóveis', label: 'Imóveis', icon: Building2 },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'venda', label: 'Compra & Venda', icon: Tag },
];

const ClassifiedDetailModal: React.FC<{
  item: Classified;
  user: User | null;
  onClose: () => void;
  onRequireLogin: () => void;
}> = ({ item, user, onClose, onRequireLogin }) => {
  const handleContact = () => {
    if (!user) {
      onRequireLogin();
    } else {
      window.open(`https://wa.me/${item.contactWhatsapp}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[1001] bg-black/60 flex items-end" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 shrink-0"></div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{item.category} • {item.neighborhood}</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{item.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400"><X size={24} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2 -mr-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
            {item.price && <p className="text-lg font-bold text-gray-900 dark:text-white">{item.price}</p>}
            <p className="text-xs text-gray-400">Publicado {item.timestamp} por <strong>{item.advertiser}</strong></p>
        </div>
        
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <button 
              onClick={handleContact}
              className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <MessageSquare size={20} /> Entrar em contato
            </button>
        </div>
      </div>
    </div>
  );
};


export interface ClassifiedsViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  onRequireLogin: () => void;
}

export const ClassifiedsView: React.FC<ClassifiedsViewProps> = ({ onBack, onNavigate, user, onRequireLogin }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<Classified | null>(null);

  const filteredItems = useMemo(() => {
    return MOCK_CLASSIFIEDS.filter(item => {
      const matchHood = currentNeighborhood === 'Jacarepaguá (todos)' || item.neighborhood === currentNeighborhood;
      const matchCat = activeCategory === 'all' || item.category.toLowerCase().includes(activeCategory);
      return matchHood && matchCat;
    });
  }, [currentNeighborhood, activeCategory]);
  
  const handlePublish = () => {
    if (!user) {
      onRequireLogin();
    } else {
      alert('Publicar anúncio (em breve)');
    }
  };

  const getIconForCategory = (category: string) => {
    switch (category) {
        case 'Empregos': return <Briefcase size={16} />;
        case 'Serviços': return <Wrench size={16} />;
        case 'Avisos': return <Info size={16} />;
        default: return <Tag size={16} />;
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in fade-in duration-500 overflow-x-hidden">
      <header className="bg-white dark:bg-gray-900 px-6 pt-10 pb-6 border-b border-gray-100 dark:border-gray-800 rounded-b-[2.5rem] shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Classificados JPA</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">O que acontece no bairro</p>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 mt-4">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all flex items-center gap-2 ${activeCategory === cat.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
              >
                <cat.icon size={12} /> {cat.label}
              </button>
            ))}
        </div>
      </header>

      <main className="max-w-md mx-auto py-4 space-y-4 w-full px-4">
        <div className="p-4 bg-white dark:bg-gray-900 sm:rounded-2xl border-b sm:border border-gray-100 dark:border-gray-800">
          <button 
            onClick={handlePublish}
            className="w-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold text-sm py-3 px-4 rounded-xl transition-colors flex items-center gap-2 hover:bg-blue-100"
          >
            <Plus size={16} />
            Publicar Anúncio Grátis
          </button>
        </div>

        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getIconForCategory(item.category)}
                  <span className="text-[10px] font-bold uppercase text-gray-400">{item.category}</span>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">{item.title}</h3>
              </div>
              {item.price && <span className="font-bold text-blue-600 text-sm">{item.price}</span>}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                <p className="text-xs text-gray-400">{item.advertiser}</p>
                <p className="text-xs text-gray-400">{item.timestamp}</p>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>Nenhum classificado encontrado.</p>
          </div>
        )}
      </main>
      
      {selectedItem && (
        <ClassifiedDetailModal 
          item={selectedItem}
          user={user}
          onClose={() => setSelectedItem(null)}
          onRequireLogin={onRequireLogin}
        />
      )}
    </div>
  );
};

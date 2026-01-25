
import React, { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { 
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
  Clock
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Classified } from '../types';
import { MOCK_CLASSIFIEDS } from '../constants';

const CLASSIFIED_CATEGORIES = [
  { id: 'servicos', label: 'Serviços locais', icon: Wrench, color: 'bg-blue-500' },
  { id: 'imoveis', label: 'Imóveis', icon: Building2, color: 'bg-purple-500' },
  { id: 'emprego', label: 'Vaga de emprego', icon: Briefcase, color: 'bg-emerald-500' },
  { id: 'adocao', label: 'Adoção de pets', icon: PawPrint, color: 'bg-orange-500' },
  { id: 'doacoes', label: 'Doações em geral', icon: Heart, color: 'bg-rose-500' },
  { id: 'desapega', label: 'Desapega JPA', icon: Tag, color: 'bg-indigo-500' },
];

const ClassifiedCard: React.FC<{ item: Classified; onClick: () => void }> = ({ item, onClick }) => (
    <div 
        onClick={onClick} 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
        <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50 dark:bg-gray-700 relative">
            <img 
                src={item.imageUrl || "/assets/default-logo.png"} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2 bg-black/50 text-white text-[9px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm">
                {item.neighborhood}
            </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-2 h-10 leading-tight">
                {item.title}
            </h3>
            <div className="mt-auto pt-2 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span>{item.timestamp}</span>
                {item.price && <span className="text-emerald-600 dark:text-emerald-400">{item.price}</span>}
            </div>
        </div>
    </div>
);

export interface ClassifiedsViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  onRequireLogin: () => void;
}

export const ClassifiedsView: React.FC<ClassifiedsViewProps> = ({ onBack, onNavigate, user, onRequireLogin }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<Classified | null>(null);

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

  const filteredItems = useMemo(() => {
    return MOCK_CLASSIFIEDS.filter(item => {
      const matchSearch = searchTerm ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchHood = selectedNeighborhoods.length === 0 ? true : selectedNeighborhoods.includes(item.neighborhood);
      
      let matchCat = true;
      if (activeCategory) {
        // Mapeamento simplificado para o mock
        if (activeCategory === 'emprego') matchCat = item.category === 'Empregos';
        else if (activeCategory === 'servicos') matchCat = item.category === 'Serviços';
        else if (activeCategory === 'imoveis') matchCat = item.category === 'Imóveis';
        else if (activeCategory === 'adocao') matchCat = item.category === 'Adoção de pets';
        else if (activeCategory === 'doacoes') matchCat = item.category === 'Doações em geral';
        else if (activeCategory === 'desapega') matchCat = item.category === 'Desapega JPA';
      }
      
      return matchSearch && matchHood && matchCat;
    });
  }, [searchTerm, selectedNeighborhoods, activeCategory]);

  const handlePublish = () => {
    if (!user) onRequireLogin();
    else alert('Tela de publicação em breve!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in fade-in duration-500 relative">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-display uppercase tracking-tighter">Classificados JPA</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Resolva o que você precisa perto de casa</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="O que você procura?"
            className="w-full bg-gray-100 dark:bg-gray-800 border-none py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
          />
        </div>
      </header>
      
      <main className="p-5 pb-32">
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

        <div className="grid grid-cols-3 gap-3 mb-8">
          {CLASSIFIED_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(isSelected ? null : cat.id)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all ${isSelected ? `${cat.color} text-white shadow-lg` : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-bold leading-tight">{cat.label}</span>
              </button>
            )
          })}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <ClassifiedCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>Nenhum anúncio encontrado.</p>
          </div>
        )}
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
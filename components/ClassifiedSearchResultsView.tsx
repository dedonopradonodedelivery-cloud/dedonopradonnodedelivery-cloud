
import React, { useMemo } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Briefcase, 
  Building2, 
  Wrench, 
  PawPrint, 
  Heart, 
  Tag,
  AlertCircle
} from 'lucide-react';
import { MOCK_CLASSIFIEDS } from '../constants';
import { Classified } from '../types';

interface ClassifiedSearchResultsViewProps {
  searchTerm: string;
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  'Orçamento de Serviços': Wrench,
  'Imóveis Comerciais': Building2,
  'Empregos': Briefcase,
  'Adoção de pets': PawPrint,
  'Doações em geral': Heart,
  'Desapega JPA': Tag,
};

const CATEGORY_LABELS: Record<string, string> = {
  'Orçamento de Serviços': 'Orçamento de Serviços',
  'Imóveis Comerciais': 'Imóveis Comerciais',
  'Empregos': 'Vagas de Emprego',
  'Adoção de pets': 'Adoção',
  'Doações em geral': 'Doações',
  'Desapega JPA': 'Desapega',
};

const ResultCard: React.FC<{ item: Classified; onClick: () => void }> = ({ item, onClick }) => {
    const isDonation = item.category === 'Doações em geral';
    const isAdoption = item.category === 'Adoção de pets';
    const hasPrice = !!item.price && !isDonation && !isAdoption && item.category !== 'Empregos';

    return (
        <div 
            onClick={onClick}
            className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex gap-4 active:scale-[0.98] transition-all cursor-pointer"
        >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden shrink-0">
                <img src={item.imageUrl || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800"} className="w-full h-full object-cover" alt={item.title} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight mb-1">{item.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <MapPin size={10} className="text-blue-500" />
                    <span className="truncate">{item.neighborhood}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <Clock size={10} className="text-blue-500" />
                    <span>{item.timestamp}</span>
                </div>
                {hasPrice && <p className="mt-2 text-emerald-600 font-black italic">{item.price}</p>}
            </div>
            <div className="flex items-center">
                <ChevronRight className="w-5 h-5 text-gray-200" />
            </div>
        </div>
    );
};

export const ClassifiedSearchResultsView: React.FC<ClassifiedSearchResultsViewProps> = ({ searchTerm, onBack, onNavigate }) => {
  const groupedResults = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = MOCK_CLASSIFIEDS.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    );

    const groups: Record<string, Classified[]> = {};
    filtered.forEach(item => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
    });

    return Object.entries(groups).sort();
  }, [searchTerm]);

  const totalResults = useMemo(() => 
    Object.values(groupedResults).reduce((acc, curr) => acc + curr[1].length, 0), 
  [groupedResults]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col pb-32 animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 pt-10 pb-6 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-all active:scale-90">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Resultados</h1>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Busca em Classificados</p>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3 border border-gray-100 dark:border-gray-700 shadow-inner">
            <Search size={18} className="text-[#1E5BFF]" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">"{searchTerm}"</span>
            <span className="ml-auto text-[10px] font-black text-gray-400 uppercase tracking-widest">{totalResults} anúncios</span>
        </div>
      </header>

      <main className="flex-1 p-5 space-y-10 overflow-y-auto no-scrollbar">
        {groupedResults.length > 0 ? groupedResults.map(([category, items]) => {
          const Icon = CATEGORY_ICONS[category] || Search;
          const label = CATEGORY_LABELS[category] || category;

          return (
            <section key={category} className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF]">
                        <Icon size={16} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{label}</h2>
                    <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {items.map(item => (
                        <ResultCard 
                            key={item.id} 
                            item={item} 
                            onClick={() => onNavigate('classified_detail', { item })} 
                        />
                    ))}
                </div>
            </section>
          );
        }) : (
          <div className="py-24 text-center flex flex-col items-center opacity-40">
             <AlertCircle size={48} className="text-gray-300 mb-4" />
             <p className="text-sm font-bold uppercase tracking-widest">Nenhum anúncio encontrado</p>
             <p className="text-xs text-gray-500 mt-2 max-w-[200px] mx-auto">Tente buscar por termos mais genéricos como "vaga", "sala" ou "doação".</p>
          </div>
        )}
      </main>
    </div>
  );
};

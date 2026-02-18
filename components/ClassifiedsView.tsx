
import React, { useState, useMemo, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft, Plus, MessageSquare, Briefcase, Building2, Wrench, PawPrint, Tag, Heart, Search, MapPin, Clock, ArrowRight, SlidersHorizontal, CheckCircle2, X, Camera, Loader2, AlertCircle, Megaphone, Check, ChevronRight
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Classified, AdType, Store, ServiceUrgency } from '../types';
import { MOCK_CLASSIFIEDS, STORES } from '../constants';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { ClassifiedsSelectionModal } from './ClassifiedsSelectionModal';
import { ClassifiedsFilterModal } from './ClassifiedsFilterModal';

interface ClassifiedsViewProps {
  onBack: () => void;
  user: User | null;
  onRequireLogin: () => void;
  onNavigate: (view: string, data?: any) => void;
}

const CLASSIFIED_CATEGORIES = [
  { id: 'servicos', name: 'Orçamento de Serviços', slug: 'services_landing', icon: <Wrench />, color: 'bg-brand-blue', bentoClass: 'col-span-4 aspect-[4/1]' },
  { id: 'imoveis', name: 'Imóveis Comerciais', slug: 'real_estate', icon: <Building2 />, color: 'bg-brand-blue', bentoClass: 'col-span-2 aspect-[1/0.8]' },
  { id: 'doacoes', name: 'Doações', slug: 'donations', icon: <Heart />, color: 'bg-brand-blue', bentoClass: 'col-span-1 aspect-[1/1.6]' },
  { id: 'desapega', name: 'Desapega', slug: 'desapega', icon: <Tag />, color: 'bg-brand-blue', bentoClass: 'col-span-1 aspect-[1/1.6]' },
];

const ClassifiedCategoryButton: React.FC<{ category: any; onClick: () => void }> = ({ category, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center group active:scale-95 transition-all w-full h-full ${category.bentoClass}`}>
    <div className={`w-full h-full rounded-[22px] border border-white/20 shadow-sm flex flex-col items-center justify-between p-2 ${category.color}`}>
      <div className="flex-1 flex items-center justify-center">{React.cloneElement(category.icon as any, { className: "text-white drop-shadow-md", size: category.id === 'servicos' ? 28 : (category.id === 'imoveis' ? 32 : 22), strokeWidth: 3 })}</div>
      <span className="text-[7.5px] w-full font-black text-white text-center uppercase tracking-tighter leading-tight pb-1 truncate">{category.name}</span>
    </div>
  </button>
);

const ClassifiedCard: React.FC<{ item: Classified; onClick: () => void }> = ({ item, onClick }) => (
    <div onClick={onClick} className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden">
        <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
            <img src={item.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-black/50 text-white backdrop-blur-md">{item.neighborhood}</div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-2 h-10 leading-tight mb-2">{item.title}</h3>
            <div className="mt-auto pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider"><Clock size={10} /><span>{item.timestamp}</span></div>
                {item.price && <span className="text-emerald-600 dark:text-emerald-400 text-base font-black italic">{item.price}</span>}
            </div>
        </div>
    </div>
);

export const ClassifiedsView: React.FC<ClassifiedsViewProps> = ({ onBack, onNavigate, user, onRequireLogin }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const services = useMemo(() => MOCK_CLASSIFIEDS.filter(item => item.category === 'Orçamento de Serviços').slice(0, 5), []);
  const donations = useMemo(() => MOCK_CLASSIFIEDS.filter(item => item.category === 'Doações em geral' || item.category === 'Adoção de pets').slice(0, 8), []);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500 overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-brand-blue px-5 py-6 border-b border-white/10 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-5">
          <button onClick={onBack} className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white active:scale-90 transition-all shadow-sm shrink-0"><ChevronLeft size={20} /></button>
          <div className="text-center flex-1 min-w-0">
            <h1 className="font-black text-xl text-white uppercase tracking-tighter leading-none truncate">Classificados</h1>
            <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mt-1 truncate">Oportunidades em {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}</p>
          </div>
          <button onClick={() => { if(!user) onRequireLogin(); else setIsSelectionOpen(true); }} className="px-3 py-1.5 bg-[#1E5BFF] hover:bg-blue-600 text-white font-black rounded-full shadow-lg flex items-center justify-center gap-1.5 uppercase tracking-widest text-[9px] border border-white/10 h-9 shrink-0"><Plus size={12} strokeWidth={4} />Anunciar</button>
        </div>
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Busque anúncios..." className="w-full bg-white/10 border-none py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/40 shadow-inner" />
        </div>
      </header>

      <main className="p-5 space-y-4">
        <div className="grid grid-cols-4 gap-3 mb-8 mt-2">
            {CLASSIFIED_CATEGORIES.map(cat => (<ClassifiedCategoryButton key={cat.id} category={cat} onClick={() => onNavigate(cat.slug)} />))}
        </div>

        <section className="py-8 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-blue flex items-center justify-center text-white shadow-lg"><Wrench size={20} /></div>
                    <div><h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Serviços</h2><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Profissionais do bairro</p></div>
                </div>
                <button onClick={() => onNavigate('services_landing')} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1">Ver tudo <ArrowRight size={12} /></button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2 snap-x">
                {services.map(item => <ClassifiedCard key={item.id} item={item} onClick={() => onNavigate('classified_detail', { item })} />)}
            </div>
        </section>

        <section className="py-8 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg"><Heart size={20} /></div>
                    <div><h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Doações</h2><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ações sociais e pets</p></div>
                </div>
                <button onClick={() => onNavigate('donations')} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1">Ver tudo <ArrowRight size={12} /></button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2 snap-x">
                {donations.map(item => <ClassifiedCard key={item.id} item={item} onClick={() => onNavigate('classified_detail', { item })} />)}
            </div>
        </section>

        {/* PATROCINADOR MASTER OBRIGATÓRIO RODAPÉ */}
        <section className="mt-8">
          <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label="Classificados JPA" />
        </section>
      </main>

      <ClassifiedsSelectionModal isOpen={isSelectionOpen} onClose={() => setIsSelectionOpen(false)} onSelect={(slug) => { setIsSelectionOpen(false); onNavigate(slug); }} />
      <ClassifiedsFilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={(filters) => { setIsFilterOpen(false); }} />
    </div>
  );
};


import React, { useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Star,
  BadgeCheck,
  MapPin,
  Stethoscope,
  Sparkles,
  User as UserIcon
} from 'lucide-react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { Store } from '../types';
import { STORES } from '../constants';
import { MasterSponsorBadge } from './MasterSponsorBadge';

interface HealthSpecialtyDetailViewProps {
  specialtyName: string;
  onBack: () => void;
  onSelectStore: (store: Store) => void;
}

const MOCK_HIGHLIGHTS = [
    {
        id: 'h1',
        name: 'Dra. Juliana Mendes',
        image: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?q=80&w=400',
        call: 'Ginecologia Regenerativa',
        desc: 'Tratamentos modernos e humanizados.',
        cta: 'Agendar'
    },
    {
        id: 'h2',
        name: 'Dr. Ricardo Silva',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400',
        call: 'Check-up Anual',
        desc: 'Exames completos e precisos.',
        cta: 'Ver'
    },
    {
        id: 'h3',
        name: 'Clínica Mulher Ativa',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400',
        call: 'Nova Unidade',
        desc: 'Especialistas renomados no bairro.',
        cta: 'Conhecer'
    }
];

const MOCK_PROFESSIONALS = [
    { id: 'p1', name: 'Dra. Beatriz Soares', specialty: 'Ginecologia e Obstetrícia', location: 'Freguesia', rating: 4.9, image: 'https://i.pravatar.cc/150?u=beatriz' },
    { id: 'p2', name: 'Dr. Marcos Paulo', specialty: 'Ginecologia Endócrina', location: 'Taquara', rating: 4.8, image: 'https://i.pravatar.cc/150?u=marcos' },
    { id: 'p3', name: 'Dra. Helena Vaz', specialty: 'Mastologia', location: 'Anil', rating: 4.9, image: 'https://i.pravatar.cc/150?u=helena' },
    { id: 'p4', name: 'Dr. Andre Luiz', specialty: 'Uroginecologia', location: 'Pechincha', rating: 4.7, image: 'https://i.pravatar.cc/150?u=andre' },
];

export const HealthSpecialtyDetailView: React.FC<HealthSpecialtyDetailViewProps> = ({ 
  specialtyName, 
  onBack,
  onSelectStore
}) => {
  const { currentNeighborhood } = useNeighborhood();

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* 1. Header Fixo com Selo Premium */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-transform">
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{specialtyName}</h1>
            <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Especialistas em {currentNeighborhood}</p>
          </div>
        </div>
        <MasterSponsorBadge />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <section className="px-5 pt-6">
            <div className="relative w-full aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-blue-600 shadow-2xl">
                <img 
                    src="https://images.unsplash.com/photo-1505751172107-573225a94022?q=80&w=1200" 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" 
                    alt="Cuidado"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-end p-8">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 w-fit mb-3">
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Referência Local</span>
                    </div>
                    <h2 className="text-3xl font-black text-white leading-[0.95] uppercase tracking-tighter drop-shadow-lg">
                        Cuidado Especial <br/>Para Você.
                    </h2>
                </div>
            </div>
        </section>

        <section className="pt-10 px-5">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" fill="currentColor" />
                    <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Destaques</h3>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-5 px-5 pb-4">
                {MOCK_HIGHLIGHTS.map(h => (
                    <div key={h.id} className="min-w-[200px] max-w-[200px] snap-center bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden flex flex-col group">
                        <div className="h-28 w-full overflow-hidden bg-gray-50 relative">
                             <img src={h.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={h.name} />
                             <div className="absolute top-3 right-3">
                                <BadgeCheck size={14} className="text-[#1E5BFF] fill-white" />
                             </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h4 className="font-black text-gray-900 dark:text-white text-[11px] uppercase tracking-tighter mb-1 line-clamp-1">{h.call}</h4>
                            <p className="text-[9px] font-bold text-[#1E5BFF] uppercase tracking-widest mb-2 truncate">{h.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium leading-tight line-clamp-2 mb-4">"{h.desc}"</p>
                            <button className="mt-auto w-full py-2 bg-blue-50 dark:bg-blue-900/30 text-[#1E5BFF] font-black text-[9px] uppercase tracking-widest rounded-xl transition-all active:scale-95">
                                {h.cta}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section className="pt-10 px-5 space-y-4">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-2">
                <Stethoscope size={16} className="text-gray-400" />
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Profissionais no Bairro</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {MOCK_PROFESSIONALS.map((doc) => (
                    <div 
                        key={doc.id}
                        className="bg-white dark:bg-gray-900 p-4 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer group shadow-sm hover:shadow-md"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700 shadow-inner">
                            <img src={doc.image} className="w-full h-full object-cover" alt={doc.name} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">{doc.name}</h4>
                                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-lg border border-yellow-100 dark:border-yellow-800/50">
                                    <Star size={10} className="text-yellow-500 fill-current" />
                                    <span className="text-[10px] font-black text-yellow-700 dark:text-yellow-400">{doc.rating}</span>
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-tighter mt-0.5">{doc.specialty}</p>
                            <div className="flex items-center gap-1.5 text-gray-400 mt-2">
                                <MapPin size={10} className="text-gray-300" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">{doc.location}</span>
                            </div>
                        </div>

                        <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-200 group-hover:text-[#1E5BFF] transition-colors">
                            <ChevronRight size={18} strokeWidth={3} />
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </main>
    </div>
  );
};

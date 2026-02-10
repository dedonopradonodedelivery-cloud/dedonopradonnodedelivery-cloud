
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Star, 
  MapPin, 
  BadgeCheck, 
  ChevronRight, 
  Crown,
  HeartPulse,
  Stethoscope,
  Calendar,
  User as UserIcon,
  Search
} from 'lucide-react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { Store } from '../types';

interface HealthSubSpecialtiesViewProps {
  title: string;
  subtitle: string;
  specialties: string[];
  themeColor: string;
  onBack: () => void;
  onSelectStore: (store: Store) => void;
}

// PROFISSIONAIS FAKES PARA DEMONSTRAÇÃO DE LAYOUT
const MOCK_PROS = [
  {
    id: 'pro-1',
    name: 'Dra. Letícia Neves',
    specialty: 'Ginecologia & Obstetrícia',
    neighborhood: 'Freguesia',
    rating: 5.0,
    reviews: 124,
    verified: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'pro-2',
    name: 'Clínica MedCuidado',
    specialty: 'Exames e Diagnósticos',
    neighborhood: 'Taquara',
    rating: 4.8,
    reviews: 89,
    verified: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'pro-3',
    name: 'Dr. Ricardo Borges',
    specialty: 'Mastologia Avançada',
    neighborhood: 'Anil',
    rating: 4.9,
    reviews: 56,
    verified: false,
    featured: true,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop'
  }
];

export const HealthSubSpecialtiesView: React.FC<HealthSubSpecialtiesViewProps> = ({ 
  title, 
  specialties, 
  onBack,
  onSelectStore
}) => {
  const { currentNeighborhood } = useNeighborhood();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-in fade-in duration-300">
      
      {/* 1. Header com Patrocinador Master */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90">
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{title}</h1>
            <p className="text-[9px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">{currentNeighborhood}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-2xl border border-amber-100 dark:border-amber-800 shadow-sm">
            <Crown size={12} className="text-amber-500 fill-amber-500" />
            <div className="flex flex-col">
                <span className="text-[7px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-none">Master</span>
                <span className="text-[10px] font-bold text-gray-900 dark:text-white leading-none">Esquematiza</span>
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* 2. Banner de Destaque */}
        <section className="px-5 pt-6">
            <div className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-xl group cursor-pointer active:scale-[0.99] transition-transform">
                <img 
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" 
                    alt="Publicidade"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-center px-6">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[7px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest w-fit mb-2 border border-white/10">Publicidade</span>
                    <h2 className="text-lg font-black text-white leading-tight uppercase tracking-tight">Hospital e Maternidade <br/>Amparo</h2>
                    <p className="text-[10px] text-white/70 font-medium mt-1">Sempre perto de você.</p>
                </div>
            </div>
        </section>

        {/* 3. Grid Fixo de Especialidades */}
        <section className="pt-10 mb-8 px-5">
            <div className="mb-4 flex items-center gap-2">
                <div className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded text-[#1E5BFF]">
                    <Stethoscope size={14} />
                </div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Especialidades Disponíveis</h3>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
                {specialties.slice(0, 8).map((spec) => (
                    <button 
                        key={spec}
                        onClick={() => setSelectedSpecialty(spec === selectedSpecialty ? null : spec)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 ${
                            selectedSpecialty === spec 
                            ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400'
                        }`}
                    >
                        <HeartPulse size={20} className={selectedSpecialty === spec ? 'text-white' : 'text-blue-500/60'} />
                        <span className={`text-[8px] font-black uppercase tracking-tighter text-center mt-2 leading-none line-clamp-1`}>
                            {spec.split(' ')[0]}
                        </span>
                    </button>
                ))}
                <button className="flex flex-col items-center justify-center p-3 rounded-2xl border bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 active:scale-95">
                    <Search size={20} className="text-gray-300" />
                    <span className="text-[8px] font-black uppercase tracking-tighter text-center mt-2 leading-none">Ver Mais</span>
                </button>
            </div>
        </section>

        {/* 4. Lista de Profissionais Recomendados (Cards Fakes) */}
        <section className="px-5 space-y-4">
            <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Profissionais Recomendados</h3>
                <span className="text-[10px] font-bold text-[#1E5BFF] uppercase bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">Exclusivos JPA</span>
            </div>

            <div className="space-y-4">
                {MOCK_PROS.map((pro) => (
                    <div
                        key={pro.id}
                        className="w-full bg-white dark:bg-gray-900 p-4 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 group hover:border-[#1E5BFF]/30 transition-all"
                    >
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-50 dark:border-gray-700 shadow-sm">
                                <img src={pro.image} className="w-full h-full object-cover" alt={pro.name} />
                            </div>
                            {pro.featured && (
                                <div className="absolute -top-2 -left-2 bg-amber-400 text-white p-1 rounded-full shadow-lg border-2 border-white dark:border-gray-950">
                                    <Star size={10} fill="white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{pro.name}</h4>
                                {pro.verified && <BadgeCheck size={14} className="text-[#1E5BFF] fill-blue-50 dark:fill-blue-900/30" />}
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{pro.specialty}</p>
                            
                            <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1">
                                    <MapPin size={10} className="text-[#1E5BFF]" />
                                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{pro.neighborhood}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                    <span className="text-[9px] font-black text-yellow-700 dark:text-yellow-400">{pro.rating}</span>
                                </div>
                            </div>
                        </div>

                        <button 
                          className="shrink-0 bg-gray-50 dark:bg-gray-800 group-hover:bg-[#1E5BFF] p-3 rounded-2xl transition-all shadow-inner group-hover:shadow-blue-500/20"
                          title="Ver Perfil"
                        >
                            <Calendar size={18} className="text-gray-400 group-hover:text-white" />
                        </button>
                    </div>
                ))}
            </div>
            
            <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] pt-6">
                Mais profissionais serão listados em breve
            </p>
        </section>
      </main>
    </div>
  );
};

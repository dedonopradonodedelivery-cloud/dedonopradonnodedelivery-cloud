
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
  Search,
  AlertCircle
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

// MOCK DATA: PROFISSIONAIS COM ESPECIALIDADES VINCULADAS
const MOCK_PROFESSIONALS = [
  {
    id: 'p-1',
    name: 'Dra. Letícia Neves',
    specialty: 'Ginecologia',
    neighborhood: 'Freguesia',
    rating: 5.0,
    reviews: 124,
    verified: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'p-2',
    name: 'Dra. Ana Beatriz Moraes',
    specialty: 'Obstetrícia',
    neighborhood: 'Taquara',
    rating: 4.9,
    reviews: 86,
    verified: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'p-3',
    name: 'Dr. Ricardo Borges',
    specialty: 'Mastologia',
    neighborhood: 'Anil',
    rating: 5.0,
    reviews: 56,
    verified: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'p-4',
    name: 'Dra. Cláudia Viegas',
    specialty: 'Ginecologia',
    neighborhood: 'Pechincha',
    rating: 4.8,
    reviews: 92,
    verified: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'p-5',
    name: 'Clínica Mulher & Vida',
    specialty: 'Reprodução humana',
    neighborhood: 'Freguesia',
    rating: 4.7,
    reviews: 210,
    verified: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'p-6',
    name: 'Dr. Marcos Paulo',
    specialty: 'Endocrinologia feminina',
    neighborhood: 'Taquara',
    rating: 4.9,
    reviews: 43,
    verified: false,
    featured: true,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&auto=format&fit=crop'
  }
];

export const HealthSubSpecialtiesView: React.FC<HealthSubSpecialtiesViewProps> = ({ 
  title, 
  subtitle,
  specialties, 
  themeColor,
  onBack,
  onSelectStore
}) => {
  const { currentNeighborhood } = useNeighborhood();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = (spec: string) => {
    setSelectedSpecialty(prev => prev === spec ? null : spec);
  }

  const filteredSpecialties = useMemo(() => {
    if (!searchTerm) return specialties;
    return specialties.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [specialties, searchTerm]);

  // Lógica de Filtragem de Profissionais
  const filteredPros = useMemo(() => {
    let list = [...MOCK_PROFESSIONALS];
    
    if (selectedSpecialty) {
      list = list.filter(pro => pro.specialty === selectedSpecialty);
    }
    
    if (currentNeighborhood !== 'Jacarepaguá (todos)') {
      list = list.filter(pro => pro.neighborhood === currentNeighborhood);
    }

    return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [selectedSpecialty, currentNeighborhood]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-in fade-in duration-300">
      
      {/* 1. Header */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-transform">
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <div>
            <h1 className={`text-lg font-black ${themeColor} uppercase tracking-tighter leading-none`}>{title}</h1>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">{subtitle} em {currentNeighborhood}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* 2. Barra de Busca */}
        <div className="px-5 pt-4 pb-6">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Buscar especialidade..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3.5 pl-11 pr-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner dark:text-white"
                />
            </div>
        </div>

        {/* 3. Grid de Especialidades (LAYOUT AJUSTADO) */}
        <section className="px-5 mb-8">
            <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Especialidades</h3>
                <span className="text-[9px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">{filteredSpecialties.length} Áreas</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
                {filteredSpecialties.map(spec => (
                    <button
                        key={spec}
                        onClick={() => handleSelect(spec)}
                        className={`p-3 rounded-2xl border-2 transition-all text-center group active:scale-95 flex flex-col items-center justify-center h-full ${
                        selectedSpecialty === spec
                            ? `bg-white dark:bg-gray-800 border-blue-500 shadow-lg`
                            : `bg-white dark:bg-gray-800 border-transparent hover:border-blue-200/50`
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 mx-auto transition-all ${
                            selectedSpecialty === spec ? `bg-blue-500` : `bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100`
                        }`}>
                            <Stethoscope size={18} className={selectedSpecialty === spec ? `text-white` : 'text-gray-400 group-hover:text-blue-500'} />
                        </div>
                        <span className={`text-[10px] font-black leading-tight transition-colors line-clamp-2 flex-grow flex items-center ${
                            selectedSpecialty === spec ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'
                        }`}>
                            {spec}
                        </span>
                    </button>
                ))}
            </div>
        </section>

        {/* 4. Lista de Profissionais */}
        <section className="px-5 space-y-4">
            <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Profissionais Recomendados</h3>
            </div>

            <div className="space-y-4 min-h-[200px]">
                {filteredPros.length > 0 ? (
                    filteredPros.map((pro) => (
                        <div
                            key={pro.id}
                            className="w-full bg-white dark:bg-gray-900 p-4 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 group hover:border-blue-500/30 transition-all animate-in fade-in duration-500"
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
                                    {pro.verified && <BadgeCheck size={14} className="text-blue-500 fill-blue-50 dark:fill-blue-900/30" />}
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{pro.specialty}</p>
                                
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={10} className="text-blue-500" />
                                        <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{pro.neighborhood}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-[9px] font-black text-yellow-700 dark:text-yellow-400">{pro.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                              className="shrink-0 bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-500 p-3 rounded-2xl transition-all shadow-inner group-hover:shadow-blue-500/20 active:scale-90"
                              title="Agendar"
                            >
                                <Calendar size={18} className="text-gray-400 group-hover:text-white" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-3xl flex items-center justify-center text-gray-300 dark:text-gray-700 mb-4 border border-dashed border-gray-200 dark:border-gray-800">
                            <AlertCircle size={28} />
                        </div>
                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-600 uppercase tracking-tight">Em breve teremos profissionais de</h4>
                        <p className="text-sm font-black text-blue-500 uppercase tracking-tighter mt-1">{selectedSpecialty || 'nesta área'}</p>
                    </div>
                )}
            </div>
            
            <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] pt-10">
                O bairro na palma de suas mãos! ✋
            </p>
        </section>
      </main>
    </div>
  );
};

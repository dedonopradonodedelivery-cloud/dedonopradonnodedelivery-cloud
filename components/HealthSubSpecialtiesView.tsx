
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Star, 
  MapPin, 
  BadgeCheck, 
  ChevronRight, 
  Crown,
  Stethoscope,
  ArrowRight,
  HeartPulse,
  LayoutGrid
} from 'lucide-react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { Store, AdType } from '../types';
import { STORES } from '../constants';

interface Specialty {
  name: string;
  id: string;
}

interface HealthSubSpecialtiesViewProps {
  title: string;
  subtitle: string;
  specialties: string[];
  themeColor: string;
  onBack: () => void;
  onSelectStore: (store: Store) => void;
}

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

  // Lógica de Localização: Os resultados e o banner são filtrados com base no bairro selecionado
  // No mundo real, a query ao Supabase incluiria: .eq('neighborhood', currentNeighborhood)
  const filteredStores = useMemo(() => {
    let list = STORES.filter(s => s.category === 'Saúde');
    
    // Filtro por Bairro (Global Context)
    if (currentNeighborhood !== "Jacarepaguá (todos)") {
      list = list.filter(s => s.neighborhood === currentNeighborhood);
    }

    // Filtro por Especialidade (Icon Click)
    if (selectedSpecialty) {
      list = list.filter(s => 
        s.subcategory === selectedSpecialty || 
        s.tags?.includes(selectedSpecialty.toLowerCase())
      );
    }

    return list;
  }, [currentNeighborhood, selectedSpecialty]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-in fade-in duration-300">
      
      {/* 1. Cabeçalho Dual */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md z-50 border-b border-gray-50 dark:border-gray-900">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 active:scale-90">
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{title}</h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{currentNeighborhood}</p>
          </div>
        </div>

        {/* Patrocinador Master Fixo */}
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-2xl border border-amber-100 dark:border-amber-800">
            <Crown size={12} className="text-amber-500 fill-amber-500" />
            <div className="flex flex-col">
                <span className="text-[7px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-none">Master</span>
                <span className="text-[10px] font-bold text-gray-900 dark:text-white leading-none">Esquematiza</span>
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* 2. Banner de Especialidade (Publicidade Dinâmica) */}
        <section className="px-5 pt-6">
            <div className="relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden bg-slate-900 shadow-xl group cursor-pointer active:scale-[0.99] transition-transform">
                <img 
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" 
                    alt="Publicidade"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-center px-6">
                    <span className="bg-[#1E5BFF] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest w-fit mb-2">Destaque</span>
                    <h2 className="text-lg font-black text-white leading-tight uppercase tracking-tight">Centro Médico <br/>Freguesia</h2>
                    <p className="text-[10px] text-white/70 font-medium mt-1">Sua saúde em primeiro lugar.</p>
                </div>
                <div className="absolute bottom-4 right-6">
                    <div className="bg-white p-2 rounded-full shadow-lg">
                        <ArrowRight size={14} className="text-blue-600" strokeWidth={3} />
                    </div>
                </div>
            </div>
        </section>

        {/* 3. Filtro de Ícones Pequenos (Horizontal) */}
        <section className="pt-8 mb-6">
            <div className="px-5 mb-4 flex items-center gap-2">
                <LayoutGrid size={14} className="text-gray-400" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Especialidades</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-2">
                <button 
                  onClick={() => setSelectedSpecialty(null)}
                  className="flex flex-col items-center gap-2 shrink-0 group"
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${!selectedSpecialty ? 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 dark:bg-gray-900 text-gray-400 border border-gray-200 dark:border-gray-800'}`}>
                        <Stethoscope size={24} />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-tighter ${!selectedSpecialty ? 'text-blue-600' : 'text-gray-400'}`}>Todos</span>
                </button>

                {specialties.map((spec) => (
                    <button 
                        key={spec}
                        onClick={() => setSelectedSpecialty(spec)}
                        className="flex flex-col items-center gap-2 shrink-0 group"
                    >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${selectedSpecialty === spec ? 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 dark:bg-gray-900 text-gray-400 border border-gray-200 dark:border-gray-800 group-active:scale-90'}`}>
                            <HeartPulse size={24} />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-tighter truncate w-14 text-center ${selectedSpecialty === spec ? 'text-blue-600' : 'text-gray-400'}`}>
                            {spec.split(' ')[0]}
                        </span>
                    </button>
                ))}
            </div>
        </section>

        {/* 4. Lista Dinâmica de Negócios */}
        <section className="px-5 space-y-4">
            <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                    {selectedSpecialty ? `Resultados para ${selectedSpecialty}` : 'Profissionais Recomendados'}
                </h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{filteredStores.length} locais</span>
            </div>

            <div className="space-y-3">
                {filteredStores.length > 0 ? filteredStores.map((store) => (
                    <button
                        key={store.id}
                        onClick={() => onSelectStore(store)}
                        className="w-full bg-white dark:bg-gray-900 p-4 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all group"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-50 dark:border-gray-700">
                            <img src={store.logoUrl || store.image} className="w-full h-full object-cover" alt={store.name} />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                                {store.verified && <BadgeCheck size={14} className="text-blue-500 fill-blue-50 dark:fill-gray-900" />}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <MapPin size={10} className="text-blue-500" />
                                    <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{store.neighborhood}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-lg border border-yellow-100 dark:border-yellow-800/50">
                                    <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                    <span className="text-[9px] font-black text-yellow-700 dark:text-yellow-400">{store.rating}</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 line-clamp-1">{store.subcategory}</p>
                        </div>
                        <ChevronRight className="text-gray-200 group-hover:text-blue-500 transition-colors" />
                    </button>
                )) : (
                    <div className="py-20 flex flex-col items-center text-center opacity-30">
                        <Stethoscope size={48} className="text-gray-300 mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest">Nenhum profissional <br/>encontrado nesta busca.</p>
                    </div>
                )}
            </div>
        </section>
      </main>
    </div>
  );
};


import React, { useState } from 'react';
import { 
  ChevronLeft, 
  HeartPulse,
  Stethoscope
} from 'lucide-react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { Store } from '../types';
import { MasterSponsorBadge } from './MasterSponsorBadge';

interface HealthSubSpecialtiesViewProps {
  title: string;
  subtitle: string;
  specialties: string[];
  themeColor: string;
  onBack: () => void;
  onSelectStore: (store: Store) => void;
  onSelectSpecialty: (specialty: string) => void;
}

export const HealthSubSpecialtiesView: React.FC<HealthSubSpecialtiesViewProps> = ({ 
  title, 
  specialties, 
  onBack,
  onSelectSpecialty
}) => {
  const { currentNeighborhood } = useNeighborhood();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const handleSpecialtyClick = (spec: string) => {
    setSelectedSpecialty(spec);
    setTimeout(() => {
        onSelectSpecialty(spec);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-in fade-in duration-500">
      
      {/* Header com Selo Premium */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-900 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-transform shadow-sm">
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{title}</h1>
            <p className="text-[9px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">{currentNeighborhood}</p>
          </div>
        </div>

        <MasterSponsorBadge />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        <section className="pt-8 px-5">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-[#1E5BFF] shadow-sm border border-blue-100 dark:border-blue-800/30">
                        <Stethoscope size={16} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Navegar por Especialidades</h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Selecione o cuidado necessário</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                {specialties.map((spec) => (
                    <button 
                        key={spec}
                        onClick={() => handleSpecialtyClick(spec)}
                        className={`flex flex-col items-center justify-between min-h-[115px] rounded-[1.8rem] transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/10 bg-gradient-to-br from-blue-400 to-blue-600 border border-white/20 hover:brightness-110 group overflow-hidden`}
                    >
                        <div className={`flex-1 flex items-center justify-center text-white drop-shadow-sm ${selectedSpecialty === spec ? 'scale-110' : ''} transition-transform`}>
                            <HeartPulse size={24} strokeWidth={2.5} />
                        </div>
                        <div className="w-full bg-white/10 backdrop-blur-md py-1.5 px-1">
                            <span className="block w-full text-[8px] font-black uppercase tracking-tighter text-center leading-tight text-white truncate drop-shadow-sm">
                                {spec}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
            
            <div className="mt-16 text-center opacity-40">
                <p className="text-[8px] font-black text-gray-400 dark:text-white uppercase tracking-[0.4em]">
                    Localizei JPA • Rede de Cuidado
                </p>
            </div>
        </section>
      </main>
    </div>
  );
};

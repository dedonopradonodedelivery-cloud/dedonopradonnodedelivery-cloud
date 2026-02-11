
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Crown,
  HeartPulse,
  Stethoscope,
  Star
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

export const HealthSubSpecialtiesView: React.FC<HealthSubSpecialtiesViewProps> = ({ 
  title, 
  specialties, 
  onBack,
  onSelectStore
}) => {
  const { currentNeighborhood } = useNeighborhood();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-in fade-in duration-500">
      
      {/* 1. Header com Patrocinador Master */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-transform">
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

      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        
        {/* 2. Banner de Destaque - Identidade Visual */}
        <section className="px-5 pt-6">
            <div className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-xl group cursor-pointer active:scale-[0.99] transition-transform">
                <img 
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" 
                    alt="Publicidade"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-center px-6">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[7px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest w-fit mb-2 border border-white/10">Destaque JPA</span>
                    <h2 className="text-lg font-black text-white leading-tight uppercase tracking-tight">Hospital e Maternidade <br/>Amparo</h2>
                    <p className="text-[10px] text-white/70 font-medium mt-1">Cuidado completo no bairro.</p>
                </div>
            </div>
        </section>

        {/* 3. Grid de Especialidades - Conteúdo Principal */}
        <section className="pt-10 px-5">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-[#1E5BFF] shadow-sm">
                        <Stethoscope size={16} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Navegar por Especialidades</h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">O que você busca hoje?</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                {specialties.map((spec) => (
                    <button 
                        key={spec}
                        onClick={() => setSelectedSpecialty(spec)}
                        className={`flex flex-col items-center justify-center p-4 min-h-[90px] rounded-[2rem] border transition-all duration-300 active:scale-95 shadow-sm ${
                            selectedSpecialty === spec 
                            ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-blue-500/30' 
                            : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-blue-100'
                        }`}
                    >
                        <div className={`p-2 rounded-xl mb-2 transition-colors ${selectedSpecialty === spec ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF]'}`}>
                            <HeartPulse size={22} strokeWidth={2.2} />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-tighter text-center leading-tight line-clamp-2 w-full px-1 ${selectedSpecialty === spec ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                            {spec}
                        </span>
                    </button>
                ))}
            </div>
            
            <div className="mt-16 text-center opacity-40">
                <p className="text-[8px] font-black text-gray-400 dark:text-white uppercase tracking-[0.4em]">
                    Localizei JPA • Especialidades Femininas
                </p>
            </div>
        </section>
      </main>
    </div>
  );
};

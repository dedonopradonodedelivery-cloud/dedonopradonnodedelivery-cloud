
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Stethoscope, 
  ClipboardList, 
  HeartPulse, 
  ChevronRight,
  UserRound,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface HealthSubSpecialtiesViewProps {
  title: string;
  subtitle: string;
  specialties: string[];
  themeColor: string;
  onBack: () => void;
  onSelectSpecialty: (specialty: string) => void;
}

export const HealthSubSpecialtiesView: React.FC<HealthSubSpecialtiesViewProps> = ({ 
  title, 
  subtitle, 
  specialties, 
  themeColor, 
  onBack, 
  onSelectSpecialty 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpecialties = useMemo(() => {
    const term = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!term) return specialties;
    return specialties.filter(spec => 
      spec.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(term)
    );
  }, [searchTerm, specialties]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header Fixo */}
      <header className="px-5 pt-12 pb-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{title}</h1>
            <p className={`text-[10px] ${themeColor} font-black uppercase tracking-widest mt-1`}>{subtitle}</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Qual especialista você precisa?"
            className="w-full bg-gray-100 dark:bg-gray-800 border-none py-4 pl-11 pr-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white transition-all shadow-inner"
          />
        </div>
      </header>

      {/* Lista Vertical */}
      <main className="flex-1 p-5 space-y-2 pb-32">
        {filteredSpecialties.length > 0 ? (
          filteredSpecialties.map((spec, index) => (
            <button
              key={index}
              onClick={() => onSelectSpecialty(spec)}
              className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all group hover:border-blue-100 dark:hover:border-blue-900"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:${themeColor} transition-colors`}>
                  {spec.includes('Avaliação') || spec.includes('Planejamento') ? <ClipboardList size={20} /> : <Stethoscope size={20} />}
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {spec}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-blue-500" />
            </button>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center text-center opacity-30">
            <AlertCircle size={48} className="text-gray-300 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Nenhum especialista encontrado</p>
          </div>
        )}
      </main>

      {/* Footer CTA */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-40 max-w-md mx-auto">
          <div className="flex items-start gap-3 opacity-60 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
            <HeartPulse size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold uppercase tracking-widest">
              Localizei JPA: Conectando você aos melhores profissionais de saúde de Jacarepaguá.
            </p>
          </div>
      </footer>
    </div>
  );
};

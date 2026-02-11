
import React, { useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Star,
  BadgeCheck,
  MapPin,
  MessageSquare,
  ArrowRight,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { Store } from '../types';
import { STORES } from '../constants';

interface HealthSpecialtyDetailViewProps {
  specialtyName: string;
  onBack: () => void;
  onSelectStore: (store: Store) => void;
}

// Mock de Destaques customizados por médico (simulando dados vindos do banco)
const MOCK_HIGHLIGHTS = [
    {
        id: 'h1',
        name: 'Dra. Juliana Mendes',
        image: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?q=80&w=400',
        call: 'Referência em Ginecologia Regenerativa',
        desc: 'Tratamentos modernos e humanizados para o bem-estar feminino.',
        cta: 'Agendar Consulta'
    },
    {
        id: 'h2',
        name: 'Dr. Ricardo Silva',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400',
        call: 'Check-up Preventivo Anual',
        desc: 'Exames completos e diagnósticos precisos em um só local.',
        cta: 'Ver Exames'
    },
    {
        id: 'h3',
        name: 'Clínica Mulher Ativa',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400',
        call: 'Inauguração Nova Unidade',
        desc: 'Agora também na Freguesia com especialistas renomados.',
        cta: 'Conhecer Clínica'
    }
];

export const HealthSpecialtyDetailView: React.FC<HealthSpecialtyDetailViewProps> = ({ 
  specialtyName, 
  onBack,
  onSelectStore
}) => {
  const { currentNeighborhood } = useNeighborhood();

  // Filtra médicos da especialidade (simulado)
  const allDoctors = useMemo(() => {
      return STORES.filter(s => s.category === 'Saúde' || s.subcategory?.includes(specialtyName)).slice(0, 10);
  }, [specialtyName]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* 1. Header Estilo Premium */}
      <header className="px-5 pt-12 pb-4 flex items-center gap-4 sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-900 shadow-sm">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-transform shadow-sm">
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{specialtyName}</h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Especialistas em {currentNeighborhood}</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* 2. Banner de Contexto */}
        <section className="px-5 pt-6">
            <div className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-blue-600 shadow-xl">
                <img 
                    src="https://images.unsplash.com/photo-1505751172107-573225a94022?q=80&w=800" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30" 
                    alt="Cuidado"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-end p-6">
                    <span className="text-[9px] font-black text-blue-200 uppercase tracking-[0.2em] mb-1">Qualidade Garantida</span>
                    <h2 className="text-lg font-black text-white leading-tight uppercase tracking-tighter">Onde o bairro encontra <br/>os melhores cuidados</h2>
                </div>
            </div>
        </section>

        {/* 3. Bloco de Destaques Premium (Configurável via Painel) */}
        <section className="pt-10 px-5">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-2xl text-amber-500 shadow-sm">
                    <Sparkles size={18} fill="currentColor" />
                </div>
                <div>
                    <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none">Destaques da Especialidade</h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Profissionais Recomendados</p>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-5 px-5 pb-4">
                {MOCK_HIGHLIGHTS.map(h => (
                    <div key={h.id} className="min-w-[280px] max-w-[280px] snap-center bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col group">
                        {/* Parte Superior: Logo/Imagem */}
                        <div className="h-32 w-full overflow-hidden bg-gray-50 relative">
                             <img src={h.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={h.name} />
                             <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-white/20">
                                <BadgeCheck size={16} className="text-[#1E5BFF] fill-blue-50" />
                             </div>
                        </div>
                        {/* Parte Inferior: Conteúdo Livre */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h4 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight mb-2">{h.call}</h4>
                                <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-3">{h.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2">"{h.desc}"</p>
                            </div>
                            <button className="mt-6 w-full py-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200 font-black text-[9px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all">
                                {h.cta} <ChevronRight size={14} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 4. Lista Geral de Profissionais */}
        <section className="pt-12 px-5">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-[#1E5BFF] shadow-sm">
                    <Stethoscope size={18} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none">Lista Geral</h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Mais especialistas por perto</p>
                </div>
            </div>

            <div className="space-y-3">
                {allDoctors.map(doctor => (
                    <div 
                        key={doctor.id}
                        onClick={() => onSelectStore(doctor)}
                        className="bg-white dark:bg-gray-900 p-4 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                            <img src={doctor.logoUrl || doctor.image} className="w-full h-full object-cover p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{doctor.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-[#F59E0B]">
                                    <Star size={10} fill="currentColor" />
                                    <span className="text-[10px] font-black">{doctor.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-gray-300 dark:text-gray-700">•</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">{doctor.neighborhood}</span>
                            </div>
                        </div>
                        <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-200 group-hover:text-[#1E5BFF] transition-colors">
                            <ChevronRight size={16} strokeWidth={3} />
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </main>
    </div>
  );
};

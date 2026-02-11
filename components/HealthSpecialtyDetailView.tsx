
import React, { useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Star,
  BadgeCheck,
  MapPin,
  Stethoscope,
  Sparkles,
  User as UserIcon,
  ArrowRight
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

// Dados fakes padronizados para garantir que a página nunca esteja vazia
const MOCK_HIGHLIGHTS = [
    {
        id: 'h1',
        name: 'Dra. Ana Silveira',
        image: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?q=80&w=400',
        call: 'Consulta Premium',
        desc: 'Atendimento humanizado e especializado.',
        cta: 'AGENDAR'
    },
    {
        id: 'h2',
        name: 'Dr. Marcos Costa',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400',
        call: 'Check-up Completo',
        desc: 'Tecnologia de ponta em diagnósticos.',
        cta: 'VER'
    }
];

const MOCK_LIST = [
    { id: 'p1', name: 'Dra. Juliana Mendes', sub: 'Especialista Sênior', location: 'Freguesia', rating: 4.9, image: 'https://i.pravatar.cc/150?u=juliana' },
    { id: 'p2', name: 'Dr. Ricardo Silva', sub: 'Atendimento Clínico', location: 'Taquara', rating: 4.8, image: 'https://i.pravatar.cc/150?u=ricardo' },
    { id: 'p3', name: 'Dra. Beatriz Soares', sub: 'Mestre em Saúde', location: 'Anil', rating: 5.0, image: 'https://i.pravatar.cc/150?u=beatriz' },
    { id: 'p4', name: 'Dr. André Luiz', sub: 'Consultor Especialista', location: 'Pechincha', rating: 4.7, image: 'https://i.pravatar.cc/150?u=andre' },
    { id: 'p5', name: 'Dra. Helena Vaz', sub: 'Especialista local', location: 'Freguesia', rating: 4.9, image: 'https://i.pravatar.cc/150?u=helena' },
    { id: 'p6', name: 'Dr. Paulo Nunes', sub: 'Referência no bairro', location: 'Taquara', rating: 4.8, image: 'https://i.pravatar.cc/150?u=paulo' },
];

export const HealthSpecialtyDetailView: React.FC<HealthSpecialtyDetailViewProps> = ({ 
  specialtyName, 
  onBack,
  onSelectStore
}) => {
  const { currentNeighborhood } = useNeighborhood();
  const neighborhoodLabel = currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood;

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500">
      
      {/* 1. TOP BAR PADRONIZADA */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-transform">
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{specialtyName}</h1>
            <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Especialistas em {neighborhoodLabel}</p>
          </div>
        </div>
        <MasterSponsorBadge />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* 2. BANNER HERO PADRONIZADO */}
        <section className="px-5 pt-6">
            <div className="relative w-full aspect-[16/7] rounded-[2.5rem] overflow-hidden bg-[#1E5BFF] shadow-2xl border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E5BFF] via-[#1749CC] to-[#030816] opacity-90"></div>
                
                {/* Background Decorativo Estilo App */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>
                
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

        {/* 3. SEÇÃO DE DESTAQUES (GRID 2 COLUNAS) */}
        <section className="pt-10 px-5">
            <div className="flex items-center gap-2 mb-5 ml-1">
                <Sparkles size={16} className="text-amber-500" fill="currentColor" />
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">✨ Destaques</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {MOCK_HIGHLIGHTS.map(h => (
                    <div key={h.id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col group active:scale-[0.98] transition-all">
                        <div className="h-24 w-full overflow-hidden bg-gray-50 relative">
                             <img src={h.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={h.name} />
                             <div className="absolute top-2 right-2">
                                <div className="p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                                    <BadgeCheck size={12} className="text-[#1E5BFF] fill-white" />
                                </div>
                             </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h4 className="font-black text-gray-900 dark:text-white text-[10px] uppercase tracking-tighter mb-0.5 line-clamp-1">{h.call}</h4>
                            <p className="text-[9px] font-bold text-[#1E5BFF] uppercase tracking-widest mb-2 truncate">{h.name}</p>
                            <p className="text-[9px] text-gray-400 font-medium leading-tight line-clamp-2 mb-4">"{h.desc}"</p>
                            <button className="mt-auto w-full py-2.5 bg-blue-50 dark:bg-blue-900/30 text-[#1E5BFF] font-black text-[9px] uppercase tracking-widest rounded-xl transition-all border border-blue-100 dark:border-blue-800/30">
                                {h.cta}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 4. LISTA PADRONIZADA DE PROFISSIONAIS */}
        <section className="pt-10 px-5 space-y-4">
            <div className="flex items-center gap-2 mb-6 ml-1">
                <Stethoscope size={16} className="text-gray-400" />
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Profissionais no Bairro</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {MOCK_LIST.map((prof) => (
                    <div 
                        key={prof.id}
                        className="bg-white dark:bg-gray-900 p-4 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer group shadow-sm"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700 shadow-inner">
                            <img src={prof.image} className="w-full h-full object-cover" alt={prof.name} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">{prof.name}</h4>
                                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-lg border border-yellow-100 dark:border-yellow-800/50">
                                    <Star size={10} className="text-yellow-500 fill-current" />
                                    <span className="text-[10px] font-black text-yellow-700 dark:text-yellow-400">{prof.rating}</span>
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-tighter mt-0.5">{prof.sub}</p>
                            <div className="flex items-center gap-1.5 text-gray-400 mt-2">
                                <MapPin size={10} className="text-gray-300" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">{prof.location}</span>
                            </div>
                        </div>

                        <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-200 group-hover:text-[#1E5BFF] transition-colors">
                            <ChevronRight size={18} strokeWidth={3} />
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Footer Branding */}
        <div className="mt-16 text-center opacity-30 grayscale pointer-events-none pb-10">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] dark:text-white">Localizei JPA • Rede de Confiança</p>
        </div>
      </main>
    </div>
  );
};

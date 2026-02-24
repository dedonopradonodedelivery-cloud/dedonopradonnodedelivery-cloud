
import React from 'react';
import { ChevronLeft, ChevronRight, Baby, Stethoscope, Brain, ShieldPlus, Activity, Heart, Thermometer, Microscope, Syringe, Sparkles } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';
import { Store } from '@/types';

interface SpecialtyItem {
  name: string;
}

interface SpecialtyGroup {
  title: string;
  items: SpecialtyItem[];
  color: string;
}

interface HealthPediatricsViewProps {
  onBack: () => void;
  onSelect: (specialty: string) => void;
  onNavigate: (view: string) => void;
  onStoreClick: (store: Store) => void;
}

const GROUPS: SpecialtyGroup[] = [
  {
    title: "Atendimento Geral / Rotina",
    color: "text-amber-500 bg-amber-50",
    items: [
      { name: "Pediatria geral" },
      { name: "Neonatologia" },
      { name: "Puericultura" },
      { name: "Pediatria preventiva" },
    ]
  },
  {
    title: "Especialidades Clínicas",
    color: "text-blue-500 bg-blue-50",
    items: [
      { name: "Alergologia pediátrica" },
      { name: "Endocrinologia pediátrica" },
      { name: "Neuropediatria" },
      { name: "Gastroenterologia pediátrica" },
      { name: "Pneumologia pediátrica" },
      { name: "Cardiologia pediátrica" },
      { name: "Nefrologia pediátrica" },
      { name: "Hematologia pediátrica" },
      { name: "Reumatologia pediátrica" },
    ]
  },
  {
    title: "Saúde Mental / Desenvolvimento",
    color: "text-indigo-500 bg-indigo-50",
    items: [
      { name: "Psiquiatria infantil" },
    ]
  },
  {
    title: "Alta Especialização",
    color: "text-rose-500 bg-rose-50",
    items: [
      { name: "Oncologia pediátrica" },
      { name: "Infectologia pediátrica" },
      { name: "Genética médica pediátrica" },
    ]
  },
  {
    title: "Procedimentos / Intervenções",
    color: "text-emerald-500 bg-emerald-50",
    items: [
      { name: "Ortopedia pediátrica" },
      { name: "Cirurgia pediátrica" },
    ]
  }
];

const SpecialtyCard: React.FC<{ name: string; onClick: () => void }> = ({ name, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm mb-2"
  >
    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight">{name}</span>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
  </button>
);

export const HealthPediatricsView: React.FC<HealthPediatricsViewProps> = ({ onBack, onSelect, onNavigate, onStoreClick }) => {
  const handleHeroClick = () => {
    onStoreClick({
      name: 'Pediátrica JPA — Dr. André Luiz',
      category: 'Saúde',
      subcategory: 'Pediatria',
      image: 'https://images.unsplash.com/photo-1584515933487-9d317552d894?q=80&w=1200',
      description: 'Especialista em desenvolvimento infantil com foco em pediatria preventiva e puericultura na Freguesia.',
    } as Store);
  };

  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Pediatria</h1>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-8 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        <main className="p-6 pt-12 space-y-8">
          <div 
              onClick={handleHeroClick}
              className="flex items-start gap-4 py-9 px-5 bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] border border-amber-100 dark:border-amber-800/30 cursor-pointer active:scale-[0.99] transition-all group"
          >
            <div className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
              <Baby className="text-amber-500" size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-widest mb-1">Crescimento Saudável</h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                Encontre pediatras e especialistas focados no desenvolvimento integral do seu filho. <span className="underline ml-1">Ver Destaque</span>
              </p>
            </div>
          </div>

          {GROUPS.map((group, idx) => (
            <section key={idx} className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                  {group.title}
                </h3>
              </div>
              <div className="flex flex-col">
                {group.items.map((item, itemIdx) => (
                  <SpecialtyCard 
                    key={itemIdx} 
                    name={item.name} 
                    onClick={() => onSelect(item.name)} 
                  />
                ))}
              </div>
            </section>
          ))}

          <div className="py-10 text-center opacity-20 flex flex-col items-center gap-2">
              <div className="h-1 w-8 bg-gray-400 rounded-full mb-2"></div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA Kids Ecosystem</p>
          </div>
        </main>
      </div>
    </div>
  );
};

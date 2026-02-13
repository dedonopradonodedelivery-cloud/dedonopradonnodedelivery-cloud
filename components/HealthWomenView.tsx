
import React from 'react';
import { ChevronLeft, ChevronRight, Activity, Heart, Baby, Microscope, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge'; // Import the new badge component

interface SpecialtyItem {
  name: string;
  icon?: React.ElementType;
}

interface SpecialtyGroup {
  title: string;
  items: SpecialtyItem[];
  color: string;
}

interface HealthWomenViewProps {
  onBack: () => void;
  onSelect: (specialty: string) => void;
  onNavigate: (view: string) => void; // Added for the MasterSponsorBadge
}

const GROUPS: SpecialtyGroup[] = [
  {
    title: "Atendimento Geral",
    color: "text-rose-500 bg-rose-50",
    items: [
      { name: "Ginecologia", icon: Heart },
      { name: "Obstetrícia", icon: Baby },
      { name: "Mastologia", icon: Activity },
      { name: "Uroginecologia", icon: ShieldCheck },
    ]
  },
  {
    title: "Hormonal / Ciclos / Fases",
    color: "text-purple-500 bg-purple-50",
    items: [
      { name: "Endocrinologia feminina" },
      { name: "Climatério" },
      { name: "Menopausa" },
      { name: "Ginecologia endócrina" },
    ]
  },
  {
    title: "Gestação / Reprodução",
    color: "text-blue-500 bg-blue-50",
    items: [
      { name: "Reprodução humana" },
      { name: "Fertilidade feminina" },
      { name: "Planejamento familiar" },
      { name: "Medicina fetal" },
      { name: "Pré-natal de alto risco" },
    ]
  },
  {
    title: "Diagnóstico / Procedimentos",
    color: "text-emerald-500 bg-emerald-50",
    items: [
      { name: "Colposcopia" },
      { name: "Patologia do trato genital inferior" },
      { name: "Ginecologia oncológica" },
    ]
  },
  {
    title: "Condições Específicas",
    color: "text-amber-500 bg-amber-50",
    items: [
      { name: "Dor pélvica crônica" },
      { name: "Saúde sexual feminina" },
      { name: "Saúde íntima feminina" },
    ]
  }
];

const SpecialtyCard: React.FC<{ name: string; onClick: () => void }> = ({ name, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm mb-2"
  >
    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight">{name}</span>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-rose-500 transition-colors" />
  </button>
);

export const HealthWomenView: React.FC<HealthWomenViewProps> = ({ onBack, onSelect, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 pt-12 pb-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500 active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Saúde — Mulher</h1>
            <p className="text-[9px] text-rose-500 font-bold uppercase tracking-widest mt-1">Especialidades femininas</p>
          </div>
        </div>
        {/* MasterSponsorBadge fixed at top right */}
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 relative">
        {/* Removed the absolute positioned badge from main */}

        <div className="flex items-start gap-4 p-5 bg-rose-50 dark:bg-rose-900/10 rounded-[2rem] border border-rose-100 dark:border-rose-800/30">
          <div className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
            <Sparkles className="text-rose-500" size={20} />
          </div>
          <div>
            <h4 className="text-xs font-black text-rose-900 dark:text-rose-200 uppercase tracking-widest mb-1">Cuidado Especializado</h4>
            <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
              Selecione uma área abaixo para encontrar os melhores profissionais de Jacarepaguá.
            </p>
          </div>
        </div>

        {GROUPS.map((group, idx) => (
          <section key={idx} className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-rose-500 rounded-full"></div>
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

        <div className="py-10 text-center opacity-20">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Jacarepaguá Health Ecosystem</p>
        </div>
      </main>
    </div>
  );
};

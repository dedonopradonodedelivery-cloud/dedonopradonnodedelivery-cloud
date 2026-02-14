
import React from 'react';
import { 
  ChevronLeft, 
  Heart, 
  Baby, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Wind, 
  Sparkles, 
  Microscope,
  Stethoscope,
  Droplets
} from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

interface SubcategoryItem {
  name: string;
  icon: React.ElementType;
  color: string;
}

interface HealthWomenViewProps {
  onBack: () => void;
  onSelect: (specialty: string) => void;
  onNavigate: (view: string) => void;
}

const SUBCATEGORIES_DATA: SubcategoryItem[] = [
  { name: "Ginecologia", icon: Stethoscope, color: "bg-rose-500" },
  { name: "Obstetrícia", icon: Baby, color: "bg-pink-500" },
  { name: "Mastologia", icon: ShieldCheck, color: "bg-rose-600" },
  { name: "Uroginecologia", icon: Droplets, color: "bg-blue-400" },
  { name: "Endocrinologia Feminina", icon: Zap, color: "bg-amber-500" },
  { name: "Climatério", icon: Wind, color: "bg-indigo-400" },
  { name: "Menopausa", icon: Sparkles, color: "bg-purple-500" },
  { name: "Reprodução Humana", icon: Microscope, color: "bg-emerald-500" },
];

const SubcategoryCard: React.FC<{ item: SubcategoryItem; onClick: () => void }> = ({ item, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
    >
      <div className={`w-16 h-16 rounded-[1.5rem] ${item.color} bg-opacity-10 flex items-center justify-center ${item.color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={32} strokeWidth={2.5} />
      </div>
      <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-tight px-1">
        {item.name}
      </span>
    </button>
  );
};

export const HealthWomenView: React.FC<HealthWomenViewProps> = ({ onBack, onSelect, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500">
      {/* Header Sticky Premium Azul */}
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Saúde — Mulher</h1>
            <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest mt-1">Especialidades femininas</p>
          </div>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32 space-y-8">
        {/* Intro Banner Sutil */}
        <div className="p-6 bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2.5rem] text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20">
                    <Heart size={24} fill="white" className="text-white" />
                </div>
                <div>
                    <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-1">Cuidado Especializado</h3>
                    <p className="text-rose-100 text-xs font-medium leading-relaxed">Os melhores profissionais para cada fase da sua vida.</p>
                </div>
            </div>
        </div>

        {/* Grid de Subcategorias - A Nova Experiência */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            {SUBCATEGORIES_DATA.map((item, idx) => (
              <SubcategoryCard 
                key={idx} 
                item={item} 
                onClick={() => onSelect(item.name)} 
              />
            ))}
          </div>
        </section>

        {/* Info de Rodapé sutil */}
        <div className="py-10 text-center opacity-20 flex flex-col items-center gap-2">
            <div className="h-1 w-8 bg-gray-400 rounded-full mb-2"></div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Jacarepaguá Health Ecosystem</p>
        </div>
      </main>
    </div>
  );
};

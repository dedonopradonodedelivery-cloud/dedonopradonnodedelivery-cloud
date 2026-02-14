
import React from 'react';
import { ChevronLeft, ChevronRight, Construction, Zap, Hammer, Key, Shovel, Sparkles, Droplets, Trash2, Star, Clock } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

interface SpecialtyItem {
  name: string;
  isPopular?: boolean;
}

interface SpecialtyGroup {
  title: string;
  icon: React.ElementType;
  items: SpecialtyItem[];
  color: string;
}

interface ServicesManualViewProps {
  onBack: () => void;
  onSelect: (specialty: string) => void;
  onNavigate: (view: string) => void;
}

const GROUPS: SpecialtyGroup[] = [
  {
    title: "Construção / Reforma",
    icon: Construction,
    color: "text-slate-600 bg-slate-50",
    items: [
      { name: "Pedreiro", isPopular: true },
      { name: "Pintor" },
      { name: "Gesseiro" },
      { name: "Azulejista" },
      { name: "Impermeabilizador" },
    ]
  },
  {
    title: "Instalações / Técnicos",
    icon: Zap,
    color: "text-amber-500 bg-amber-50",
    items: [
      { name: "Eletricista", isPopular: true },
      { name: "Encanador", isPopular: true },
      { name: "Instalador de ar-condicionado" },
      { name: "Técnico em refrigeração" },
      { name: "Montador de móveis" },
      { name: "Instalador de cortinas e persianas" },
    ]
  },
  {
    title: "Madeira / Metal / Estruturas",
    icon: Hammer,
    color: "text-orange-600 bg-orange-50",
    items: [
      { name: "Carpinteiro" },
      { name: "Marceneiro" },
      { name: "Serralheiro" },
      { name: "Soldador" },
      { name: "Sapateiro" },
      { name: "Tapeceiro" },
      { name: "Estofador" },
    ]
  },
  {
    title: "Chaves / Vidros / Acessos",
    icon: Key,
    color: "text-blue-600 bg-blue-50",
    items: [
      { name: "Vidraceiro" },
      { name: "Chaveiro" },
    ]
  },
  {
    title: "Área Externa / Manutenção",
    icon: Shovel,
    color: "text-emerald-600 bg-emerald-50",
    items: [
      { name: "Jardineiro" },
      { name: "Paisagista" },
      { name: "Piscineiro" },
    ]
  },
  {
    title: "Serviços Domésticos",
    icon: Sparkles,
    color: "text-indigo-600 bg-indigo-50",
    items: [
      { name: "Faxineira" },
      { name: "Diarista", isPopular: true },
      { name: "Passadeira" },
      { name: "Costureira" },
    ]
  },
  {
    title: "Limpeza / Serviços Pesados",
    icon: Trash2,
    color: "text-rose-600 bg-rose-50",
    items: [
      { name: "Dedetizador" },
      { name: "Limpeza pós-obra" },
      { name: "Lava-jato" },
    ]
  }
];

const SpecialtyCard: React.FC<{ item: SpecialtyItem; onClick: () => void }> = ({ item, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm mb-2"
  >
    <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight">{item.name}</span>
        {item.isPopular && (
            <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Mais buscado</span>
        )}
    </div>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
  </button>
);

export const ServicesManualView: React.FC<ServicesManualViewProps> = ({ onBack, onSelect, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500 pb-20">
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Serviços — Manuais</h1>
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">Jacarepaguá • Qualidade Local</p>
          </div>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 relative">
        {/* Bloco de Urgência Psicológica */}
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                    <Star size={24} fill="#1E5BFF" className="text-[#1E5BFF]" />
                </div>
                <div>
                    <h3 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">Mão de Obra de Confiança</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-relaxed">Profissionais avaliados por seus vizinhos na Freguesia e região.</p>
                </div>
            </div>
        </div>

        {GROUPS.map((group, idx) => (
          <section key={idx} className="space-y-4">
            <div className="flex items-center gap-3 mb-2 px-1">
              <div className={`p-2 rounded-xl ${group.color} shrink-0`}>
                <group.icon size={18} />
              </div>
              <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em]">
                {group.title}
              </h3>
            </div>
            <div className="flex flex-col">
              {group.items.map((item, itemIdx) => (
                <SpecialtyCard 
                  key={itemIdx} 
                  item={item} 
                  onClick={() => onSelect(item.name)} 
                />
              ))}
            </div>
          </section>
        ))}

        <div className="pt-8 pb-12 text-center opacity-30 flex flex-col items-center gap-2">
            <Clock size={20} />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA • Profissionais 24h</p>
        </div>
      </main>
    </div>
  );
};


import React from 'react';
import { ChevronLeft, ChevronRight, Car, BatteryCharging, PlugZap, Cpu } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

interface SpecialtyGroup { title: string; icon: React.ElementType; items: { name: string }[]; }
interface AutosEletricosViewProps { onBack: () => void; onSelect: (specialty: string) => void; onNavigate: (view: string) => void; }

const GROUPS: SpecialtyGroup[] = [
    { title: "Compra & Mobilidade", icon: Car, items: [{ name: "Concessionária de veículos elétricos" }, { name: "Loja de carros elétricos" }] },
    { title: "Manutenção & Diagnóstico", icon: BatteryCharging, items: [{ name: "Oficina especializada em elétricos" }, { name: "Manutenção de veículos elétricos" }, { name: "Diagnóstico de sistemas elétricos" }, { name: "Troca e manutenção de baterias" }] },
    { title: "Recarga & Infraestrutura", icon: PlugZap, items: [{ name: "Estação de recarga" }, { name: "Instalação de carregadores" }, { name: "Infraestrutura para recarga" }] },
    { title: "Conversão & Tecnologia", icon: Cpu, items: [{ name: "Conversão para elétrico" }, { name: "Software automotivo elétrico" }] },
];

const SpecialtyCard: React.FC<{ name: string; onClick: () => void }> = ({ name, onClick }) => (
  <button onClick={onClick} className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm mb-2">
    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight">{name}</span>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
  </button>
);

export const AutosEletricosView: React.FC<AutosEletricosViewProps> = ({ onBack, onSelect, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"><ChevronLeft size={24} /></button>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Autos — Elétricos</h1>
            <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest mt-1">Manutenção e Recarga</p>
          </div>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {GROUPS.map((group, idx) => (
          <section key={idx} className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-amber-500"><group.icon size={20} strokeWidth={2.5}/></div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{group.title}</h3>
            </div>
            {group.items.map((item, itemIdx) => <SpecialtyCard key={itemIdx} name={item.name} onClick={() => onSelect(item.name)} />)}
          </section>
        ))}
      </main>
    </div>
  );
};


import React from 'react';
import { ChevronLeft, ChevronRight, Key, Wrench, PaintRoller, Sparkles, Radio, ShieldAlert, ClipboardCheck } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

interface SpecialtyGroup { title: string; icon: React.ElementType; items: { name: string }[]; }
interface AutosCarrosViewProps { onBack: () => void; onSelect: (specialty: string) => void; onNavigate: (view: string) => void; }

const GROUPS: SpecialtyGroup[] = [
  { title: "Compra & Venda", icon: Key, items: [{ name: "Concessionária de carros" }, { name: "Loja de seminovos" }] },
  { title: "Manutenção & Mecânica", icon: Wrench, items: [{ name: "Oficina mecânica" }, { name: "Mecânica especializada" }, { name: "Centro automotivo" }, { name: "Auto elétrica" }, { name: "Suspensão automotiva" }, { name: "Freios automotivos" }, { name: "Troca de óleo" }, { name: "Alinhamento e balanceamento" }, { name: "Ar-condicionado automotivo" }] },
  { title: "Funilaria & Reparos", icon: PaintRoller, items: [{ name: "Funilaria" }, { name: "Pintura automotiva" }, { name: "Martelinho de ouro" }, { name: "Vidros automotivos" }] },
  { title: "Estética & Cuidados", icon: Sparkles, items: [{ name: "Estética automotiva" }, { name: "Lava-jato" }] },
  { title: "Som & Acessórios", icon: Radio, items: [{ name: "Som e multimídia" }, { name: "Acessórios automotivos" }] },
  { title: "Emergência & Proteção", icon: ShieldAlert, items: [{ name: "Guincho automotivo" }, { name: "Rastreamento veicular" }, { name: "Blindagem automotiva" }] },
  { title: "Inspeção & Regularização", icon: ClipboardCheck, items: [{ name: "Inspeção veicular" }] },
];

const SpecialtyCard: React.FC<{ name: string; onClick: () => void }> = ({ name, onClick }) => (
  <button onClick={onClick} className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm mb-2">
    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight">{name}</span>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
  </button>
);

export const AutosCarrosView: React.FC<AutosCarrosViewProps> = ({ onBack, onSelect, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"><ChevronLeft size={24} /></button>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Autos — Carros</h1>
            <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest mt-1">Serviços e Cuidados</p>
          </div>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {GROUPS.map((group, idx) => (
          <section key={idx} className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-blue-500"><group.icon size={20} strokeWidth={2.5}/></div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{group.title}</h3>
            </div>
            {group.items.map((item, itemIdx) => <SpecialtyCard key={itemIdx} name={item.name} onClick={() => onSelect(item.name)} />)}
          </section>
        ))}
      </main>
    </div>
  );
};

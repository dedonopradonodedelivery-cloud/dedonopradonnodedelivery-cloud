
import React from 'react';
import { ChevronLeft, ChevronRight, Key, Wrench, PaintRoller, Sparkles, Radio, ShieldAlert, ClipboardCheck } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';
import { Store } from '@/types';

interface SpecialtyGroup { title: string; icon: React.ElementType; items: { name: string }[]; }
interface AutosCarrosViewProps { 
  onBack: () => void; 
  onSelect: (specialty: string) => void; 
  onNavigate: (view: string) => void; 
  onStoreClick: (store: Store) => void;
}

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

export const AutosCarrosView: React.FC<AutosCarrosViewProps> = ({ onBack, onSelect, onNavigate, onStoreClick }) => {
  const handleHeroClick = () => {
    onStoreClick({
      name: 'Centro Automotivo Taquara',
      category: 'Autos',
      subcategory: 'Mecânica Geral',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200',
      description: 'Revisão completa, suspensão e freios. Tecnologia de diagnóstico avançada para seu veículo na Taquara.',
    } as Store);
  };

  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"><ChevronLeft size={24} /></button>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Carros</h1>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>
      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-6 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        <main className="p-6 pt-12 space-y-8">
          <div 
              onClick={handleHeroClick}
              className="py-10 px-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden border border-white/5 cursor-pointer active:scale-[0.99] transition-all group"
          >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-105 transition-transform duration-700"></div>
              <div className="relative z-10 flex items-start gap-4">
                  <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
                      <Wrench size={24} className="text-white" />
                  </div>
                  <div>
                      <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-1">Mecânica de Confiança</h3>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed">Conecte-se com as melhores oficinas de Jacarepaguá. <span className="underline ml-1">Ver Destaque</span></p>
                  </div>
              </div>
          </div>

          {GROUPS.map((group, idx) => (
            <section key={idx} className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-blue-500"><group.icon size={20} strokeWidth={2.5}/></div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{group.title}</h3>
              </div>
              {group.items.map((item, itemIdx) => <SpecialtyCard key={itemIdx} name={item.name} onClick={() => onSelect(item.name)} />)}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

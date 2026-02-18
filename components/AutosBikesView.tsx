
import React from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Settings, Bike, Package, Palette, Repeat } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';
import { Store } from '@/types';

interface SpecialtyGroup { title: string; icon: React.ElementType; items: { name: string }[]; }
interface AutosBikesViewProps { 
  onBack: () => void; 
  onSelect: (specialty: string) => void; 
  onNavigate: (view: string) => void; 
  onStoreClick: (store: Store) => void;
}

const GROUPS: SpecialtyGroup[] = [
    { title: "Compra & Loja", icon: ShoppingCart, items: [{ name: "Loja de bicicletas" }, { name: "Bike shop" }] },
    { title: "Manutenção & Ajustes", icon: Settings, items: [{ name: "Oficina de bicicletas" }, { name: "Mecânica de bikes" }, { name: "Ajuste e revisão de bikes" }, { name: "Montagem de bicicletas" }, { name: "Estúdio de bike fit" }] },
    { title: "Mobilidade Elétrica", icon: Bike, items: [{ name: "Bike elétrica" }, { name: "Manutenção de bike elétrica" }] },
    { title: "Peças & Acessórios", icon: Package, items: [{ name: "Peças e acessórios para bikes" }] },
    { title: "Customização", icon: Palette, items: [{ name: "Customização de bikes" }] },
    { title: "Serviços & Uso", icon: Repeat, items: [{ name: "Aluguel de bicicletas" }] },
];

const SpecialtyCard: React.FC<{ name: string; onClick: () => void }> = ({ name, onClick }) => (
  <button onClick={onClick} className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm mb-2">
    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight">{name}</span>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
  </button>
);

export const AutosBikesView: React.FC<AutosBikesViewProps> = ({ onBack, onSelect, onNavigate, onStoreClick }) => {
  const handleHeroClick = () => {
    onStoreClick({
      name: 'Ciclo Vibe Freguesia',
      category: 'Autos',
      subcategory: 'Bikes & Mobilidade',
      image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1200',
      description: 'Oficina especializada e loja de acessórios premium para ciclistas urbanos e de trilha em Jacarepaguá.',
    } as Store);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500 pb-20">
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"><ChevronLeft size={24} /></button>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Autos — Bikes</h1>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        <div 
            onClick={handleHeroClick}
            className="p-6 bg-emerald-600 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden border border-white/10 cursor-pointer active:scale-[0.99] transition-all group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-2xl shadow-lg border border-white/30 backdrop-blur-md">
                    <Bike size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-1">Liberdade sobre Rodas</h3>
                    <p className="text-emerald-50 text-xs font-medium leading-relaxed">As melhores oficinas e lojas para sua bike no bairro. <span className="underline ml-1">Explorar</span></p>
                </div>
            </div>
        </div>

        {GROUPS.map((group, idx) => (
          <section key={idx} className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-emerald-500"><group.icon size={20} strokeWidth={2.5}/></div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{group.title}</h3>
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
      </main>
    </div>
  );
};
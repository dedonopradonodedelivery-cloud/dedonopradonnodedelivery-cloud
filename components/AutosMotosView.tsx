
import React from 'react';
import { ChevronLeft, ChevronRight, Key, Wrench, Package, Sparkles, Zap, Siren } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';
import { Store } from '@/types';

interface SpecialtyGroup { title: string; icon: React.ElementType; items: { name: string }[]; }
interface AutosMotosViewProps { 
  onBack: () => void; 
  onSelect: (specialty: string) => void; 
  onNavigate: (view: string) => void; 
  onStoreClick: (store: Store) => void;
}

const GROUPS: SpecialtyGroup[] = [
    { title: "Compra & Venda", icon: Key, items: [{ name: "Concessionária de motos" }, { name: "Loja de motos seminovas" }] },
    { title: "Manutenção & Mecânica", icon: Wrench, items: [{ name: "Oficina de motos" }, { name: "Mecânica de motos" }, { name: "Elétrica de motos" }, { name: "Troca de óleo para motos" }, { name: "Pneus para motos" }] },
    { title: "Peças & Acessórios", icon: Package, items: [{ name: "Peças e acessórios para motos" }, { name: "Equipamentos para motociclistas" }] },
    { title: "Estética & Cuidados", icon: Sparkles, items: [{ name: "Estética de motos" }, { name: "Lavagem de motos" }] },
    { title: "Preparação & Customização", icon: Zap, items: [{ name: "Preparação de motos" }, { name: "Customização de motos" }] },
    { title: "Emergência", icon: Siren, items: [{ name: "Guincho para motos" }] },
];

export const AutosMotosView: React.FC<AutosMotosViewProps> = ({ onBack, onSelect, onNavigate, onStoreClick }) => {
  const handleHeroClick = () => {
    onStoreClick({
      name: 'Moto Force JPA',
      category: 'Autos',
      subcategory: 'Oficina de Motos',
      image: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=1200',
      description: 'Especialistas em alta cilindrada e manutenção preventiva para todas as marcas. Peças e acessórios exclusivos.',
    } as Store);
  };

  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"><ChevronLeft size={24} /></button>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Motos</h1>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>
      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-6 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        <main className="p-6 pt-12 space-y-8">
          <div 
              onClick={handleHeroClick}
              className="py-10 px-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden border border-white/5 cursor-pointer active:scale-[0.99] transition-all group"
          >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative z-10 flex items-start gap-4">
                  <div className="p-3 bg-amber-500 rounded-2xl shadow-lg">
                      <Zap size={24} className="text-white" />
                  </div>
                  <div>
                      <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-1">Paixão por Duas Rodas</h3>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed">As melhores oficinas e lojas de acessórios para sua moto. <span className="underline ml-1">Ver</span></p>
                  </div>
              </div>
          </div>

          {GROUPS.map((group, idx) => (
            <section key={idx} className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-slate-500"><group.icon size={20} strokeWidth={2.5}/></div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{group.title}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {group.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => onSelect(item.name)}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                  >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-500 bg-opacity-10 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform duration-500">
                      <group.icon size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

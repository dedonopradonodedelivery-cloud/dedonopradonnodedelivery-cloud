
import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Scissors, Hand, Smile, Palette, Eye, Droplets, Heart } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

interface SpecialtyGroup {
  title: string;
  icon: React.ElementType;
  items: { name: string; isPopular?: boolean }[];
}

interface BeautyWomenViewProps {
  onBack: () => void;
  onSelect: (specialty: string) => void;
  onNavigate: (view: string) => void;
}

const GROUPS: SpecialtyGroup[] = [
  { title: "Cabelo & Transformação", icon: Scissors, items: [{ name: "Salão feminino" }, { name: "Cabeleireira" }, { name: "Spa capilar" }, { name: "Tricologia feminina" }] },
  { title: "Unhas & Nail Art", icon: Hand, items: [{ name: "Manicure" }, { name: "Pedicure" }, { name: "Nail Designer" }, { name: "Alongamento de unhas" }] },
  { title: "Rosto & Estética Facial", icon: Smile, items: [{ name: "Limpeza de pele" }, { name: "Peeling estético" }, { name: "Botox estético" }, { name: "Preenchimento facial" }, { name: "Harmonização facial" }, { name: "Tratamentos anti-idade" }] },
  { title: "Corpo & Bem-Estar", icon: Heart, items: [{ name: "Drenagem linfática" }, { name: "Massoterapia estética" }, { name: "Terapias corporais" }, { name: "Spa feminino" }, { name: "Bronzeamento natural" }] },
  { title: "Sobrancelhas & Beleza Avançada", icon: Eye, items: [{ name: "Design de sobrancelhas" }, { name: "Micropigmentação" }, { name: "Estética avançada feminina" }, { name: "Estética íntima feminina" }] },
  { title: "Maquiagem & Ocasiões", icon: Palette, items: [{ name: "Maquiagem profissional" }, { name: "Maquiagem social" }, { name: "Maquiagem artística" }, { name: "Estética para noivas" }] },
  { title: "Depilação & Procedimentos", icon: Droplets, items: [{ name: "Depilação" }, { name: "Depilação a laser" }, { name: "Epilação egípcia" }] },
];

const SpecialtyCard: React.FC<{ item: {name: string, isPopular?: boolean}; onClick: () => void }> = ({ item, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm mb-2"
  >
    <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight">{item.name}</span>
    </div>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-rose-500 transition-colors" />
  </button>
);

export const BeautyWomenView: React.FC<BeautyWomenViewProps> = ({ onBack, onSelect, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Beleza — Mulher</h1>
            <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest mt-1">Especialidades femininas</p>
          </div>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 relative">
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-rose-500">
                  <group.icon size={20} strokeWidth={2.5}/>
              </div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
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

        <div className="py-10 text-center opacity-20">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Jacarepaguá Beauty Ecosystem</p>
        </div>
      </main>
    </div>
  );
};


import React from 'react';
import { ChevronLeft, ChevronRight, Scale, Stethoscope, Home, HardHat, Palette, Monitor, Target, Award, ShieldCheck, Zap, Star } from 'lucide-react';
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

interface ServicesSpecializedViewProps {
  onBack: () => void;
  onSelect: (specialty: string) => void;
  onNavigate: (view: string) => void;
}

const GROUPS: SpecialtyGroup[] = [
  {
    title: "Mais Procurados",
    icon: Star,
    color: "text-amber-500 bg-amber-50",
    items: [
      { name: "Advogado", isPopular: true },
      { name: "Psicólogo", isPopular: true },
      { name: "Contador", isPopular: true },
      { name: "Desenvolvedor de software", isPopular: true },
    ]
  },
  {
    title: "Jurídico / Negócios / Gestão",
    icon: Scale,
    color: "text-slate-600 bg-slate-50",
    items: [
      { name: "Advogado" },
      { name: "Contador" },
      { name: "Auditor" },
      { name: "Consultor empresarial" },
      { name: "Consultor financeiro" },
      { name: "Consultor de RH" },
    ]
  },
  {
    title: "Saúde / Bem-estar / Terapias",
    icon: Stethoscope,
    color: "text-emerald-600 bg-emerald-50",
    items: [
      { name: "Psicólogo" },
      { name: "Psiquiatra" },
      { name: "Médico" },
      { name: "Dentista" },
      { name: "Fisioterapeuta" },
      { name: "Nutricionista" },
      { name: "Fonoaudiólogo" },
      { name: "Terapeuta ocupacional" },
    ]
  },
  {
    title: "Imóveis / Seguros / Mercado",
    icon: Home,
    color: "text-blue-600 bg-blue-50",
    items: [
      { name: "Corretor de imóveis" },
      { name: "Corretor de seguros" },
    ]
  },
  {
    title: "Projetos / Engenharia / Arq",
    icon: HardHat,
    color: "text-indigo-600 bg-indigo-50",
    items: [
      { name: "Engenheiro" },
      { name: "Arquiteto" },
      { name: "Designer de interiores" },
    ]
  },
  {
    title: "Criativo / Comunicação",
    icon: Palette,
    color: "text-rose-600 bg-rose-50",
    items: [
      { name: "Designer gráfico" },
      { name: "Publicitário" },
      { name: "Jornalista" },
      { name: "Produtor de conteúdo" },
      { name: "Fotógrafo profissional" },
      { name: "Videomaker" },
    ]
  },
  {
    title: "Tecnologia / Digital",
    icon: Monitor,
    color: "text-cyan-600 bg-cyan-50",
    items: [
      { name: "Desenvolvedor de software" },
      { name: "Programador" },
      { name: "Analista de sistemas" },
      { name: "Especialista em marketing digital" },
    ]
  },
  {
    title: "Desenvolvimento Pessoal",
    icon: Target,
    color: "text-violet-600 bg-violet-50",
    items: [
      { name: "Coach" },
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
            <span className="bg-blue-100 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Destaque</span>
        )}
    </div>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
  </button>
);

export const ServicesSpecializedView: React.FC<ServicesSpecializedViewProps> = ({ onBack, onSelect, onNavigate }) => {
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
            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Serviços — Especializados</h1>
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">Profissionais de alto nível</p>
          </div>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 relative">
        {/* Bloco de Autoridade */}
        <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl">
                    <Award size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-1">Especialistas Certificados</h3>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">Conecte-se com consultores e profissionais graduados em Jacarepaguá.</p>
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
            <ShieldCheck size={20} className="text-[#1E5BFF]" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA • Hub de Profissões</p>
        </div>
      </main>
    </div>
  );
};

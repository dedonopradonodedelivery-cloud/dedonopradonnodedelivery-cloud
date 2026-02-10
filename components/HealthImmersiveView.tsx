
import React from 'react';
import { 
  ChevronLeft, 
  Stethoscope, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Baby, 
  HeartHandshake, 
  Activity, 
  Microscope, 
  Brain, 
  Smile, 
  Building2, 
  Apple, 
  Zap,
  Info,
  ArrowRight
} from 'lucide-react';

interface HealthImmersiveViewProps {
  group: 'Mulher' | 'Homem' | 'Pediatria' | 'Geriatria';
  onBack: () => void;
  onSelectSpecialty: (specialty: string) => void;
}

const SPECIALTIES_BY_GROUP = {
  Mulher: [
    { name: 'Ginecologia', icon: <Stethoscope /> },
    { name: 'Obstetrícia', icon: <Heart /> },
    { name: 'Mastologia', icon: <ShieldCheck /> },
    { name: 'Dermatologia', icon: <Sparkles /> },
    { name: 'Psicologia', icon: <Brain /> },
    { name: 'Nutrição', icon: <Apple /> },
    { name: 'Endocrino', icon: <Activity /> },
    { name: 'Exames', icon: <Microscope /> },
  ],
  Homem: [
    { name: 'Urologia', icon: <ShieldCheck /> },
    { name: 'Cardiologia', icon: <Activity /> },
    { name: 'Dermato', icon: <Sparkles /> },
    { name: 'Psicologia', icon: <Brain /> },
    { name: 'Nutrição', icon: <Apple /> },
    { name: 'Fisío', icon: <Zap /> },
    { name: 'Clínica', icon: <Building2 /> },
    { name: 'Exames', icon: <Microscope /> },
  ],
  Pediatria: [
    { name: 'Pediatria', icon: <Smile /> },
    { name: 'Psico Infantil', icon: <Brain /> },
    { name: 'Nutrição', icon: <Apple /> },
    { name: 'Fono', icon: <Activity /> },
    { name: 'Dentista', icon: <Smile /> },
    { name: 'Vacinas', icon: <ShieldCheck /> },
    { name: 'Pronto Socorro', icon: <Zap /> },
    { name: 'Exames', icon: <Microscope /> },
  ],
  Geriatria: [
    { name: 'Geriatria', icon: <HeartHandshake /> },
    { name: 'Fisioterapia', icon: <Zap /> },
    { name: 'Cardiologia', icon: <Activity /> },
    { name: 'Nutrição', icon: <Apple /> },
    { name: 'Home Care', icon: <Building2 /> },
    { name: 'Psicologia', icon: <Brain /> },
    { name: 'Cuidadores', icon: <User /> },
    { name: 'Exames', icon: <Microscope /> },
  ]
};

export const HealthImmersiveView: React.FC<HealthImmersiveViewProps> = ({ group, onBack, onSelectSpecialty }) => {
  const specialties = SPECIALTIES_BY_GROUP[group];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 animate-in fade-in duration-300 flex flex-col">
      {/* HEADER PADRÃO */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-none">Saúde {group}</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Especialidades no Bairro</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {/* BANNER PUBLICITÁRIO DISCRETO */}
        <div className="px-5 pt-5 mb-4">
            <div className="w-full h-32 bg-gradient-to-br from-[#1E5BFF] to-blue-700 rounded-3xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-transform">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                <div className="relative z-10">
                    <span className="text-[8px] font-black text-blue-200 uppercase tracking-widest mb-1 block">Espaço Premium</span>
                    <h3 className="text-white font-bold text-sm leading-tight max-w-[140px]">
                        Anuncie sua Clínica ou Consultório aqui.
                    </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <ArrowRight size={18} />
                </div>
            </div>
        </div>

        {/* GRID DE CATEGORIAS PADRÃO (ÍCONES CIRCULARES) */}
        <div className="p-5">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 ml-1">
                Selecione a especialidade
            </h3>
            
            <div className="grid grid-cols-4 gap-y-8 gap-x-4">
                {specialties.map((spec) => (
                    <button 
                        key={spec.name}
                        onClick={() => onSelectSpecialty(spec.name)}
                        className="flex flex-col items-center gap-2 group active:scale-90 transition-all"
                    >
                        <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 flex items-center justify-center text-[#1E5BFF] shadow-sm group-hover:bg-[#1E5BFF] group-hover:text-white transition-all">
                            {React.cloneElement(spec.icon as any, { size: 24, strokeWidth: 2.5 })}
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 text-center leading-tight uppercase tracking-tighter">
                            {spec.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>

        {/* INFO ADICIONAL */}
        <div className="px-5 mt-8 pb-12">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex gap-3 items-center">
                <Info size={16} className="text-gray-400 shrink-0" />
                <p className="text-[9px] text-gray-500 dark:text-gray-400 font-medium uppercase leading-relaxed tracking-wide">
                    Encontre os melhores profissionais de saúde verificados de Jacarepaguá.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
};

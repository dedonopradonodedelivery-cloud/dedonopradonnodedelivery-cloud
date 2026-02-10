
import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  ArrowRight, 
  Stethoscope, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Info,
  Clock,
  User,
  Baby,
  HeartHandshake,
  Activity,
  Microscope,
  Brain,
  Smile,
  Building2,
  Apple,
  Zap
} from 'lucide-react';

interface HealthImmersiveViewProps {
  group: 'Mulher' | 'Homem' | 'Pediatria' | 'Geriatria';
  onBack: () => void;
  onSelectSpecialty: (specialty: string) => void;
}

const GROUP_METADATA = {
  Mulher: {
    title: "Saúde da Mulher",
    subtitle: "Cuidado integral e acolhimento em cada fase da sua vida.",
    color: "from-rose-100 via-rose-50 to-white",
    icon: <User className="w-12 h-12 text-rose-500" />,
    specialties: [
      { name: 'Ginecologia', desc: 'Prevenção e saúde da mulher.', icon: <Stethoscope /> },
      { name: 'Obstetrícia', desc: 'Acompanhamento gentil na gestação.', icon: <Heart /> },
      { name: 'Dermatologia', desc: 'Cuidados com a pele e estética.', icon: <Sparkles /> },
      { name: 'Psicologia', desc: 'Equilíbrio emocional e bem-estar.', icon: <Brain /> },
      { name: 'Nutrição', desc: 'Alimentação focada na saúde feminina.', icon: <Apple /> },
    ]
  },
  Homem: {
    title: "Saúde do Homem",
    subtitle: "Prevenção e performance para o seu dia a dia.",
    color: "from-blue-100 via-blue-50 to-white",
    icon: <User className="w-12 h-12 text-blue-500" />,
    specialties: [
      { name: 'Urologia', desc: 'Prevenção e cuidados essenciais.', icon: <ShieldCheck /> },
      { name: 'Cardiologia', desc: 'Monitoramento da saúde do coração.', icon: <Activity /> },
      { name: 'Nutrição', desc: 'Performance e saúde alimentar.', icon: <Apple /> },
      // Added Zap from lucide-react and removed local definition
      { name: 'Fisioterapia', desc: 'Recuperação e mobilidade.', icon: <Zap /> },
      { name: 'Psicologia', desc: 'Saúde mental e produtividade.', icon: <Brain /> },
    ]
  },
  Pediatria: {
    title: "Saúde Infantil",
    subtitle: "Crescimento saudável com carinho e especialização.",
    color: "from-amber-100 via-amber-50 to-white",
    icon: <Baby className="w-12 h-12 text-amber-500" />,
    specialties: [
      { name: 'Pediatria', desc: 'Acompanhamento do desenvolvimento.', icon: <Smile /> },
      { name: 'Psicologia Infantil', desc: 'Cuidado com as emoções dos pequenos.', icon: <Brain /> },
      { name: 'Nutrição Infantil', desc: 'Hábitos saudáveis desde cedo.', icon: <Apple /> },
      { name: 'Fonoaudiologia', desc: 'Desenvolvimento da fala e audição.', icon: <Activity /> },
    ]
  },
  Geriatria: {
    title: "Melhor Idade",
    subtitle: "Longevidade com qualidade de vida e independência.",
    color: "from-emerald-100 via-emerald-50 to-white",
    icon: <HeartHandshake className="w-12 h-12 text-emerald-500" />,
    specialties: [
      { name: 'Geriatria', desc: 'Cuidado especializado no envelhecimento.', icon: <Building2 /> },
      { name: 'Fisioterapia', desc: 'Manutenção da força e equilíbrio.', icon: <Activity /> },
      { name: 'Cardiologia', desc: 'Check-up completo do coração.', icon: <Activity /> },
      { name: 'Exames', desc: 'Laboratórios próximos a você.', icon: <Microscope /> },
    ]
  }
};

export const HealthImmersiveView: React.FC<HealthImmersiveViewProps> = ({ group, onBack, onSelectSpecialty }) => {
  const meta = GROUP_METADATA[group];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 animate-in fade-in duration-500 flex flex-col relative">
      
      {/* 1) HERO FIXO EXCLUSIVO */}
      <section className={`pt-16 pb-12 px-6 bg-gradient-to-b ${meta.color} dark:from-gray-900 dark:to-gray-950 relative overflow-hidden shrink-0`}>
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-full text-gray-700 dark:text-white active:scale-90 transition-all z-20"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Elemento Decorativo de Fundo */}
        <div className="absolute -right-10 -top-10 opacity-10 transform rotate-12 pointer-events-none">
            {React.cloneElement(meta.icon as any, { size: 240, strokeWidth: 1 })}
        </div>

        <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 rounded-[2rem] bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center border border-white/20">
                {meta.icon}
            </div>
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
                    {meta.title}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed max-w-[280px]">
                    {meta.subtitle}
                </p>
            </div>
        </div>
      </section>

      {/* 2) BANNER PUBLICITÁRIO STICKY */}
      <div className="sticky top-0 z-30 px-6 py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-5 flex items-center justify-between shadow-lg relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-transform">
              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative z-10 flex flex-col justify-center">
                  <span className="text-[8px] font-black text-blue-200 uppercase tracking-widest mb-1">Destaque Local</span>
                  <h3 className="text-white font-bold text-sm leading-tight">Anuncie aqui sua Clínica <br/> ou Consultório</h3>
                  <div className="flex items-center gap-1 mt-2 text-white/70">
                    <Info size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">Espaço Publicitário Premium</span>
                  </div>
              </div>
              <div className="relative z-10 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <ArrowRight className="text-white" size={20} />
              </div>
          </div>
      </div>

      {/* 3) LISTA DE SUBCATEGORIAS (LAYOUT NÃO CONVENCIONAL) */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar pb-32">
        <div className="grid grid-cols-1 gap-5">
            {meta.specialties.map((spec) => (
                <button 
                    key={spec.name}
                    onClick={() => onSelectSpecialty(spec.name)}
                    className="w-full p-6 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-6 group text-left"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors shrink-0">
                        {React.cloneElement(spec.icon as any, { size: 28, strokeWidth: 2.5 })}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">{spec.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
                            "{spec.desc}"
                        </p>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-300 group-hover:text-blue-500 transition-colors">
                        {/* Imported ChevronRight from lucide-react to fix missing name error */}
                        <ChevronRight size={20} />
                    </div>
                </button>
            ))}
        </div>

        {/* Footer Acolhedor */}
        <div className="pt-8 pb-12 flex flex-col items-center text-center opacity-40">
            <Heart size={24} className="text-rose-500 mb-2" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Cuidado local de confiança</p>
        </div>
      </main>
    </div>
  );
};

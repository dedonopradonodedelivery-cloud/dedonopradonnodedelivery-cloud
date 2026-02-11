
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Wrench, 
  Briefcase,
  Hammer,
  PaintRoller,
  Zap,
  Droplets,
  Scissors,
  Home,
  Settings,
  Car,
  Shield,
  LayoutGrid,
  Scale,
  Calculator,
  User,
  Heart,
  Stethoscope,
  PenTool,
  Camera,
  Code,
  Globe,
  TrendingUp,
  Award
} from 'lucide-react';
import { MasterSponsorBadge } from './MasterSponsorBadge';

interface ServicesSelectionViewProps {
  type: 'MANUAL' | 'SPECIALIZED';
  onBack: () => void;
  onSelectService: (serviceName: string) => void;
}

const MANUAL_SERVICES = [
  "Pedreiro", "Pintor", "Eletricista", "Encanador", "Gesseiro", "Azulejista", "Carpinteiro", 
  "Marceneiro", "Serralheiro", "Soldador", "Vidraceiro", "Chaveiro", "Jardineiro", 
  "Paisagista", "Piscineiro", "Faxineira", "Diarista", "Passadeira", "Costureira", 
  "Sapateiro", "Tapeceiro", "Estofador", "Instalador de ar-condicionado", "Técnico em refrigeração", 
  "Montador de móveis", "Instalador de cortinas e persianas", "Impermeabilizador", 
  "Dedetizador", "Limpeza pós-obra", "Lava-jato"
];

const SPECIALIZED_SERVICES = [
  "Advogado", "Contador", "Consultor empresarial", "Consultor financeiro", "Consultor de RH", 
  "Psicólogo", "Psiquiatra", "Médico", "Dentista", "Fisioterapeuta", "Nutricionista", 
  "Fonoaudiólogo", "Terapeuta ocupacional", "Coach", "Auditor", "Corretor de imóveis", 
  "Corretor de seguros", "Engenheiro", "Arquiteto", "Designer gráfico", "Designer de interiores", 
  "Publicitário", "Jornalista", "Produtor de conteúdo", "Fotógrafo profissional", 
  "Videomaker", "Desenvolvedor de software", "Programador", "Analista de sistemas", 
  "Especialista em marketing digital"
];

const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('pedreiro') || n.includes('obra')) return <Hammer size={20} />;
    if (n.includes('pintor')) return <PaintRoller size={20} />;
    if (n.includes('eletricista') || n.includes('zap')) return <Zap size={20} />;
    if (n.includes('encanador') || n.includes('lavajato') || n.includes('piscina')) return <Droplets size={20} />;
    if (n.includes('chaveiro') || n.includes('segurança')) return <Shield size={20} />;
    if (n.includes('advogado')) return <Scale size={20} />;
    if (n.includes('contador') || n.includes('financeiro')) return <Calculator size={20} />;
    if (n.includes('médico') || n.includes('dentista') || n.includes('psico') || n.includes('terapeuta')) return <Heart size={20} />;
    if (n.includes('designer') || n.includes('arquiteto') || n.includes('fotógrafo')) return <PenTool size={20} />;
    if (n.includes('programador') || n.includes('software') || n.includes('analista')) return <Code size={20} />;
    if (n.includes('marketing') || n.includes('publicitário') || n.includes('coach')) return <TrendingUp size={20} />;
    return <Settings size={20} />;
};

export const ServicesSelectionView: React.FC<ServicesSelectionViewProps> = ({ type, onBack, onSelectService }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const services = type === 'MANUAL' ? MANUAL_SERVICES : SPECIALIZED_SERVICES;
  const title = type === 'MANUAL' ? 'Serviços Manuais' : 'Serviços Especializados';
  
  const filteredServices = useMemo(() => {
    return services.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [services, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md px-5 pt-12 pb-5 border-b border-gray-100 dark:border-gray-900 flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-transform">
                    <ChevronLeft size={20} strokeWidth={3} />
                </button>
                <div>
                    <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{title}</h1>
                    <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Jacarepaguá</p>
                </div>
            </div>
            <MasterSponsorBadge />
        </div>

        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Qual serviço você busca?" 
                className="w-full bg-gray-50 dark:bg-gray-800 border-none py-4 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 transition-all shadow-inner dark:text-white"
            />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-5 pb-32">
        <div className="grid grid-cols-3 gap-3">
            {filteredServices.map((service) => (
                <button 
                    key={service}
                    onClick={() => onSelectService(service)}
                    className="flex flex-col items-center justify-center p-4 min-h-[110px] rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md active:scale-95 group"
                >
                    <div className="mb-2.5 w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-[#1E5BFF] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                        {getIcon(service)}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight text-gray-600 dark:text-gray-300">
                        {service}
                    </span>
                </button>
            ))}
        </div>

        {filteredServices.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center opacity-30">
                <Search size={48} className="text-gray-400 mb-4" />
                <p className="font-bold uppercase tracking-widest text-xs">Nenhum serviço encontrado</p>
            </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-8 text-center opacity-20 pointer-events-none bg-gradient-to-t from-[#F8F9FC] dark:from-gray-950 to-transparent">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] dark:text-white text-gray-400">Localizei JPA • Credibilidade</p>
      </footer>
    </div>
  );
};
